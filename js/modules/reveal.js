// ============================================================================
// reveal.js — IntersectionObserver reveal for [data-reveal] elements.
// Applies will-change only for the duration of the transition so we don't
// permanently promote dozens of elements to their own GPU layers.
// ============================================================================

export function initReveal({ selector = "[data-reveal]", threshold = 0.15 } = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      const delay = el.getAttribute("data-reveal-delay");
      if (delay) el.style.transitionDelay = delay + "ms";
      el.classList.add("is-revealing", "is-visible");
      el.addEventListener("transitionend", () => {
        el.classList.remove("is-revealing");
        el.classList.add("is-settled");
      }, { once: true });
      io.unobserve(el);
    }
  }, { threshold });

  els.forEach((el) => io.observe(el));
}
