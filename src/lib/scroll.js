/** 
 * Physics Inertia Settings for Lenis Smooth Scroll
 * Aligned with modern high-performance design-systems (Apple/Awwwards).
 * Provides responsive immediate-pickup on desktop wheels/trackpads
 * and authentic momentum decay (exponential ease-out) on mobile touch.
 */

// Exponential ease-out physics curve: rapid launch, prolonged silky glide
export const easeOutExpo = (t) => (t === 1 ? 1 : 1.001 * (1 - 2 ** (-10 * t)));

// Natural quartic ease-out for anchor gliding
export const easeOutQuart = (t) => 1 - (1 - t) ** 4;

export const rootScrollOptions = {
  // Desktop Wheel & Trackpad Physics
  smoothWheel: true,
  lerp: 0.085, // Viscous exponential damping: immediate reaction + fluid glide
  wheelMultiplier: 1.0, // 1:1 natural input distance
  autoRaf: true,

  // Mobile & Touchscreen Inertial Physics
  syncTouch: true, // Enables full touch virtualization and inertial physics on mobile
  syncTouchLerp: 0.075, // Prolonged momentum decay factor on finger release
  touchInertiaExponent: 1.75, // Dynamic velocity scaling (swift flick = farther glide)
  touchMultiplier: 1.2, // Generous travel per swipe distance for comfortable mobile navigation

  // Anchor Navigation with Smooth Inertia
  anchors: {
    offset: -20,
    duration: 1.2,
    easing: easeOutExpo,
  },

  // Do not let internal checks block root scroll; rely on targeted prevent()
  allowNestedScroll: false,
  overscroll: true,
  prevent: (node) =>
    Boolean(
      node?.closest?.('[data-nested-scroll="y"]') ||
        node?.closest?.("[data-lenis-prevent]") ||
        node?.closest?.('[role="dialog"]')
    ),
};

export const nestedScrollOptions = {
  smoothWheel: true,
  lerp: 0.09,
  wheelMultiplier: 1.0,
  autoRaf: true,

  // Touch physics for vertical sidebar
  syncTouch: true,
  syncTouchLerp: 0.08,
  touchInertiaExponent: 1.7,
  touchMultiplier: 1.2,

  overscroll: false,
};
