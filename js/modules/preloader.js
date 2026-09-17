// ============================================================================
// preloader.js — 0→100 counter, mask-wipe reveal into hero.
// ============================================================================

export function initPreloader({ reducedMotion } = {}) {
  const el      = document.getElementById("preloader");
  const count   = document.getElementById("preloader-count");
  const barFill = document.getElementById("preloader-bar-fill");
  if (!el) return Promise.resolve();

  if (reducedMotion) {
    if (count) count.textContent = "100";
    if (barFill) barFill.style.width = "100%";
    el.classList.add("is-done");
    // Remove after curtain would have finished
    setTimeout(() => el.remove(), 400);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let current = 0;
    const target = 100;
    const duration = 1800;
    const start = performance.now();

    // Ensure fonts + first paint before we finish
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      current = Math.floor(eased * target);
      if (count) count.textContent = String(current).padStart(3, "0");
      if (barFill) barFill.style.width = current + "%";
      if (t < 1) requestAnimationFrame(step);
      else {
        fontsReady.then(() => {
          if (count) count.textContent = "100";
          setTimeout(() => {
            el.classList.add("is-done");
            document.documentElement.classList.add("is-loaded");
            setTimeout(() => {
              el.remove();
              resolve();
            }, 1400);
          }, 180);
        });
      }
    }
    requestAnimationFrame(step);
  });
}
