import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { content, media } from './content';
import './videofolio.css';

const reveal = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: .7, ease: [0.22, 1, .36, 1] as const } } };
const viewport = { once: true, amount: .2 };

function Video({ src, className = '', posterLabel }: { src: string; className?: string; posterLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`vf-video ${className}`} data-testid={`media-video-${posterLabel ?? 'loop'}`}>
      {inView && <video src={src} autoPlay muted loop playsInline preload="none" aria-label={posterLabel ?? content.ui.videoLabel} />}
      {posterLabel ? <span className="vf-video-label vf-mono">{posterLabel}</span> : null}
    </div>
  );
}

export function BrandMark() {
  return (
    <a href="#home" className="vf-brand" data-testid="link-brand" aria-label="TheBoredMonkey">
      <img src={`${import.meta.env.BASE_URL}/logo.png`} alt="TheBoredMonkey" className="vf-brand-logo" />
    </a>
  );
}

export function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="vf-menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true">
          <div className="vf-menu-top">
            <BrandMark />
            <button className="vf-menu-close-btn" onClick={onClose} data-testid="button-close-menu" aria-label={content.ui.close}>
              <span>{content.ui.close}</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2l14 14M16 2L2 16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <nav className="vf-menu-grid">
            {content.nav.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="vf-menu-tile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                data-testid={`link-menu-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              >
                <span className="vf-menu-num">[{String(index + 1).padStart(2, '0')}]</span>
                <span className="vf-menu-label">{item.label}</span>
              </motion.a>
            ))}
          </nav>
          <div className="vf-menu-contact">
            <button className="vf-email" data-testid="button-copy-email" onClick={() => navigator.clipboard?.writeText(content.footer.email)}>
              {content.footer.email}
              <span>{content.ui.copied}</span>
            </button>
            <a href={`tel:${content.footer.phone}`} data-testid="link-menu-phone">{content.footer.phone}</a>
            <span>{content.footer.address}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

import { useMotionValueEvent } from 'framer-motion';

export function Header({ onMenu }: { onMenu: () => void }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <header className={`vf-header ${hidden ? 'is-hidden' : ''}`}>
      <BrandMark />
      <button className="vf-menu-toggle" onClick={onMenu} data-testid="button-open-menu" aria-label={content.ui.menu}>
        <span>{content.ui.menu}</span>
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
          <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
          <line x1="0" y1="9" x2="22" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
        </svg>
      </button>
    </header>
  );
}

