/**
 * Physics inertia for Lenis.
 * Root Lenis runs on tablet+ and mouse/trackpad viewports.
 * Phone-width touch keeps native compositor scrolling (syncTouch off).
 */

export const easeOutExpo = (t) => (t === 1 ? 1 : 1.001 * (1 - 2 ** (-10 * t)));

export const easeOutQuart = (t) => 1 - (1 - t) ** 4;

export const rootScrollOptions = {
  smoothWheel: true,
  lerp: 0.14,
  wheelMultiplier: 1,
  autoRaf: true,
  syncTouch: false,
  touchMultiplier: 1,
  anchors: {
    offset: -20,
    duration: 0.85,
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
  lerp: 0.14,
  wheelMultiplier: 1,
  autoRaf: true,
  syncTouch: false,
  touchMultiplier: 1,
  overscroll: false,
};
