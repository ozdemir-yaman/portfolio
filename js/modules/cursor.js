// ============================================================================
// cursor.js — custom dot + trailing ring cursor.
// Morphs on elements marked with [data-cursor] or hoverables.
// ============================================================================

import { prefersReducedMotion } from "./reduced-motion.js";

export function initCursor() {
  // Skip on touch / coarse pointers / reduced motion
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover || prefersReducedMotion()) return;

  const cursor = document.getElementById("cursor");
  const dot    = cursor?.querySelector(".cursor__dot");
  const ring   = cursor?.querySelector(".cursor__ring");
  const label  = document.getElementById("cursor-label");
  if (!cursor || !dot || !ring) return;

  document.documentElement.classList.add("custom-cursor");

  const target  = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: target.x, y: target.y };
  let running = false;
  let lastMove = 0;

  window.addEventListener("pointermove", (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
    lastMove = performance.now();
    if (!running) { running = true; requestAnimationFrame(render); }
  }, { passive: true });

  window.addEventListener("pointerdown", () => cursor.classList.add("is-clicking"));
  window.addEventListener("pointerup",   () => cursor.classList.remove("is-clicking"));

  // Hoverable morph
  const hoverables = "a, button, [data-cursor], input, textarea, select, [role='button']";
  document.addEventListener("pointerover", (e) => {
    const t = e.target.closest(hoverables);
    if (t) {
      cursor.classList.add("is-hovering");
      const custom = t.getAttribute("data-cursor");
      if (label) {
        label.textContent = customLabel(custom, t);
      }
    }
  });
  document.addEventListener("pointerout", (e) => {
    const t = e.target.closest(hoverables);
    if (t && !t.contains(e.relatedTarget)) {
      cursor.classList.remove("is-hovering");
      if (label) label.textContent = "";
    }
  });

  function customLabel(kind, el) {
    switch (kind) {
      case "view":  return "View";
      case "cta":   return "Go";
      case "copy":  return "Copy";
      case "brand": return "Top";
      default:      return el.tagName === "A" ? "Open" : "";
    }
  }

  function render() {
    // Dot: instant
    dot.style.transform  = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
    // Ring: lerp
    ringPos.x += (target.x - ringPos.x) * 0.18;
    ringPos.y += (target.y - ringPos.y) * 0.18;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
    if (label) label.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

    // Stop rAF when ring is settled AND pointer has been still for >300ms.
    const settled =
      Math.abs(target.x - ringPos.x) < 0.3 &&
      Math.abs(target.y - ringPos.y) < 0.3 &&
      performance.now() - lastMove > 300;
    if (settled) {
      running = false;
      return;
    }
    requestAnimationFrame(render);
  }
}