export function Hero() {
  const slides = content.hero.slides;
  const [currentIdx, setCurrentIdx] = useState(0);

  const [video1Src, setVideo1Src] = useState<string>(slides[0].video);
  const [video2Src, setVideo2Src] = useState<string>(slides[1 % slides.length].video);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const busy = useRef(false);

  const transitionTo = useCallback((to: number) => {
    if (busy.current || to === currentIdx) return;
    busy.current = true;
    const dir = to > currentIdx ? 'next' : 'prev';
    setSlideDirection(dir);

    if (activeVideo === 1) {
      setVideo2Src(slides[to].video);
      setTimeout(() => {
        const vid2 = video2Ref.current;
        if (vid2) {
          vid2.load();
          vid2.play()
            .then(() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActiveVideo(2);
                setCurrentIdx(to);
                setIsTransitioning(false);
                busy.current = false;
              }, 800);
            })
            .catch(() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActiveVideo(2);
                setCurrentIdx(to);
                setIsTransitioning(false);
                busy.current = false;
              }, 800);
            });
        }
      }, 50);
    } else {
      setVideo1Src(slides[to].video);
      setTimeout(() => {
        const vid1 = video1Ref.current;
        if (vid1) {
          vid1.load();
          vid1.play()
            .then(() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActiveVideo(1);
                setCurrentIdx(to);
                setIsTransitioning(false);
                busy.current = false;
              }, 800);
            })
            .catch(() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActiveVideo(1);
                setCurrentIdx(to);
                setIsTransitioning(false);
                busy.current = false;
              }, 800);
            });
        }
      }, 50);
    }
  }, [currentIdx, activeVideo, slides]);

  useEffect(() => {
    const id = setInterval(() => {
      const next = (currentIdx + 1) % slides.length;
      transitionTo(next);
    }, 7000);
    return () => clearInterval(id);
  }, [currentIdx, transitionTo, slides.length]);

  const goNext = useCallback(() => {
    const next = (currentIdx + 1) % slides.length;
    transitionTo(next);
  }, [currentIdx, transitionTo, slides.length]);

  const goPrev = useCallback(() => {
    const prev = (currentIdx - 1 + slides.length) % slides.length;
    transitionTo(prev);
  }, [currentIdx, transitionTo, slides.length]);

  const getVideo1Style = () => {
    const base = { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const };
    if (activeVideo === 1) {
      if (isTransitioning) {
        return {
          ...base,
          transform: `translate3d(${slideDirection === 'next' ? '-100%' : '100%'}, 0, 0)`,
          transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        };
      }
      return {
        ...base,
        transform: 'translate3d(0, 0, 0)',
        transition: 'none',
      };
    } else {
      if (isTransitioning) {
        return {
          ...base,
          transform: 'translate3d(0, 0, 0)',
          transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        };
      }
      return {
        ...base,
        transform: `translate3d(${slideDirection === 'next' ? '100%' : '-100%'}, 0, 0)`,
        transition: 'none',
      };
    }
  };

  const getVideo2Style = () => {
    const base = { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const };
    if (activeVideo === 2) {
      if (isTransitioning) {
        return {
          ...base,
          transform: `translate3d(${slideDirection === 'next' ? '-100%' : '100%'}, 0, 0)`,
          transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        };
      }
      return {
        ...base,
        transform: 'translate3d(0, 0, 0)',
        transition: 'none',
      };
    } else {
      if (isTransitioning) {
        return {
          ...base,
          transform: 'translate3d(0, 0, 0)',
          transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        };
      }
      return {
        ...base,
        transform: `translate3d(${slideDirection === 'next' ? '100%' : '-100%'}, 0, 0)`,
        transition: 'none',
      };
    }
  };

  return (
    <section className="vf-hero" id="home">
      <div className="vf-hero-video-bg" style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
        <video
          ref={video1Ref}
          src={video1Src}
          muted
          playsInline
          loop
          autoPlay
          style={getVideo1Style()}
        />
        <video
          ref={video2Ref}
          src={video2Src}
          muted
          playsInline
          loop
          autoPlay
          style={getVideo2Style()}
        />
      </div>
      <div className="vf-hero-overlay" />
      <div className="vf-hero-content">
        <div className="vf-hero-layout">
          <div className="vf-hero-left">
            <h1 className="vf-hero-title">{content.hero.title}</h1>
          </div>
          <div className="vf-hero-right">
            <p className="vf-hero-description">{content.hero.description}</p>
          </div>
        </div>
      </div>
      <div className="vf-hero-bottom">
        <button className="vf-hero-arrow" onClick={goPrev} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="vf-hero-brand-info">
          <img src={slides[currentIdx].logo} alt={slides[currentIdx].brand} className="vf-hero-brand-logo" />
        </div>
        <button className="vf-hero-arrow" onClick={goNext} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>
  );
}

