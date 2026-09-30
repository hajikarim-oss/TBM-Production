import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { assetUrl } from '@/lib/utils';
import { R2_ACC1_URL, R2_ACC2_URL } from '@/config';

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

const RAW_STUDIO_SLIDES: HeroSlide[] = [
  {
    brand: 'ATOMBERG',
    campaign: 'Cold Press Juicer Commercial',
    talent: 'Cold Press Juicer Film',
    video: `${R2_ACC1_URL}/Atomberg%20CPJ_TheBoredMonkey%20Studios.mp4`,
    logo: '/brands/atomberg-logo-new.png',
    format: '4K PRORES 422 HQ',
    lens: 'ARRI MASTER ANAMORPHIC 40mm T1.9',
    iso: 'ISO 800',
    fps: '24.000 FPS',
  },
  {
    brand: 'HAPPI PLANET',
    campaign: 'Plant-Powered Commercial',
    talent: 'Eco-Clean Ad Film',
    video: `${R2_ACC2_URL}/Happi%20planet.mp4`,
    logo: '/brands/happi-planet-brand-color.png',
    format: '4K PRORES 422 HQ',
    lens: 'LEICA SUMMICRON-C 50mm T2.0',
    iso: 'ISO 500',
    fps: '24.000 FPS',
  },
  {
    brand: 'ZOFF',
    campaign: 'Spice Revolution',
    talent: 'High-Speed Commercial',
    video: `${R2_ACC1_URL}/Zoff.mp4`,
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
    video: `${R2_ACC1_URL}/Vibhor.mp4`,
    logo: '/brands/vibhor-logo-new.png',
    format: '4K CINEMA DNG',
    lens: 'ANGENIEUX OPTIMO 28-76mm T2.6',
    iso: 'ISO 800',
    fps: '24.000 FPS',
  },
  {
    brand: 'BLUE TYGA',
    campaign: 'Milind Soman Series',
    talent: 'Starring Milind Soman',
    video: `${R2_ACC1_URL}/Blue%20Tyga_DVC_13.4.2026.mp4`,
    logo: '/brands/bluetyga-logo-white.png',
    format: '4K PRORES 422 HQ',
    lens: 'ARRI SIGNATURE PRIME 47mm T1.8',
    iso: 'ISO 800',
    fps: '24.000 FPS',
  },
];

export const STUDIO_SLIDES: HeroSlide[] = RAW_STUDIO_SLIDES.map((slide) => ({
  ...slide,
  logo: assetUrl(slide.logo),
  video: assetUrl(slide.video),
}));

const AUTOPLAY_DURATION = 8000;
const springSubtle = { type: 'spring' as const, duration: 0.45, bounce: 0 };

