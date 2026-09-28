import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assetUrl } from '@/lib/utils';
import { R2_BASE_URL as R2 } from '@/config';

export interface BtsItem {
  id: string;
  title: string;
  brand: string;
  role: string;
  video: string;
  poster: string;
  aspectRatio: '16:9' | '9:16';
}

const RAW_BTS_ITEMS: BtsItem[] = [
  {
    id: 'milind-soman-bts',
    title: 'Milind Soman × Sunscreen Jacket',
    brand: 'BLUE TYGA',
    role: 'Celebrity DVC On-Set Shoot',
    video: `${R2}/milind-soman-bts.mp4`,
    poster: '/images/bts/milind-soman-bts.jpg',
    aspectRatio: '9:16',
  },
  {
    id: 'streax-bts',
    title: 'Streax Professional Campaign',
    brand: 'STREAX',
    role: 'Camera Rigging & Studio Set',
    video: `${R2}/streax-bts.mp4`,
    poster: '/images/bts/streax-bts.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'atomberg-bts',
    title: 'Atomberg Factory Floor Tracking',
    brand: 'ATOMBERG',
    role: 'Ronin 4K Cinema Cinematography',
    video: `${R2}/atomberg-bts-v04.mp4`,
    poster: '/images/bts/atomberg-bts.jpg',
    aspectRatio: '16:9',
  },
  {
    id: 'bts-face-reveal',
    title: 'Milind Soman Look Reveal',
    brand: 'BLUE TYGA',
    role: 'Wardrobe & Stunt Framing',
    video: `${R2}/bts-face-reveal.mp4`,
    poster: '/images/bts/bts-face-reveal.jpg',
    aspectRatio: '9:16',
  },
  {
    id: 'atomberg-podcast',
    title: 'Atomberg Culinary Kitchen DVC',
    brand: 'ATOMBERG',
    role: 'Saasu Maa Commercial Lighting',
    video: `${R2}/atomberg-podcast-bts.mp4`,
    poster: '/images/bts/atomberg-podcast.jpg',
    aspectRatio: '9:16',
  },
  {
    id: 'zeenova-bts',
    title: 'Zeenova Mixer Grinder Commercial',
    brand: 'ZEENOVA',
    role: 'Kitchen Set Production & High-Speed',
    video: `${R2}/zeenova-bts.mp4`,
    poster: '/images/bts/zeenova-bts.jpg',
    aspectRatio: '9:16',
  },
];

export const BTS_ITEMS: BtsItem[] = RAW_BTS_ITEMS.map((item) => ({
  ...item,
  poster: assetUrl(item.poster),
  video: assetUrl(item.video),
}));

function BtsSlideCard({
  item,
  onSelect,
}: {
  item: BtsItem;
  onSelect: (item: BtsItem) => void;
}) {
  return (
    <div
      className="project-image-splide-wrap"
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      aria-label={`Watch ${item.title} (${item.brand} BTS)`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item);
        }
      }}
    >
      <img
        src={item.poster}
        alt={`${item.brand} Behind The Scenes - ${item.title}`}
        className="project-image-splide"
        loading="lazy"
        draggable={false}
      />

      {/* Minimal Play Hover Overlay */}
      <div className="bts-card-play-overlay">
        <div className="bts-card-play-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>PLAY</span>
        </div>
      </div>
    </div>
  );
}

/* ── BTS Cinema Fullscreen Modal Popup ── */
function BtsModal({
  item,
  onClose,
}: {
  item: BtsItem;
  onClose: () => void;
}) {
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [, setIsPlaying] = useState(true);

  // Autoplay handler with audio fallback
  useEffect(() => {
    if (modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0;
      const playPromise = modalVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks unmuted autoplay, mute and resume automatically
          if (modalVideoRef.current) {
            modalVideoRef.current.muted = true;
            setIsAudioMuted(true);
            modalVideoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [item]);

  // Esc and keyboard shortcuts
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
          <div className="cinema-title-group">
            <span className="cinema-project-title">{item.title}</span>
            <span className="cinema-client-subtitle">{item.brand} · {item.role}</span>
          </div>
        </div>

        <div className="cinema-header-controls">
          <div className={`cinema-format-pill format-pill--${isVertical ? 'vertical' : 'dvc'}`}>
            <span className="cinema-live-pulse" />
            <span>BTS ARCHIVE</span>
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
            preload="metadata"
            muted={isAudioMuted}
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
          <span>THEBOREDMONKEY STUDIOS · ON-SET BEHIND THE SCENES ARCHIVE</span>
        </div>
        <div className="cinema-footer-meta">
          <span>{item.brand}</span>
          <span className="cinema-meta-sep">·</span>
          <span>{item.role}</span>
        </div>
      </footer>
    </motion.div>
  );
}

export function BehindTheScenes() {
  const [selectedBts, setSelectedBts] = useState<BtsItem | null>(null);

  const handleSelectBts = useCallback((item: BtsItem) => {
    setSelectedBts(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedBts(null);
  }, []);

  return (
    <section className="behind-the-scene-wrap" id="bts">
      {/* Exact Reference Top Navigation Bar */}
      <div className="bts-nav-bar">
        <div className="bts-nav-left">
          <span className="bts-nav-dot" aria-hidden="true" />
          <span className="bts-nav-label">PROJECT SHOWCASE</span>
        </div>

        <h2 className="bts-nav-title">BEHIND THE SCENES</h2>

        <div className="bts-nav-spacer" aria-hidden="true" />
      </div>

      {/* Continuously Horizontally Scrolling Splide Container (Pauses on Cursor Hover) */}
      <div className="splide" aria-label="Behind the scenes continuous gallery">
        <div className="splide__track">
          <div className="splide__marquee">
            {/* Primary Track */}
            <div className="splide__group">
              {BTS_ITEMS.map((item) => (
                <div key={`primary-${item.id}`} className="splide__slide">
                  <BtsSlideCard item={item} onSelect={handleSelectBts} />
                </div>
              ))}
            </div>

            {/* Seamless Infinite Looping Track */}
            <div className="splide__group" aria-hidden="true">
              {BTS_ITEMS.map((item) => (
                <div key={`duplicate-${item.id}`} className="splide__slide">
                  <BtsSlideCard item={item} onSelect={handleSelectBts} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cinema Fullscreen Modal Player for BTS */}
      <AnimatePresence>
        {selectedBts && (
          <BtsModal item={selectedBts} onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </section>
  );
}
