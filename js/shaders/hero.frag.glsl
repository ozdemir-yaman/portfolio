#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform vec3  u_accent; // violet

// Classic simplex-ish 2D noise (Ashima) — compact version
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = v_uv;
  vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

  float t = u_time * 0.06;

  // Warped domain
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)),
                fbm(p * 1.3 + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(p * 2.0 + q + vec2(1.7, 9.2) + t * 0.5),
                fbm(p * 2.0 + q + vec2(8.3, 2.8) - t * 0.5));
  float f = fbm(p * 2.5 + r);

  // Mouse-driven soft light
  vec2 mouse = (u_mouse - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float light = 1.0 - smoothstep(0.0, 0.7, distance(p, mouse));
  light = pow(light, 2.5);

  // Color mixing
  vec3 base    = vec3(0.039, 0.039, 0.043);     // near-black bg
  vec3 accent  = u_accent;
  vec3 accent2 = mix(u_accent, vec3(1.0), 0.15);

  float mask = smoothstep(-0.2, 1.2, f);
  vec3 col = mix(base, accent * 0.35, mask);
  col = mix(col, accent2 * 0.55, pow(mask, 3.0) * 0.7);
  col += light * accent * 0.35;

  // Radial vignette
  float vign = smoothstep(1.2, 0.35, length(p));
  col *= vign;

  // Subtle scanline shimmer
  col += 0.008 * sin(uv.y * u_resolution.y * 1.2 + u_time * 2.0);

  outColor = vec4(col, 1.0);
}
