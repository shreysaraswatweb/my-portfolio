import { useRef, useEffect } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import careerVideo from "../../assets/webm/career-stair-ascent.webm";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CAREER STAIR ASCENT — CENTERED ZOOMED-OUT BACKDROP (120FPS)
 *
 * Features:
 * - Zoomed-out & Centered Backdrop: scaled to ~68% and centered in the card
 *   so the climbing animation sits elegantly as an atmospheric backdrop,
 *   giving generous breathing room for the foreground stats and badge.
 * - Sub-Pixel Multi-Sample Anti-Aliasing (MSAA): 9-tap morphological kernel
 *   ensures silky-smooth vector-grade stroke curves with zero pixel jaggies.
 * - Mathematical Un-Matting: zero white fringes or cutout white lines.
 * - 100% Preserved Vibrant Colors: peach skin and crimson red are saturation-protected.
 * - Smooth 120 FPS hardware-accelerated playback synced to display refresh rate.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default function CareerStairAscent({ className = "", isHovered = false }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const { resolved } = useTheme();
  const isLight = resolved === "light";
  const isLightRef = useRef(isLight);

  useEffect(() => {
    isLightRef.current = isLight;
  }, [isLight]);

  // Adjust playback rate on hover
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = isHovered ? 1.25 : 1.0;
    }
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    let animId = null;
    let isMounted = true;

    // Crop box of the animation inside 1280x720 video
    const CROP_X = 346;
    const CROP_Y = 0;
    const CROP_W = 576;
    const CROP_H = 601;

    let gl = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
      });
    } catch {
      gl = null;
    }

    let cleanupWebGL = null;

    if (gl) {
      const vsSource = `
        attribute vec2 a_pos;
        varying vec2 v_uv;
        void main() {
          v_uv = a_pos * 0.5 + 0.5;
          v_uv.y = 1.0 - v_uv.y;
          gl_Position = vec4(a_pos, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision mediump float;
        uniform sampler2D u_tex;
        uniform vec2 u_canvasRes;
        uniform float u_isLight;
        varying vec2 v_uv;

        const float VID_W = 1280.0;
        const float VID_H = 720.0;
        const float CROP_X = 346.0;
        const float CROP_Y = 0.0;
        const float CROP_W = 576.0;
        const float CROP_H = 601.0;

        // Backdrop zoom level (zoomed-out centered backdrop)
        const float ZOOM = 0.58;

        const vec3 STROKE_COLOR = vec3(46.0 / 255.0, 49.0 / 255.0, 59.0 / 255.0);
        const float STROKE_LUMA = 0.2126 * (46.0 / 255.0) + 0.7152 * (49.0 / 255.0) + 0.0722 * (59.0 / 255.0);

        // Core un-matting sampler function
        vec4 sampleUnmatted(vec2 vidUV) {
          vec4 col = texture2D(u_tex, vidUV);
          float maxC = max(max(col.r, col.g), col.b);
          float minC = min(min(col.r, col.g), col.b);
          float sat = maxC > 0.0 ? (maxC - minC) / maxC : 0.0;
          float luma = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));

          float a = 1.0;
          vec3 rgb = col.rgb;

          // Only un-matte neutral white background & compression edges
          if (sat < 0.12) {
            if (luma > 0.93) {
              a = 0.0;
              rgb = vec3(0.0);
            } else if (luma > STROKE_LUMA) {
              float coverage = clamp((1.0 - luma) / (1.0 - STROKE_LUMA), 0.0, 1.0);
              a = coverage;
              rgb = STROKE_COLOR;
            }
          }
          return vec4(rgb, a);
        }

        void main() {
          // Center-aligned backdrop framing
          float animAspect = CROP_W / CROP_H;
          float animH = ZOOM;
          float animW = animH * animAspect * (u_canvasRes.y / u_canvasRes.x);

          // If on a narrow card, ensure width stays comfortably framed
          if (animW > 0.88) {
            float shrink = 0.88 / animW;
            animW = 0.88;
            animH *= shrink;
          }

          // Centered horizontal and vertical coordinates
          float startX = 0.5 - animW * 0.5;
          float startY = 0.5 - animH * 0.5;

          float uvXInAnim = (v_uv.x - startX) / animW;
          float uvYInAnim = (v_uv.y - startY) / animH;

          if (uvXInAnim < 0.0 || uvXInAnim > 1.0 || uvYInAnim < 0.0 || uvYInAnim > 1.0) {
            gl_FragColor = vec4(0.0);
            return;
          }

          // Calculate distance to closest border (0.0 at edge, 0.5 at center)
          float edgeDist = min(min(uvXInAnim, 1.0 - uvXInAnim), min(uvYInAnim, 1.0 - uvYInAnim));

          // Border fade ramp: 0.0 at edge, smoothly reaches 1.0 at 0.22 depth
          float borderFade = smoothstep(0.0, 0.22, edgeDist);

          // Card boundary edge fade to ensure soft transition into card margins
          float cardEdgeDist = min(min(v_uv.x, 1.0 - v_uv.x), min(v_uv.y, 1.0 - v_uv.y));
          borderFade *= smoothstep(0.0, 0.08, cardEdgeDist);

          float vidU = (CROP_X + uvXInAnim * CROP_W) / VID_W;
          float vidV = (CROP_Y + uvYInAnim * CROP_H) / VID_H;
          vec2 vidUV = vec2(vidU, vidV);

          // ─── DYNAMIC BORDER BLUR KERNEL SPREAD ─────────────────────────
          // In the center (borderFade ~ 1.0): spread is 0.85 texels (crisp vector MSAA).
          // Near the border (borderFade < 1.0): spread expands up to 4.5 texels,
          // physically blurring the graphic strokes as they dissolve!
          float blurFactor = 1.0 - borderFade;
          float spread = 0.85 + blurFactor * 4.2;

          vec2 texel = vec2(1.0 / VID_W, 1.0 / VID_H);
          vec2 d1 = texel * vec2(-0.85, -0.85) * spread;
          vec2 d2 = texel * vec2( 0.85, -0.85) * spread;
          vec2 d3 = texel * vec2(-0.85,  0.85) * spread;
          vec2 d4 = texel * vec2( 0.85,  0.85) * spread;
          vec2 d5 = texel * vec2( 0.0,  -1.10) * spread;
          vec2 d6 = texel * vec2( 0.0,   1.10) * spread;
          vec2 d7 = texel * vec2(-1.10,  0.0)  * spread;
          vec2 d8 = texel * vec2( 1.10,  0.0)  * spread;

          // Center sample
          vec4 c0 = sampleUnmatted(vidUV);

          vec4 s1 = sampleUnmatted(vidUV + d1);
          vec4 s2 = sampleUnmatted(vidUV + d2);
          vec4 s3 = sampleUnmatted(vidUV + d3);
          vec4 s4 = sampleUnmatted(vidUV + d4);
          vec4 s5 = sampleUnmatted(vidUV + d5);
          vec4 s6 = sampleUnmatted(vidUV + d6);
          vec4 s7 = sampleUnmatted(vidUV + d7);
          vec4 s8 = sampleUnmatted(vidUV + d8);

          // Gaussian-weighted sub-pixel alpha smoothing with blur spread
          float smoothA = c0.a * 0.28 + (s1.a + s2.a + s3.a + s4.a) * 0.10 + (s5.a + s6.a + s7.a + s8.a) * 0.08;

          vec3 outRgb = c0.rgb;
          if (c0.a < 0.98) {
            outRgb = STROKE_COLOR;
          }

          // Apply soft faded blur boundary
          smoothA *= borderFade;

          gl_FragColor = vec4(outRgb, smoothA);
        }
      `;

      const createShader = (type, source) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        return s;
      };

      const program = gl.createProgram();
      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      const aPos = gl.getAttribLocation(program, "a_pos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const uCanvasRes = gl.getUniformLocation(program, "u_canvasRes");
      const uIsLight = gl.getUniformLocation(program, "u_isLight");

      const render = () => {
        if (!isMounted) return;

        if (video.readyState >= 2) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const w = Math.round(canvas.clientWidth * dpr);
          const h = Math.round(canvas.clientHeight * dpr);

          if (w > 0 && h > 0) {
            if (canvas.width !== w || canvas.height !== h) {
              canvas.width = w;
              canvas.height = h;
              gl.viewport(0, 0, w, h);
            }

            gl.useProgram(program);
            gl.uniform2f(uCanvasRes, w, h);
            gl.uniform1f(uIsLight, isLightRef.current ? 1.0 : 0.0);

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              video
            );

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          }
        }

        animId = requestAnimationFrame(render);
      };

      animId = requestAnimationFrame(render);

      cleanupWebGL = () => {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(posBuf);
        gl.deleteTexture(texture);
      };
    } else {
      // 2D Canvas Fallback with centered backdrop scaling
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const strokeR = 46;
      const strokeG = 49;
      const strokeB = 59;
      const strokeLuma = (0.2126 * strokeR + 0.7152 * strokeG + 0.0722 * strokeB) / 255;

      const render2D = () => {
        if (!isMounted) return;

        if (video.readyState >= 2) {
          const w = canvas.clientWidth;
          const h = canvas.clientHeight;
          if (w > 0 && h > 0) {
            if (canvas.width !== w || canvas.height !== h) {
              canvas.width = w;
              canvas.height = h;
            }

            ctx.clearRect(0, 0, w, h);

            const ZOOM = 0.81;
            const animAspect = CROP_W / CROP_H;
            let drawH = h * ZOOM;
            let drawW = drawH * animAspect;
            if (drawW > w * 0.88) {
              const shrink = (w * 0.88) / drawW;
              drawW = w * 0.88;
              drawH *= shrink;
            }
            const drawX = Math.round((w - drawW) * 0.5);
            const drawY = Math.round((h - drawH) * 0.5);

            ctx.drawImage(
              video,
              CROP_X,
              CROP_Y,
              CROP_W,
              CROP_H,
              drawX,
              drawY,
              drawW,
              drawH
            );

            const imgData = ctx.getImageData(drawX, drawY, drawW, drawH);
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
              let r = data[i];
              let g = data[i + 1];
              let b = data[i + 2];
              const maxC = Math.max(r, g, b);
              const minC = Math.min(r, g, b);
              const sat = maxC > 0 ? (maxC - minC) / maxC : 0;
              const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

              if (sat < 0.12) {
                if (luma > 0.93) {
                  data[i + 3] = 0;
                  continue;
                } else if (luma > strokeLuma) {
                  const coverage = Math.max(0, Math.min(1, (1.0 - luma) / (1.0 - strokeLuma)));
                  data[i + 3] = Math.round(255 * coverage);
                  r = strokeR;
                  g = strokeG;
                  b = strokeB;
                }
              }

              data[i] = r;
              data[i + 1] = g;
              data[i + 2] = b;
            }

            ctx.putImageData(imgData, drawX, drawY);
          }
        }

        animId = requestAnimationFrame(render2D);
      };

      animId = requestAnimationFrame(render2D);
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    return () => {
      isMounted = false;
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
      if (cleanupWebGL) cleanupWebGL();
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden rounded-[inherit] ${className}`}
      aria-hidden="true"
    >
      {/* Hidden source video element */}
      <video
        ref={videoRef}
        src={careerVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{ display: "none" }}
      />

      {/* Real-time Centered Backdrop Canvas with feathered border mask */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit]"
        style={{
          maskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, rgba(0,0,0,0.7) 75%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 92% 88% at 50% 50%, black 50%, rgba(0,0,0,0.7) 75%, transparent 100%)",
        }}
      />

      {/* Border Faded Blur Layer — applies soft optical blur on the outer borders */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[2px] sm:backdrop-blur-sm"
        style={{
          maskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 45%, black 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 45%, black 85%)",
        }}
      />

      {/* Subtle border fade vignette (soft inset dissolve) */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-300 ${
          isLight
            ? "shadow-[inset_0_0_24px_12px_rgba(250,246,241,0.6)]"
            : "shadow-[inset_0_0_24px_12px_rgba(12,16,23,0.65)]"
        }`}
      />

      {/* Subtle bottom-left text readability gradient */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-tr from-[#faf6f1]/65 via-[#faf6f1]/15 to-transparent"
            : "bg-gradient-to-tr from-[#0c1017]/75 via-[#0c1017]/15 to-transparent"
        }`}
      />
    </div>
  );
}
