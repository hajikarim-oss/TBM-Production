import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assetUrl } from '@/lib/utils';
import { R2_ACC1_URL, R2_ACC2_URL } from '@/config';
import { globalVideoManager } from '@/lib/video-manager';

export interface WorkItem {
  id: string;
  brand: string;
  title: string;
  format: 'Vertical AD Film' | 'DVC ADS';
  client: string;
  logo: string;
  video: string;
  previewVideo?: string;
  fallbackVideo?: string;
  poster?: string;
  aspectRatio: '9:16' | '16:9';
}

const RAW_WORK_ITEMS: WorkItem[] = [
  // ─── 1. DVC ADS & HORIZONTAL FILMS (16:9) ───
  {
    id: 'blue-tyga',
    brand: 'Blue Tyga',
    title: 'Comfort First Commercial',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/bluetyga-logo-white.png',
    video: `${R2_ACC1_URL}/Blue%20Tyga_DVC_13.4.2026.mp4`,
    poster: '/images/posters/blue-tyga.webp',
    aspectRatio: '16:9',
  },
  {
    id: 'atomberg-cpj',
    brand: 'CPJ (Atomberg)',
    title: 'Cold Press Juicer Launch',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/atomberg-logo-new.png',
    video: `${R2_ACC1_URL}/Atomberg%20CPJ_TheBoredMonkey%20Studios.mp4`,
    poster: '/images/posters/atomberg-cpj.webp',
    aspectRatio: '16:9',
  },
  {
    id: 'zoff-spices',
    brand: 'ZOFF',
    title: 'Khade Masale Revolution',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/zoff-logo-white.png',
    video: `${R2_ACC1_URL}/Zoff.mp4`,
    poster: '/images/posters/zoff.webp',
    fallbackVideo: '/videos/zoff-khadey-masale.mp4',
    aspectRatio: '16:9',
  },
  {
    id: 'vibhor-cooking-oil',
    brand: 'Vibhor',
    title: 'Heritage Mustard Taste',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/vibhor-logo-new.png',
    video: `${R2_ACC1_URL}/Vibhor.mp4`,
    poster: '/images/posters/vibhor.webp',
    fallbackVideo: '/videos/vibhor-rupali-cooking-oil.mp4',
    aspectRatio: '16:9',
  },
  {
    id: 'happi-planet',
    brand: 'Happi Planet',
    title: 'Plant-Powered Clean DVC',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/happi-planet-brand-color.png',
    video: `${R2_ACC2_URL}/Happi%20planet.mp4`,
    poster: '/images/posters/happi-planet.webp',
    fallbackVideo: '/videos/happi-planet.mp4',
    aspectRatio: '16:9',
  },
  {
    id: 'jordan-oral-care',
    brand: 'Jordan',
    title: 'Mama Penguin Oral Care',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/jordan-logo.svg',
    video: '/videos/jordans-brush-mama-penguin.mp4',
    poster: '/images/posters/jordan.webp',
    fallbackVideo: `${R2_ACC2_URL}/jordans-brush-mama-penguin.mp4`,
    aspectRatio: '16:9',
  },

  // ─── 2. VERTICAL AD FILMS & REELS (9:16) ───
  {
    id: 'bombay-sweet-shop',
    brand: 'Bombay Sweet Shop',
    title: 'Thursday Order Delivery',
    format: 'Vertical AD Film',
    client: 'Vertical AD Film',
    logo: '/brands/bombay-sweet-shop-new.png',
    video: `${R2_ACC2_URL}/Thursday%20order_9_16.mp4`,
    poster: '/images/posters/bombay-sweet-shop.webp',
    fallbackVideo: '/videos/thursday-order-9-16.mp4',
    aspectRatio: '9:16',
  },
  {
    id: 'setu-delhivery',
    brand: 'Setu',
    title: 'Setu Delivery Campaign',
    format: 'Vertical AD Film',
    client: 'Vertical AD Film',
    logo: '/brands/delhivery-white.png',
    video: '/videos/setu-campaign.mp4',
    poster: '/images/posters/setu.webp',
    fallbackVideo: `${R2_ACC2_URL}/setu-campaign.mp4`,
    aspectRatio: '9:16',
  },
  {
    id: 'cheq-pay',
    brand: 'CheQ',
    title: 'Smart Credit Rewards',
    format: 'Vertical AD Film',
    client: 'Vertical AD Film',
    logo: '/brands/cheq-logo-white.png',
    video: `${R2_ACC2_URL}/Script%202-%20Hook%203_3%20Oct25.mp4`,
    poster: '/images/posters/cheq.webp',
    fallbackVideo: '/videos/script-2-hook-3.mp4',
    aspectRatio: '9:16',
  },
  {
    id: 'fiona-diamonds',
    brand: 'Fiona',
    title: 'Solitaire Gifting Hook',
    format: 'Vertical AD Film',
    client: 'Vertical AD Film',
    logo: '/brands/fiona-logo.svg',
    video: `${R2_ACC2_URL}/Gifting%20(HOOK%2001).mp4`,
    fallbackVideo: '/videos/gifting-hook-01.mp4',
    poster: '/images/posters/fiona.webp',
    aspectRatio: '9:16',
  },
];

