// ============================================================================
// scramble.js — decoder/scramble text effect for [data-scramble] elements.
// Reveals characters progressively while randomising the unresolved ones.
// ============================================================================

import { prefersReducedMotion } from "./reduced-motion.js";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";

export function initScramble({ selector = "[data-scramble]", stagger = 120 } = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  if (prefersReducedMotion()) {
    // Text is already in the DOM; nothing to do.
    return;
  }

  els.forEach((el, i) => {
    scrambleTo(el, el.textContent, { delay: i * stagger, duration: 1200 });
  });
}

export function scrambleTo(el, newText, { delay = 0, duration = 900 } = {}) {
  const original = newText;
  const queue = [];
  const max = Math.max(el.textContent.length, original.length);
  for (let i = 0; i < max; i++) {
    const from = el.textContent[i] || "";
    const to   = original[i] || "";
    const start = Math.floor(Math.random() * (duration * 0.4));
    const end   = start + Math.floor(Math.random() * (duration * 0.6));
    queue.push({ from, to, start, end, char: "" });
  }
  const startTime = performance.now() + delay;

  function tick(now) {
    const elapsed = now - startTime;
    if (elapsed < 0) { requestAnimationFrame(tick); return; }
    let output = "";
    let complete = 0;
    for (let i = 0; i < queue.length; i++) {
      const q = queue[i];
      if (elapsed >= q.end) { complete++; output += q.to; }
      else if (elapsed >= q.start) {
        if (!q.char || Math.random() < 0.28) q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        output += `<span style="color:var(--accent)">${q.char}</span>`;
      } else {
        output += q.from;
      }
    }
    el.innerHTML = output;
    if (complete === queue.length) { el.textContent = original; }
    else requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
