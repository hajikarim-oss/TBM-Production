import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────
   HEADER — Refined with Design Motion Principles
   ├── Jakub Krehel   → Subtle enter/exit, blur materializing overlay
   ├── Emil Kowalski   → Scroll hide/show, speed-first, tactile :active
   ├── taste-skill     → Navigation single-line cap, 64-72px height
   └── Accessibility   → prefers-reduced-motion, proper ARIA
   ────────────────────────────────────────────────────────────────── */

const menuOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      duration: 0.45,
      bounce: 0,
      delay: i * 0.06,
    },
  }),
};

export function DickClarkHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Glassmorphism state (Emil: instant, no unnecessary animation)
      setScrolled(currentScrollY > 40);

      // Smart hide/show on scroll direction
      if (currentScrollY > 180 && currentScrollY > lastScrollY.current) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navItems = [
    { id: 'about', label: 'About', href: '#about' },
    { id: 'works', label: 'Works', href: '#works' },
    { id: 'producers', label: 'Producers', href: '#team' },
    { id: 'bts', label: 'BTS', href: '#bts' },
  ];

  return (
    <>
      <header
        className={`dcp-header ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}
        role="banner"
      >
        <div className="dcp-header__background" />
        <div className="dcp-container dcp-header__items">
          {/* Logo (Top Left) */}
          <a
            href="#home"
            className="dcp-header__logo"
            aria-label="TheBoredMonkey Studios — Home"
          >
            <img
              src="/tbm-logo.png"
              alt="TheBoredMonkey Studios"
              className="dcp-header__logo-img"
            />
          </a>

          {/* Desktop Navigation (Center — single line, taste-skill rule) */}
          <nav className="dcp-header__navItems" aria-label="Main Navigation">
            <ul className="dcp-header__navList">
              {navItems.map((item) => (
                <li key={item.id} className="dcp-header__navListItem">
                  <a href={item.href} className="dcp-header__navLink">
                    <span className="dcp-link__mask">
                      <span className="dcp-buttonText">{item.label}</span>
                      <span className="dcp-buttonText" aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Top Right: • CONTACT Pill + Mobile Menu */}
          <div className="dcp-header__right">
            <a href="#contact" className="dcp-header__contactBtn">
              <span className="dcp-header__contactDot" aria-hidden="true" />
              <span>Contact</span>
            </a>

            {/* Mobile Menu Toggle (≤920px) */}
            <button
              type="button"
              className="dcp-header__mobileMenuBtn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={menuOpen}
            >
              <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                <line
                  x1="0" y1="2" x2="24" y2="2"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                />
                <line
                  x1="0" y1="10" x2="24" y2="10"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Fullscreen Mobile Menu Overlay ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="dcp-menuOverlay"
            variants={reduceMotion ? undefined : menuOverlayVariants}
            initial={reduceMotion ? undefined : 'hidden'}
            animate={reduceMotion ? undefined : 'visible'}
            exit={reduceMotion ? undefined : 'exit'}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div className="dcp-menuOverlay__top">
              <img src="/logo.png" alt="TheBoredMonkey" style={{ height: '32px' }} />
              <button
                type="button"
                className="dcp-menuOverlay__close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close Navigation Menu"
              >
                Close
              </button>
            </div>

            <nav className="dcp-menuOverlay__nav" aria-label="Mobile Navigation">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  className="dcp-menuOverlay__link"
                  onClick={() => setMenuOpen(false)}
                  custom={i}
                  variants={reduceMotion ? undefined : menuItemVariants}
                  initial={reduceMotion ? undefined : 'hidden'}
                  animate={reduceMotion ? undefined : 'visible'}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                className="dcp-menuOverlay__link"
                onClick={() => setMenuOpen(false)}
                custom={navItems.length}
                variants={reduceMotion ? undefined : menuItemVariants}
                initial={reduceMotion ? undefined : 'hidden'}
                animate={reduceMotion ? undefined : 'visible'}
              >
                Contact
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