export const WORK_ITEMS: WorkItem[] = RAW_WORK_ITEMS.map((item) => ({
  ...item,
  logo: assetUrl(item.logo),
  video: assetUrl(item.video),
  fallbackVideo: item.fallbackVideo ? assetUrl(item.fallbackVideo) : undefined,
  poster: item.poster ? assetUrl(item.poster) : undefined,
}));

const HORIZONTAL_ITEMS = WORK_ITEMS.filter((item) => item.aspectRatio === '16:9');
const VERTICAL_ITEMS = WORK_ITEMS.filter((item) => item.aspectRatio === '9:16');

function WorkCard({
  item,
  isAnyModalOpen,
  onSelect,
}: {
  item: WorkItem;
  isAnyModalOpen: boolean;
  onSelect: (item: WorkItem) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [videoReady, setVideoReady] = useState(false);   // Frame-ready gate
  const [isPlaying, setIsPlaying] = useState(false);       // Track active playback
  const fadeOutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isTouchDevice] = useState(() =>
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 880)
  );

  // Lazy render the video element when card is near viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '400px 0px', threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Register card video with Global Video Manager
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    return globalVideoManager.register({
      id: `card-${item.id}`,
      element: vid,
      priority: 'card',
      pause: () => {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      play: () => {
        if (videoRef.current) {
          videoRef.current.defaultMuted = true;
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      },
    });
  }, [item.id, isInView]);

  // Frame-ready gate: detect when video has decoded first frame
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onCanPlay = () => setVideoReady(true);
    
    // If already ready (cached), set immediately
    if (vid.readyState >= 2) {
      setVideoReady(true);
      return;
    }

    vid.addEventListener('canplay', onCanPlay);
    return () => vid.removeEventListener('canplay', onCanPlay);
  }, [isInView]);

  // On touch/mobile devices: auto-play single centered card smoothly
  useEffect(() => {
    if (!isTouchDevice || !isInView || isAnyModalOpen) return;
    const el = cardRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    const touchObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAnyModalOpen) {
          if (globalVideoManager.requestPlay(`card-${item.id}`)) {
            vid.defaultMuted = true;
            vid.muted = true;
            vid.playsInline = true;
            const p = vid.play();
            if (p !== undefined) {
              p.then(() => {
                setVideoReady(true);
                setIsPlaying(true);
              }).catch(() => {});
            } else {
              setVideoReady(true);
              setIsPlaying(true);
            }
          }
        } else {
          vid.pause();
          setIsPlaying(false);
          globalVideoManager.notifyPause(`card-${item.id}`);
        }
      },
      {
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.15,
      }
    );

    touchObserver.observe(el);
    return () => touchObserver.disconnect();
  }, [isTouchDevice, isInView, isAnyModalOpen, item.id]);

  // Pause card video when modal is open
  useEffect(() => {
    if (isAnyModalOpen && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isAnyModalOpen]);

  // Reset videoReady state when video src changes or unmounts
  useEffect(() => {
    if (!isInView) {
      setVideoReady(false);
      setIsPlaying(false);
    }
  }, [isInView]);

  // ─── Instagram Proximity Preloading ───
  // When cursor enters the card's outer padding zone (before actual hover),
  // start loading video metadata so it's ready to play instantly on hover.
  const handleProximityEnter = useCallback(() => {
    if (!isAnyModalOpen && videoRef.current) {
      globalVideoManager.requestPreload(`card-${item.id}`);
    }
  }, [isAnyModalOpen, item.id]);

  // Hover to Play logic: works for mice, trackpads, and touch-screen laptops
  // Instagram-style: video only becomes visible after frame is decoded
  const handleMouseEnter = useCallback(() => {
    if (fadeOutTimer.current) {
      clearTimeout(fadeOutTimer.current);
      fadeOutTimer.current = null;
    }
    if (!isAnyModalOpen && videoRef.current) {
      if (globalVideoManager.requestPlay(`card-${item.id}`)) {
        const vid = videoRef.current;
        vid.muted = true;
        // With preload="none", trigger loading before play
        if (vid.readyState === 0) {
          vid.load();
        }
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
        setIsPlaying(true);
      }
    }
  }, [isAnyModalOpen, item.id]);

  // Instagram-style smooth leave: fade out video before pausing
  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      setIsPlaying(false);
      // Delay pause to allow CSS opacity transition to complete
      fadeOutTimer.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          globalVideoManager.notifyPause(`card-${item.id}`);
          videoRef.current.currentTime = item.id === 'fiona-diamonds' ? 0.5 : 0;
        }
        fadeOutTimer.current = null;
      }, 280); // Matches CSS transition duration
    }
  }, [item.id]);

  // Cleanup fade timer on unmount
  useEffect(() => {
    return () => {
      if (fadeOutTimer.current) clearTimeout(fadeOutTimer.current);
    };
  }, []);

  const isVertical = item.aspectRatio === '9:16';

  // Instagram video visibility: only show video when it has a frame AND is playing
  const showVideo = videoReady && isPlaying;

  return (
    <div
      className="work-content-item"
      ref={cardRef}
      onMouseEnter={handleProximityEnter}  /* Proximity preload zone */
    >
      <div
        className="work-content-item-card-wrap"
        onClick={() => onSelect(item)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`Watch ${item.brand} film`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(item);
          }
        }}
      >
        {/* Video Canvas: Instagram-style poster → video crossfade */}
        <div className={`work-content-image ${isVertical ? 'is-vertical-aspect' : 'is-dvc-aspect'}`}>
          <div className="bg-video">
            {/* Poster layer: always visible as base, fades out when video is ready */}
            {item.poster && (
              <img
                src={item.poster}
                alt=""
                className={`bg-video-poster ${showVideo ? 'poster-hidden' : ''}`}
                loading="lazy"
                decoding="async"
              />
            )}

            {/* Video layer: fades IN only when frame-ready + playing */}
            {isInView ? (
              <video
                ref={videoRef}
                playsInline
                loop
                muted
                preload={isTouchDevice ? 'metadata' : 'auto'}
                poster={item.poster}
                src={item.previewVideo || item.video}
                className={`bg-video-player ${showVideo ? 'video-visible' : ''}`}
                onError={(e) => {
                  if (item.fallbackVideo && e.currentTarget.src !== item.fallbackVideo) {
                    e.currentTarget.src = item.fallbackVideo;
                    e.currentTarget.load();
                  }
                }}
              />
            ) : (
              <div className="work-card-placeholder" />
            )}

            {/* Instagram-style loading shimmer: shows while video is buffering on hover */}
            {isPlaying && !videoReady && (
              <div className="bg-video-loading" />
            )}
          </div>

          {/* Interactive Play Button on Card Hover */}
          <div className="work-card-play-overlay">
            <div className="work-card-play-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>WATCH FILM</span>
            </div>
          </div>
        </div>

        {/* Content inside the tile: Only Brand Logo */}
        <div className="work-content-body">
          <div className="work-card-headline-row">
            <div className="work-card-logo-container" title={item.brand}>
              <img
                src={item.logo}
                alt={item.brand}
                className="work-card-tile-logo"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Cinema Fullscreen Modal Popup (Designed per runwayml & apple design-md) ── */
