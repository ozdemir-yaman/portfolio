// ============================================================================
// reduced-motion.js — single source of truth for motion preference.
// ============================================================================

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function onMotionPrefChange(cb) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", (e) => cb(e.matches));
}
