import { useEffect, useRef, useState, memo } from "react";
import { noidaSector28Blocks } from "../LocationMapBackground";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIG: Central tweakable settings for the WebGL Ripple & Beacon effect
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const CONFIG = {
  loopDuration: 3.6, // Loop repeats every 3.6 seconds
  waveSpeed: 0.4, // Speed wave spreads from center to border
  waveThickness: 9.0, // Wave gaussian thickness factor (9)
  waveStrength: 0.3, // Wave distortion / refraction factor (0.3)
  dotSize: 0.016, // Center popping beacon dot radius
  dotColor: [0.18, 0.89, 0.54], // Center dot color (#2fe28a)
  center: [0.5, 0.5], // [u, v] center coordinate in UV space
  darkBottom: 0.3, // Readability darkening at bottom of card
  darkTop: 0.65, // Readability darkening at top of card
};

/**
 * Generates an embedded, self-contained SVG Data URI of the Sector 28 Noida
 * Map background. Since it is loaded directly from a data URI, it will NEVER
 * throw a security error over file:// or cross-origin restrictions in WebGL.
 */
export function generateNoidaMapDataUri(isLight = false) {
  const bg = isLight ? "#eae5dc" : "#080b10";
  const accent = isLight ? "#16a34a" : "#22c55e";
  const buildingFill = isLight ? "#ffffff" : null;
  const buildingStroke = isLight
    ? 'stroke="rgba(22, 24, 31, 0.08)" stroke-width="0.75"'
    : "";
  const parkFill = isLight ? "#d4ebd9" : null;
  const parkStroke = isLight
    ? 'stroke="rgba(22, 163, 74, 0.22)" stroke-width="0.75"'
    : "";

  const rects = (noidaSector28Blocks || [])
    .map((b, i) => {
      const isPark = i < 4;
      const fill = isLight ? (isPark ? parkFill : buildingFill) : b.color;
      const stroke = isLight ? (isPark ? parkStroke : buildingStroke) : "";
      return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="1.5" fill="${fill}" ${stroke} />`;
    })
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 300 300">
    <rect width="300" height="300" fill="${bg}"/>
    <g transform="rotate(-38 150 138)">
      ${rects}
      <path d="M 150 -50 L 150 138" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M 150 330 L 150 138" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M -40 138 L 150 138" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M 340 138 L 150 138" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
      <path d="M -20 70 L 150 70 L 150 138" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
      <path d="M 218 -40 L 218 138 L 150 138" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
      <path d="M 82 310 L 82 138 L 150 138" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
      <path d="M 218 310 L 218 138 L 150 138" stroke="${accent}" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
      <circle cx="150" cy="138" r="4.5" fill="${accent}" opacity="0.85"/>
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Default dark map data URI
export const DEFAULT_MAP_IMAGE = generateNoidaMapDataUri(false);

const VS_SOURCE = `
attribute vec2 a;
void main() {
  gl_Position = vec4(a, 0.0, 1.0);
}
`;

const FS_SOURCE = `
precision highp float;

uniform vec2 res;
uniform float t;
uniform sampler2D tx;
uniform float uImgAspect;
uniform vec2 uCenter;
uniform float uLoopDuration;
uniform float uWaveSpeed;
uniform float uWaveThickness;
uniform float uWaveStrength;
uniform float uDotSize;
uniform vec3 uDotColor;
uniform float uDarkBottom;
uniform float uDarkTop;

// Liquid wave height field
float H(vec2 p, float tt) {
  float d = length(p);
  float a = tt - 0.35;
  float x = d - a * uWaveSpeed;
  float on = step(0.0, a) * step(a, 2.3);
  float fade = smoothstep(0.0, 0.12, a) * (1.0 - smoothstep(1.3, 2.3, a));
  return exp(-pow(x * uWaveThickness, 2.0)) * fade * on * 0.06;
}

void main() {
  float tt = mod(t, uLoopDuration);
  float asp = res.y / res.x;

  // Normalized coordinate with (0,0) in card center
  vec2 p = (gl_FragCoord.xy - 0.5 * res) / res.x;

  // Shift origin relative to uCenter
  vec2 centerP = vec2(uCenter.x - 0.5, (uCenter.y - 0.5) * asp);
  vec2 q = p - centerP;

  // Wave surface normal gradient via finite differences
  float e = 0.002;
  float dx = (H(q + vec2(e, 0.0), tt) - H(q - vec2(e, 0.0), tt)) / (2.0 * e);
  float dy = (H(q + vec2(0.0, e), tt) - H(q - vec2(0.0, e), tt)) / (2.0 * e);

  // Distort texture sample position (wave has no color of its own)
  vec2 pd = p - vec2(dx, dy) * uWaveStrength;

  // Map to [0, 1] UV space of the card
  vec2 c = vec2(pd.x + 0.5, pd.y / asp + 0.5);

  // Cover-fit image to card (crop, don't stretch)
  float canvasAspect = res.x / res.y;
  vec2 iu;
  if (canvasAspect > uImgAspect) {
    // Canvas is wider than image -> fit width, crop height
    float visibleHeight = uImgAspect / canvasAspect;
    iu = vec2(c.x, 0.5 + (c.y - 0.5) * visibleHeight);
  } else {
    // Canvas is taller than image -> fit height, crop width
    float visibleWidth = canvasAspect / uImgAspect;
    iu = vec2(0.5 + (c.x - 0.5) * visibleWidth, c.y);
  }

  // Sample background texture
  vec3 col = texture2D(tx, iu).rgb;

  // Center green beacon dot: scale pop and fade out
  float d = length(q);
  vec3 gr = vec3(0.2, 1.0, 0.5);
  float vis = smoothstep(0.05, 0.3, tt) * (1.0 - smoothstep(2.5, 3.1, tt));
  float sc = vis * (1.0 + 0.25 * sin(clamp((tt - 0.05) / 0.3, 0.0, 1.0) * 3.14159));
  float dr = uDotSize * sc;
  float dot = (1.0 - smoothstep(dr - 0.002, dr, d)) * step(0.004, dr);

  col = mix(col, uDotColor, dot);
  col = mix(col, vec3(0.92, 1.0, 0.95), smoothstep(dr - 0.005, dr - 0.003, d) * dot);
  col += gr * exp(-d * 45.0) * vis * 0.4;

  // Readability darkening gradients at bottom and top
  vec2 uv0 = gl_FragCoord.xy / res;
  col *= mix(uDarkBottom, 1.0, smoothstep(0.0, 0.42, uv0.y));
  col *= mix(1.0, uDarkTop, smoothstep(0.82, 1.0, uv0.y));

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * Reusable WebGL Ripple Background Component.
 *
 * @param {string} [image] - URL, data URI, or path to the background image. Defaults to Sector 28 Map.
 * @param {[number, number]} [center] - [x, y] UV center coordinate (default: [0.5, 0.5]).
 * @param {object} [config] - Optional overrides for the CONFIG object.
 * @param {string} [className] - Optional custom CSS classes.
 * @param {React.ReactNode} [fallback] - Custom fallback content if WebGL is unavailable.
 */
function RippleBackground({
  image = DEFAULT_MAP_IMAGE,
  center = CONFIG.center,
  config = {},
  className = "",
  fallback = null,
}) {
  const canvasRef = useRef(null);
  const [glAvailable, setGlAvailable] = useState(true);

  // Merge runtime config overrides with default CONFIG
  const activeConfig = { ...CONFIG, ...config };
  const centerCoord = center || activeConfig.center;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl = null;
    try {
      gl =
        canvas.getContext("webgl", { antialias: true, alpha: false }) ||
        canvas.getContext("experimental-webgl", {
          antialias: true,
          alpha: false,
        });
    } catch {
      gl = null;
    }

    if (!gl) {
      setGlAvailable(false);
      return;
    }

    setGlAvailable(true);

    // Shader compilation helper
    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, VS_SOURCE);
    const fs = createShader(gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) {
      setGlAvailable(false);
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      setGlAvailable(false);
      return;
    }

    gl.useProgram(program);

    // Full-screen quad buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosLoc = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const U = {
      res: gl.getUniformLocation(program, "res"),
      t: gl.getUniformLocation(program, "t"),
      tx: gl.getUniformLocation(program, "tx"),
      uImgAspect: gl.getUniformLocation(program, "uImgAspect"),
      uCenter: gl.getUniformLocation(program, "uCenter"),
      uLoopDuration: gl.getUniformLocation(program, "uLoopDuration"),
      uWaveSpeed: gl.getUniformLocation(program, "uWaveSpeed"),
      uWaveThickness: gl.getUniformLocation(program, "uWaveThickness"),
      uWaveStrength: gl.getUniformLocation(program, "uWaveStrength"),
      uDotSize: gl.getUniformLocation(program, "uDotSize"),
      uDotColor: gl.getUniformLocation(program, "uDotColor"),
      uDarkBottom: gl.getUniformLocation(program, "uDarkBottom"),
      uDarkTop: gl.getUniformLocation(program, "uDarkTop"),
    };

    // Set static uniforms
    gl.uniform1i(U.tx, 0);
    gl.uniform2f(U.uCenter, centerCoord[0], centerCoord[1]);
    gl.uniform1f(U.uLoopDuration, activeConfig.loopDuration);
    gl.uniform1f(U.uWaveSpeed, activeConfig.waveSpeed);
    gl.uniform1f(U.uWaveThickness, activeConfig.waveThickness);
    gl.uniform1f(U.uWaveStrength, activeConfig.waveStrength);
    gl.uniform1f(U.uDotSize, activeConfig.dotSize);
    gl.uniform3f(
      U.uDotColor,
      activeConfig.dotColor[0],
      activeConfig.dotColor[1],
      activeConfig.dotColor[2]
    );
    gl.uniform1f(U.uDarkBottom, activeConfig.darkBottom);
    gl.uniform1f(U.uDarkTop, activeConfig.darkTop);

    // Texture setup
    let isTextureReady = false;
    let currentImgAspect = 1.0;
    const tex = gl.createTexture();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!gl) return;
      currentImgAspect =
        (img.naturalWidth || img.width || 1) /
        (img.naturalHeight || img.height || 1);

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

      try {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          img
        );
      } catch {
        // Fallback drawing via 2D canvas if browser requires rasterized bitmap
        const c2d = document.createElement("canvas");
        c2d.width = img.naturalWidth || img.width || 600;
        c2d.height = img.naturalHeight || img.height || 600;
        const ctx2d = c2d.getContext("2d");
        if (ctx2d) {
          ctx2d.drawImage(img, 0, 0);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            c2d
          );
        }
      }

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      isTextureReady = true;
    };
    img.src = image;

    // Resize handling (devicePixelRatio capped at 2)
    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(canvas);

    // Prefers-reduced-motion check: slow animation to 30% speed if active
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let speedFactor = motionQuery.matches ? 0.3 : 1.0;
    const onMotionChange = (e) => {
      speedFactor = e.matches ? 0.3 : 1.0;
    };
    motionQuery.addEventListener("change", onMotionChange);

    // Pause requestAnimationFrame when tab is hidden
    let animId = null;
    let isTabHidden = document.hidden;
    const t0 = performance.now();

    function render(now) {
      if (isTabHidden) return;

      if (isTextureReady) {
        gl.uniform2f(U.res, canvas.width, canvas.height);
        gl.uniform1f(U.uImgAspect, currentImgAspect);
        gl.uniform1f(U.t, ((now - t0) / 1000) * speedFactor);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    const onVisibilityChange = () => {
      isTabHidden = document.hidden;
      if (isTabHidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      } else {
        if (!animId) {
          animId = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Cleanup on unmount
    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (tex) gl.deleteTexture(tex);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [
    image,
    centerCoord[0],
    centerCoord[1],
    activeConfig.loopDuration,
    activeConfig.waveSpeed,
    activeConfig.waveThickness,
    activeConfig.waveStrength,
    activeConfig.dotSize,
    activeConfig.darkBottom,
    activeConfig.darkTop,
  ]);

  if (!glAvailable) {
    if (fallback) {
      return fallback;
    }
    return (
      <div
        className={`ripple-fallback pointer-events-none absolute inset-0 z-0 h-full w-full rounded-[inherit] ${className}`}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 block h-full w-full rounded-[inherit] ${className}`}
      aria-hidden="true"
    />
  );
}

export default memo(RippleBackground);
