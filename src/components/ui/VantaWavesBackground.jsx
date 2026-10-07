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
 * Key Three.js r186 Fixes:
 * - Fixes PointLight physical attenuation (decay = 0) so specular wave crests gleam brightly.
 * - Injects dynamic Directional rim-lighting for crisp faceted 3D wave relief.
 * - forceAnimate: true guarantees uninterrupted 60fps rendering in sub-grid layouts.
 * - Multi-phase resize synchronizer ensures exact pixel dimensions on container layout.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const THEME_COLORS = {
  dark: {
    color: 0x093a2e, // Rich luminous obsidian emerald
    shininess: 65.0, // High specular gloss on wave peaks
    waveHeight: 18.0, // Pronounced 3D wave crests
    waveSpeed: 0.75, // Graceful fluid wave undulation
    zoom: 1.15,
    lightColor: 0x34d399, // Bright emerald point highlight
    ambientColor: 0x13382c, // Deep emerald ambient glow
    rimColor: 0x10b981, // Cyan-emerald rim light
  },
  light: {
    color: 0xf3f6f4, // Pure luminous pearl white matching light glass cards
    shininess: 35.0,
    waveHeight: 12.0,
    waveSpeed: 0.65,
    zoom: 1.15,
    lightColor: 0xffffff, // Pure crisp specular gloss
    ambientColor: 0xf8faf8, // Pristine soft porcelain ambient
    rimColor: 0xa7f3d0, // Delicate emerald rim sheen on wave crests
  },
};

export default function VantaWavesBackground({
  className = "",
  waveSpeed,
  waveHeight,
  shininess,
  zoom,
  color,
  opacity,
}) {
  const containerRef = useRef(null);
  const vantaEffectRef = useRef(null);
  const rimLightRef = useRef(null);
  const { resolved } = useTheme();
  const isLight = resolved === "light";

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === "undefined") return undefined;

    // Attach THREE globally for Vanta compatibility
    window.THREE = THREE;

    const themeConfig = isLight ? THEME_COLORS.light : THEME_COLORS.dark;
    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const activeColor = color ?? themeConfig.color;
    const activeShininess = shininess ?? themeConfig.shininess;
    const activeWaveHeight = waveHeight ?? (reducedMotion ? 6.0 : themeConfig.waveHeight);
    const activeWaveSpeed = reducedMotion ? 0.25 : (waveSpeed ?? themeConfig.waveSpeed);
    const activeZoom = zoom ?? themeConfig.zoom;

    try {
      const effectFn =
        typeof WAVES === "function"
          ? WAVES
          : typeof WAVES?.default === "function"
          ? WAVES.default
          : typeof window !== "undefined" && typeof window.VANTA?.WAVES === "function"
          ? window.VANTA.WAVES
          : null;

      if (effectFn) {
        vantaEffectRef.current = effectFn({
          el,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 10.0,
          minWidth: 10.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: activeColor,
          shininess: activeShininess,
          waveHeight: activeWaveHeight,
          waveSpeed: activeWaveSpeed,
          zoom: activeZoom,
          forceAnimate: true, // Always keep animation loop ticking
        });

        // ─── THREE.JS LIGHTING CORRECTION FOR THREE r186 ───────────────────
        // In Three.js r155+, PointLight default decay is 2 (physical attenuation),
        // which makes Vanta's default lighting pitch black at scene scale.
        // We restore legacy non-attenuating decay and add a custom rim light.
        const scene = vantaEffectRef.current?.scene;
        if (scene) {
          scene.traverse((obj) => {
            if (obj.isPointLight) {
              obj.decay = 0; // Disable inverse-square falloff
              obj.intensity = isLight ? 1.0 : 1.8;
              obj.color.set(themeConfig.lightColor);
              obj.position.set(-60, 240, 90);
            }
            if (obj.isAmbientLight) {
              obj.intensity = isLight ? 1.2 : 1.05;
              obj.color.set(themeConfig.ambientColor);
            }
          });

          // Add a dedicated directional rim light for gorgeous metallic facet glints
          const rim = new THREE.DirectionalLight(
            themeConfig.rimColor,
            isLight ? 0.7 : 1.3
          );
          rim.name = "vantaRimLight";
          rim.position.set(220, 280, 180);
          scene.add(rim);
          rimLightRef.current = rim;
        }

        // Multi-tick resize: trigger immediately and upon layout stabilization
        if (vantaEffectRef.current?.resize) {
          vantaEffectRef.current.resize();
          requestAnimationFrame(() => {
            vantaEffectRef.current?.resize?.();
          });
          const t1 = setTimeout(() => vantaEffectRef.current?.resize?.(), 100);
          const t2 = setTimeout(() => vantaEffectRef.current?.resize?.(), 300);
          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
          };
        }
      }
    } catch (err) {
      console.warn("[VantaWaves] Initialization warning:", err);
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
          if (rimLightRef.current && vantaEffectRef.current.scene) {
            vantaEffectRef.current.scene.remove(rimLightRef.current);
            rimLightRef.current.dispose?.();
          }
          vantaEffectRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        vantaEffectRef.current = null;
        rimLightRef.current = null;
      }
    };
  }, []); // Run on mount; theme changes handled in dynamic update effect

  // Dynamically update Vanta options & lighting when theme changes
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

      const scene = vantaEffectRef.current?.scene;
      if (scene) {
        scene.traverse((obj) => {
          if (obj.isPointLight) {
            obj.color.set(themeConfig.lightColor);
            obj.intensity = isLight ? 1.0 : 1.8;
          }
          if (obj.isAmbientLight) {
            obj.color.set(themeConfig.ambientColor);
            obj.intensity = isLight ? 1.2 : 1.05;
          }
        });
        if (rimLightRef.current) {
          rimLightRef.current.color.set(themeConfig.rimColor);
          rimLightRef.current.intensity = isLight ? 0.7 : 1.3;
        }
      }
    } catch {
      // ignore dynamic option errors
    }
  }, [isLight, color, shininess, waveHeight]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden rounded-[inherit] transition-opacity duration-500 ${className}`}
      style={{ opacity: opacity ?? (isLight ? 0.55 : 0.95) }}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 h-full w-full rounded-[inherit] [&>canvas]:!block [&>canvas]:!h-full [&>canvas]:!w-full [&>canvas]:!object-cover"
      />
      {/* Light edge vignette to protect bottom legend contrast without darkening the waves */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-300 ${
          isLight
            ? "bg-gradient-to-t from-white/70 via-white/20 to-transparent"
            : "bg-gradient-to-t from-[#0b0d14]/40 via-transparent to-transparent"
        }`}
      />
    </div>
  );
}
