export interface BrandItem {
  name: string;
  logo: string;
}

const BRANDS: BrandItem[] = [
  { name: 'ATOMBERG', logo: '/brands/atomberg-logo-white.png' },
  { name: 'ZOFF SPICES', logo: '/brands/zoff-logo-white.png' },
  { name: 'BLUE TYGA', logo: '/brands/bluetyga-logo-white.png' },
  { name: 'SETU', logo: '/brands/setu-logo-white.svg' },
  { name: 'VIBHOR', logo: '/brands/vibhor-logo-white.png' },
  { name: 'BIOPEAK', logo: '/brands/biopeak-logo-white.png' },
  { name: 'HAPPI PLANET', logo: '/brands/happi-planet-white.svg' },
  { name: 'CHEQ', logo: '/brands/cheq-logo-white.png' },
  { name: 'PILGRIM', logo: '/brands/pilgrim-logo-white.png' },
  { name: 'EAT ANYTIME', logo: '/brands/eatanytime-logo-white.png' },
  { name: 'WAKEFIT', logo: '/brands/wakefit-logo-white.png' },
  { name: 'TOOTHSI', logo: '/brands/toothsi-logo-white.png' },
  { name: 'RENTOMOJO', logo: '/brands/rentomojo-logo-white.png' },
  { name: 'REEQUIL', logo: '/brands/reequil-logo-white.png' },
];

export function BrandMarquee() {
  // Duplicate array for seamless infinite marquee loop
  const marqueeItems = [...BRANDS, ...BRANDS];

  return (
    <section className="tbm-marqueeSection" id="clients" aria-label="Brand Clients">
      {/* Architectural Label with Flanking Hairline Dividers */}
      <div className="tbm-marqueeHeader">
        <span className="tbm-marqueeLine" aria-hidden="true" />
        <span className="tbm-marqueeLabel">TRUSTED BY INDUSTRY-LEADING ENTERPRISE & D2C BRANDS</span>
        <span className="tbm-marqueeLine" aria-hidden="true" />
      </div>

      <div className="tbm-marqueeContainer">
        <div className="tbm-marqueeGradient tbm-marqueeGradient--left" aria-hidden="true" />

        <div className="tbm-marqueeTrack">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="tbm-marqueeItem"
              title={brand.name}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="tbm-marqueeLogo"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="tbm-marqueeGradient tbm-marqueeGradient--right" aria-hidden="true" />
      </div>
    </section>
  );
}
