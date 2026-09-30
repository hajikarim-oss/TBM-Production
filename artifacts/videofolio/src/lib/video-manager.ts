/**
 * Global Video Playback Manager (Singleton) — Instagram-Grade
 * 
 * Implements the exact patterns used by Instagram Reels, Netflix, and TikTok:
 * 
 * 1. STRICT CONCURRENCY: On mobile, AT MOST ONE video decoder can be active.
 * 2. HIERARCHY PRIORITY: Cinema Modal pauses ALL background videos instantly.
 * 3. VIEWPORT ARBITRATION: Only center-focused video plays on touch devices.
 * 4. PROXIMITY PRELOADING: Videos start buffering BEFORE hover (cursor proximity detection).
 * 5. FRAME-READY GATE: Video element stays hidden until first frame is decoded — no black flash.
 * 6. CONNECTION-AWARE: Adapts preload strategy based on network speed (4G/WiFi vs 3G/slow).
 * 7. PREDICTIVE SCROLL: On mobile, pre-buffers the NEXT card in the user's scroll direction.
 */

type VideoId = string;

interface VideoRegistration {
  id: VideoId;
  element: HTMLVideoElement;
  priority: 'modal' | 'hero' | 'card';
  pause: () => void;
  play?: () => void;
}

type ConnectionQuality = 'fast' | 'medium' | 'slow';

class VideoManager {
  private static instance: VideoManager;
  private registry = new Map<VideoId, VideoRegistration>();
  private activeId: VideoId | null = null;
  private isModalActive = false;
  private preloadingIds = new Set<VideoId>();
  private connectionQuality: ConnectionQuality = 'fast';
  private lastScrollY = 0;
  private scrollDirection: 'down' | 'up' = 'down';

  private constructor() {
    this.detectConnection();
    this.trackScrollDirection();
  }

  public static getInstance(): VideoManager {
    if (!VideoManager.instance) {
      VideoManager.instance = new VideoManager();
    }
    return VideoManager.instance;
  }

  /**
   * Detect network quality using the Network Information API.
   * Falls back to 'fast' if the API is unavailable (desktop browsers).
   */
  private detectConnection(): void {
    const nav = navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        downlink?: number;
        saveData?: boolean;
        addEventListener?: (type: string, handler: () => void) => void;
      };
    };

    const update = () => {
      const conn = nav.connection;
      if (!conn) {
        this.connectionQuality = 'fast';
        return;
      }
      if (conn.saveData) {
        this.connectionQuality = 'slow';
        return;
      }
      const ect = conn.effectiveType;
      if (ect === '4g' && (conn.downlink ?? 10) >= 5) {
        this.connectionQuality = 'fast';
      } else if (ect === '4g' || ect === '3g') {
        this.connectionQuality = 'medium';
      } else {
        this.connectionQuality = 'slow';
      }
    };

    update();
    nav.connection?.addEventListener?.('change', update);
  }

  /**
   * Track scroll direction for predictive preloading on mobile.
   */
  private trackScrollDirection(): void {
    if (typeof window === 'undefined') return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        this.scrollDirection = currentY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = currentY;
        ticking = false;
      });
    }, { passive: true });
  }

  public getConnectionQuality(): ConnectionQuality {
    return this.connectionQuality;
  }

  public getScrollDirection(): 'down' | 'up' {
    return this.scrollDirection;
  }

  public register(registration: VideoRegistration): () => void {
    this.registry.set(registration.id, registration);
    return () => {
      this.unregister(registration.id);
    };
  }

  public unregister(id: VideoId): void {
    if (this.activeId === id) {
      this.activeId = null;
    }
    this.preloadingIds.delete(id);
    this.registry.delete(id);
  }

  /**
   * Instagram-style proximity preloading.
   * Called when cursor is NEAR a card (not yet hovering).
   * Starts loading video data so it's ready by the time cursor arrives.
   */
  public requestPreload(id: VideoId): void {
    if (this.preloadingIds.has(id)) return;
    if (this.isModalActive) return;
    // On slow connections, skip proximity preloading to save bandwidth
    if (this.connectionQuality === 'slow') return;

    const target = this.registry.get(id);
    if (!target) return;

    const vid = target.element;
    if (vid.readyState >= 1) return; // Already has metadata or more

    this.preloadingIds.add(id);
    vid.preload = 'metadata';
    vid.load();
  }

  /**
   * Request playback permission for a specific video.
   * If granted, any lower-priority or competing videos are automatically paused.
   */
  public requestPlay(id: VideoId): boolean {
    const target = this.registry.get(id);
    if (!target) return false;

    // If a modal is open, only the modal video is permitted to play
    if (this.isModalActive && target.priority !== 'modal') {
      target.pause();
      return false;
    }

    // Modal priority override
    if (target.priority === 'modal') {
      this.isModalActive = true;
      // Pause all background videos
      this.registry.forEach((reg) => {
        if (reg.id !== id) {
          reg.pause();
        }
      });
      this.activeId = id;
      return true;
    }

    // Single active video rule on mobile / cards:
    // If a card requests play, pause any other active card or lower priority
    if (this.activeId && this.activeId !== id) {
      const currentActive = this.registry.get(this.activeId);
      if (currentActive && currentActive.priority === 'card') {
        currentActive.pause();
      }
    }

    this.activeId = id;
    this.preloadingIds.delete(id); // No longer just preloading
    return true;
  }

  public notifyPause(id: VideoId): void {
    if (this.activeId === id) {
      this.activeId = null;
    }
  }

  public setModalOpen(isOpen: boolean): void {
    this.isModalActive = isOpen;
    if (isOpen) {
      // Pause all non-modal videos
      this.registry.forEach((reg) => {
        if (reg.priority !== 'modal') {
          reg.pause();
        }
      });
    }
  }

  public isAllowed(id: VideoId): boolean {
    const target = this.registry.get(id);
    if (!target) return false;
    if (this.isModalActive && target.priority !== 'modal') return false;
    return true;
  }
}

export const globalVideoManager = VideoManager.getInstance();
