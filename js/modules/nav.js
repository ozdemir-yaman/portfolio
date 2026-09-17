// ============================================================================
// nav.js — sticky nav: scrolled state + active section indicator.
// ============================================================================

export function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  // Scrolled state — rAF-throttled + only writes when state actually changes.
  let ticking = false;
  let wasScrolled = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY > 24;
      if (scrolled !== wasScrolled) {
        nav.classList.toggle("is-scrolled", scrolled);
        wasScrolled = scrolled;
      }
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Active section — IntersectionObserver
  const links = document.querySelectorAll(".nav__links a[data-nav]");
  const map = new Map();
  links.forEach((a) => {
    const id = a.getAttribute("data-nav");
    const section = document.getElementById(id);
    if (section) map.set(section, a);
  });

  const io = new IntersectionObserver((entries) => {
    // Pick the entry with the largest visible ratio that IS intersecting
    let best = null;
    for (const entry of entries) {
      if (entry.isIntersecting) {
        if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
      }
    }
    if (best) {
      links.forEach((a) => a.classList.remove("is-active"));
      const a = map.get(best.target);
      if (a) a.classList.add("is-active");
    }
  }, {
    rootMargin: "-40% 0px -50% 0px",
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });
  map.forEach((_, section) => io.observe(section));
}
