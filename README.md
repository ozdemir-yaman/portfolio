# Portfolio — Senior Frontend Engineer

A hand-rolled, zero-build, motion-heavy portfolio. Vanilla HTML/CSS/JS, WebGL2 shader hero, GSAP + Lenis for motion.

## Quick start

No build step. No install. Just serve the folder.

```bash
# option 1 — Python
python -m http.server 8080

# option 2 — Node (once)
npx serve .

# option 3 — VS Code "Live Server" extension
```

Then open <http://localhost:8080>.

> Note: because `index.html` imports GLSL shaders via `fetch()`, you must serve it over HTTP. Double-clicking the file will not work in most browsers.

## Editing your details

**Every piece of content lives in one file: `js/data.js`.**

Open it, replace the `TODO` values, and everything on the page updates on the next reload.

```js
identity:  { name, handle, tagline, location, availability, email, resume, timezone }
socials:   { github, linkedin, x, dribbble, readcv }
stats:     [{ label, value, suffix }]
experience:[{ company, role, dates, location, bullets[], stack[] }]
stack:     { frameworks[], languages[], styling[], motion[], threeD[], tooling[], testing[], state[] }
projects:  [{ title, tag, year, blurb, stack[] }]
testimonials:[{ quote, name, role, company }]
meta:      { siteUrl, title, description, ogImage }
```

## Customising the look

- **Accent color** — change `--accent` in `css/tokens.css`. It cascades everywhere (including the WebGL shader).
- **Fonts** — swap the Google Fonts link in `index.html`, drop `.woff2` files in `public/fonts/`, and update `--font-display`, `--font-serif`, `--font-mono` in `css/tokens.css`.
- **Sections** — reorder the `<section>` blocks in `index.html`; the nav updates itself via `IntersectionObserver`.

## Project structure

```
index.html
css/
  reset.css       # modern reset
  tokens.css      # design tokens (change accent here)
  base.css        # type + primitives
  components.css  # nav, cursor, buttons, marquee, preloader
  sections.css    # hero, about, work, experience, stack, contact
  animations.css  # keyframes + reduced-motion guard
js/
  main.js         # entrypoint — renders data.js into DOM & boots modules
  data.js         # ← your content lives here
  modules/
    preloader.js       # 0→100 counter + curtain reveal
    cursor.js          # custom cursor
    nav.js             # scrolled state + active section
    hero-shader.js     # WebGL2 renderer (loads GLSL below)
    scramble.js        # decoder text on hero
    magnetic.js        # magnetic buttons
    marquee.js         # marquee band
    reveal.js          # IntersectionObserver reveals
    counter.js         # animated stat counters
    lenis-init.js      # smooth scroll (Lenis)
    gsap-scenes.js     # ScrollTrigger orchestration
    clock.js           # live local-time clock
    reduced-motion.js  # prefers-reduced-motion guard
  shaders/
    hero.vert.glsl
    hero.frag.glsl
public/
  fonts/          # (optional) self-hosted variable fonts
  favicon.svg
  og.png          # (optional) 1200x630 OG image
  resume.pdf      # (placeholder) your resume
```

## Dependencies (CDN)

Fonts fall back to Google Fonts (Inter, Instrument Serif, JetBrains Mono) out of the box.

## Accessibility & performance

- Full `prefers-reduced-motion` fallback path (WebGL → static gradient, motion → instant states).
- Keyboard-navigable, visible focus rings, skip link, semantic landmarks, JSON-LD Person schema.
- WebGL clamps DPR to 1.5 and pauses when off-screen / tab hidden.
- No CLS: content renders synchronously from `data.js` before motion starts.

## Deploy

**Static host, drop the folder in.**

- **Vercel** — `vercel --prod` in the folder, or drag-and-drop on vercel.com.
- **Netlify** — drag the folder onto netlify.com or use `netlify deploy --prod --dir=.`.
- **GitHub Pages** — push to `main`, enable Pages from the repo settings.
- **Cloudflare Pages** — connect the repo, no build command, output directory `/`.

## Todo before you ship

- [ ] Replace every `TODO` in `js/data.js`.
- [ ] Drop your real resume at `public/resume.pdf`.
- [ ] Add a 1200×630 OG image at `public/og.png`.
- [ ] Update the canonical URL and JSON-LD in `index.html`.
- [ ] (Optional) Self-host fonts in `public/fonts/` for better perf and privacy.
