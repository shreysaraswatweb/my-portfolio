/**
 * Physics inertia for Lenis.
 * Root Lenis runs on tablet+ and mouse/trackpad viewports.
 * Phone-width touch keeps native compositor scrolling (syncTouch off).
 *
 * Tuning guide:
 *   lerp   – lower = smoother glide, higher = snappier stop (0.03–0.06 ultra-smooth)
 *   duration – scroll animation length in seconds (overridden when lerp is set,
 *              but acts as a cap for programmatic scrollTo / anchor scrolls)
 *   wheelMultiplier – distance per wheel tick (1 = native, 1.2 = slightly faster)
 *   easing – deceleration curve applied to scroll momentum
 */

export const easeOutExpo = (t) => (t === 1 ? 1 : 1.001 * (1 - 2 ** (-10 * t)));

export const easeOutQuart = (t) => 1 - (1 - t) ** 4;

/** Smooth quintic ease-out — gentler tail than quart, feels silky. */
export const easeOutQuint = (t) => 1 - (1 - t) ** 5;

/** Ultra-smooth sextic ease-out — longest, dreamiest deceleration tail. */
export const easeOutSextic = (t) => 1 - (1 - t) ** 6;

export const rootScrollOptions = {
  smoothWheel: true,
  lerp: 0.04,
  duration: 1.8,
  easing: easeOutSextic,
  wheelMultiplier: 1.4,
  autoRaf: true,
  syncTouch: false,
  touchMultiplier: 2.0,
  anchors: {
    offset: -20,
    duration: 1.4,
    easing: easeOutExpo,
  },
  allowNestedScroll: true,
  overscroll: true,
  prevent: (node) =>
    Boolean(
      node?.closest?.('[data-nested-scroll="y"]') ||
      node?.closest?.("[data-lenis-prevent]") ||
      node?.closest?.('[role="dialog"]'),
    ),
};

export const nestedScrollOptions = {
  smoothWheel: true,
  lerp: 0.04,
  duration: 1.8,
  easing: easeOutSextic,
  wheelMultiplier: 1.4,
  autoRaf: true,
  syncTouch: false,
  touchMultiplier: 2.0,
  overscroll: false,
};
