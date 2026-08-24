const { chromium } = require("playwright");
const fs = require("fs");

const url = "https://video-folio.framer.website/";
const out = "extraction";
const allSizes = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 834, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const sizes = process.env.ONLY ? allSizes.filter((size) => size.name === process.env.ONLY) : allSizes;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium",
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();

  const audit = {};
  for (const size of sizes) {
    await page.setViewportSize({ width: size.width, height: size.height });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(5000);
    try {
      await page.screenshot({ path: `${out}/${size.name}-top.png`, fullPage: false, timeout: 30000, animations: "disabled" });
      await page.evaluate(() => window.scrollTo(0, Math.min(1200, document.documentElement.scrollHeight)));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${out}/${size.name}-scroll-1200.png`, fullPage: false, timeout: 30000, animations: "disabled" });
      await page.evaluate(() => window.scrollTo(0, 0));
    } catch (e) {
      audit[`${size.name}_screenshot_error`] = String(e);
    }

    audit[size.name] = await page.evaluate(() => {
      const visible = (el) => {
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && s.display !== "none" && s.visibility !== "hidden";
      };
      const clean = (v) => String(v || "").replace(/\s+/g, " ").trim();
      const style = (el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || "",
          className: typeof el.className === "string" ? el.className : "",
          text: clean(el.innerText).slice(0, 300),
          rect: { x: +r.x.toFixed(2), y: +r.y.toFixed(2), width: +r.width.toFixed(2), height: +r.height.toFixed(2) },
          display: s.display, position: s.position, flexDirection: s.flexDirection,
          gridTemplateColumns: s.gridTemplateColumns, gap: s.gap,
          padding: s.padding, margin: s.margin,
          color: s.color, backgroundColor: s.backgroundColor,
          fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
          lineHeight: s.lineHeight, letterSpacing: s.letterSpacing,
          borderRadius: s.borderRadius, opacity: s.opacity,
          transform: s.transform, transition: s.transition, animation: s.animation,
          overflow: s.overflow,
        };
      };
      const all = [...document.querySelectorAll("body *")].filter(visible);
      const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(visible).map(style);
      const sections = [...document.querySelectorAll("main > *, body > *, section, header, footer")].filter(visible).map(style);
      const animated = all.filter((el) => {
        const s = getComputedStyle(el);
        return s.animationName !== "none" || s.transitionProperty !== "all 0s ease 0s" || s.transitionDuration !== "0s";
      }).slice(0, 200).map(style);
      return {
        url: location.href,
        title: document.title,
        lang: document.documentElement.lang,
        viewport: { width: innerWidth, height: innerHeight },
        documentHeight: document.documentElement.scrollHeight,
        body: style(document.body),
        headings,
        sections,
        animated,
        links: [...document.querySelectorAll("a")].filter(visible).map(a => ({ text: clean(a.innerText), href: a.href })),
        images: [...document.images].map(i => ({ src: i.currentSrc || i.src, alt: i.alt, width: i.naturalWidth, height: i.naturalHeight })),
        videos: [...document.querySelectorAll("video")].map(v => ({ src: v.currentSrc || v.src, poster: v.poster, width: v.videoWidth, height: v.videoHeight, autoplay: v.autoplay, loop: v.loop, muted: v.muted })),
        fonts: [...document.fonts].map(f => ({ family: f.family, style: f.style, weight: f.weight, status: f.status })),
      };
    });
    fs.writeFileSync(`${out}/${size.name}.json`, JSON.stringify(audit[size.name], null, 2));
  }
  fs.writeFileSync(`${out}/raw.html`, await page.content());
  fs.writeFileSync(`${out}/audit.json`, JSON.stringify(audit, null, 2));
  await browser.close();
})();