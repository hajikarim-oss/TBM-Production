import { useRef } from 'react';
import { motion } from 'framer-motion';

export interface BtsSlide {
  id: string;
  image: string;
  alt: string;
}

const BTS_SLIDES: BtsSlide[] = [
  {
    id: 'bts-1',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1400&auto=format&fit=crop&q=85',
    alt: 'ARRI Alexa tracking shot on studio set',
  },
  {
    id: 'bts-2',
    image: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?w=1400&auto=format&fit=crop&q=85',
    alt: 'Motorized gimbal and optical camera rig',
  },
  {
    id: 'bts-3',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=1400&auto=format&fit=crop&q=85',
    alt: '1000FPS high-speed macro food capture',
  },
  {
    id: 'bts-4',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1400&auto=format&fit=crop&q=85',
    alt: 'Multi-track production audio recording',
  },
  {
    id: 'bts-5',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400&auto=format&fit=crop&q=85',
    alt: 'DaVinci Resolve 4K theatrical color grading bay',
  },
  {
    id: 'bts-6',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1400&auto=format&fit=crop&q=85',
    alt: 'Commercial lighting setup on location',
  },
  {
    id: 'bts-7',
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1400&auto=format&fit=crop&q=85',
    alt: 'Cinema prime lenses and focus pull calibration',
  },
];

export function BehindTheScenes() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="behind-the-scene-wrap" id="bts">
      {/* Exact Kookie Kollective Zara Action Header */}
      <div className="behind-the-scene-headline">
        <div className="behind-scene-headline">
          <p className="project-navigation-text is-project">behind the scenes</p>
        </div>
      </div>

      {/* Splide / Horizontal Slider Container */}
      <div className="splide">
        <div className="splide__track" ref={trackRef}>
          <motion.div
            role="list"
            className="splide__list is-project"
            drag="x"
            dragConstraints={trackRef}
            dragElastic={0.15}
            whileTap={{ cursor: 'grabbing' }}
          >
            {BTS_SLIDES.map((slide) => (
              <div role="listitem" key={slide.id} className="splide__slide">
                <div className="project-image-splide-wrap">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="project-image-splide"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
