import { useState } from 'react';
import {
  BrandCarousel,
  Contact,
  Footer,
  Header,
  Hero,
  HorizontalGallery,
  MenuOverlay,
  OurServices,
  Stats,
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
      <Contact />
      <Footer />
    </main>
  );
}

export default App;
