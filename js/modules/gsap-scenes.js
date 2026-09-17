// ============================================================================
// gsap-scenes.js — ScrollTrigger orchestration for section reveals & timeline.
// Uses vanilla text-splitting (no paid SplitText plugin required).
// ============================================================================

import { prefersReducedMotion } from "./reduced-motion.js";

export function initGsapScenes() {
  if (prefersReducedMotion()) return;
  const gsap = window.gsap;
  const ST   = window.ScrollTrigger;
  if (!gsap || !ST) return;

  gsap.registerPlugin(ST);

  // ------------------------------------------------------------
  // Line-split reveal for [data-split] section titles.
  // Splits by whole words so it degrades gracefully.
  // ------------------------------------------------------------
  document.querySelectorAll("[data-split]").forEach((el) => {
    const text = el.textContent.trim();
    el.innerHTML = `<span class="line"><span>${text}</span></span>`;
    const inner = el.querySelector(".line > span");
    gsap.set(inner, { yPercent: 110 });
    gsap.to(inner, {
      yPercent: 0,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // ------------------------------------------------------------
  // NOTE: fades for [.about__bio p], [.project], [.bento], [.testimonial],
  // and [.stat] are all handled by reveal.js via the [data-reveal] attribute.
  // Doing it twice caused a race: GSAP wrote inline `opacity: 0` which beats
  // reveal.js's CSS class, and if a ScrollTrigger start-point never re-fired
  // (elements already in view, or ST measurements stale after content-visibility
  // shifts) the elements stayed invisible forever. Reveal.js is authoritative.
  // ------------------------------------------------------------

  // ------------------------------------------------------------
  // Timeline items — staggered fade + rise
  // ------------------------------------------------------------
  gsap.utils.toArray(".timeline__item").forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // ------------------------------------------------------------
  // Project cards — cursor-follow spotlight (delegated + throttled).
  // Reveal fade is handled by reveal.js via [data-reveal] on each .project.
  // ------------------------------------------------------------
  let spotlightCard = null;
  let spotlightRect = null;
  let spotlightX = 0, spotlightY = 0;
  let spotlightTick = false;
  const grid = document.querySelector(".work__grid");
  if (grid) {
    grid.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".project");
      if (!card) return;
      if (card !== spotlightCard) {
        spotlightCard = card;
        spotlightRect = card.getBoundingClientRect();
      }
      spotlightX = e.clientX;
      spotlightY = e.clientY;
      if (spotlightTick) return;
      spotlightTick = true;
      requestAnimationFrame(() => {
        spotlightTick = false;
        if (!spotlightCard || !spotlightRect) return;
        const mx = ((spotlightX - spotlightRect.left) / spotlightRect.width) * 100;
        const my = ((spotlightY - spotlightRect.top)  / spotlightRect.height) * 100;
        spotlightCard.style.setProperty("--mx", mx + "%");
        spotlightCard.style.setProperty("--my", my + "%");
      });
    }, { passive: true });
    // Invalidate rect on scroll/resize (positions shift).
    window.addEventListener("scroll", () => { spotlightRect = spotlightCard?.getBoundingClientRect() ?? null; }, { passive: true });
    window.addEventListener("resize", () => { spotlightRect = spotlightCard?.getBoundingClientRect() ?? null; });
  }

  // ------------------------------------------------------------
  // Hero parallax (title floats up slightly on scroll)
  // ------------------------------------------------------------
  const heroTitle = document.querySelector(".hero__title");
  if (heroTitle) {
    gsap.to(heroTitle, {
      yPercent: -12,
      opacity: 0.6,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end:   "bottom top",
        scrub: 0.6
      }
    });
  }

  // ------------------------------------------------------------
  // Contact title — subtle scale on scroll-in
  // ------------------------------------------------------------
  const contactTitle = document.querySelector(".contact__title");
  if (contactTitle) {
    gsap.from(contactTitle, {
      scale: 0.94,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: {
        trigger: contactTitle,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  }
}
