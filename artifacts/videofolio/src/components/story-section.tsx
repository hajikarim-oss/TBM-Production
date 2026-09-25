import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

function RollingNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Quintic ease out (sharp, purposeful deceleration)
      const eased = 1 - Math.pow(1 - progress, 5);
      const current = Math.floor(eased * value);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplay(value);
      }
    };
    requestAnimationFrame(update);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tbm-statNum">
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export function StorySection() {
  return (
    <section className="tbm-story" id="about">
      <div className="tbm-container">
        {/* Balanced Architectural 2-Column Editorial Grid */}
        <div className="tbm-story__grid">
          {/* Left Column: Vision, Eyebrow & Headline */}
          <div className="tbm-story__left">
            <div className="tbm-story__eyebrow">
              <span className="tbm-eyebrowLine" />
              <span>002 — STUDIO PHILOSOPHY</span>
            </div>

            <h2 className="tbm-story__heading">
              Full Pipeline In-House.<br />
              From First Brief<br />
              To Final Master.
            </h2>

            <div className="tbm-story__originBadge">
              <span className="tbm-originDot" />
              <span>EST. 2020 · MUMBAI PRODUCTION HOUSE</span>
            </div>
          </div>

          {/* Right Column: Narrative Manifesto & Production Pillars */}
          <div className="tbm-story__right">
            <blockquote className="tbm-story__quote">
              Founded in 2020, <strong className="tbm-text-white">TheBoredMonkey Studios</strong> is the dedicated production and post-production wing of TheBoredMonkey. We work with a{' '}
              <span className="tbm-nowrap"><em className="tbm-text-gold">“Whatever It Takes Mindset”</em></span> — full pipeline in-house. One team, one brief, one standard, from the first creative conversation to final delivery.
            </blockquote>



            <p className="tbm-story__subcopy">
              No fragmented vendors. No miscommunicated briefs. We operate our own camera packages, lighting trucks, studio soundstages, and post-production suites to guarantee broadcast-grade execution for every brand partner.
            </p>

            {/* Three Studio Production Pillars */}
            <div className="tbm-story__pillars">
              <div className="tbm-pillar">
                <span className="tbm-pillarIndex">01</span>
                <span className="tbm-pillarTitle">In-House Soundstage & Gear</span>
              </div>
              <div className="tbm-pillar">
                <span className="tbm-pillarIndex">02</span>
                <span className="tbm-pillarTitle">Director-Led Commercials</span>
              </div>
              <div className="tbm-pillar">
                <span className="tbm-pillarIndex">03</span>
                <span className="tbm-pillarTitle">Broadcast 4K Color & Post</span>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Production Metric Counters */}
        <div className="tbm-story__stats">
          <div className="tbm-statBlock">
            <RollingNumber value={6} suffix="+" />
            <span className="tbm-statTitle">Years In Film Production</span>
            <span className="tbm-statDesc">Established 2020 in Mumbai</span>
          </div>

          <div className="tbm-statBlock">
            <RollingNumber value={1500} suffix="+" />
            <span className="tbm-statTitle">Films & DVCs Delivered</span>
            <span className="tbm-statDesc">Commercial, digital, documentary</span>
          </div>

          <div className="tbm-statBlock">
            <RollingNumber value={15} suffix="+" />
            <span className="tbm-statTitle">Enterprise Creative Partners</span>
            <span className="tbm-statDesc">From venture unicorns to market leaders</span>
          </div>

          <div className="tbm-statBlock">
            <RollingNumber value={78} suffix="%" />
            <span className="tbm-statTitle">Repeat Client Retainer</span>
            <span className="tbm-statDesc">Multi-year creative consistency</span>
          </div>
        </div>
      </div>
    </section>
  );
}