function WorkModal({
  item,
  onClose,
}: {
  item: WorkItem;
  onClose: () => void;
}) {
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [, setIsPlaying] = useState(true);

  // Priority registration with Global Video Manager
  useEffect(() => {
    globalVideoManager.setModalOpen(true);
    const vid = modalVideoRef.current;
    if (vid) {
      globalVideoManager.register({
        id: `modal-${item.id}`,
        element: vid,
        priority: 'modal',
        pause: () => {
          if (modalVideoRef.current) modalVideoRef.current.pause();
          setIsPlaying(false);
        },
        play: () => {
          if (modalVideoRef.current) modalVideoRef.current.play().catch(() => {});
          setIsPlaying(true);
        },
      });
      globalVideoManager.requestPlay(`modal-${item.id}`);
    }
    return () => {
      globalVideoManager.setModalOpen(false);
      globalVideoManager.unregister(`modal-${item.id}`);
    };
  }, [item.id]);

  // Autoplay handler with audio fallback (guarantees instant playback on all mobile devices)
  useEffect(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0;
      modalVideoRef.current.playsInline = true;
      const playPromise = modalVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks unmuted autoplay on mobile, mute and resume instantly
          if (modalVideoRef.current) {
            modalVideoRef.current.defaultMuted = true;
            modalVideoRef.current.muted = true;
            setIsAudioMuted(true);
            modalVideoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [item]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        if (modalVideoRef.current) {
          if (modalVideoRef.current.paused) {
            modalVideoRef.current.play();
            setIsPlaying(true);
          } else {
            modalVideoRef.current.pause();
            setIsPlaying(false);
          }
        }
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  const isVertical = item.aspectRatio === '9:16';

  const toggleMute = useCallback(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !modalVideoRef.current.muted;
      setIsAudioMuted(modalVideoRef.current.muted);
    }
  }, []);

  const handleVideoClick = useCallback(() => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play();
        setIsPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  return (
    <motion.div
      className="cinema-overlay"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Background Dimmer */}
      <div className="cinema-backdrop" onClick={onClose} />

      {/* Floating Top Header Bar */}
      <header className="cinema-header">
        <div className="cinema-brand-block">
          <div className="cinema-logo-box">
            <img src={item.logo} alt={item.brand} className="cinema-brand-logo" />
          </div>
          <div className="cinema-brand-divider" />
          <div className="cinema-title-group">
            <span className="cinema-project-title">{item.title}</span>
            <span className="cinema-client-subtitle">{item.client}</span>
          </div>
        </div>

        <div className="cinema-header-controls">
          <div className={`cinema-format-pill format-pill--${isVertical ? 'vertical' : 'dvc'}`}>
            <span className="cinema-live-pulse" />
            <span>{item.format}</span>
          </div>

          <button
            type="button"
            className="cinema-audio-toggle"
            onClick={toggleMute}
            title={isAudioMuted ? 'Click to Unmute (M)' : 'Mute Sound (M)'}
          >
            {isAudioMuted ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
            <span>{isAudioMuted ? 'UNMUTE AUDIO' : 'AUDIO ON'}</span>
          </button>

          <button
            type="button"
            className="cinema-close-btn"
            onClick={onClose}
            aria-label="Close cinema viewer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="cinema-close-esc">ESC</span>
          </button>
        </div>
      </header>

      {/* Main Cinema Stage Video */}
      <main
        className="cinema-stage"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className={`cinema-viewport ${isVertical ? 'viewport--vertical' : 'viewport--dvc'}`}
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          <video
            ref={modalVideoRef}
            src={item.video}
            poster={item.poster}
            className="cinema-video"
            autoPlay
            playsInline
            controls
            preload="auto"
            onError={(e) => {
              if (item.fallbackVideo && e.currentTarget.src !== item.fallbackVideo) {
                e.currentTarget.src = item.fallbackVideo;
                e.currentTarget.load();
                e.currentTarget.play().catch(() => {});
              }
            }}
            onClick={handleVideoClick}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {isAudioMuted && (
            <button
              type="button"
              className="cinema-unmute-prompt"
              onClick={toggleMute}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <span>CLICK TO UNMUTE AUDIO</span>
            </button>
          )}
        </motion.div>
      </main>

      {/* Cinema Footer Bar */}
      <footer className="cinema-footer">
        <div className="cinema-footer-brand">
          <span className="cinema-footer-dot" />
          <span>THEBOREDMONKEY STUDIOS · 4K MASTER CINEMA ARCHIVE</span>
        </div>
        <div className="cinema-footer-meta">
          <span>{item.brand}</span>
          <span className="cinema-meta-sep">·</span>
          <span>{item.format}</span>
        </div>
      </footer>
    </motion.div>
  );
}

export function BestWorkGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null);

  const handleSelectWork = useCallback((item: WorkItem) => {
    setSelectedItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <section id="work" className="section-work" ref={sectionRef}>
      <div className="work-wrapper">
        {/* Sticky Background Wrap */}
        <div className="work-sticky-wrap">
          <div className="section-work-heading-wrap">
            <div className="work-heading-wrapper">
              {/* Half blurred OUR WORK title */}
              <div className="our-work-image">
                <span className="our-work-title-back">OUR WORK</span>
                <span className="our-work-title-front">OUR WORK</span>
              </div>

              {/* Framing Corners (Kookie Kollective wtl, wtr, wbl, wbr) */}
              <div className="work-corners-wrap" aria-hidden="true">
                <div className="work-corners">
                  <div className="wtl" />
                  <div className="wtr" />
                </div>
                <div className="work-corners">
                  <div className="wbl" />
                  <div className="wbr" />
                </div>
              </div>

              {/* Framing Crosshairs (Kookie Kollective SVG crosses) */}
              <div className="work-cross-wrap" aria-hidden="true">
                <div className="work-cros">
                  <div className="work-cross-icon">
                    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none">
                      <path d="M20 10H10V0" stroke="#595959" />
                      <path d="M0 10H10V20" stroke="#595959" />
                    </svg>
                  </div>
                  <div className="work-cross-icon">
                    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none">
                      <path d="M20 10H10V0" stroke="#595959" />
                      <path d="M0 10H10V20" stroke="#595959" />
                    </svg>
                  </div>
                </div>
                <div className="work-cros">
                  <div className="work-cross-icon">
                    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none">
                      <path d="M20 10H10V0" stroke="#595959" />
                      <path d="M0 10H10V20" stroke="#595959" />
                    </svg>
                  </div>
                  <div className="work-cross-icon">
                    <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none">
                      <path d="M20 10H10V0" stroke="#595959" />
                      <path d="M0 10H10V20" stroke="#595959" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container: 6 Horizontal DVC Ads top (3x2), 4 Vertical Works below (4x1) */}
        <div className="work-content-wrap">
          {/* Top: 6 DVC Ads / Horizontal Films (3 columns x 2 rows) */}
          <div className="work-grid-horizontal">
            {HORIZONTAL_ITEMS.map((item) => (
              <WorkCard
                key={item.id}
                item={item}
                isAnyModalOpen={Boolean(selectedItem)}
                onSelect={handleSelectWork}
              />
            ))}
          </div>

          {/* Bottom: 4 Vertical Works (4 columns x 1 row) */}
          <div className="work-grid-vertical">
            {VERTICAL_ITEMS.map((item) => (
              <WorkCard
                key={item.id}
                item={item}
                isAnyModalOpen={Boolean(selectedItem)}
                onSelect={handleSelectWork}
              />
            ))}
          </div>
        </div>
      </div>

        {/* Cinema Fullscreen Modal Popup */}
        <AnimatePresence>
          {selectedItem && (
            <WorkModal item={selectedItem} onClose={handleCloseModal} />
          )}
        </AnimatePresence>
      </section>
  );
}
