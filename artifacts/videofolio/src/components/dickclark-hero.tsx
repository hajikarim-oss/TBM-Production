import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const R2 = 'https://pub-c3a151aad3544d4297431bb6fef7f945.r2.dev';

export interface HeroSlide {
  brand: string;
  campaign: string;
  talent: string;
  video: string;
  logo: string;
  format: string;
  lens: string;
  iso: string;
  fps: string;
}

export const STUDIO_SLIDES: HeroSlide[] = [
  {
    brand: 'ATOMBERG',
    campaign: 'CPJ Commercial',
    talent: 'Commercial Ad Film',
    video: `${R2}/Atomberg%20CPJ_TheBoredMonkey%20Studios.mp4`,
    logo: '/brands/atomberg-logo-white.png',
    format: '4K PRORES 422 HQ',
    lens: 'ARRI MASTER ANAMORPHIC 40mm T1.9',
    iso: 'ISO 800',
    fps: '24.000 FPS',
  },
  {
    brand: 'SETU',
    campaign: 'Ankita Raina Series',
    talent: 'Starring Ankita Raina',
    video: `${R2}/Biopeak%20Script%202.mp4`,
    logo: '/brands/setu-logo-white.svg',
    format: '4K PRORES 4444 XQ',
    lens: 'COOKE ANAMORPHIC /i 50mm T2.3',
    iso: 'ISO 640',
    fps: '24.000 FPS',
  },
  {
    brand: 'ZOFF',
    campaign: 'Spice Revolution',
    talent: 'High-Speed Commercial',
    video: `${R2}/Zoff.mp4`,
    logo: '/brands/zoff-logo-white.png',
    format: '4K RAW HIGH-SPEED',
    lens: 'ZEISS SUPREME PRIME 35mm T1.5',
    iso: 'ISO 1250',
    fps: '120.00 FPS',
  },
  {
    brand: 'VIBHOR',
    campaign: 'Heritage Taste',
    talent: 'Brand Film Series',
    video: `${R2}/Vibhor.mp4`,
    logo: '/brands/vibhor-logo-white.png',
    format: '4K CINEMA DNG',
    lens: 'ANGENIEUX OPTIMO 28-76mm T2.6',
    iso: 'ISO 800',
    fps: '24.000 FPS',
  },
  {
    brand: 'BLUE TYGA',
    campaign: 'Milind Soman Series',
    talent: 'Starring Milind Soman',
    video: `${R2}/Blue%20Tyga_DVC_13.4.2026.mp4`,
    logo: '/brands/bluetyga-logo-white.png',
    format: '4K PRORES 422 HQ',
    lens: 'ARRI SIGNATURE PRIME 47mm T1.8',
    iso: 'ISO 800',
    fps: '24.000 FPS',
  },
  {
    brand: 'HAPPI PLANET',
    campaign: 'Plant-Powered Home',
    talent: 'Customer POV Series',
    video: `${R2}/CUSTOMER%20POV.mp4`,
    logo: '/brands/happi-planet-white.svg',
    format: '4K PRORES 422 HQ',
    lens: 'LEICA SUMMICRON-C 50mm T2.0',
    iso: 'ISO 500',
    fps: '24.000 FPS',
  },
];

const AUTOPLAY_DURATION = 8000;
const springSubtle = { type: 'spring' as const, duration: 0.45, bounce: 0 };

