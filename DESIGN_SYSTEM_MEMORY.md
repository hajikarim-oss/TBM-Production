# MASTER DESIGN SYSTEM MEMORY & ANALYSIS
## Extracted from `awesome-design-md-main` (74 Production Design Systems) & `dickclark.com`

---

## 1. Executive Summary & Design System Memory

After comprehensive scanning and dedicated analysis of all 74 `DESIGN.md` files in `awesome-design-md-main`, the industry's highest tier web experiences fall into 5 distinct architectural design archetypes. This memory document serves as the permanent foundation for all UI/UX decisions on this project.

### The 5 Architectural Archetypes:

| Archetype | Reference Leaders | Defining Aesthetic | Typography Behavior | Motion Language |
|---|---|---|---|---|
| **Cinematic Entertainment & Production** | **Dick Clark Productions**, RunwayML, Bugatti, Ferrari | Absolute deep canvas (`#111111` / `#000000`), full-bleed 16:9/fullscreen video as primary UI canvas, minimal border interference, high-contrast white text (`#fffcfc`), live recording red accent (`#d63032`). | `PP Neue Montreal` / `abcNormal`, line-height 1.0–1.15, negative tracking (`-0.02em`), fluid clamp scaling pegged to `min(100vw, 177.77vh)`. | `cubic-bezier(.23, 1, .32, 1)`, dual-line masked rolling text (`buttonText`), recording light blink pulses, cross-fade video buffers. |
| **Dark-Craft Software Monolith** | Linear, Raycast, Warp, Cursor | Near-black canvas (`#010102`, `#08090a`), hairline gridlines (`#23252a`), subtle lavender/indigo accents (`#5e6ad2`), dense information hierarchy. | Monospace micro-labels, tight display sans, high-contrast semantic indicators. | Snappy micro-interactions (150ms–250ms), keyboard shortcuts, glowing cursor trails. |
| **Vibrant Interactive Artboard** | Framer, Lovable, Webflow, Mintlify | Dark canvas (`#090909`) with oversized saturated radiant aura blooms (magenta, violet, electric cyan), pill buttons, card elevations (`#141414`). | GT Walsheim / Inter, aggressive display tracking (`-4px` to `-5px`), tight headlines. | Spring physics, hover scale lift (`scale(1.02)`), border shine sweeps. |
| **Quiet Luxury & Precision Craft** | Apple, Tesla, Superhuman | Monochromatic neutrality, subtle gray gradation (`#86868b`), generous whitespace, ultra-sharp product renders. | SF Pro Display / Universal Grotesque, refined line-heights, understated presence. | Butter-smooth continuous scroll, fade-and-settle page entry. |
| **Fintech & Enterprise Monolith** | Stripe, Revolut, Wise, Vercel | Dynamic mesh gradients, clean tabular numbers, strict grid rhythm, high-utility forms. | Inter Display / Haas Grotesk, tabular figures, high readability at 12px–14px. | Multi-column dropdown transitions, live data ticker tickers. |

---

## 2. Dedicated Analysis: Dick Clark Productions (`dickclark.com`)

Dick Clark Productions represents the gold standard of **Cinematic Live Entertainment & Broadcast UI**. The interface acts as an invisible, high-impact cinema screen where video and stage presence take center stage while navigation and controls feel like precision studio broadcast hardware.

### 2.1 Color Tokens & Roles

```yaml
colors:
  canvas: "#111111"              # The deep cinematic darkroom background
  canvas-deep: "#000000"         # Footer and deep overlay background
  ink: "#fffcfc"                 # Off-white primary text (never blinding pure #fff)
  ink-secondary: "#cec2c2"       # Warm silver secondary body and descriptions
  ink-muted: "#6b6767"           # Muted labels, inactive pagination, timestamps
  accent-live: "#d63032"         # Broadcast recording red dot indicator
  hairline: "#353232"            # Hairline dividers and borders
  hairline-subtle: "rgba(255,255,255,0.12)" # Border around carousel arrows
  overlay-hero: "rgba(0,0,0,0.40)" # 40% darkness overlay over fullscreen video
```

### 2.2 Typography Rules (`PP Neue Montreal`)

1. **Fluid Clamp Formula**:
   Typography scales fluidly with viewport width and aspect-ratio bounds:
   `clamp(MIN_REM, MIN_REM + DELTA * (min(100vw, 177.78vh) - 102.4rem) / 776, MAX_REM)`
2. **Hero H1 (`We Turn Live into Legendary`)**:
   - Font: `PP Neue Montreal`, sans-serif
   - Weight: 400
   - Size: `clamp(4.2rem, 4.2rem + 38 * (min(100vw, 177.78vh) - 102.4rem) / 776, 8.0rem)` (42px mobile to 80px wide desktop)
   - Line height: 1.0 (ultra-tight headline presence)
   - Letter spacing: `-0.02em`
   - Color: `#fffcfc`
