import { lazy, Suspense } from 'react';
import { TbmHeader } from './components/dickclark-header';
import { TbmHero } from './components/dickclark-hero';

// Lazy-load below-the-fold sections — only fetched when React renders them
const StorySection = lazy(() => import('./components/story-section').then(m => ({ default: m.StorySection })));
const BrandMarquee = lazy(() => import('./components/brand-marquee').then(m => ({ default: m.BrandMarquee })));
const BestWorkGrid = lazy(() => import('./components/best-work-grid').then(m => ({ default: m.BestWorkGrid })));
const ProducersCrew = lazy(() => import('./components/producers-crew').then(m => ({ default: m.ProducersCrew })));
const BehindTheScenes = lazy(() => import('./components/behind-the-scenes').then(m => ({ default: m.BehindTheScenes })));
const ContactSection = lazy(() => import('./components/contact-section').then(m => ({ default: m.ContactSection })));

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

      {/* ─── Below-the-fold: code-split and lazy-loaded ─── */}
      <Suspense fallback={null}>
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
      </Suspense>
    </main>
  );
}

export default App;
