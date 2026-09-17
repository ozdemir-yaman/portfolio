// ============================================================================
// name-anim.js — animates the hero name letter-by-letter: each glyph slides
// up and fades in with a staggered delay. Respects reduced motion.
// ============================================================================

import { prefersReducedMotion } from "./reduced-motion.js";

export function initNameAnim({
  target,
  text,
  perCharDelay = 55,
  startDelay = 200
} = {}) {
  if (!target || !text) return;

  // Build markup: each character wrapped in a span. Preserve spaces via a
  // non-breaking span so stagger still applies without collapsing whitespace.
  // The individual letter spans are aria-hidden — the parent carries an
  // aria-label so assistive tech announces the whole name, not letter by letter.
  const chars = Array.from(text);
  target.setAttribute("role", "text");
  target.innerHTML = chars
    .map((c) => {
      if (c === " ") return `<span class="hero__name-char hero__name-char--space" aria-hidden="true">&nbsp;</span>`;
      // Escape HTML-special chars just in case (name may include ö, ü etc.)
      const safe = c
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<span class="hero__name-char" aria-hidden="true">${safe}</span>`;
    })
    .join("");

  if (prefersReducedMotion()) {
    // Reveal instantly.
    target.querySelectorAll(".hero__name-char").forEach((el) => {
      el.classList.add("is-in");
    });
    return;
  }

  // Stagger the reveal.
  const spans = target.querySelectorAll(".hero__name-char");
  spans.forEach((el, i) => {
    // Use inline transitionDelay so the CSS transition drives the motion.
    el.style.transitionDelay = `${startDelay + i * perCharDelay}ms`;
  });

  // Trigger next frame so the transition actually plays.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      spans.forEach((el) => el.classList.add("is-in"));
    });
  });

  // Clean up will-change after the last letter lands.
  const totalMs = startDelay + spans.length * perCharDelay + 900;
  setTimeout(() => {
    spans.forEach((el) => { el.style.willChange = "auto"; });
  }, totalMs);
}