3. **Hero Subtitle / Description**:
   - Size: `clamp(1.4rem, 1.8rem)` (14px–18px)
   - Weight: 400
   - Line height: 1.3
   - Letter spacing: `0`
   - Color: `#fffcfc` (with 85% opacity or `#cec2c2`)
   - Max-width: `50ch`
4. **Broadcast Labels & Navigation**:
   - Size: `clamp(1.2rem, 1.6rem)` (12px–16px)
   - Weight: 500
   - Letter spacing: `0`
   - Text transform: uppercase
   - Line height: 1.0

### 2.3 Component Anatomy & Micro-Interactions

#### A. Header (`.header`)
- **Structure**: Fixed at top (`position: fixed; top: 0; left: 0; width: 100%; z-index: 100; padding-top: 3.6rem`).
- **Gradient Backdrop**: `linear-gradient(180deg, #111 0%, hsla(0,0%,7%,.5) 51.44%, hsla(0,0%,7%,0) 100%)`.
- **Nav Link Rolling Mask (`.link--masks`)**:
  - Contains two copies of the label inside `.link__mask`.
  - On hover, copy #1 shifts `translateY(-100%)` while copy #2 slides from `translateY(105%)` to `0%` in `0.4s cubic-bezier(.23, 1, .32, 1)`.
- **Active Link Dot**:
  - Injected as `::before` pseudo-element: `width: 0.6rem; height: 0.6rem; background: #d63032; border-radius: 50%`.
- **Action Buttons (`.button.button--filled`)**:
  - `CONTACT` & `MENU` pill buttons:
    - Background: `#fffcfc`, text color `#111111`
    - Radius: `3.2rem`, height: `4.6rem`, padding: `0 2.4rem 0 0.6rem`
    - Contains `.button__dot`: A `2.4rem` circle in live red `#d63032` containing a micro-arrow chevron that transitions with spring bezier.

#### B. Fullscreen Video Hero (`.homeHero`)
- **Container**: `100svh` / `100vh` height, position relative.
- **Dual Video Buffer Stack**:
  - Two video elements cross-fading (`activeVideo: 1 | 2`) to ensure zero black flickers or stutter when cycling slides.
  - Video overlay: `linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4))` for text contrast.
- **Carousel Controls (`.homeHero__carouselControls`)**:
  - Pinned at bottom: `inset: auto 0 2rem 0; justify-content: center; z-index: 3`.
  - Width: `clamp(20rem, 30rem)`.
  - **Prev & Next Buttons (`.slider-arrow`)**:
    - `42px × 42px` circular button.
    - Outer ring with internal fill circle that expands (`transform: scale(1)`) on hover with easing `.4s cubic-bezier(.23, 1, .32, 1)`.
    - Chevron slides horizontally on hover.
  - **Center Brand / Show Logo Switcher**:
    - Aspect ratio: `5/3`, height `56px`.
    - Shows crisp white brand / show logo (e.g. Golden Globes, NYRE, AMAs, Atomberg, Blue Tyga, etc.).
- **Live Tagline Ticker (`.homeHero__intro`)**:
  - Grid: `<span>Making moments</span> <span class="homeHero__introDot"></span> <span>that move millions</span>`.
  - Dot: Crimson `#d63032`, pulsing with broadcast recording blink animation:
    ```css
    @keyframes recordingLightBlink {
      0% { opacity: 1; }
      50% { opacity: 0.15; }
      100% { opacity: 1; }
    }
    ```

---

## 3. Pixel-to-Pixel Execution Plan

1. **Font System**: Integrate `@font-face` definitions for `PP Neue Montreal` (Medium 400 & SemiBold 500) with robust fallback to system Grotesque fonts.
2. **Header Replacement**: Build high-fidelity Dick Clark Productions header with:
   - Dynamic gradient backdrop
   - Exact logo lockup
   - Centered desktop nav links with rolling masked text and active live red dot
   - White pill `Contact` button with live recording dot
   - White pill `Menu` button with toggle states and animated drawer
3. **Hero Replacement**:
   - `100svh` container
   - Fullscreen video player with dual-buffer crossfade
   - Center H1: `"We Turn Live into Legendary"` with exact fluid clamp and tracking
   - Center subtitle: `"Dick Clark Productions is the world’s largest producer and proprietor of televised live entertainment programming."` (and toggleable for TheBoredMonkey portfolio)
   - Bottom controls: 42px circular prev/next arrows with expanding circle hover animation + center logo switcher
   - Bottom intro ticker: `"Making moments • that move millions"` with blinking broadcast dot.
