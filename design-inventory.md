# Videofolio — Extraction Inventory

**Status:** Phase 1 — Extraction complete. Build has not started.  
**Source:** https://video-folio.framer.website/  
**Audit date:** 2026-08-21 (Asia/Calcutta)  
**Source attribution/license note:** User supplied the source as “Videofolio” by Real Mehedi, Framer Marketplace, Limited Commercial / Free Content, licensed for modification in the user's commercial project. The eventual build must retain any required attribution and must not redistribute the extracted template as a standalone template.

## Audit artifacts

The Playwright audit was run with Chromium, `domcontentloaded`, a 5-second post-load wait, and `--no-sandbox`.

| Artifact | Purpose |
|---|---|
| `extraction/raw.html` | Post-load DOM source of truth |
| `extraction/audit.json` | Combined computed-style/runtime audit |
| `extraction/desktop.json` | 1440px audit |
| `extraction/tablet.json` | 834px audit |
| `extraction/mobile.json` | 390px audit |
| `extraction/desktop-top.png` | Desktop top viewport reference |
| `extraction/desktop-scroll-1200.png` | Desktop scroll reference |
| `extraction/tablet-top.png` | Tablet top viewport reference |
| `extraction/tablet-scroll-1200.png` | Tablet scroll reference |
| `extraction/mobile-top.png` | Mobile top viewport reference |
| `extraction/mobile-scroll-1200.png` | Mobile scroll reference |

The supplied reference image is `attached_assets/Desktop@4x_1787311075964.png` (4800 × 65232 RGBA PNG).

## Global measurements

| Viewport | Document height | Primary behavior |
|---:|---:|---|
| 1440 × 900 | 15,849px | Wide desktop; hero is 900px tall; featured work is a horizontal project rail |
| 834 × 900 | 16,754px | Tablet restructuring; hero remains 900px; sections become taller |
| 390 × 844 | 16,295px | Mobile restructuring; project rail and service/category layouts collapse vertically |

The document uses a red page background: computed `body` background is `rgb(194, 0, 0)` / `#c20000`. Default body text computes to black, while the visible page content is predominantly white.

## Typography

Loaded font families:

- `TASA Orbiter` — primary display/UI face used by the visible headings and major labels.
- `Inter` / `Inter Display` — supporting interface/body families present in the loaded font set.
- `Poppins` — loaded supporting family.
- Merriweather — loaded but not used by the sampled visible headings.

Primary visible heading measurements at 1440px:

| Role | Family | Size | Weight | Line height | Letter spacing | Color |
|---|---|---:|---:|---:|---:|---|
| Hero H1 | TASA Orbiter | 80px | 600 | 64px | -4px | `rgb(255,255,255)` |
| Section H2 | TASA Orbiter | 60px | 600 | 54px | -3px | `rgb(255,255,255)` |
| Project title | TASA Orbiter | 20px | 600 | 22px | -0.4px | `rgb(255,255,255)` |
| Service/category title | TASA Orbiter | 30px | 700 | 30px | -0.6px | `rgb(255,255,255)` |
| Stat label | TASA Orbiter | 22px | 600 | 24.2px | -0.44px | `rgb(255,255,255)` |

The source loads actual font files through Framer/CDN `@font-face` rules. The build should use the extracted/licensed font files rather than silently substituting a similar font.

## Ordered section inventory

The source has 12 primary content sections followed by the footer/contact region. Framer also renders responsive/overlay navigation instances in the DOM; those are recorded separately below.

| # | Section label / exact heading | Desktop top | Desktop height | Tablet height | Mobile height |
|---:|---|---:|---:|---:|---:|
| 1 | Hero — `WE MAKE VIDEOS PEOPLE REMEMBER` | 0 | 900px | 900px | 844px |
| 2 | Meet Sequence — supporting studio introduction | 900 | 1,038px | 1,067.7px | 1,113.5px |
| 3 | Featured Works — `A FEW PROJECTS WE'RE PROUD OF` | 1,938 | 4,354px | 4,354px | 2,678.1px |
| 4 | What We Make — `BUILT AROUND THE ENTIRE PRODUCTION PROCESS.` | 6,292 | 938px | 927.4px | 711.9px |
| 5 | Expertise — `DIFFERENT BUSINESSES. SAME CREATIVE OBSESSION.` | 7,230 | 1,015px | 1,003.6px | 849.2px |
| 6 | Playground/category slideshow — `OUR PLAYGROUND` | ~7,732 | 413px | 413px | 295px |
| 7 | Stats — `THESE NUMBERS DIDN'T HAPPEN OVERNIGHT` | 8,245 | 1,102.81px | 1,110.3px | 1,230px |
| 8 | Testimonials — `THEY SAID IT BETTER THAN WE COULD` | 9,348 | 1,788.25px | 2,019px | 2,983.5px |
| 9 | Packages — `CHOOSE THE RIGHT PRODUCTION FOR WHAT YOU’RE MAKING` | 11,136 | 1,336px | 1,394.8px | 1,713px |
| 10 | FAQ — `THE QUESTIONS BEFORE THE CAMERAS ROLL` | 12,472 | 1,225.53px | 1,414.3px | 1,235.2px |
| 11 | Insights — `FRESH PERSPECTIVES FROM THE STUDIO` | 13,698 | 1,162.61px | 1,100.7px | 1,797.2px |
| 12 | CTA — `LET'S ROLL` / `START CREATING` | 14,860 | 380px | 540px | 270px |

The exact Framer class selectors and complete section text are preserved in `extraction/*.json` and `extraction/raw.html`; class names are implementation-generated and should not be treated as semantic design tokens.

