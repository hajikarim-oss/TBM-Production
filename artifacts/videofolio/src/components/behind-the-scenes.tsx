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
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1400&auto=format&fit=crop&q=85',
    alt: 'High-speed studio camera and cinema lighting',
  },
  {
    id: 'bts-4',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1400&auto=format&fit=crop&q=85',
    alt: 'Multi-track production audio recording desk',
  },
  {
    id: 'bts-5',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400&auto=format&fit=crop&q=85',
    alt: 'DaVinci Resolve 4K theatrical color grading bay',
  },
  {
    id: 'bts-6',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1400&auto=format&fit=crop&q=85',
    alt: 'Director on location with prime cinema camera',
  },
  {
    id: 'bts-7',
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1400&auto=format&fit=crop&q=85',
    alt: 'Cinema prime lenses and focus pull calibration',
  },
  {
    id: 'bts-8',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1400&auto=format&fit=crop&q=85',
    alt: 'Studio screening and master playback theatre',
  },
];

export function BehindTheScenes() {
  return (
    <section className="behind-the-scene-wrap" id="bts">
      {/* Exact Kookie Kollective Zara Action Header */}
      <div className="behind-the-scene-headline">
        <div className="behind-scene-headline">
          <p className="project-navigation-text is-project">behind the scenes</p>
        </div>
      </div>

      {/* Continuously Horizontally Scrolling Splide Container (Pauses on Cursor Hover) */}
      <div className="splide" aria-label="Behind the scenes continuous gallery">
        <div className="splide__track">
          <div className="splide__marquee">
            {/* Primary Track */}
            <div className="splide__group">
              {BTS_SLIDES.map((slide) => (
                <div key={`primary-${slide.id}`} className="splide__slide">
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
            </div>

            {/* Seamless Infinite Looping Track */}
            <div className="splide__group" aria-hidden="true">
              {BTS_SLIDES.map((slide) => (
                <div key={`duplicate-${slide.id}`} className="splide__slide">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
