import { useEffect, useRef } from "react";
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min.js";
import { useTheme } from "../../theme/ThemeProvider";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VANTA WAVES 3D ANIMATED BACKGROUND COMPONENT
 *
 * Renders an interactive WebGL 3D wave mesh powered by Three.js & Vanta.
 * Harmonized with the portfolio's emerald accent & glassmorphic theme.
 *
 * Features:
 * - Theme-aware dynamic color switching (Dark Obsidian-Emerald / Light Mint-Sage)
 * - Mouse & touch interaction with smooth camera parallax
 * - Automatic cleanup & resize handling
 * - prefers-reduced-motion & visibility optimizations
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Colors tuned to match portfolio design tokens:
// Dark: Deep obsidian emerald (0x071d15) -> catches point light with sleek #22c55e sheen
// Light: Soft pearl mint sage (0xd8ede1) -> clean luminous daytime ripple
const THEME_COLORS = {
  dark: {
    color: 0x081e16,
    shininess: 38.0,
    waveHeight: 12.0,
    waveSpeed: 0.65,
    zoom: 1.15,
  },
  light: {
    color: 0xd6ebd9,
    shininess: 42.0,
    waveHeight: 11.0,
    waveSpeed: 0.65,
    zoom: 1.15,
  },
};

export default function VantaWavesBackground({
  className = "",
  waveSpeed = 0.65,
  waveHeight,
  shininess,
  zoom,
  color,
  opacity,
}) {
  const containerRef = useRef(null);
  const vantaEffectRef = useRef(null);
  const { resolved } = useTheme();
  const isLight = resolved === "light";

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return undefined;

    // Ensure THREE is globally available on window for Vanta
    window.THREE = THREE;

    const themeConfig = isLight ? THEME_COLORS.light : THEME_COLORS.dark;
    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const activeColor = color ?? themeConfig.color;
    const activeShininess = shininess ?? themeConfig.shininess;
    const activeWaveHeight = waveHeight ?? (reducedMotion ? 5.0 : themeConfig.waveHeight);
    const activeWaveSpeed = reducedMotion ? 0.2 : (waveSpeed ?? themeConfig.waveSpeed);
    const activeZoom = zoom ?? themeConfig.zoom;

    try {
      const effectFn = WAVES?.default || WAVES;
      vantaEffectRef.current = effectFn({
        el,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 120.0,
        minWidth: 160.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: activeColor,
        shininess: activeShininess,
        waveHeight: activeWaveHeight,
        waveSpeed: activeWaveSpeed,
        zoom: activeZoom,
      });
    } catch (err) {
      console.warn("[VantaWaves] Initialization failed:", err);
    }

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        if (vantaEffectRef.current && typeof vantaEffectRef.current.resize === "function") {
          vantaEffectRef.current.resize();
        }
      });
      resizeObserver.observe(el);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        vantaEffectRef.current = null;
      }
    };
  }, []); // Run on mount; theme changes handled in separate effect for seamless transitions

  // Dynamically update Vanta options when theme (light/dark) switches without rebuilding WebGL context
  useEffect(() => {
    if (!vantaEffectRef.current) return;
    const themeConfig = isLight ? THEME_COLORS.light : THEME_COLORS.dark;
    const activeColor = color ?? themeConfig.color;
    const activeShininess = shininess ?? themeConfig.shininess;
    const activeWaveHeight = waveHeight ?? themeConfig.waveHeight;

    try {
      vantaEffectRef.current.setOptions({
        color: activeColor,
        shininess: activeShininess,
        waveHeight: activeWaveHeight,
      });
    } catch {
      // ignore
    }
  }, [isLight, color, shininess, waveHeight]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden rounded-[inherit] transition-opacity duration-500 ${className}`}
      style={{ opacity: opacity ?? (isLight ? 0.75 : 0.82) }}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit]"
      />
      {/* Subtle vignette mask to ensure text & contribution cubes have crisp contrast */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-t from-white/70 via-white/20 to-white/45"
            : "bg-gradient-to-t from-[#080b10]/75 via-[#080b10]/25 to-[#080b10]/40"
        }`}
      />
    </div>
  );
}
