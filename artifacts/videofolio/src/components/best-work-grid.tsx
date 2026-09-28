import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { assetUrl } from '@/lib/utils';
import { R2_ACC1_URL, R2_ACC2_URL } from '@/config';

export interface WorkItem {
  id: string;
  brand: string;
  title: string;
  format: 'Vertical AD Film' | 'DVC ADS';
  client: string;
  logo: string;
  video: string;
  aspectRatio: '9:16' | '16:9';
}

const RAW_WORK_ITEMS: WorkItem[] = [
  {
    id: 'bombay-sweet-shop',
    brand: 'Bombay Sweet Shop',
    title: 'Thursday Order Delivery',
    format: 'Vertical AD Film',
    client: 'Vertical AD Film',
    logo: '/brands/bombay-sweet-shop-logo.svg',
    video: `${R2_ACC2_URL}/Thursday%20order_9_16.mp4`,
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
    aspectRatio: '9:16',
  },
  {
    id: 'happi-planet',
    brand: 'Happi Planet',
    title: 'Plant-Powered Clean DVC',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/happi-planet-brand-color.png',
    video: `${R2_ACC2_URL}/Happi%20planet.mp4`,
    aspectRatio: '16:9',
  },
  {
    id: 'vibhor-cooking-oil',
    brand: 'Vibhor',
    title: 'Heritage Mustard Taste',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/vibhor-logo-white.png',
    video: `${R2_ACC1_URL}/Vibhor.mp4`,
    aspectRatio: '16:9',
  },
  {
    id: 'cheq-pay',
    brand: 'Cheq',
    title: 'Smart Credit Rewards',
    format: 'Vertical AD Film',
    client: 'Vertical AD Film',
    logo: '/brands/cheq-logo-white.png',
    video: `${R2_ACC2_URL}/Script%202-%20Hook%203_3%20Oct25.mp4`,
    aspectRatio: '9:16',
  },
  {
    id: 'jordan-oral-care',
    brand: 'Jordan',
    title: 'Mama Penguin Oral Care',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/jordan-logo.svg',
    video: `${R2_ACC2_URL}/jordans-brush-mama-penguin.mp4`,
    aspectRatio: '16:9',
  },
  {
    id: 'setu-nutrition',
    brand: 'Setu',
    title: 'Daily Nutrition Boost',
    format: 'Vertical AD Film',
    client: 'Vertical AD Film',
    logo: '/brands/setu-white.png',
    video: `${R2_ACC2_URL}/setu-campaign.mp4`,
    aspectRatio: '9:16',
  },
  {
    id: 'zoff-spices',
    brand: 'ZOFF',
    title: 'Khade Masale Revolution',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/zoff-logo-white.png',
    video: `${R2_ACC1_URL}/Zoff.mp4`,
    aspectRatio: '16:9',
  },
  {
    id: 'atomberg-cpj',
    brand: 'Atomberg',
    title: 'Cold Press Juicer Launch',
    format: 'DVC ADS',
    client: 'DVC ADS',
    logo: '/brands/atomberg-logo-white.svg',
    video: `${R2_ACC1_URL}/Atomberg%20CPJ_TheBoredMonkey%20Studios.mp4`,
    aspectRatio: '16:9',
  },
];

export const WORK_ITEMS: WorkItem[] = RAW_WORK_ITEMS.map((item) => ({
  ...item,
  logo: assetUrl(item.logo),
  video: assetUrl(item.video),
}));

// Balanced 3-column parallax distribution: exactly 3 items per column
const COL_1 = WORK_ITEMS.filter((_, i) => i % 3 === 0); // Bombay, Vibhor, Setu
const COL_2 = WORK_ITEMS.filter((_, i) => i % 3 === 1); // Fiona, Cheq, ZOFF
const COL_3 = WORK_ITEMS.filter((_, i) => i % 3 === 2); // Happi Planet, Jordan, Atomberg

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

  // Lazy render the video element when card is near viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!entry.isIntersecting && videoRef.current) {
          videoRef.current.pause();
        }
      },
      { rootMargin: '150px 0px', threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pause card video when modal is open
  useEffect(() => {
    if (isAnyModalOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isAnyModalOpen]);

  // Hover to Play logic: plays on mouse enter, pauses on mouse leave
  const handleMouseEnter = useCallback(() => {
    if (!isAnyModalOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isAnyModalOpen]);

  const handleMouseLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const isVertical = item.aspectRatio === '9:16';

  return (
    <div className="work-content-item" ref={cardRef}>
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
        {/* Video Canvas at the top of the card */}
        <div className={`work-content-image ${isVertical ? 'is-vertical-aspect' : 'is-dvc-aspect'}`}>
          <div className="bg-video">
            {isInView ? (
              <video
                ref={videoRef}
                playsInline
                loop
                muted
                preload="metadata"
                src={item.video}
              />
            ) : (
              <div className="work-card-placeholder" />
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
                loading="lazy"
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
            className="cinema-video"
            autoPlay
            playsInline
            controls
            preload="metadata"
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

  // Calibrated, smooth parallax travel speeds (Jakub Krehel subtle polish)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const col1Y = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const col2Y = useTransform(scrollYProgress, [0, 1], ['6%', '-22%']);
  const col3Y = useTransform(scrollYProgress, [0, 1], ['3%', '-15%']);

  const handleSelectWork = useCallback((item: WorkItem) => {
    setSelectedItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return (
    <VideoSlotProvider>
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

          {/* Moving Tiles Grid Container: 3 Symmetrical Columns of 3 items each */}
          <div className="work-content-wrap">
            <div className="work-content-columns">
              {/* Column 1 (3 items) */}
              <motion.div className="work-column" style={{ y: col1Y }}>
                {COL_1.map((item) => (
                  <WorkCard
                    key={item.id}
                    item={item}
                    isAnyModalOpen={Boolean(selectedItem)}
                    onSelect={handleSelectWork}
                  />
                ))}
              </motion.div>

              {/* Column 2 (3 items, offset down) */}
              <motion.div className="work-column work-column--middle" style={{ y: col2Y }}>
                {COL_2.map((item) => (
                  <WorkCard
                    key={item.id}
                    item={item}
                    isAnyModalOpen={Boolean(selectedItem)}
                    onSelect={handleSelectWork}
                  />
                ))}
              </motion.div>

              {/* Column 3 (3 items, perfectly filling the bottom right) */}
              <motion.div className="work-column" style={{ y: col3Y }}>
                {COL_3.map((item) => (
                  <WorkCard
                    key={item.id}
                    item={item}
                    isAnyModalOpen={Boolean(selectedItem)}
                    onSelect={handleSelectWork}
                  />
                ))}
              </motion.div>
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
    </VideoSlotProvider>
  );
}