export function DickClarkHero() {
  const slides = STUDIO_SLIDES;
  const [currentIdx, setCurrentIdx] = useState(0);
  const reduceMotion = useReducedMotion();

  // Dual video crossfade buffers with warm ping-pong pre-buffering
  const [activeBuffer, setActiveBuffer] = useState<1 | 2>(1);
  const [video1Src, setVideo1Src] = useState<string>(slides[0]?.video || '');
  const [video2Src, setVideo2Src] = useState<string>(slides[1]?.video || '');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isMuted] = useState(true);

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const busy = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  /* ─── Scroll-driven morph: fullscreen → portrait (responsive) ─── */
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroWrapRef,
    offset: ['start start', 'end start'],
  });

  // Video container morphs: on desktop 100% → 42%, on mobile 100% → 92% centered with 16px radius
  const videoWidth = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    isMobile ? ['100%', '100%', '92%'] : ['100%', '100%', '42%']
  );
  const videoHeight = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    isMobile ? ['100%', '100%', '58vh'] : ['100%', '100%', '75vh']
  );
  const videoBorderRadius = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0, 16]);

  // Content fades out as video morphs
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const controlsOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handleManualNav('next');
      } else {
        handleManualNav('prev');
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const transitionTo = useCallback(
    (toIndex: number) => {
      if (busy.current || toIndex === currentIdx) return;
      busy.current = true;

      const targetSlide = slides[toIndex];
      const nextUpcomingSlide = slides[(toIndex + 1) % slides.length];
      const crossfadeDuration = reduceMotion ? 0 : 500;

      if (activeBuffer === 1) {
        // Buffer 2 is the target
        const v2 = video2Ref.current;
        const v1 = video1Ref.current;

        // Ensure buffer 2 has the correct target video
        if (v2) {
          if (video2Src !== targetSlide.video) {
            v2.src = targetSlide.video;
          }
          v2.muted = isMuted;
          const playPromise = v2.play();

          const executeCrossfade = () => {
            setIsTransitioning(true);
            setTimeout(() => {
              setActiveBuffer(2);
              setCurrentIdx(toIndex);
              setIsTransitioning(false);
              busy.current = false;
              if (v1) v1.pause();

              // Warm up buffer 1 with the NEXT upcoming slide
              if (nextUpcomingSlide) {
                setVideo1Src(nextUpcomingSlide.video);
              }
            }, crossfadeDuration);
          };

          if (playPromise !== undefined) {
            playPromise.then(executeCrossfade).catch(() => {
              executeCrossfade();
            });
          } else {
            executeCrossfade();
          }
        }
      } else {
        // Buffer 1 is the target
        const v1 = video1Ref.current;
        const v2 = video2Ref.current;

        if (v1) {
          if (video1Src !== targetSlide.video) {
            v1.src = targetSlide.video;
          }
          v1.muted = isMuted;
          const playPromise = v1.play();

          const executeCrossfade = () => {
            setIsTransitioning(true);
            setTimeout(() => {
              setActiveBuffer(1);
              setCurrentIdx(toIndex);
              setIsTransitioning(false);
              busy.current = false;
              if (v2) v2.pause();

              // Warm up buffer 2 with the NEXT upcoming slide
              if (nextUpcomingSlide) {
                setVideo2Src(nextUpcomingSlide.video);
              }
            }, crossfadeDuration);
          };

          if (playPromise !== undefined) {
            playPromise.then(executeCrossfade).catch(() => {
              executeCrossfade();
            });
          } else {
            executeCrossfade();
          }
        }
      }
    },
    [activeBuffer, currentIdx, slides, reduceMotion, isMuted, video1Src, video2Src]
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
    if (autoplayRef.current) clearTimeout(autoplayRef.current);
    autoplayRef.current = setTimeout(() => {
      goNext();
    }, AUTOPLAY_DURATION);
    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [currentIdx, goNext]);

  const handleManualNav = useCallback(
    (direction: 'next' | 'prev' | number) => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);

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
    <div className="dcp-heroWrap" ref={heroWrapRef}>
      <section
        className="dcp-hero"
        id="home"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ─── Video Canvas with scroll-driven morph ─── */}
        <motion.div
          className="dcp-hero__videoMorph"
          style={{
            width: videoWidth,
            height: videoHeight,
            borderRadius: videoBorderRadius,
          }}
        >
          <div className="dcp-hero__videoCanvas">
            <video
              ref={video1Ref}
              src={video1Src}
              className="dcp-hero__video"
              muted={isMuted}
              loop
              playsInline
              autoPlay
              preload="auto"
              style={{
                opacity: activeBuffer === 1 ? (isTransitioning ? 0 : 1) : isTransitioning ? 1 : 0,
                zIndex: activeBuffer === 1 ? 2 : 1,
                transition: reduceMotion ? 'none' : 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            />
            <video
              ref={video2Ref}
              src={video2Src || undefined}
              className="dcp-hero__video"
              muted={isMuted}
              loop
              playsInline
              preload="auto"
              style={{
                opacity: activeBuffer === 2 ? (isTransitioning ? 0 : 1) : isTransitioning ? 1 : 0,
                zIndex: activeBuffer === 2 ? 2 : 1,
                transition: reduceMotion ? 'none' : 'opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            />
            <div className="dcp-hero__videoOverlay" />
          </div>
        </motion.div>

        {/* ─── Hero Content Grid ─── */}
        <motion.div className="dcp-hero__content" style={{ opacity: contentOpacity }}>
          <div className="dcp-container">
            <div className="dcp-hero__splitLayout">
              {/* Left Column */}
              <div className="dcp-hero__left">
                <h1 className="dcp-hero__title">
                  We Make Films<br />
                  <span className="tbm-text-highlight">People Remember</span>
                </h1>
              </div>

              {/* Right Column */}
              <div className="dcp-hero__right">
                <p className="dcp-hero__description">
                  The in-house production and post-production unit of TheBoredMonkey. From cinematic commercials to brand films and full campaigns, we take an idea from the first frame to the final cut under one roof.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Bottom Center Controls ─── */}
        <motion.div className="dcp-hero__controls" style={{ opacity: controlsOpacity }}>
          <div className="dcp-hero__controlsInner">
            {/* Previous Arrow */}
            <button
              type="button"
              className="dcp-hero__arrow dcp-hero__arrow-prev"
              onClick={() => handleManualNav('prev')}
              aria-label="Previous Brand Video"
            >
              <span className="dcp-hero__arrowFill" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Central Brand Logo */}
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

            {/* Next Arrow */}
            <button
              type="button"
              className="dcp-hero__arrow dcp-hero__arrow-next"
              onClick={() => handleManualNav('next')}
              aria-label="Next Brand Video"
            >
              <span className="dcp-hero__arrowFill" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export const TbmHero = DickClarkHero;
