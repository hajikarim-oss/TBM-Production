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
        {/* Single-column centered manifesto — clean, editorial */}
        <div className="tbm-story__manifesto">
          <div className="tbm-story__eyebrow">
            <span className="tbm-story__dot" aria-hidden="true" />
            <span>WHO WE ARE · STUDIO MANIFESTO</span>
          </div>

          <blockquote className="tbm-story__quote">
            Founded in 2020, <strong className="tbm-text-white">TheBoredMonkey Studios</strong> is the dedicated production and post-production wing of TheBoredMonkey. We work with a{' '}
            <span className="tbm-nowrap"><em className="tbm-text-highlight">"Whatever It Takes Mindset"</em></span> — full pipeline in-house. One team, one brief, one standard, from the first creative conversation to final delivery.
          </blockquote>

          <p className="tbm-story__subcopy">
            No fragmented vendors. No miscommunicated briefs. We operate our own camera packages, lighting trucks, studio soundstages, and post-production suites to guarantee broadcast-grade execution for every brand partner.
          </p>
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
