// ============================================================================
// main.js — entrypoint. Renders data into the DOM and boots all modules.
// ============================================================================

import { data }              from "./data.js";
import { prefersReducedMotion } from "./modules/reduced-motion.js";
import { initPreloader }     from "./modules/preloader.js";
import { initCursor }        from "./modules/cursor.js";
import { initNav }           from "./modules/nav.js";
import { initHeroShader }    from "./modules/hero-shader.js";
import { initScramble }      from "./modules/scramble.js";
import { initMagnetic }      from "./modules/magnetic.js";
import { initReveal }        from "./modules/reveal.js";
import { initCounters }      from "./modules/counter.js";
import { initGsapScenes }    from "./modules/gsap-scenes.js";
import { initNameAnim }      from "./modules/name-anim.js";

// ----------------------------------------------------------------------------
// Render content from data.js
// ----------------------------------------------------------------------------
function render() {
  const { identity, socials, stats, experience, stack, projects, meta } = data;

  // <head> updates
  document.title = meta.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", meta.description);

  // Nav brand
  const brand = document.getElementById("nav-brand-name");
  if (brand) brand.textContent = identity.handle.replace(/^@/, "");

  // Hero meta
  setText("hero-availability", identity.availability);
  setText("hero-location", identity.location);
  setText("hero-tagline", `${identity.tagline} — React, Vue & Angular on the frontend, ASP.NET Core & Node.js on the server.`);

  // Hero title uses fixed 3 lines already; leave as-is.

  // About bio
  const bio = document.getElementById("about-bio");
  if (bio) bio.innerHTML = identity.bio.map((p) => `<p data-reveal>${p}</p>`).join("");

  // Stats
  initCounters({ container: document.getElementById("about-stats"), stats });

  // Work grid
  const grid = document.getElementById("work-grid");
  if (grid) {
    grid.innerHTML = projects.map((p, i) => `
      <li class="project" data-reveal data-reveal-delay="${(i % 3) * 60}">
        <div class="project__thumb" aria-hidden="true">
          <span class="project__thumb-glyph">${p.title.charAt(0)}</span>
        </div>
        <div class="project__body">
          <div class="project__meta">
            <span class="project__tag" data-tag="${p.tag}">${p.tag}</span>
            <span class="mono">${p.year}</span>
          </div>
          <h3 class="project__title">${p.title}</h3>
          <p class="project__blurb">${p.blurb}</p>
          <ul class="project__stack">
            ${p.stack.map((s) => `<li>${s}</li>`).join("")}
          </ul>
          ${p.url ? `
            <a class="project__link mono" href="${p.url}" target="_blank" rel="noopener noreferrer" data-cursor="view">
              <span>Preview</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
            </a>
          ` : ""}
        </div>
      </li>
    `).join("");
  }

  // Timeline
  const timeline = document.getElementById("timeline");
  if (timeline) {
    timeline.innerHTML = experience.map((e) => `
      <li class="timeline__item">
        <div class="timeline__dates mono">${e.dates}<br />${e.location}</div>
        <div class="timeline__body">
          <div class="timeline__role">${e.role}</div>
          <div class="timeline__company">${e.company}</div>
          <ul class="timeline__bullets">
            ${e.bullets.map((b) => `<li>${b}</li>`).join("")}
          </ul>
        </div>
        <ul class="timeline__stack" aria-label="Stack">
          ${e.stack.map((s) => `<li>${s}</li>`).join("")}
        </ul>
      </li>
    `).join("");
  }

  // Stack bento
  const bento = document.getElementById("stack-bento");
  if (bento) {
    const groups = [
      { label: "Frameworks", items: stack.frameworks },
      { label: "Backend",    items: stack.backend },
      { label: "Languages",  items: stack.languages },
      { label: "Tooling",    items: stack.tooling },
      { label: "Testing",    items: stack.testing }
    ];
    bento.innerHTML = groups.map((g) => `
      <div class="bento ${g.wide ? "bento--wide" : ""}" data-reveal>
        <div class="bento__label mono">${g.label}</div>
        <ul class="bento__items">
          ${g.items.map((i) => `<li>${i}</li>`).join("")}
        </ul>
      </div>
    `).join("");
  }

  // Contact
  const emailBtn      = document.getElementById("email-btn");
  const emailLabel    = document.getElementById("email-btn-label");
  const emailHint     = document.getElementById("email-btn-hint");
  if (emailLabel) emailLabel.textContent = identity.email;
  if (emailBtn) {
    emailBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(identity.email);
        if (emailHint) {
          emailHint.textContent = "Copied ✓";
          setTimeout(() => { emailHint.textContent = "Click to copy"; }, 2200);
        }
      } catch {
        window.location.href = `mailto:${identity.email}`;
      }
    });
  }

  // Socials
  const sList = document.getElementById("contact-socials");
  if (sList) {
    const items = Object.entries(socials).filter(([, v]) => v);
    sList.innerHTML = items.map(([k, v]) => `
      <li><a href="${v}" target="_blank" rel="noopener noreferrer" data-cursor="cta">${k}</a></li>
    `).join("") + `<li><a href="${identity.resume}" target="_blank" rel="noopener" data-cursor="cta">Resume ↗</a></li>`;
  }

  // Footer
  setText("footer-signature", `© ${new Date().getFullYear()} · ${identity.name}`);
}

function setText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

// ----------------------------------------------------------------------------
// Boot
// ----------------------------------------------------------------------------
async function boot() {
  const reduced = prefersReducedMotion();

  render();

  // Cursor first so subsequent hoverables register
  initCursor();
  initNav();

  // Preloader — resolves after count-up + curtain
  await initPreloader({ reducedMotion: reduced });

  // Hero shader (async — fetches GLSL)
  initHeroShader({
    canvas: document.getElementById("hero-canvas"),
    reducedMotion: reduced
  });

  // Motion — native browser scroll (no Lenis, no smoothing, no scroll-hijacking).
  requestAnimationFrame(() => {
    initGsapScenes();
    initReveal();
    initScramble({ selector: ".hero__title-line[data-scramble]", stagger: 140 });
    // Animated name in the hero greeting. Runs alongside the scramble so both
    // land together as the hero settles.
    initNameAnim({
      target: document.getElementById("hero-name"),
      text: data.identity.name,
      perCharDelay: 55,
      startDelay: 250
    });
    if (window.ScrollTrigger) {
      requestAnimationFrame(() => window.ScrollTrigger.refresh());
    }
  });

  initMagnetic();
}

// GSAP loads via <script defer> — wait for load event so window.gsap exists.
if (document.readyState === "complete") boot();
else window.addEventListener("load", boot, { once: true });
