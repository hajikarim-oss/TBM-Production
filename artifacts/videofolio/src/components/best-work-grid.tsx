import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const R2 = 'https://pub-c3a151aad3544d4297431bb6fef7f945.r2.dev';

export interface WorkItem {
  id: string;
  title: string;
  client: string;
  services: string[];
  image: string;
  video: string;
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: 'atomberg-cpj',
    title: 'ATOMBERG CPJ',
    client: 'Atomberg Technologies',
    services: ['PRODUCTION', 'COMMERCIAL', 'COLOR GRADE'],
    image: '/brands/Atomberg.jpg',
    video: `${R2}/Atomberg%20CPJ_TheBoredMonkey%20Studios.mp4`,
  },
  {
    id: 'blue-tyga',
    title: 'BLUE TYGA',
    client: 'Starring Milind Soman',
    services: ['DIRECTION', 'AD FILM', 'ATHLEISURE'],
    image: '/brands/Blue%20Tyga.png',
    video: `${R2}/Blue%20Tyga_DVC_13.4.2026.mp4`,
  },
  {
    id: 'zoff-spices',
    title: 'ZOFF SPICES',
    client: 'Shark Tank India Winner',
    services: ['HIGH-SPEED 4K', 'PRODUCTION', 'COMMERCIAL'],
    image: '/brands/ZOFF%20Logo%202195.png',
    video: `${R2}/Zoff.mp4`,
  },
  {
    id: 'biopeak-health',
    title: 'BIOPEAK HEALTH',
    client: 'Biopeak Nutrition',
    services: ['PRODUCT FILM', 'VFX', 'CINEMATOGRAPHY'],
    image: '/brands/Biopeak.png',
    video: `${R2}/Biopeak%20Script%202.mp4`,
  },
  {
    id: 'vibhor-oils',
    title: 'VIBHOR OILS',
    client: 'Vibhor Heritage Foods',
    services: ['BRAND FILM', 'DIRECTION', 'DOCUMENTARY'],
    image: '/brands/Vibhor.png',
    video: `${R2}/Vibhor.mp4`,
  },
  {
    id: 'setu-nutrition',
    title: 'SETU NUTRITION',
    client: 'Starring Ankita Raina',
    services: ['PRODUCTION', 'CELEBRITY DVC', 'POST'],
    image: '/brands/setu-logo-white.svg',
    video: `${R2}/Script%203_2%20min_Version_20%20Nov_1.mp4`,
  },
  {
    id: 'happi-planet',
    title: 'HAPPI PLANET',
    client: 'Eco-Living Series',
    services: ['DIGITAL CAMPAIGN', 'CUSTOMER POV', 'DIRECTION'],
    image: '/brands/happy%20planet.png',
    video: `${R2}/CUSTOMER%20POV.mp4`,
  },
  {
    id: 'atomberg-factory',
    title: 'ATOMBERG FACTORY',
    client: 'Automated Robotics Docu',
    services: ['CORPORATE DOCU', 'MOTION GRAPHICS', 'EDIT'],
    image: '/brands/Atomberg.png',
    video: `${R2}/Atomberg%20Factory%20Edit_With%20Map%20Animation%20V2.mp4`,
  },
  {
    id: 'cheq-pay',
    title: 'CHEQ PAY',
    client: 'Fintech Series',
    services: ['PRODUCTION', 'COMMERCIAL', '4K MASTER'],
    image: '/brands/cheq.svg',
    video: `${R2}/CUSTOMER%20POV.mp4`,
  },
];

// Split into 3 columns for Kookie Kollective 3-column parallax layout
const COL_1 = [WORK_ITEMS[0], WORK_ITEMS[3], WORK_ITEMS[6]];
const COL_2 = [WORK_ITEMS[1], WORK_ITEMS[4], WORK_ITEMS[7]];
const COL_3 = [WORK_ITEMS[2], WORK_ITEMS[5], WORK_ITEMS[8]];

function WorkCard({ item }: { item: WorkItem }) {
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
          if (entry.isIntersecting) {
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
  }, []);

  return (
    <div className="work-content-item" ref={cardRef}>
      <div className="work-content-item-card-wrap">
        <div className="work-content-content">
          <div className="work-content-image">
            {/* Viewport-optimized video stream: plays only when in or near viewport */}
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
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#121216',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      maxWidth: '55%',
                      maxHeight: '55%',
                      objectFit: 'contain',
                      opacity: 0.65,
                      filter: 'brightness(0) invert(1)',
                    }}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="work-content-title">
            <div className="cards-headline">{item.title}</div>
          </div>
        </div>

        <div className="work-content-services">
          {item.services.map((svc) => (
            <div key={svc} className="work-content-single-service">
              <div className="work-content-service-line is-hp-card" />
              <div className="work-content-service-text is-hp-card">{svc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BestWorkGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll driver mapping Kookie Kollective GSAP speeds
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // 3 Staggered columns with distinct travel speeds
  const col1Y = useTransform(scrollYProgress, [0, 1], ['5%', '-25%']);
  const col2Y = useTransform(scrollYProgress, [0, 1], ['18%', '-48%']);
  const col3Y = useTransform(scrollYProgress, [0, 1], ['10%', '-35%']);

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

        {/* Moving Tiles Grid Container */}
        <div className="work-content-wrap">
          <div className="work-content-columns">
            {/* Column 1 */}
            <motion.div className="work-column" style={{ y: col1Y }}>
              {COL_1.map((item) => (
                <WorkCard key={item.id} item={item} />
              ))}
            </motion.div>

            {/* Column 2 (Offset down, faster scrub) */}
            <motion.div className="work-column work-column--middle" style={{ y: col2Y }}>
              {COL_2.map((item) => (
                <WorkCard key={item.id} item={item} />
              ))}
            </motion.div>

            {/* Column 3 */}
            <motion.div className="work-column" style={{ y: col3Y }}>
              {COL_3.map((item) => (
                <WorkCard key={item.id} item={item} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
