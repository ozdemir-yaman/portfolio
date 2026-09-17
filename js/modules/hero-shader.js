// ============================================================================
// hero-shader.js — hand-written WebGL2 renderer for the hero background.
// Loads GLSL files, compiles, animates. Pauses when off-screen. DPR-clamped.
// Falls back to a static CSS gradient if WebGL is unavailable or user prefers
// reduced motion.
// ============================================================================

export async function initHeroShader({ canvas, reducedMotion }) {
  if (!canvas) return;

  if (reducedMotion) {
    applyFallback(canvas);
    return;
  }

  const gl = canvas.getContext("webgl2", {
    antialias: false,
    alpha: true,
    premultipliedAlpha: false,
    powerPreference: "high-performance"
  });

  if (!gl) {
    applyFallback(canvas);
    return;
  }

  let vertSrc, fragSrc;
  try {
    [vertSrc, fragSrc] = await Promise.all([
      fetch("js/shaders/hero.vert.glsl").then(r => r.text()),
      fetch("js/shaders/hero.frag.glsl").then(r => r.text())
    ]);
  } catch (err) {
    console.warn("[hero-shader] shader fetch failed, using fallback", err);
    applyFallback(canvas);
    return;
  }

  const program = createProgram(gl, vertSrc, fragSrc);
  if (!program) {
    applyFallback(canvas);
    return;
  }

  // Fullscreen triangle
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,   3, -1,   -1, 3
  ]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uTime   = gl.getUniformLocation(program, "u_time");
  const uRes    = gl.getUniformLocation(program, "u_resolution");
  const uMouse  = gl.getUniformLocation(program, "u_mouse");
  const uAccent = gl.getUniformLocation(program, "u_accent");

  gl.useProgram(program);
  // Read accent color from CSS custom property
  const accentCss = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#7c5cff";
  const [ar, ag, ab] = hexToRgb01(accentCss);
  gl.uniform3f(uAccent, ar, ag, ab);

  const state = {
    mouse: [0.5, 0.5],
    targetMouse: [0.5, 0.5],
    running: true,
    visible: true,
    start: performance.now(),
    rafId: 0,
    rect: null
  };

  function refreshRect() { state.rect = canvas.getBoundingClientRect(); }

  function resize() {
    // Lower DPR cap: this shader has 5-octave fbm; keep it cheap.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    refreshRect();
  }
  resize();
  window.addEventListener("resize", resize);
  // Rect only shifts on scroll/resize; recompute on scroll (rAF-throttled).
  let scrollTick = false;
  window.addEventListener("scroll", () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => { refreshRect(); scrollTick = false; });
  }, { passive: true });

  // Mouse tracking — reuse cached rect (no forced layout per move).
  window.addEventListener("pointermove", (e) => {
    if (!state.visible || !state.rect) return;
    const r = state.rect;
    state.targetMouse[0] = (e.clientX - r.left) / r.width;
    state.targetMouse[1] = 1.0 - (e.clientY - r.top) / r.height;
  }, { passive: true });

  // Pause when hero leaves viewport — actually stop rAF, not just skip draw.
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      state.visible = entry.isIntersecting;
      if (state.visible && state.running && !state.rafId) {
        state.rafId = requestAnimationFrame(frame);
      }
    }
  }, { threshold: 0 });
  io.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    state.running = !document.hidden;
    if (state.running && state.visible && !state.rafId) {
      state.rafId = requestAnimationFrame(frame);
    }
  });

  function frame() {
    state.rafId = 0;
    if (!(state.running && state.visible)) return; // hard stop
    state.mouse[0] += (state.targetMouse[0] - state.mouse[0]) * 0.05;
    state.mouse[1] += (state.targetMouse[1] - state.mouse[1]) * 0.05;
    const t = (performance.now() - state.start) / 1000;
    gl.useProgram(program);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, state.mouse[0], state.mouse[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    state.rafId = requestAnimationFrame(frame);
  }
  state.rafId = requestAnimationFrame(frame);
}

function createShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("[hero-shader] compile error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}
function createProgram(gl, vSrc, fSrc) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vSrc);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fSrc);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("[hero-shader] link error:", gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }
  return p;
}

function hexToRgb01(hex) {
  const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
  if (!m) return [0.49, 0.36, 1.0];
  const int = parseInt(m[1], 16);
  return [
    ((int >> 16) & 255) / 255,
    ((int >> 8)  & 255) / 255,
    ( int        & 255) / 255
  ];
}

function applyFallback(canvas) {
  canvas.style.background =
    "radial-gradient(ellipse at 30% 30%, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 55%), " +
    "radial-gradient(ellipse at 80% 80%, color-mix(in oklab, var(--accent) 15%, transparent) 0%, transparent 50%), " +
    "var(--bg)";
}
