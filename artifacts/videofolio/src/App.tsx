import { useState } from 'react';
import {
  Contact,
  Footer,
  Header,
  Hero,
  HorizontalGallery,
  MenuOverlay,
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
      <TheRoom />
      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}

export default App;
