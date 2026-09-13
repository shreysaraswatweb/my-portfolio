"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const DESKTOP_POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)";

function isTrackablePointer(pointerType) {
  return pointerType !== "touch";
}

/**
 * Default SVG arrow cursor with high-contrast dual stroke/fill for crisp visibility on both dark & light themes.
 */
function DefaultCursorSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={46}
      height={50}
      viewBox="0 0 50 54"
      fill="none"
      className="origin-top-left drop-shadow-md select-none pointer-events-none"
      style={{ transform: "scale(0.52)" }}
    >
      <defs>
        <filter
          id="smooth-cursor-shadow"
          x="0"
          y="0"
          width="50"
          height="54"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter="url(#smooth-cursor-shadow)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="rgb(var(--rgb-text-primary, 255 255 255))"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4156 7.97238 46.298 10.803 45.2549L24.7662 40.109C25.0221 40.0147 25.2999 40.0156 25.5494 40.1082L39.4193 45.254C42.2261 46.2953 44.9254 43.4347 43.7146 40.6933Z"
          stroke="rgb(var(--rgb-canvas-mid, 18 20 28))"
          strokeWidth={2.5}
        />
      </g>
    </svg>
  );
}

/**
 * Sleek glassmorphic pointer indicator — a minimal dot + ring that matches the
 * dark glassmorphic aesthetic. Replaces the clunky hand cursor with something
 * that actually belongs in this UI.
 */
function DefaultPointerIndicator() {
  return (
    <div
      className="pointer-events-none select-none"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
      }}
    >
      {/* Outer ring — thin, glassmorphic, accent-tinted */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1.5px solid rgba(168, 85, 247, 0.38)",
          background: "rgba(168, 85, 247, 0.04)",
          backdropFilter: "blur(1px)",
          boxShadow:
            "0 0 16px rgba(168, 85, 247, 0.12), inset 0 0 6px rgba(168, 85, 247, 0.03)",
        }}
      />
      {/* Core dot — high-contrast, theme-adaptive */}
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "rgb(var(--rgb-text-primary, 255 255 255))",
          boxShadow:
            "0 0 6px rgba(168, 85, 247, 0.4), 0 0 2px rgba(255, 255, 255, 0.15)",
        }}
      />
    </div>
  );
}

/**
 * Selectors for interactive DOM elements where `cursor: pointer` is expected.
 */
const POINTER_SELECTORS = [
  "a",
  "button",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "label",
  "summary",
  "[role='button']",
  "[role='tab']",
  "[role='link']",
  "[role='switch']",
  "[role='menuitem']",
  "[role='menuitemcheckbox']",
  "[role='menuitemradio']",
  "[role='option']",
  "[role='checkbox']",
  "[role='radio']",
  "[role='slider']",
  "[tabindex]:not([tabindex='-1'])",
  "[onclick]",
  "[data-interactive='true']",
  "[data-clickable='true']",
  "[data-cursor='pointer']",
  "[data-pointer]",
  ".cursor-pointer",
  "[class*='cursor-pointer']",
  ".hover-lift",
  ".hover-chip",
  ".hover-icon",
  ".hover-link",
  ".hover-nav",
  ".hover-media",
  ".primary-btn",
  ".secondary-btn",
  ".bulb-button",
].join(", ");

/**
 * Checks whether the target element should trigger the pointer cursor state.
 * Fast-path: selector match. Fallback: getComputedStyle for any CSS cursor:pointer.
 */
function checkIsPointer(target) {
  if (
    !target ||
    target === document.documentElement ||
    target === document.body
  ) {
    return false;
  }

  // Fast path: match interactive element selectors via .closest()
  if (target.closest?.(POINTER_SELECTORS)) {
    return true;
  }

  // Fallback: computed style catches cursor:pointer from CSS, inline, or inheritance
  try {
    const c = window.getComputedStyle(target).cursor;
    return c === "pointer" || c === "grab" || c === "grabbing";
  } catch {
    return false;
  }
}

/**
 * SmoothCursor — Magic UI
 *
 * Physics-based smooth cursor with spring inertia, velocity-driven rotation,
 * glassmorphic pointer morphing, and tactile click dynamics.
 *
 * Physics tuning notes (2026-09-19):
 *   Main cursor  → near-critically-damped, fast follow with zero overshoot
 *   Trail aura   → under-damped, dramatic lag for depth/inertia feel
 *   Rotation     → smooth directional tracking, stabilizes to 0° over interactive
 *   Scale        → snappy, slightly bouncy click feedback
 */
