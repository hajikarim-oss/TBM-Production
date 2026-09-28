import { TbmHeader } from './components/dickclark-header';
import { TbmHero } from './components/dickclark-hero';
import { BrandMarquee } from './components/brand-marquee';
import { StorySection } from './components/story-section';
import { BestWorkGrid } from './components/best-work-grid';
import { ProducersCrew } from './components/producers-crew';
import { BehindTheScenes } from './components/behind-the-scenes';
import { ContactSection } from './components/contact-section';

import './dcp-first-section.css';
import './tbm-sections.css';
import './index.css';

function App() {
  return (
    <main className="vf-app dcp-root">
      {/* ─── Navigation Header ─── */}
      <TbmHeader />

      {/* ─── SECTION 1: Hero with scroll-driven video morph (fullscreen → portrait) ─── */}
      <TbmHero />

      {/* ─── SECTION 2: Studio Manifesto & Stats ─── */}
      <StorySection />

      {/* ─── SECTION 3: Brand Partners Grid ─── */}
      <BrandMarquee />

      {/* ─── SECTION 4: Best Work Grid (Parallax Masonry) ─── */}
      <BestWorkGrid />

      {/* ─── SECTION 5: Meet The Crew / Our Producers ─── */}
      <ProducersCrew />

      {/* ─── SECTION 6: Behind The Scenes ─── */}
      <BehindTheScenes />

      {/* ─── SECTION 7: Contact Us + Footer ─── */}
      <ContactSection />
    </main>
  );
}

export default App;
