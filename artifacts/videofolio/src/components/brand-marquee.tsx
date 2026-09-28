import { assetUrl } from '@/lib/utils';

export interface BrandItem {
  name: string;
  logo: string;
  scale?: number;
}

const ROW_1: BrandItem[] = [
  { name: 'ATOMBERG', logo: '/brands/atomberg-logo-new.png' },
  { name: 'ZOFF SPICES', logo: '/brands/zoff-logo-white.png' },
  { name: 'BLUE TYGA', logo: '/brands/bluetyga-logo-white.png' },
  { name: 'BEATXP', logo: '/brands/beatxp-logo-white.png' },
  { name: 'VIBHOR', logo: '/brands/vibhor-logo-new.png' },
  { name: 'BIOPEAK', logo: '/brands/biopeak-logo-white.svg' },
  { name: 'HAPPI PLANET', logo: '/brands/happi-planet-brand-color.png' },
  { name: 'CHEQ', logo: '/brands/cheq-logo-white.png' },
];

const ROW_2: BrandItem[] = [
  { name: 'SETU', logo: '/brands/setu-white.png' },
  { name: 'PILGRIM', logo: '/brands/pilgrim-logo-white.png' },
  { name: 'EAT ANYTIME', logo: '/brands/eatanytime-logo-white.png' },
  { name: 'WAKEFIT', logo: '/brands/wakefit-logo-white.png' },
  { name: 'TOOTHSI', logo: '/brands/toothsi-logo-white.png' },
  { name: 'RENTOMOJO', logo: '/brands/rentomojo-logo-white.png' },
  { name: "RE'EQUIL", logo: '/brands/reequil-logo-white.png' },
  { name: 'ONECARD', logo: '/brands/onecard-logo-white.png' },
];

export function BrandMarquee() {
  return (
    <section className="tbm-brands" id="clients" aria-label="Brand Partners">
      {/* Studio Header */}
      <div className="tbm-brands__header">
        <h2 className="tbm-brands__title">
          Trusted by Market Disrupters & <span className="tbm-text-highlight">Household Names</span>
        </h2>
      </div>

      {/* Modern Silk Dual-Marquee Showcase with Edge Vignette Mask */}
      <div className="tbm-brands__showcase">
        {/* Track 1: Drift Left */}
        <div className="tbm-brands__trackWrap">
          <div className="tbm-brands__track tbm-brands__track--left">
            {[...ROW_1, ...ROW_1, ...ROW_1].map((brand, i) => (
              <div key={`${brand.name}-r1-${i}`} className="tbm-brands__card" title={brand.name}>
                <img
                  src={assetUrl(brand.logo)}
                  alt={brand.name}
                  className="tbm-brands__logo"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Track 2: Drift Right */}
        <div className="tbm-brands__trackWrap">
          <div className="tbm-brands__track tbm-brands__track--right">
            {[...ROW_2, ...ROW_2, ...ROW_2].map((brand, i) => (
              <div key={`${brand.name}-r2-${i}`} className="tbm-brands__card" title={brand.name}>
                <img
                  src={assetUrl(brand.logo)}
                  alt={brand.name}
                  className="tbm-brands__logo"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
