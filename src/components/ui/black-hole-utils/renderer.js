/**
 * ADMIRUS — Black Hole WebGL Renderer
 * Gravitational lensing + accretion disk + particle field
 * Full-screen fragment shader approach for maximum performance
 */

const VERT_SRC = /* glsl */ `#version 300 es
precision highp float;
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG_SRC = /* glsl */ `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;       // normalized -1..1
in  vec2 v_uv;
out vec4 fragColor;

// ── Helpers ─────────────────────────────────────────────────────────────────
#define PI  3.14159265358979
#define TAU 6.28318530717959

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1,0)), f.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.1 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// ── Black Hole Core ──────────────────────────────────────────────────────────
// Simple Schwarzschild-inspired lensing (no full GR raymarching)
vec2 gravLens(vec2 uv, vec2 center, float mass) {
  vec2 d = uv - center;
  float r = length(d);
  float rs = mass * 0.12; // Schwarzschild radius (visual)
  // Bending angle ∝ 1/r²
  float bend = rs / (r * r + 0.001);
  return uv - normalize(d) * bend;
}

// ── Accretion Disk ───────────────────────────────────────────────────────────
vec3 accretionDisk(vec2 uv, vec2 center, float t) {
  vec2 d = uv - center;
  // Squish Y for oblique view
  d.y *= 2.2;
  float r = length(d);
  float theta = atan(d.y, d.x);

  // Disk radial bands
  float rInner = 0.08;
  float rOuter = 0.45;
  float disk = smoothstep(rOuter, rOuter - 0.05, r)
             * smoothstep(rInner, rInner + 0.04, r);

  // Spiral arm turbulence
  float swirl = theta + t * 0.4 + r * 8.0;
  float turb = fbm(vec2(swirl * 0.6, r * 5.0 + t * 0.2));

  // Temperature gradient: inner = white-hot, outer = deep orange/red
  float temp = 1.0 - smoothstep(rInner, rOuter, r);
  vec3 inner = vec3(1.0, 0.96, 0.85);          // white-hot
  vec3 mid   = vec3(0.98, 0.45, 0.09);          // violet (ADMIRUS accent)
  vec3 outer = vec3(0.57, 0.22, 0.03);          // deep purple

  vec3 col = mix(outer, mix(mid, inner, pow(temp, 2.0)), temp);
  float intensity = disk * (0.7 + turb * 0.6);
  // Doppler brightening — one side brighter
  float doppler = 0.7 + 0.3 * sin(theta + t * 0.15);
  return col * intensity * doppler * 1.8;
}

// ── Event Horizon ────────────────────────────────────────────────────────────
float eventHorizon(vec2 uv, vec2 center, float rs) {
  return 1.0 - smoothstep(rs - 0.005, rs + 0.005, length(uv - center));
}

// ── Photon Ring ──────────────────────────────────────────────────────────────
float photonRing(vec2 uv, vec2 center, float rs) {
  float r = length(uv - center);
  float ring = rs * 1.5;
  return smoothstep(0.02, 0.0, abs(r - ring)) * 1.4;
}

// ── Star Field ───────────────────────────────────────────────────────────────
vec3 stars(vec2 uv, float t) {
  vec3 col = vec3(0.0);
  // Layer 1 – fine stars
  for (int i = 0; i < 3; i++) {
    vec2 grid = floor(uv * (60.0 + float(i) * 40.0));
    float h = hash(grid + float(i) * 17.3);
    vec2 off = vec2(hash(grid + 1.1), hash(grid + 2.2)) - 0.5;
    vec2 pos = (grid + 0.5 + off * 0.5) / (60.0 + float(i) * 40.0);
    float dist = length(uv - pos);
    float brightness = h * smoothstep(0.006, 0.0, dist);
    brightness *= 0.6 + 0.4 * sin(t * (1.0 + h * 3.0) + h * TAU);
    col += brightness * mix(vec3(0.8, 0.85, 1.0), vec3(1.0, 0.8, 0.6), h);
  }
  return col * 0.5;
}

// ── Nebula ───────────────────────────────────────────────────────────────────
vec3 nebula(vec2 uv, float t) {
  float n1 = fbm(uv * 2.0 + t * 0.02);
  float n2 = fbm(uv * 3.5 - t * 0.015 + 1.7);
  vec3 c1 = vec3(0.40, 0.12, 0.02) * n1 * n1;
  vec3 c2 = vec3(0.20, 0.08, 0.01) * n2;
  return (c1 + c2) * 0.6;
}

// ── Relativistic Jets ─────────────────────────────────────────────────────────
float jet(vec2 uv, vec2 center, float t) {
  vec2 d = uv - center;
  float angle = atan(d.x, abs(d.y));
  float r = length(d);
  float cone = smoothstep(0.25, 0.0, abs(angle));
  float beam = cone * smoothstep(0.6, 0.05, r) * smoothstep(0.02, 0.05, r);
  float pulse = 0.5 + 0.5 * sin(r * 20.0 - t * 3.0);
  return beam * pulse;
}