export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  pointerCursor = <DefaultPointerIndicator />,
  springConfig = {
    damping: 28,
    stiffness: 420,
    mass: 0.5,
    restDelta: 0.001,
  },
  showTrail = true,
}) {
  /* ── refs ─────────────────────────────────────────────────────────── */
  const lastMousePos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const lastPointerState = useRef(false);
  const wasVisible = useRef(false);

  /* ── state ────────────────────────────────────────────────────────── */
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHoveringPointer, setIsHoveringPointer] = useState(false);

  /* ── spring: main cursor position (snappy, near-critical damping) ── */
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  /* ── spring: trailing aura (heavy, under-damped for dramatic inertia) ── */
  const trailX = useSpring(0, { damping: 18, stiffness: 140, mass: 1.5 });
  const trailY = useSpring(0, { damping: 18, stiffness: 140, mass: 1.5 });

  /* ── spring: rotation (smooth directional tracking) ─────────────── */
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 44,
    stiffness: 280,
  });

  /* ── spring: scale (crisp, slightly bouncy click feedback) ──────── */
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 26,
  });

  /* ── detect desktop fine pointer (exclude mobile/touch) ─────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(DESKTOP_POINTER_QUERY);

    const updateEnabled = () => {
      const next = mediaQuery.matches;
      setIsEnabled(next);
      if (!next) {
        setIsVisible(false);
        wasVisible.current = false;
      }
    };

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);
    return () => mediaQuery.removeEventListener("change", updateEnabled);
  }, []);

  /* ── main cursor logic ──────────────────────────────────────────── */
  useEffect(() => {
    if (!isEnabled) return;

    let settleTimeout = null;

    const updateVelocity = (pos) => {
      const now = Date.now();
      const dt = now - lastUpdateTime.current;
      if (dt > 0) {
        velocity.current = {
          x: (pos.x - lastMousePos.current.x) / dt,
          y: (pos.y - lastMousePos.current.y) / dt,
        };
      }
      lastUpdateTime.current = now;
      lastMousePos.current = pos;
    };

    const onPointerMove = (e) => {
      if (!isTrackablePointer(e.pointerType)) return;

      // Only trigger state update on first appearance
      if (!wasVisible.current) {
        wasVisible.current = true;
        setIsVisible(true);
      }

      const pos = { x: e.clientX, y: e.clientY };
      updateVelocity(pos);

      const speed = Math.hypot(velocity.current.x, velocity.current.y);

      // Drive spring positions
      cursorX.set(pos.x);
      cursorY.set(pos.y);
      trailX.set(pos.x);
      trailY.set(pos.y);

      // Pointer detection (only re-render on state change)
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const isPointer = checkIsPointer(target);
      if (isPointer !== lastPointerState.current) {
        lastPointerState.current = isPointer;
        setIsHoveringPointer(isPointer);
      }

      // Rotational physics
      if (isPointer) {
        // Stabilize upright over interactive targets
        rotation.set(0);
        accumulatedRotation.current = 0;
        previousAngle.current = 0;
      } else if (speed > 0.05) {
        // Tilt arrow along velocity vector in free space
        const angle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90;

        let diff = angle - previousAngle.current;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        accumulatedRotation.current += diff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = angle;

        // Velocity squash feedback
        scale.set(0.90);

        if (settleTimeout !== null) clearTimeout(settleTimeout);
        settleTimeout = setTimeout(() => {
          scale.set(isClicking ? 0.82 : 1);
        }, 90);
      }
    };

    // rAF throttle to cap at display refresh rate
    let rafId = 0;
    const throttledMove = (e) => {
      if (!isTrackablePointer(e.pointerType)) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        onPointerMove(e);
        rafId = 0;
      });
    };

    const onPointerDown = (e) => {
      setIsClicking(true);
      scale.set(0.82);
      if (e) {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        const isPointer = checkIsPointer(target);
        if (isPointer !== lastPointerState.current) {
          lastPointerState.current = isPointer;
          setIsHoveringPointer(isPointer);
        }
      }
    };

    const onPointerUp = () => {
      setIsClicking(false);
      scale.set(1);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      wasVisible.current = false;
    };

    const onMouseEnter = () => {
      if (!wasVisible.current) {
        wasVisible.current = true;
        setIsVisible(true);
      }
    };

    // Suppress native cursor on desktop
    document.documentElement.classList.add("custom-cursor-active");
    document.body.style.cursor = "none";

    window.addEventListener("pointermove", throttledMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("pointermove", throttledMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);

      document.documentElement.classList.remove("custom-cursor-active");
      document.body.style.cursor = "auto";

      if (rafId) cancelAnimationFrame(rafId);
      if (settleTimeout !== null) clearTimeout(settleTimeout);
    };
  }, [cursorX, cursorY, trailX, trailY, rotation, scale, isEnabled, isClicking]);

  /* ── bail on non-desktop ────────────────────────────────────────── */
  if (!isEnabled) return null;

  /* ── render ─────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── Trailing inertia aura ── */}
      {showTrail && (
        <motion.div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: trailX,
            top: trailY,
            translateX: "-50%",
            translateY: "-50%",
            zIndex: 99998,
            pointerEvents: "none",
            willChange: "transform",
          }}
          animate={{
            opacity: isVisible ? (isHoveringPointer ? 0.65 : 0.35) : 0,
            scale: isHoveringPointer ? 2.2 : 1,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: "1px solid rgba(168, 85, 247, 0.3)",
              background: "rgba(168, 85, 247, 0.06)",
              boxShadow: "0 0 10px rgba(168, 85, 247, 0.15)",
            }}
          />
        </motion.div>
      )}

      {/* ── Main cursor container (spring-driven position + rotation + scale) ── */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: cursorX,
          top: cursorY,
          rotate: rotation,
          scale: scale,
          zIndex: 99999,
          pointerEvents: "none",
          willChange: "transform",
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        initial={false}
        transition={{ duration: 0.1 }}
      >
        <div className="relative pointer-events-none select-none">
          {/* Default arrow (free space) */}
          <motion.div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              translateX: "-50%",
              translateY: "-50%",
              pointerEvents: "none",
            }}
            animate={{
              opacity: isHoveringPointer ? 0 : 1,
              scale: isHoveringPointer ? 0.5 : 1,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {cursor}
          </motion.div>

          {/* Pointer indicator (interactive elements) */}
          <motion.div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              translateX: "-50%",
              translateY: "-50%",
              pointerEvents: "none",
            }}
            animate={{
              opacity: isHoveringPointer ? 1 : 0,
              scale: isHoveringPointer ? (isClicking ? 0.85 : 1) : 0.4,
            }}
            transition={{
              duration: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {pointerCursor}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export default SmoothCursor;
