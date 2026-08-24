import { useState } from 'react';
import {
  CTA,
  Expertise,
  FAQ,
  FeaturedWorks,
  Footer,
  Header,
  Hero,
  HorizontalGallery,
  Insights,
  MeetSequence,
  MenuOverlay,
  Packages,
  Playground,
  Services,
  Stats,
  Testimonials,
} from './videofolio-sections';
import './index.css';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="vf-app">
      <Header onMenu={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Hero />
      <HorizontalGallery />
      <MeetSequence />
      <FeaturedWorks />
      <Services />
      <Expertise />
      <Playground />
      <Stats />
      <Testimonials />
      <Packages />
      <FAQ />
      <Insights />
      <CTA />
      <Footer />
    </main>
  );
}

export default App;