### Content captured

- Navigation: `HOME`, `WORKS`, `GALLERY`, `INSIGHTS`, `ABOUT`, `CONTACT`, `PREMIUM RESOURCES`.
- Hero support: `PLAY SHOWREEL`, `2026`, `4.9/5.0 RATING FROM 480+ VERIFIED REVIEWS`.
- Featured work titles: `AFTER SCHOOL`, `CODE IN THE CAPSULE`, `LIGHT THROUGH THE ARCHIVE`, `NORTHBOUND`.
- Services: `VIDEO PRODUCTION`, `VIDEO EDITING`, `MOTION GRAPHICS`, `POST PRODUCTION`, `CONTENT CREATION`.
- Playground categories: `SOCIAL MEDIA`, `BRAND FILM`, `PRODUCT`, `UGC`, `DOCUMENTARY`, `CORPORATE`, `COMMERCIAL`, `EVENT`.
- Stats labels: `Years Creating`, `Videos Delivered`, `Creative Partners`, `Repeat Clients`.
- Package prices sampled: `$1,500`, `$4,800`.
- Footer contact copy: `SEQUENCE@SEQUENCE.COM`, `(217) 555-0134`, `123 MAIN STREET, SUITE 200, AUSTIN, TX 78701`.

## Media and assets

Runtime audit found **7 video elements**. They are muted and looped; the first video is autoplaying and reports 1920 × 1080 after load. The remaining video sources are lazy/deferred and report zero intrinsic dimensions at the audit moment.

Video source URLs observed:

1. `https://framerusercontent.com/assets/GEkG9vF2A30awmxgKpod4FLe5eI.mp4`
2. `https://framerusercontent.com/assets/Y2xVzqxMWwg6Fy819Beau1ZkAg.mp4`
3. `https://framerusercontent.com/assets/Y7gFBMR55ZjxtJCLlsAbQkdlls.mp4`
4. `https://framerusercontent.com/assets/IY0EmGSPIfj0yteWQgSVb7wIo3s.mp4`
5. `https://framerusercontent.com/assets/lvOWiiNTlCzPpLDzcVtSBgkQ.mp4`
6. `https://framerusercontent.com/assets/WXJX4ABjPhKbtW5r6wY3OHopw.mp4`
7. `https://www.pexels.com/download/video/14221297/`

The page also contains 63 image elements, including SVG brand/mark assets, project imagery, and video posters. The full URL/alt/natural-size inventory is in each viewport JSON. Media must be used only within the user's stated license/usage rights; if a source video cannot be locally reused under those rights, the build phase should use a free, license-cleared replacement with the same measured aspect ratio and motion role—not a generic visual redesign.

## Layout and responsive behavior

### Desktop — 1440px

- Hero is exactly 900px tall.
- Main content uses wide full-bleed sections with a 50px left content inset in sampled H2 blocks.
- Featured works is a horizontal project rail: project title cards are laid out beyond the viewport, with sampled title positions at x=666, 1574, 2482, and 3390.
- What We Make and Expertise use a two-column composition: left heading block and right detail/list block.
- Playground uses a two-column visual split; sampled category slideshow occupies x=720–1390 and is vertically animated.
- Stats and testimonials use large centered/offset display typography and generous vertical spacing.

### Tablet — 834px

- Hero remains 900px.
- All major sections retain the same order but gain vertical height where horizontal compositions collapse or reflow.
- Featured works remains 4,354px, while subsequent sections become ~927–2,019px depending on content.
- Navigation/footer overlays exist as responsive Framer variants in the DOM.

### Mobile — 390px

- Hero is 844px.
- Meet Sequence expands to 1,113.5px.
- Featured Works becomes a compact 2,678.1px vertical presentation rather than the desktop 4,354px rail.
- What We Make and Expertise reduce to 711.9px and 849.2px, with content restructured vertically.
- Testimonials, packages, FAQ, and insights become substantially taller to stack content: 2,983.5px, 1,713px, 1,235.2px, and 1,797.2px respectively.
- CTA reduces to 270px.
- Mobile navigation/footer variants are distinct DOM/layout variants, not merely fluid scaling.

## Animation / interaction inventory

Observed or cataloged from runtime/source:

- Hero showreel video: autoplay, muted, looping video background/visual.
- Multiple muted looping project/section videos, generally lazy/deferred.
- Featured works horizontal rail with offscreen project cards and viewport-based motion.
- Playground vertical slideshow (`framer-slideshow-axis-y`) cycling the category labels.
- Framer viewport/scroll reveal behavior across section content; exact generated transforms are preserved in the runtime audit.
- Navigation menu has `Menu` / `Close` states and responsive overlay variants.
- Video/media cards expose hover/interaction states through Framer-generated transitions.
- Contact/email interaction includes a `Copied` state for the email control.
- CTA and repeated link treatments use marquee/repeated text patterns, including `VIEW WORKS`, `MORE ABOUT US`, and `START CREATING`.

No animation easing curve should be guessed during the build. The source CSS/runtime audit must be consulted for each motion implementation; if a specific easing cannot be derived, that is a gate issue to report rather than silently approximate.

## Phase 1 gate

Extraction is complete and the project is intentionally **not** set up or built yet. The next phase, after explicit approval, is:

1. Next.js App Router + strict TypeScript.
2. `framer-motion`.
3. CSS Modules and tokens derived from this inventory.
4. `content.ts` as the single editable content/media configuration.
5. Labeled aspect-ratio placeholders only where a locally usable source asset is not available.
