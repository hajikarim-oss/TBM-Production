import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { content, media } from './content';
import './videofolio.css';

const reveal = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: .7, ease: [0.22, 1, .36, 1] as const } } };
const viewport = { once: true, amount: .2 };

function Video({ src, className = '', posterLabel }: { src: string; className?: string; posterLabel?: string }) {
  return (
    <div className={`vf-video ${className}`} data-testid={`media-video-${posterLabel ?? 'loop'}`}>
      <video src={src} autoPlay muted loop playsInline aria-label={posterLabel ?? content.ui.videoLabel} />
      {posterLabel ? <span className="vf-video-label vf-mono">{posterLabel}</span> : null}
    </div>
  );
}

export function BrandMark() {
  return (
    <a href="#home" className="vf-brand" data-testid="link-brand" aria-label="TheBoredMonkey">
      <img src="/logo.png" alt="TheBoredMonkey" className="vf-brand-logo" />
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
            <button className="vf-menu-toggle vf-close" onClick={onClose} data-testid="button-close-menu" aria-label={content.ui.close}>
              <span>{content.ui.close}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          <nav className="vf-menu-list">
            {content.nav.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={onClose}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                data-testid={`link-menu-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              >
                <span className="vf-menu-num">[{String(index + 1).padStart(2, '0')}]</span>
                <strong className="vf-menu-label">{item.label}</strong>
              </motion.a>
            ))}
          </nav>
          <div className="vf-menu-contact">
            <button className="vf-email" data-testid="button-copy-email" onClick={() => navigator.clipboard?.writeText(content.footer.contactEmail)}>
              {content.footer.contactEmail}
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

export function Header({ onMenu }: { onMenu: () => void }) {
  return <header className="vf-header"><BrandMark /><button className="vf-menu-toggle" onClick={onMenu} data-testid="button-open-menu" aria-label={content.ui.menu}><span>{content.ui.menu}</span><svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor"><line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="0" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="0" y1="13" x2="18" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button></header>;
}

export function Hero() {
  const [showWidget, setShowWidget] = useState(true);
  return (
    <section className="vf-hero" id="home">
      <div className="vf-hero-video-bg">
        <video src={media.hero} autoPlay muted loop playsInline />
      </div>
      <div className="vf-hero-overlay" />
      <div className="vf-hero-grid-overlay" />
      <div className="vf-hero-content">
        <div className="vf-hero-inner">
          <h1 className="vf-hero-title">WE MAKE<br />VIDEOS PEOPLE<br />REMEMBER</h1>
          <div className="vf-hero-bottom-row">
            <div className="vf-hero-rating-block">
              <span className="vf-clutch-label">Clutch</span>
              <span className="vf-rating-value">4.9/5.0</span>
              <div className="vf-rating-dots">{[1,2,3,4,5].map(i => <span key={i} />)}</div>
              <span className="vf-rating-text">RATING FROM 480+ VERIFIED REVIEWS</span>
            </div>
            <div className="vf-hero-info-block">
              <p className="vf-hero-summary">EVERY FRAME HAS A JOB. EVERY CUT HAS A PURPOSE. EVERY PROJECT GETS THE KIND OF ENERGY THAT MAKES PEOPLE WATCH, REMEMBER,<br />AND HIT REPLAY.</p>
              <a className="vf-red-button vf-view-works" href="#works">
                <svg width="22" height="16" viewBox="0 0 22 16" fill="currentColor"><rect x="0" y="0" width="3" height="16" rx="1"/><rect x="5" y="0" width="3" height="16" rx="1"/><rect x="10" y="0" width="3" height="16" rx="1"/><rect x="15" y="0" width="3" height="16" rx="1"/><rect x="19" y="2" width="3" height="12" rx="1"/><polygon points="20,5 20,11 23,8" fill="#fff"/></svg>
                VIEW WORKS
              </a>
            </div>
          </div>
        </div>
        <div className="vf-hero-footer">
          <span>[NEW YORK BASED]</span>
          <span>[AWARD WINNING AGENCY]</span>
          <span>[EST 2015]</span>
          <span className="vf-clock"><b />{content.hero.clock}</span>
        </div>
      </div>
      {showWidget && (
        <div className="vf-remix-widget">
          <div className="vf-remix-card">
            <button className="vf-remix-close" onClick={() => setShowWidget(false)} aria-label="Close">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <div className="vf-remix-thumb">
              <div className="vf-remix-thumb-img" />
              <span className="vf-remix-thumb-text">Capturing Life's Best<br />Moments</span>
            </div>
            <p className="vf-remix-label">Free photography portfolio template</p>
            <a href="#" className="vf-remix-btn">Remix Template <span>›</span></a>
          </div>
        </div>
      )}
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

    if (centered === 0) return { transform: 'translateX(0) scale(1) rotate(0deg)', zIndex: 5, opacity: 1 };
    if (centered === -1) return { transform: 'translateX(-110%) scale(0.78) rotate(-5deg)', zIndex: 3, opacity: 0.5 };
    if (centered === 1) return { transform: 'translateX(110%) scale(0.78) rotate(5deg)', zIndex: 3, opacity: 0.5 };
    if (centered === -2) return { transform: 'translateX(-180%) scale(0.65) rotate(-8deg)', zIndex: 2, opacity: 0.2 };
    if (centered === 2) return { transform: 'translateX(180%) scale(0.65) rotate(8deg)', zIndex: 2, opacity: 0.2 };
    return { transform: 'translateX(0) scale(0.5)', zIndex: 1, opacity: 0 };
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
                  autoPlay={index === active}
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
              <video src={films[player].media} autoPlay controls playsInline />
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

export function Playground() {
  const [active, setActive] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setActive((value) => (value + 1) % content.playground.categories.length), 2600); return () => window.clearInterval(timer); }, []);
  return <section className="vf-playground vf-section"><div className="vf-container vf-playground-grid"><h2 className="vf-display">{content.playground.title}</h2><div className="vf-play-slideshow" aria-live="polite">{content.playground.categories.map((category, index) => <motion.span key={category} className={index === active ? 'is-active vf-display' : 'vf-display'} animate={{ opacity: index === active ? 1 : .16, y: (index - active) * 48 }} transition={{ duration: .5 }}>{category}</motion.span>)}</div></div></section>;
}

export function Stats() {
  return <section className="vf-stats vf-section"><div className="vf-container"><h2 className="vf-display">{content.stats.title}</h2><div className="vf-stat-grid">{content.stats.items.map((stat, index) => <motion.div className="vf-stat" key={stat.label} initial="hidden" whileInView="show" viewport={viewport} variants={reveal} data-testid={`stat-${index}`}><strong className="vf-display">{stat.number}</strong><h3 className="vf-display">{stat.label}</h3><p>{stat.copy}</p></motion.div>)}</div></div></section>;
}

export function Testimonials() {
  return <section className="vf-testimonials vf-section"><div className="vf-container vf-section-header"><div><span className="vf-eyebrow">{content.testimonials.eyebrow}</span><span className="vf-file-label vf-mono">{content.testimonials.file}</span></div><h2 className="vf-display">{content.testimonials.title}</h2><p>{content.testimonials.copy}</p></div><div className="vf-rating-large vf-container"><strong className="vf-display">{content.testimonials.rating}<small>{content.testimonials.ratingSuffix}</small></strong><span>{content.testimonials.ratingLabel}</span><div className="vf-platforms">{content.testimonials.platforms.map((platform) => <span key={platform}>{platform}</span>)}</div></div><div className="vf-quotes vf-container">{content.testimonials.quotes.map((quote, index) => <motion.blockquote key={quote.name} initial="hidden" whileInView="show" viewport={viewport} variants={reveal} data-testid={`quote-${index}`}><span className="vf-mono">{String(index + 1).padStart(2, '0')}</span><div><p>{quote.quote}</p><cite className="vf-display">{quote.name}</cite><small>{quote.role}</small></div></motion.blockquote>)}</div></section>;
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

export function CTA() {
  return <section className="vf-cta vf-section" id="contact"><div className="vf-cta-marquee vf-display"><span>{content.footer.start}</span><span>{content.footer.start}</span><span>{content.footer.start}</span></div><div className="vf-container vf-cta-inner"><span className="vf-eyebrow">{content.footer.letsRoll}</span><h2 className="vf-display">{content.footer.sayHello}</h2><a className="vf-red-button" href={`mailto:${content.footer.contactEmail}`} data-testid="link-start-creating">{content.footer.plan}<span>{content.ui.arrow}</span></a></div></section>;
}

export function HorizontalGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = content.gallery.films.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const idx = Math.min(total - 1, Math.floor(v * total));
      setActive(idx);
    });
  }, [scrollYProgress, total]);

  const goNext = () => { if (active < total - 1) setActive(active + 1); };
  const goPrev = () => { if (active > 0) setActive(active - 1); };

  return (
    <section className="vf-gallery-section" ref={sectionRef}>
      <div className="vf-gallery-inner">
        <div className="vf-gallery-header">
          <h2 className="vf-display">{content.gallery.title}</h2>
        </div>
        <div className="vf-gallery-panels">
          {content.gallery.films.map((film, index) => (
            <div
              className={`vf-panel ${index === active ? 'is-active' : ''}`}
              key={film.brand + index}
              data-testid={`panel-film-${index}`}
            >
              <div className="vf-panel-video">
                <video
                  src={film.media}
                  muted
                  loop
                  playsInline
                  autoPlay={index === active}
                  aria-label={`${film.brand} - ${film.concept}`}
                />
              </div>
              <span className="vf-panel-label vf-mono">
                <span className="vf-panel-label-red">P</span>({String(index + 1).padStart(2, '0')})
              </span>
              {index === active && (
                <motion.div
                  className="vf-panel-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="vf-display">{film.concept}</h3>
                  <p>{film.brand} — {film.type}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <div className="vf-gallery-controls">
          <span className="vf-gallery-counter vf-mono">
            {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <div className="vf-gallery-nav">
            <button className="vf-gallery-btn" onClick={goPrev} disabled={active === 0} aria-label="Previous">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M18 7H2M8 1L2 7L8 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="vf-gallery-btn" onClick={goNext} disabled={active === total - 1} aria-label="Next">
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><path d="M0 7H16M10 1L16 7L10 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
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
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(content.footer.contactEmail); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <footer className="vf-footer vf-section" id="resources"><div className="vf-container vf-footer-top"><BrandMark /><div className="vf-footer-contact"><button onClick={copy} data-testid="button-footer-copy-email" aria-label={content.footer.contactEmail}>{copied ? content.ui.copied : content.footer.contactEmail}</button><a href={`tel:${content.footer.phone}`} data-testid="link-footer-phone">{content.footer.phone}</a><span>{content.footer.address}</span></div><div className="vf-footer-links"><a href="#resources" data-testid="link-footer-resources">{content.footer.resources}</a><a href="#resources" data-testid="link-footer-legal">{content.footer.legal}</a></div></div><div className="vf-container vf-footer-bottom"><span>{content.footer.template}</span><span>{content.footer.made}</span><span>{content.footer.framer}</span></div></footer>;
}