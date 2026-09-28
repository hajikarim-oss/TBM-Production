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

          {/* 1: Origin & Identity */}
          <p className="tbm-story__intro">
            Founded in 2020, <strong className="tbm-text-white">TheBoredMonkey Studios</strong> is the dedicated production and post-production wing of TheBoredMonkey.
          </p>

          {/* 2: The Core Ethos (Bold Hero Display) */}
          <h2 className="tbm-story__headline">
            We work with a <span className="tbm-text-highlight">"Whatever It Takes Mindset"</span>
            <span className="tbm-story__headline-sub">full pipeline in-house.</span>
          </h2>

          <p className="tbm-story__delivery">
            From the first creative conversation to final delivery.
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