export function BrandCarousel() {
  const [active, setActive] = useState(0);
  const [player, setPlayer] = useState<number | null>(null);
  const films = content.brandGrid.films;
  const total = films.length;

  useEffect(() => {
    if (player !== null) return;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [total, player]);

  const goNext = () => setActive((prev) => (prev + 1) % total);
  const goPrev = () => setActive((prev) => (prev - 1 + total) % total);

  const getCardStyle = (index: number) => {
    const diff = ((index - active + total) % total);
    const centered = diff > total / 2 ? diff - total : diff;

    if (centered === 0) return { transform: 'translateX(0) scale(1) translateY(0) rotate(0deg)', zIndex: 5, opacity: 1 };
    if (centered === -1) return { transform: 'translateX(-85%) scale(0.75) translateY(12px) rotate(-4deg)', zIndex: 3, opacity: 0.55 };
    if (centered === 1) return { transform: 'translateX(85%) scale(0.75) translateY(12px) rotate(4deg)', zIndex: 3, opacity: 0.55 };
    if (centered === -2) return { transform: 'translateX(-140%) scale(0.6) translateY(24px) rotate(-6deg)', zIndex: 2, opacity: 0.25 };
    if (centered === 2) return { transform: 'translateX(140%) scale(0.6) translateY(24px) rotate(6deg)', zIndex: 2, opacity: 0.25 };
    return { transform: 'translateX(0) scale(0.45) translateY(30px)', zIndex: 1, opacity: 0 };
  };

  return (
    <>
      <section className="vf-carousel">
        <div className="vf-carousel-header">
          <h2 className="vf-display vf-carousel-title">One approach<br />Endless <em>possibilities.</em></h2>
          <p className="vf-carousel-subtitle">We partner with forward-thinking teams and ambitious brands to build digital experiences that creates impact.</p>
        </div>
        <div className="vf-carousel-stage">
          {films.map((film, index) => (
            <div
              key={film.brand + index}
              className={`vf-carousel-card ${index === active ? 'is-active' : ''}`}
              style={getCardStyle(index) as React.CSSProperties}
              onClick={() => setPlayer(index)}
              data-testid={`carousel-card-${index}`}
            >
              <div className="vf-carousel-card-media">
                <video
                  src={film.media}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  autoPlay
                />
              </div>
              <div className="vf-carousel-card-info">
                <span className="vf-carousel-brand">{film.brand}</span>
                <span className="vf-carousel-type">{film.type}</span>
                <span className="vf-carousel-concept">{film.concept}</span>
                <span className="vf-carousel-credit">{film.credit}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="vf-carousel-controls">
          <button className="vf-carousel-arrow" onClick={goPrev} aria-label="Previous">
            <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="vf-carousel-dots">
            {films.map((_, index) => (
              <button
                key={index}
                className={`vf-carousel-dot ${index === active ? 'is-active' : ''}`}
                onClick={() => setActive(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button className="vf-carousel-arrow" onClick={goNext} aria-label="Next">
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </section>
      <AnimatePresence>
        {player !== null && (
          <motion.div
            className="vf-carousel-player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlayer(null)}
          >
            <motion.div
              className="vf-carousel-player-inner"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="vf-carousel-player-close" onClick={() => setPlayer(null)} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <video src={films[player].media} autoPlay controls playsInline preload="none" />
              <div className="vf-carousel-player-meta">
                <span className="vf-carousel-player-brand">{films[player].brand}</span>
                <span className="vf-carousel-player-type">{films[player].type}</span>
                <span className="vf-carousel-player-concept">{films[player].concept}</span>
                <span className="vf-carousel-player-credit">{films[player].credit}</span>
              </div>
            </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const cardIn = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};
const tagIn = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

export function TheRoom() {
  return (
    <section className="vf-room" id="about">
      <motion.div
        className="vf-room-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="vf-room-eyebrow vf-mono">{content.theRoom.eyebrow}</span>
        <h2 className="vf-display vf-room-title">{content.theRoom.title}</h2>
      </motion.div>
      <motion.div
        className="vf-room-grid"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {content.theRoom.members.map((member, index) => (
          <motion.div
            key={member.name}
            className="vf-room-filmmaker"
            variants={cardIn}
            data-testid={`room-member-${index}`}
            whileHover="hover"
          >
            <div className="vf-room-filmmaker-media">
              <img src={member.image} alt={member.name} loading="lazy" />
              <div className="vf-room-filmmaker-overlay" />
            </div>
            <div className="vf-room-filmmaker-info">
              <h3 className="vf-room-filmmaker-name">{member.name}</h3>
              <span className="vf-room-filmmaker-role">{member.role}</span>
              <motion.div
                className="vf-room-filmmaker-brands"
                variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
              >
                {member.brands.map((brand) => (
                  <motion.span key={brand} className="vf-room-filmmaker-brand" variants={tagIn}>
                    {brand}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export function TrustedBy() {
  const logos = content.trustedBy.logos;
  const doubled = [...logos, ...logos];

  return (
    <section className="vf-trusted">
      <div className="vf-trusted-track">
        {doubled.map((logo, i) => (
          <div key={i} className="vf-trusted-tile" data-testid={`trusted-tile-${logo.name.toLowerCase().replaceAll(' ', '-')}`}>
            <img src={logo.src} alt={logo.name} loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function MeetSequence() {
  return <section className="vf-meet vf-section" id="about">
    <div className="vf-container vf-meet-grid">
      <motion.div className="vf-meet-media" initial="hidden" whileInView="show" viewport={viewport} variants={reveal}><Video src={media.meet} posterLabel={content.meet.files[0]} /><div className="vf-file-label vf-mono">{content.meet.files[1]}</div></motion.div>
      <motion.div className="vf-meet-copy" initial="hidden" whileInView="show" viewport={viewport} variants={reveal}><h2 className="vf-display">{content.meet.title}</h2><p>{content.meet.copy}</p><a className="vf-outline-button" href="#contact" data-testid="link-more-about">{content.meet.cta}<span>{content.ui.arrow}</span></a></motion.div>
    </div>
    <div className="vf-catalog vf-container"><div className="vf-catalog-head"><strong className="vf-display">{content.meet.stat}</strong><span>{content.meet.statCopy}</span></div><div className="vf-catalog-rule"><span>{content.meet.catalog}</span></div><div className="vf-partners">{content.meet.partners.map((partner) => <span key={partner} data-testid={`text-partner-${partner}`}>{partner}</span>)}</div></div>
  </section>;
}

export function FeaturedWorks() {
  return <section className="vf-works vf-section" id="works">
    <div className="vf-container vf-section-header"><div><span className="vf-eyebrow">{content.works.eyebrow}</span><span className="vf-file-label vf-mono">{content.works.file}</span></div><h2 className="vf-display">{content.works.title}</h2></div>
    <div className="vf-work-rail">{content.works.projects.map((project, index) => <motion.article className="vf-work-card" key={project.title} initial="hidden" whileInView="show" viewport={viewport} variants={reveal} data-testid={`card-work-${index}`}><Video src={project.media} className="vf-work-media" posterLabel={project.title} /><div className="vf-work-meta"><span>{project.year}</span><h3 className="vf-display">{project.title}</h3><div>{project.categories.map((category) => <span key={category}>{category}</span>)}</div></div></motion.article>)}</div>
    <a href="#gallery" className="vf-rail-cta" data-testid="link-explore-works">{content.works.cta}<span>{content.ui.arrow}</span></a>
  </section>;
}

export function Services() {
  const [active, setActive] = useState(0);
  const item = content.services.items[active];
  return <section className="vf-services vf-section" id="gallery">
    <div className="vf-container vf-service-heading"><div><span className="vf-eyebrow">{content.services.eyebrow}</span><span className="vf-file-label vf-mono">{content.services.file}</span></div><h2 className="vf-display">{content.services.title}</h2></div>
    <div className="vf-service-tabs vf-container">{content.services.items.map((service, index) => <button className={index === active ? 'is-active' : ''} key={service.title} onClick={() => setActive(index)} data-testid={`button-service-${index}`}><span className="vf-mono">{service.number}</span><strong className="vf-display">{service.title}</strong></button>)}</div>
    <AnimatePresence mode="wait"><motion.div className="vf-service-detail vf-container" key={item.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: .35 }}><p>{item.copy}</p><div className="vf-service-price"><strong className="vf-display">{item.price}</strong>{item.details.map((detail) => <span key={detail}>{detail}</span>)}</div><div className="vf-category-list">{item.categories.map((category) => <span key={category}>{category}</span>)}</div></motion.div></AnimatePresence>
  </section>;
}

export function Expertise() {
  return <section className="vf-expertise vf-section"><div className="vf-container vf-expertise-grid"><div><span className="vf-eyebrow">{content.expertise.eyebrow}</span><span className="vf-file-label vf-mono">{content.expertise.file}</span><h2 className="vf-display">{content.expertise.title}</h2></div><div><p>{content.expertise.copy}</p><Video src={media.workC} /></div></div></section>;
}

export function OurServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'intro' | 'services'>('intro');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setPhase(v > 0.5 ? 'services' : 'intro');
    });
  }, [scrollYProgress]);

  return (
    <section className="vf-services-section" ref={sectionRef} id="services">
      <div className="vf-services-sticky">
        <div className={`vf-services-phase ${phase === 'intro' ? 'is-active' : ''}`}>
          <motion.h2
            className="vf-services-intro"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.ourServices.intro.split('Mumbai').map((part, i) =>
              i === 0 ? <>{part}<span className="vf-gold">Mumbai</span></> : <>{part}</>
            )}
          </motion.h2>
        </div>
        <div className={`vf-services-phase ${phase === 'services' ? 'is-active' : ''}`}>
          <div className="vf-services-layout">
            <div className="vf-services-left">
              <motion.h2
                className="vf-services-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.6 }}
              >
                Our<sup>®</sup>Services
              </motion.h2>
              <motion.p
                className="vf-services-subtitle"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewport}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {content.ourServices.subtitle}
              </motion.p>
              <div className="vf-services-divider" />
              <div className="vf-services-features">
                {content.ourServices.features.map((feat, i) => (
                  <motion.div
                    className="vf-feature-item"
                    key={feat}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewport}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  >
                    <span className="vf-feature-plus">+</span>
                    <span>{feat}</span>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="vf-services-cta"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewport}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <span className="vf-cta-arrow">→</span>
                <span>{content.ourServices.cta}</span>
              </motion.button>
            </div>
            <div className="vf-services-list">
              {content.ourServices.items.map((item, i) => (
                <motion.div
                  className="vf-service-row"
                  key={item.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                >
                  <div className="vf-service-row-thumb">
                    <video src={item.media} muted loop playsInline preload="none" />
                  </div>
                  <div className="vf-service-row-info">
                    <span className="vf-service-row-name">{item.name}</span>
                    <span className="vf-service-row-cat">{item.category}</span>
                  </div>
                  <div className="vf-service-row-dots">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <span key={j} className={`vf-dot-item ${j < item.dots ? 'is-active' : ''}`} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section className="vf-stats vf-section" id="stats">
      <div className="vf-container">
        <div className="vf-stats-intro">
          <motion.div
            className="vf-stats-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.5 }}
          >
            <span className="vf-dot" />
            <span>{content.stats.eyebrow}</span>
          </motion.div>
          <motion.p
            className="vf-stats-copy"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {content.stats.introParts.map((part, i) =>
              (part as any).highlight ? (
                <span key={i} className="vf-gold">{part.text}</span>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </motion.p>
        </div>
        <div className="vf-stats-divider" />
        <div className="vf-stats-row">
          {content.stats.items.map((stat, i) => (
            <motion.div
              className="vf-stat-card"
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
            >
              <span className="vf-stat-num">{stat.number}</span>
              <span className="vf-stat-label">{stat.label}</span>
              <span className="vf-stat-desc">{stat.copy}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const quoteReveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Testimonials() {
  return (
    <section className="vf-testimonials vf-section">
      <div className="vf-container vf-section-header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="vf-eyebrow">{content.testimonials.eyebrow}</span>
          <span className="vf-file-label vf-mono">{content.testimonials.file}</span>
        </motion.div>
        <motion.h2
          className="vf-display"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.testimonials.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.testimonials.copy}
        </motion.p>
      </div>
      <motion.div
        className="vf-rating-large vf-container"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <strong className="vf-display">{content.testimonials.rating}<small>{content.testimonials.ratingSuffix}</small></strong>
        <span>{content.testimonials.ratingLabel}</span>
        <div className="vf-platforms">
          {content.testimonials.platforms.map((platform, i) => (
            <motion.span
              key={platform}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
            >
              {platform}
            </motion.span>
          ))}
        </div>
      </motion.div>
      <div className="vf-quotes vf-container">
        {content.testimonials.quotes.map((quote, index) => (
          <motion.blockquote
            key={quote.name}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: index * 0.08 } },
            }}
            data-testid={`quote-${index}`}
          >
            <motion.span
              className="vf-mono"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }}
            >
              {String(index + 1).padStart(2, '0')}
            </motion.span>
            <div>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {quote.quote}
              </motion.p>
              <motion.cite
                className="vf-display"
                variants={{
                  hidden: { opacity: 0, x: -10 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.15 } },
                }}
              >
                {quote.name}
              </motion.cite>
              <motion.small
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { duration: 0.3, delay: 0.25 } },
                }}
              >
                {quote.role}
              </motion.small>
            </div>
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}

export function Packages() {
  return <section className="vf-packages vf-section"><div className="vf-container vf-section-header"><div><span className="vf-eyebrow">{content.packages.eyebrow}</span><span className="vf-file-label vf-mono">{content.packages.file}</span></div><h2 className="vf-display">{content.packages.title}</h2><p>{content.packages.copy}</p></div><div className="vf-plans vf-container">{content.packages.plans.map((plan, index) => <motion.article key={plan.name} initial="hidden" whileInView="show" viewport={viewport} variants={reveal}><div className="vf-plan-included"><strong>{plan.includedTitle}</strong>{plan.included.map((line) => <span key={line}>{line}</span>)}</div><div className="vf-plan-main"><span className="vf-mono">{plan.pricePrefix}</span><strong className="vf-display">{plan.price}</strong><h3 className="vf-display">{plan.name}</h3><p>{plan.description}</p><a className="vf-red-button" href="#contact" data-testid={`link-plan-${index}`}>{plan.cta}<span>{content.ui.arrow}</span></a></div></motion.article>)}</div></section>;
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  return <section className="vf-faq vf-section"><div className="vf-container vf-section-header"><div><span className="vf-eyebrow">{content.faq.eyebrow}</span><span className="vf-file-label vf-mono">{content.faq.file}</span></div><h2 className="vf-display">{content.faq.title}</h2></div><div className="vf-faq-list vf-container">{content.faq.items.map((item, index) => <div className={`vf-faq-item ${open === index ? 'is-open' : ''}`} key={item.question}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index} data-testid={`button-faq-${index}`}><span className="vf-mono">[{String(index + 1).padStart(3, '0')}]</span><strong className="vf-display">{item.question}</strong><i>{open === index ? content.ui.minus : content.ui.plus}</i></button><AnimatePresence initial={false}>{open === index ? <motion.div className="vf-faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{item.answer.map((line) => <span key={line}>{line}</span>)}</motion.div> : null}</AnimatePresence></div>)}</div></section>;
}

export function Insights() {
  return <section className="vf-insights vf-section" id="insights"><div className="vf-container vf-section-header"><div><span className="vf-eyebrow">{content.insights.eyebrow}</span><h2 className="vf-display">{content.insights.title}</h2><p>{content.insights.copy}</p></div><a className="vf-outline-button" href="#resources" data-testid="link-all-blogs">{content.insights.cta}<span>{content.ui.arrow}</span></a></div><div className="vf-post-grid vf-container">{content.insights.posts.map((post, index) => <a href="#resources" className="vf-post" key={post.title} data-testid={`link-post-${index}`}><div className="vf-post-image"><Video src={post.media} posterLabel={post.title} /><span className="vf-mono">{post.date}</span></div><div className="vf-post-meta"><span>{post.month}</span><span>{post.category}</span></div><h3 className="vf-display">{post.title}</h3><span className="vf-post-arrow">{content.ui.arrow}</span></a>)}</div></section>;
}

export function Contact() {
  return (
    <section className="vf-contact vf-section" id="contact">
      <div className="vf-container">
        <div className="vf-contact-layout">
          <div className="vf-contact-left">
            <motion.div
              className="vf-contact-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ duration: 0.4 }}
            >
              <span className="vf-contact-dot" />
              <span className="vf-contact-badge-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>
                {content.contact.eyebrow}
              </span>
            </motion.div>
            <motion.h2
              className="vf-contact-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {content.contact.title}
            </motion.h2>
            <motion.p
              className="vf-contact-subtitle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewport}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {content.contact.subtitle}
            </motion.p>
            <motion.div
              className="vf-contact-icons"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewport}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <a className="vf-contact-icon" href={`tel:${content.contact.phone}`} aria-label="Call">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </a>
              <a className="vf-contact-icon" href={`https://wa.me/${content.contact.phone}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a className="vf-contact-icon" href={`mailto:${content.contact.email}`} aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
              </a>
            </motion.div>
          </div>
          <motion.div
            className="vf-contact-right"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewport}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <form className="vf-contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="vf-form-group">
                <input type="text" placeholder="Name*" required />
              </div>
              <div className="vf-form-group">
                <input type="email" placeholder="Email*" required />
              </div>
              <div className="vf-form-group">
                <input type="tel" placeholder="Mobile Number*" required />
              </div>
              <div className="vf-form-group">
                <textarea placeholder="Message*" rows={3} required />
              </div>
              <button type="submit" className="vf-submit-btn">Submit Now</button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function HorizontalGallery() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [player, setPlayer] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const categories = content.gallery.categories;
  const currentFilm = categories[activeCategory].film;

  const handleCategoryClick = (idx: number) => {
    if (idx === activeCategory) return;
    setActiveCategory(idx);
    setVideoKey((k) => k + 1);
  };

  return (
    <section className="vf-gallery-section" id="gallery">
      <div className="vf-gallery-inner">
        <div className="vf-gallery-header">
          <h2 className="vf-display">{content.gallery.title}</h2>
        </div>
        <div className="vf-gallery-body">
          <div className="vf-gallery-sidebar">
            {categories.map((cat, idx) => (
              <button
                key={cat.label}
                className={`vf-gallery-cat ${idx === activeCategory ? 'is-active' : ''}`}
                onClick={() => handleCategoryClick(idx)}
              >
                <span className="vf-gallery-cat-text">{cat.label}</span>
                {idx === activeCategory && (
                  <motion.div
                    className="vf-gallery-cat-line"
                    layoutId="catLine"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="vf-gallery-main">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                className="vf-gallery-feature"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="vf-gallery-feature-video"
                  onClick={() => setPlayer(true)}
                >
                  <video
                    key={videoKey}
                    src={currentFilm.media}
                    muted
                    loop
                    playsInline
                    autoPlay
                    aria-label={`${currentFilm.brand} - ${currentFilm.concept}`}
                  />
                  <div className="vf-gallery-feature-overlay" />
                  <button
                    className="vf-gallery-play"
                    onClick={(e) => { e.stopPropagation(); setPlayer(true); }}
                    aria-label="Play video"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                  <div className="vf-gallery-feature-info">
                    {currentFilm.logo && (
                      <img className="vf-gallery-feature-logo" src={currentFilm.logo} alt={currentFilm.brand} />
                    )}
                    <h3 className="vf-display">{currentFilm.concept}</h3>
                    <p>{currentFilm.brand} — {currentFilm.type}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {player && (
          <motion.div
            className="vf-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlayer(false)}
          >
            <motion.div
              className="vf-modal-player"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={currentFilm.media}
                controls
                autoPlay
                aria-label={`${currentFilm.brand} - ${currentFilm.concept}`}
              />
              <button className="vf-modal-close" onClick={() => setPlayer(false)} aria-label="Close player">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function BrandGrid() {
  const [player, setPlayer] = useState<number | null>(null);

  return (
    <>
      <section className="vf-brand-grid">
        <div className="vf-brand-grid-header">
          <h2 className="vf-display vf-brand-grid-title">{content.brandGrid.title}</h2>
        </div>
        <div className="vf-brand-grid-inner">
          {content.brandGrid.films.map((film, index) => (
            <div
              key={film.brand + index}
              className={`vf-brand-card vf-brand-height-${film.height}`}
              data-testid={`brand-card-${index}`}
            >
              <div className="vf-brand-card-media">
                <video
                  src={film.media}
                  muted
                  loop
                  playsInline
                  preload="none"
                  data-testid={`brand-video-${index}`}
                />
                <div className="vf-brand-card-overlay">
                  <span className="vf-brand-card-concept">{film.concept}</span>
                  <span className="vf-brand-card-brand-inline">{film.brand}</span>
                </div>
                <button
                  className="vf-brand-card-view"
                  onClick={() => setPlayer(index)}
                  data-testid={`brand-view-${index}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M10 2H4M10 2V8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  VIEW
                </button>
              </div>
              <div className="vf-brand-card-meta">
                <span className="vf-brand-card-brand">{film.brand}</span>
                <span className="vf-brand-card-type">{film.type}</span>
                <span className="vf-brand-card-concept-desktop">{film.concept}</span>
                <span className="vf-brand-card-credit">{film.credit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <AnimatePresence>
        {player !== null ? (
          <motion.div
            className="vf-brand-player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlayer(null)}
            data-testid="brand-player-overlay"
          >
            <motion.div
              className="vf-brand-player-inner"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="vf-brand-player-close" onClick={() => setPlayer(null)} data-testid="brand-player-close" aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <video
                src={content.brandGrid.films[player].media}
                autoPlay
                controls
                playsInline
                preload="none"
                data-testid="brand-player-video"
              />
              <div className="vf-brand-player-meta">
                <span className="vf-brand-card-brand">{content.brandGrid.films[player].brand}</span>
                <span className="vf-brand-card-type">{content.brandGrid.films[player].type}</span>
                <span className="vf-brand-card-concept">{content.brandGrid.films[player].concept}</span>
                <span className="vf-brand-card-credit">{content.brandGrid.films[player].credit}</span>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="vf-footer-new" id="resources">
      <div className="vf-container">
        <div className="vf-footer-top-row">
          <div className="vf-footer-brand">
            <img src={`${import.meta.env.BASE_URL}/logo.png`} alt="TheBoredMonkey" className="vf-footer-logo-img" />
          </div>
          <div className="vf-footer-socials">
            {content.footer.socials.map((s) => (
              <a key={s.label} href={s.href}>{s.label}</a>
            ))}
          </div>
          <div className="vf-footer-address">
            <p>{content.footer.address}</p>
            <a href={`tel:${content.footer.phone}`}>{content.footer.phone}</a>
          </div>
        </div>
        <div className="vf-footer-bottom-row">
          <div className="vf-footer-email-block">
            <strong>{content.footer.businessLabel}</strong>
            <a href={`mailto:${content.footer.businessEmail}`}>{content.footer.businessEmail} <span>↗</span></a>
          </div>
          <div className="vf-footer-email-block">
            <strong>{content.footer.careersLabel}</strong>
            <a href={`mailto:${content.footer.careersEmail}`}>{content.footer.careersEmail} <span>↗</span></a>
          </div>
          <div className="vf-footer-email-block">
            <strong>{content.footer.agencyLabel}</strong>
            <a href={`mailto:${content.footer.agencyEmail}`}>{content.footer.agencyEmail} <span>↗</span></a>
          </div>
        </div>
      </div>
    </footer>
  );
}