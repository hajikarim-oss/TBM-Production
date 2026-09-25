import { DickClarkHeader } from './components/dickclark-header';
import { DickClarkHero } from './components/dickclark-hero';
import { BrandMarquee } from './components/brand-marquee';
import { StorySection } from './components/story-section';
import { BestWorkGrid } from './components/best-work-grid';
import { ProducersCrew } from './components/producers-crew';
import { BehindTheScenes } from './components/behind-the-scenes';
import { ContactSection } from './components/contact-section';
import SplashCursor from './components/lumina-cursor';

import './dcp-first-section.css';
import './tbm-sections.css';
import './index.css';

function App() {
  return (
    <main className="vf-app dcp-root">
      {/* ─── Lumina WebGL Fluid Splash Cursor Effect ─── */}
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={512}
        PRESSURE_ITERATIONS={24}
        DENSITY_DISSIPATION={2.2}
        VELOCITY_DISSIPATION={1.8}
        PRESSURE={0.8}
        CURL={30}
        SPLAT_RADIUS={0.28}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={15}
        SHADING={true}
        RAINBOW_MODE={true}
      />

      {/* ─── SECTION 1: Dick Clark Productions Hero (6 Brands + Viewfinder HUD) ─── */}
      <DickClarkHeader />
      <DickClarkHero />

      {/* ─── SECTION 2: Infinite Brand Logo Marquee Strip ─── */}
      <BrandMarquee />

      {/* ─── SECTION 3: Studio Story ("WHATEVER IT TAKES MINDSET" + Moving Equipment) ─── */}
      <StorySection />

      {/* ─── SECTION 4: Best Work Grid (Kookie Kollective Asymmetric Editorial Masonry) ─── */}
      <BestWorkGrid />

      {/* ─── SECTION 5: Meet The Crew / Our Producers (Saurabh Chaubey & Suraj Adawade) ─── */}
      <ProducersCrew />

      {/* ─── SECTION 6: Behind The Scenes (Kookie Kollective Filmstrip Contact Sheet) ─── */}
      <BehindTheScenes />

      {/* ─── SECTION 7: Contact Us (Rolling Counters) + Kookie Kollective Studio Footer ─── */}
      <ContactSection />
    </main>
  );
}

export default App;
