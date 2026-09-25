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
      <SplashCursor />

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
