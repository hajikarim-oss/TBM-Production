import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { assetUrl } from '@/lib/utils';
import { R2_ACC1_URL, R2_ACC2_URL } from '@/config';
import { globalVideoManager } from '@/lib/video-manager';

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

  // Dual video crossfade buffers with intelligent warm ping-pong pre-buffering
  const [activeBuffer, setActiveBuffer] = useState<1 | 2>(1);
  const [video1Src, setVideo1Src] = useState<string>(slides[0]?.video || '');
  // Start buffer 2 empty to avoid consuming bandwidth during critical initial paint
  const [video2Src, setVideo2Src] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isMuted] = useState(true);

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const busy = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Warm up buffer 2 quietly only after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!video2Src && slides[1]) {
        setVideo2Src(slides[1].video);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [slides, video2Src]);

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

  // Register hero video with Global Video Manager
  useEffect(() => {
    const activeVid = activeBuffer === 1 ? video1Ref.current : video2Ref.current;
    if (!activeVid) return;

    return globalVideoManager.register({
      id: 'hero-video',
      element: activeVid,
      priority: 'hero',
      pause: () => {
        if (video1Ref.current) video1Ref.current.pause();
        if (video2Ref.current) video2Ref.current.pause();
      },
      play: () => {
        const vid = activeBuffer === 1 ? video1Ref.current : video2Ref.current;
        if (vid) vid.play().catch(() => {});
      },
    });
  }, [activeBuffer]);

  // Pause hero video when scrolled out of viewport to save GPU & network
  useEffect(() => {
    const el = heroWrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const activeVid = activeBuffer === 1 ? video1Ref.current : video2Ref.current;
        if (!activeVid) return;
        if (entry.isIntersecting) {
          if (globalVideoManager.requestPlay('hero-video')) {
            activeVid.play().catch(() => {});
          }
        } else {
          activeVid.pause();
          globalVideoManager.notifyPause('hero-video');
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeBuffer]);

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

      const isToBuffer2 = activeBuffer === 1;
      const vTarget = isToBuffer2 ? video2Ref.current : video1Ref.current;
      const vCurrent = isToBuffer2 ? video1Ref.current : video2Ref.current;
      const targetBuffer: 1 | 2 = isToBuffer2 ? 2 : 1;

      if (!vTarget) {
        busy.current = false;
        return;
      }

      // Check if target buffer has the right source
      const currentTargetSrc = isToBuffer2 ? video2Src : video1Src;
      if (currentTargetSrc !== targetSlide.video) {
        if (isToBuffer2) {
          setVideo2Src(targetSlide.video);
        } else {
          setVideo1Src(targetSlide.video);
        }
        vTarget.src = targetSlide.video;
        vTarget.load();
      }

      vTarget.muted = isMuted;

      const finalize = () => {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveBuffer(targetBuffer);
          setCurrentIdx(toIndex);
          setIsTransitioning(false);
          busy.current = false;
          if (vCurrent) vCurrent.pause();

          // Warm up the inactive buffer with the NEXT upcoming slide
          if (nextUpcomingSlide) {
            if (targetBuffer === 2) {
              setVideo1Src(nextUpcomingSlide.video);
            } else {
              setVideo2Src(nextUpcomingSlide.video);
            }
          }
        }, crossfadeDuration);
      };

      const playPromise = vTarget.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // If target video has frame ready, finish smoothly
            if (vTarget.readyState >= 2) {
              finalize();
            } else {
              const onReady = () => {
                vTarget.removeEventListener('loadeddata', onReady);
                finalize();
              };
              vTarget.addEventListener('loadeddata', onReady, { once: true });
              setTimeout(onReady, 350); // Fallback timeout
            }
          })
          .catch(() => {
            finalize();
          });
      } else {
        finalize();
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
              preload={activeBuffer === 1 ? 'auto' : 'metadata'}
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
              preload={activeBuffer === 2 ? 'auto' : 'metadata'}
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
