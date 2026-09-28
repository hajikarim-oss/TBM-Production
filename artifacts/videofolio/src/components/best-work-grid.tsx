import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

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

const R2 = 'https://pub-c3a151aad3544d4297431bb6fef7f945.r2.dev';

export const WORK_ITEMS: WorkItem[] = [
  {
    id: 'bombay-sweet-shop',
    brand: 'Bombay Sweet Shop',
    title: 'BOMBAY SWEET SHOP',
    format: 'Vertical AD Film',
    client: 'Mithai & Confectionery Campaign',
    logo: '/brands/bombay-sweet-shop-logo.svg',
    video: '/videos/they-already-know-your-order.mp4',
    aspectRatio: '9:16',
  },
  {
    id: 'fiona-diamonds',
    brand: 'Fiona',
    title: 'FIONA DIAMONDS',
    format: 'Vertical AD Film',
    client: 'Festive Sparkle & Lab-Grown Diamonds',
    logo: '/brands/fiona-logo.svg',
    video: '/videos/gifting-hook-01.mp4',
    aspectRatio: '9:16',
  },
  {
    id: 'happi-planet',
    brand: 'Happi Planet',
    title: 'HAPPI PLANET',
    format: 'DVC ADS',
    client: 'Plant-Powered Eco Home Care',
    logo: '/brands/happi-planet-white.svg',
    video: '/videos/happi-planet.mp4',
    aspectRatio: '16:9',
  },
  {
    id: 'vibhor-cooking-oil',
    brand: 'Vibhor Cooking oil',
    title: 'VIBHOR COOKING OIL',
    format: 'DVC ADS',
    client: 'Starring Rupali Ganguly · Saasu Maa Campaign',
    logo: '/brands/vibhor-logo-white.png',
    video: '/videos/vibhor-rupali-cooking-oil.mp4',
    aspectRatio: '16:9',
  },
  {
    id: 'cheq-pay',
    brand: 'Cheq',
    title: 'CHEQ PAY',
    format: 'Vertical AD Film',
    client: 'Fintech Bill Payment Platform',
    logo: '/brands/cheq-logo-white.png',
    video: '/videos/script-2-hook-3.mp4',
    aspectRatio: '9:16',
  },
  {
    id: 'jordan-oral-care',
    brand: 'Jordan',
    title: 'JORDAN ORAL CARE',
    format: 'DVC ADS',
    client: 'Mama Penguin Series · Rabitat Kids Care',
    logo: '/brands/jordan-logo.svg',
    video: '/videos/jordans-brush-mama-penguin.mp4',
    aspectRatio: '16:9',
  },
  {
    id: 'setu-nutrition',
    brand: 'Setu',
    title: 'SETU NUTRITION',
    format: 'Vertical AD Film',
    client: 'Daily Wellness & Nutrition Campaign',
    logo: '/brands/setu-logo.svg',
    video: '/videos/thursday-order-9-16.mp4',
    aspectRatio: '9:16',
  },
  {
    id: 'zoff-spices',
    brand: 'ZOFF',
    title: 'ZOFF KHADEY MASALE',
    format: 'DVC ADS',
    client: 'Shark Tank India · Pinch Packed with Power',
    logo: '/brands/zoff-logo-white.png',
    video: '/videos/zoff-khadey-masale.mp4',
    aspectRatio: '16:9',
  },
  {
    id: 'atomberg-cpj',
    brand: 'Atomberg',
    title: 'ATOMBERG CPJ',
    format: 'DVC ADS',
    client: 'Atomberg Technologies · Commercial Ad Film',
    logo: '/brands/atomberg-logo-white.svg',
    video: `${R2}/Atomberg%20CPJ_TheBoredMonkey%20Studios.mp4`,
    aspectRatio: '16:9',
  },
];

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

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting && !isAnyModalOpen) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { rootMargin: '120px 0px', threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isAnyModalOpen]);

  // Pause card video when modal is open
  useEffect(() => {
    if (isAnyModalOpen && videoRef.current) {
      videoRef.current.pause();
    } else if (!isAnyModalOpen && isInView && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isAnyModalOpen, isInView]);

  const isVertical = item.aspectRatio === '9:16';

  return (
    <div className="work-content-item" ref={cardRef}>
      <div
        className="work-content-item-card-wrap"
        onClick={() => onSelect(item)}
        role="button"
        tabIndex={0}
        aria-label={`Watch ${item.title} (${item.format})`}
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
                autoPlay
                preload="metadata"
                src={item.video}
              />
            ) : (
              <div className="work-card-placeholder" />
            )}
          </div>

          {/* Broadcast Recording Indicator */}
          <div className="work-card-rec-badge" aria-hidden="true">
            <span className="rec-dot" />
            <span>REC · 4K</span>
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

        {/* Content inside the tile: Logo & Headline, Client & Format (Zero extra clutter) */}
        <div className="work-content-body">
          <div className="work-card-headline-row">
            <h3 className="cards-headline">{item.title}</h3>
            <div className="work-card-logo-container" title={item.brand}>
              <img
                src={item.logo}
                alt={item.brand}
                className="work-card-tile-logo"
                loading="lazy"
              />
            </div>
          </div>

          <div className="work-card-meta-row">
            <span className="cards-client">{item.client}</span>
            <div className={`format-tag-badge format-tag--${isVertical ? 'vertical' : 'dvc'}`}>
              <span className="format-tag-dot" aria-hidden="true" />
              <span>{item.format}</span>
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
  );
}