export function DickClarkHero() {
  const slides = STUDIO_SLIDES;
  const [currentIdx, setCurrentIdx] = useState(0);
  const reduceMotion = useReducedMotion();

  // Dual video crossfade buffers
  const [video1Src, setVideo1Src] = useState<string>(slides[0].video);
  const [video2Src, setVideo2Src] = useState<string>(slides[1 % slides.length].video);
  const [activeBuffer, setActiveBuffer] = useState<1 | 2>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isMuted] = useState(true);

  // Carousel progress timer & autoplay
  const [progress, setProgress] = useState(0);
  const progressRAF = useRef<number>(0);
  const progressStart = useRef<number>(0);

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const busy = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startProgressTimer = useCallback(() => {
    setProgress(0);
    progressStart.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - progressStart.current;
      const pct = Math.min(elapsed / AUTOPLAY_DURATION, 1);
      setProgress(pct);
      if (pct < 1) {
        progressRAF.current = requestAnimationFrame(animate);
      }
    };
    cancelAnimationFrame(progressRAF.current);
    progressRAF.current = requestAnimationFrame(animate);
  }, []);

  const transitionTo = useCallback(
    (toIndex: number) => {
      if (busy.current || toIndex === currentIdx) return;
      busy.current = true;

      const nextSlide = slides[toIndex];
      const crossfadeDuration = reduceMotion ? 0 : 500;

      if (activeBuffer === 1) {
        setVideo2Src(nextSlide.video);
        setTimeout(() => {
          const v2 = video2Ref.current;
          if (v2) {
            v2.muted = isMuted;
            v2.load();
            v2.play()
              .catch(() => {})
              .finally(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setActiveBuffer(2);
                  setCurrentIdx(toIndex);
                  setIsTransitioning(false);
                  busy.current = false;
                  startProgressTimer();
                }, crossfadeDuration);
              });
          }
        }, 30);
      } else {
        setVideo1Src(nextSlide.video);
        setTimeout(() => {
          const v1 = video1Ref.current;
          if (v1) {
            v1.muted = isMuted;
            v1.load();
            v1.play()
              .catch(() => {})
              .finally(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setActiveBuffer(1);
                  setCurrentIdx(toIndex);
                  setIsTransitioning(false);
                  busy.current = false;
                  startProgressTimer();
                }, crossfadeDuration);
              });
          }
        }, 30);
      }
    },
    [activeBuffer, currentIdx, slides, reduceMotion, isMuted, startProgressTimer]
  );

  const goNext = useCallback(() => {
    const next = (currentIdx + 1) % slides.length;
    transitionTo(next);
  }, [currentIdx, slides.length, transitionTo]);

  const goPrev = useCallback(() => {
    const prev = (currentIdx - 1 + slides.length) % slides.length;
    transitionTo(prev);
  }, [currentIdx, slides.length, transitionTo]);

  useEffect(() => {
    startProgressTimer();
    return () => cancelAnimationFrame(progressRAF.current);
  }, [startProgressTimer]);

  useEffect(() => {
    autoplayRef.current = setTimeout(() => {
      goNext();
    }, AUTOPLAY_DURATION);
    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [goNext]);

  const handleManualNav = useCallback(
    (direction: 'next' | 'prev' | number) => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
      cancelAnimationFrame(progressRAF.current);

      if (typeof direction === 'number') {
        transitionTo(direction);
      } else if (direction === 'next') {
        goNext();
      } else {
        goPrev();
      }
    },
    [goNext, goPrev, transitionTo]
  );

  const currentSlide = slides[currentIdx] || slides[0];

  return (
    <section className="dcp-hero" id="home">
      {/* ─── Background Video Canvas with Dual Buffers ─── */}
      <div className="dcp-hero__videoCanvas">
        <video
          ref={video1Ref}
          src={video1Src}
          className="dcp-hero__video"
          muted={isMuted}
          loop
          playsInline
          autoPlay
          style={{
            opacity: activeBuffer === 1 ? (isTransitioning ? 0 : 1) : isTransitioning ? 1 : 0,
            zIndex: activeBuffer === 1 ? 2 : 1,
            transition: reduceMotion ? 'none' : 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />
        <video
          ref={video2Ref}
          src={video2Src}
          className="dcp-hero__video"
          muted={isMuted}
          loop
          playsInline
          autoPlay
          style={{
            opacity: activeBuffer === 2 ? (isTransitioning ? 0 : 1) : isTransitioning ? 1 : 0,
            zIndex: activeBuffer === 2 ? 2 : 1,
            transition: reduceMotion ? 'none' : 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        />
        <div className="dcp-hero__videoOverlay" />
      </div>

      {/* ─── Hero Content Grid (Dick Clark Layout: Left Title + Right Description) ─── */}
      <div className="dcp-hero__content">
        <div className="dcp-container">
          <div className="dcp-hero__splitLayout">
            {/* Left Column: Stacked Title with Dynamic Campaign Eyebrow */}
            <div className="dcp-hero__left">
              <div className="dcp-hero__campaignTag">
                <span className="dcp-campaignDot" />
                <span>{currentSlide.brand} · {currentSlide.campaign}</span>
              </div>

              <h1 className="dcp-hero__title">
                We Make Videos<br />
                People Remember
              </h1>
            </div>

            {/* Right Column: Studio Synopsis Paragraph */}
            <div className="dcp-hero__right">
              <p className="dcp-hero__description">
                TheBoredMonkey Studios is the dedicated production and post-production
                wing of TheBoredMonkey. We craft cinematic commercials, high-velocity
                brand films, and culture-defining visual campaigns with a full in-house pipeline.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Center Controls: Dick Clark Carousel (< BRAND LOGO >) ─── */}
      <div className="dcp-hero__controls">
        <div className="dcp-hero__controlsInner">
          {/* Previous Arrow Button */}
          <button
            type="button"
            className="dcp-hero__arrow dcp-hero__arrow-prev"
            onClick={() => handleManualNav('prev')}
            aria-label="Previous Brand Video"
          >
            <span className="dcp-hero__arrowFill" />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M15 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Central Brand Logo Switcher */}
          <div className="dcp-hero__brandCenter">
            <AnimatePresence mode="wait">
              <motion.img
                key={`brand-${currentIdx}`}
                src={currentSlide.logo}
                alt={currentSlide.brand}
                className="dcp-hero__brandLogo"
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                transition={springSubtle}
              />
            </AnimatePresence>
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            className="dcp-hero__arrow dcp-hero__arrow-next"
            onClick={() => handleManualNav('next')}
            aria-label="Next Brand Video"
          >
            <span className="dcp-hero__arrowFill" />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* ─── 6-Brand Progress Tracker ─── */}
        <div className="dcp-hero__progressTracker">
          <div className="dcp-hero__progressDashes">
            {slides.map((s, i) => (
              <button
                key={s.brand}
                type="button"
                className={`dcp-hero__progressDash ${i === currentIdx ? 'is-active' : ''}`}
                onClick={() => handleManualNav(i)}
                title={`${s.brand} (${s.campaign})`}
                aria-label={`Go to ${s.brand}`}
              >
                {i === currentIdx && (
                  <span
                    className="dcp-hero__progressFill"
                    style={{
                      width: `${progress * 100}%`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          <span className="dcp-hero__progressNum">
            {String(currentIdx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
