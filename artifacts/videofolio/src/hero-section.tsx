export function Hero() {
  return (
    <section className="vf-hero" id="home">
      <Video src={media.hero} className="vf-hero-video" />
      <div className="vf-hero-overlay" />
      <div className="vf-hero-content">
        <div className="vf-hero-top">
          <motion.h1 className="vf-hero-title vf-display" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>{content.hero.title}</motion.h1>
        </div>
        <div className="vf-hero-main">
          <motion.div className="vf-hero-rating-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <span className="vf-clutch-label">Clutch</span>
            <span className="vf-rating-value">{content.hero.rating}</span>
            <div className="vf-rating-dots">{[1,2,3,4,5].map(i => <span key={i} />)}</div>
            <span className="vf-rating-text">{content.hero.ratingLabel}</span>
          </motion.div>
          <motion.div className="vf-hero-info-block" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <p className="vf-hero-summary">{content.hero.summary}</p>
            <a className="vf-red-button vf-view-works" href="#works" data-testid="link-view-works">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M2 0h12v4H2zM2 6h16v4H2zM2 12h10v4H2z" fill="currentColor"/></svg>
              {content.hero.viewWorks}
            </a>
          </motion.div>
        </div>
        <div className="vf-hero-footer">
          <span>{content.hero.location}</span>
          <span>{content.hero.agency}</span>
          <span>{content.hero.established}</span>
          <span className="vf-clock"><b />{content.hero.clock}</span>
        </div>
      </div>
    </section>
  );
}