// ── Main ─────────────────────────────────────────────────────────────────────
void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  // Center-origin, aspect-corrected
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // Black hole center drifts subtly with mouse
  vec2 bhCenter = vec2(0.0) + u_mouse * 0.06;

  // 1. Background: nebula + stars
  vec3 col = nebula(uv, u_time);
  col += stars(uv, u_time);

  // 2. Gravitational lensing of background
  float bhMass = 0.28;
  vec2 lensedP = gravLens(p, bhCenter, bhMass);
  vec2 lensedUV = lensedP / vec2(aspect, 1.0) + 0.5;
  vec3 bgLensed = nebula(lensedUV, u_time) + stars(lensedUV, u_time);
  float lensWeight = smoothstep(0.5, 0.08, length(p - bhCenter));
  col = mix(col, bgLensed, lensWeight * 0.8);

  // 3. Relativistic jets (vertical, both poles)
  float rs = 0.055;
  float jetVal = jet(p, bhCenter, u_time);
  vec3 jetCol = mix(vec3(0.97, 0.42, 0.09), vec3(1.0, 0.80, 0.40), jetVal);
  col += jetCol * jetVal * 0.8;

  // 4. Accretion disk
  col += accretionDisk(p, bhCenter, u_time);

  // 5. Photon ring glow
  float pRing = photonRing(p, bhCenter, rs);
  col += vec3(1.0, 0.82, 0.50) * pRing * 0.9;

  // 6. Event horizon — pure black
  float shadow = eventHorizon(p, bhCenter, rs);
  col = mix(col, vec3(0.0), shadow);

  // 7. Vignette
  float vig = 1.0 - smoothstep(0.4, 1.2, length(p));
  col *= vig;

  // 8. Tone-map + gamma
  col = col / (col + 0.9);      // Reinhard
  col = pow(max(col, 0.0), vec3(0.4545));

  fragColor = vec4(col, 1.0);
}`;

// ─── Renderer Factory ────────────────────────────────────────────────────────

export function createRenderer({ canvas }) {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });

  if (!gl) {
    console.warn('[BlackHole] WebGL2 not available');
    return { ready: Promise.resolve(), dispose: () => {} };
  }

  // ── Compile shaders ──────────────────────────────────────────────────────
  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[BlackHole] Shader error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vert = compile(gl.VERTEX_SHADER, VERT_SRC);
  const frag = compile(gl.FRAGMENT_SHADER, FRAG_SRC);

  const prog = gl.createProgram();
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('[BlackHole] Link error:', gl.getProgramInfoLog(prog));
  }

  gl.deleteShader(vert);
  gl.deleteShader(frag);

  // ── Full-screen quad ─────────────────────────────────────────────────────
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  // ── Uniform locations ────────────────────────────────────────────────────
  gl.useProgram(prog);
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes  = gl.getUniformLocation(prog, 'u_resolution');
  const uMouse = gl.getUniformLocation(prog, 'u_mouse');

  // ── State ────────────────────────────────────────────────────────────────
  let rafId = null;
  let startTime = performance.now();
  let mouse = { x: 0, y: 0 };
  let targetMouse = { x: 0, y: 0 };
  let disposed = false;

  // Mouse tracking — lerped for smoothness
  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    targetMouse.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    targetMouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
  }

  // Touch tracking
  function onTouchMove(e) {
    if (!e.touches.length) return;
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    targetMouse.x = ((t.clientX - rect.left) / rect.width)  * 2 - 1;
    targetMouse.y = -((t.clientY - rect.top)  / rect.height) * 2 + 1;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  canvas.addEventListener('touchmove', onTouchMove, { passive: true });

  // ── Resize ───────────────────────────────────────────────────────────────
  const ro = new ResizeObserver(() => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = Math.floor(canvas.clientWidth  * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  });
  ro.observe(canvas);

  // Force initial size
  {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width  = Math.floor(canvas.clientWidth  * dpr);
    canvas.height = Math.floor(canvas.clientHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  // ── Render loop ──────────────────────────────────────────────────────────
  function frame() {
    if (disposed) return;
    rafId = requestAnimationFrame(frame);

    // Lerp mouse
    mouse.x += (targetMouse.x - mouse.x) * 0.05;
    mouse.y += (targetMouse.y - mouse.y) * 0.05;

    const t = (performance.now() - startTime) * 0.001;

    gl.useProgram(prog);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mouse.x, mouse.y);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  // ── Kick off ─────────────────────────────────────────────────────────────
  const ready = new Promise((resolve) => {
    requestAnimationFrame(() => {
      frame();
      resolve();
    });
  });

  // ── Dispose ──────────────────────────────────────────────────────────────
  function dispose() {
    disposed = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('touchmove', onTouchMove);
    ro.disconnect();
    gl.deleteProgram(prog);
    gl.deleteBuffer(buf);
    gl.deleteVertexArray(vao);
  }

  return { ready, dispose };
}
