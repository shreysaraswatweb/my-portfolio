/**
 * Physical inertial scrolling configuration for Lenis.
 *
 * Core motion principles:
 * - Responsive: Responds within the first RAF frame (~16ms).
 * - Weighted: Viscous damping settles naturally over ~250–350ms without floatiness.
 * - Fluid & Controlled: Fast wheel input accumulates naturally for rapid travel,
 *   while single notches remain precise.
 * - Hardware Adaptive: Differentiates mouse wheel vs trackpad. Trackpads use a snappier
 *   lerp (0.22) to avoid stacking synthetic momentum on top of native OS momentum.
 * - Native Touch: syncTouch is strictly false — mobile and touch screens keep 100% native
 *   compositor scrolling, overscroll bounce, and pull-to-refresh with zero virtual lag.
 */

export const easeOutExpo = (t) => (t === 1 ? 1 : 1.001 * (1 - 2 ** (-10 * t)));

export const easeOutQuart = (t) => 1 - (1 - t) ** 4;

/** Smooth quintic ease-out — gentler tail than quart, feels silky. */
export const easeOutQuint = (t) => 1 - (1 - t) ** 5;

/** Ultra-smooth sextic ease-out — longest, dreamiest deceleration tail. */
export const easeOutSextic = (t) => 1 - (1 - t) ** 6;

export const MOUSE_WHEEL_LERP = 0.11;
export const TRACKPAD_LERP = 0.22;

let lastWheelTimestamp = 0;
let consecutiveFastSmallEvents = 0;

/**
 * Distinguishes trackpad gestures (continuous fractional streams / horizontal component)
 * from stepped mouse-wheel events (deltaMode 1 or 100/120px integer steps).
 */
export function isTrackpadWheelEvent(e) {
  if (!e || e.type !== "wheel") return false;

  // Discrete line scrolling is always a physical mouse wheel
  if (e.deltaMode === 1) {
    consecutiveFastSmallEvents = 0;
    return false;
  }

  // Fractional deltas are a definitive signature of precision trackpad subpixel events
  if (Math.abs(e.deltaY) % 1 !== 0 || Math.abs(e.deltaX) % 1 !== 0) {
    return true;
  }

  // Horizontal delta without shift key indicates 2-finger trackpad swipe
  if (Math.abs(e.deltaX) > 0 && !e.shiftKey) {
    return true;
  }

  // Physical mouse wheel notches typically produce deltas of ±100, ±120, ±150, etc.
  const absY = Math.abs(e.deltaY);
  if (absY >= 100 && absY % 10 === 0) {
    consecutiveFastSmallEvents = 0;
    return false;
  }

  // Frequency-based detection for trackpad inertia streams (events arriving every 8-24ms with small delta)
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  const dt = now - lastWheelTimestamp;
  lastWheelTimestamp = now;

  if (dt > 0 && dt < 32 && absY < 50) {
    consecutiveFastSmallEvents = Math.min(consecutiveFastSmallEvents + 1, 6);
  } else if (absY >= 80 || dt > 60) {
    consecutiveFastSmallEvents = Math.max(consecutiveFastSmallEvents - 1, 0);
  }

  return consecutiveFastSmallEvents >= 2;
}

export const rootScrollOptions = {
  smoothWheel: true,
  lerp: MOUSE_WHEEL_LERP,
  duration: undefined,
  easing: undefined,
  wheelMultiplier: 1.0,
  autoRaf: true,
  syncTouch: false,
  touchMultiplier: 1.0,
  anchors: {
    offset: -24,
    duration: 0.8,
    easing: easeOutExpo,
  },
  stopInertiaOnNavigate: true,
  respectReducedMotion: true,
  allowNestedScroll: true,
  overscroll: true,
  prevent: (node) =>
    Boolean(
      node?.closest?.('[data-nested-scroll="y"]') ||
      node?.closest?.("[data-lenis-prevent]") ||
      node?.closest?.('[role="dialog"]'),
    ),
  virtualScroll: function (data) {
    const event = data?.event;
    if (event && event.type === "wheel") {
      const isTrackpad = isTrackpadWheelEvent(event);
      this.lerp = isTrackpad ? TRACKPAD_LERP : MOUSE_WHEEL_LERP;
    }
    return true;
  },
};

export const nestedScrollOptions = {
  smoothWheel: true,
  lerp: 0.12,
  duration: undefined,
  easing: undefined,
  wheelMultiplier: 1.0,
  autoRaf: true,
  syncTouch: false,
  touchMultiplier: 1.0,
  overscroll: false,
  respectReducedMotion: true,
};

export function shouldUseLenis() {
  if (typeof window === "undefined") return false;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

