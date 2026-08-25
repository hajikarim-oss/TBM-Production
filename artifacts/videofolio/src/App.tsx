import { useState } from 'react';
import {
  BrandCarousel,
  CTA,
  FAQ,
  Footer,
  Header,
  Hero,
  HorizontalGallery,
  Insights,
  MenuOverlay,
  OurServices,
  Packages,
  Stats,
  Testimonials,
  TheRoom,
  TrustedBy,
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
      <TrustedBy />
      <BrandCarousel />
      <TheRoom />
      <OurServices />
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
