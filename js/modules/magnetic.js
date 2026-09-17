// ============================================================================
// magnetic.js — magnetic hover for [.magnetic] elements.
// Pulls the element toward the pointer with easing.
// ============================================================================

import { prefersReducedMotion } from "./reduced-motion.js";

export function initMagnetic({ selector = ".magnetic", strength = 0.35, radius = 90 } = {}) {
  if (prefersReducedMotion()) return;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) return;

  document.querySelectorAll(selector).forEach((el) => {
    const label = el.querySelector("span") || el;
    let raf = 0;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let hovering = false;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < rect.width / 2 + radius) {
        hovering = true;
        target.x = dx * strength;
        target.y = dy * strength;
        loop();
      }
    };
    const onLeave = () => {
      hovering = false;
      target.x = 0; target.y = 0;
      loop();
    };
    const loop = () => {
      if (raf) return;
      const step = () => {
        current.x += (target.x - current.x) * 0.15;
        current.y += (target.y - current.y) * 0.15;
        el.style.transform = `translate(${current.x}px, ${current.y}px)`;
        if (label !== el) label.style.transform = `translate(${current.x * 0.3}px, ${current.y * 0.3}px)`;
        if (Math.abs(current.x - target.x) > 0.1 || Math.abs(current.y - target.y) > 0.1 || hovering) {
          raf = requestAnimationFrame(step);
        } else {
          raf = 0;
        }
      };
      raf = requestAnimationFrame(step);
    };

    el.addEventListener("pointerenter", () => { hovering = true; });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
  });
}
