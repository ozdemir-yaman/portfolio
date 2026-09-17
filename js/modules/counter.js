// ============================================================================
// counter.js — animated stat counters. Fires when visible.
// ============================================================================

import { prefersReducedMotion } from "./reduced-motion.js";

export function initCounters({ container, stats }) {
  if (!container || !stats?.length) return;

  container.innerHTML = stats.map((s, i) => `
    <div class="stat" data-reveal data-reveal-delay="${i * 80}">
      <div class="stat__value" data-target="${s.value}" data-suffix="${s.suffix || ""}">0${s.suffix ? `<span class="suffix">${s.suffix}</span>` : ""}</div>
      <div class="stat__label">${s.label}</div>
    </div>
  `).join("");

  const reduced = prefersReducedMotion();

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      const target = Number(el.getAttribute("data-target")) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      if (reduced) {
        el.innerHTML = `${target}${suffix ? `<span class="suffix">${suffix}</span>` : ""}`;
      } else {
        animate(el, target, suffix);
      }
      io.unobserve(el);
    }
  }, { threshold: 0.4 });

  container.querySelectorAll(".stat__value").forEach((el) => io.observe(el));
}

function animate(el, target, suffix) {
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.round(eased * target);
    el.innerHTML = `${String(value).padStart(target >= 100 ? 0 : 2, "0")}${suffix ? `<span class="suffix">${suffix}</span>` : ""}`;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
