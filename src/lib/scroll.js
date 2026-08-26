/** Inertia settings aligned with design-system motion: subtle, ease-out, never abrupt. */
export const easeOutExpo = (t) => Math.min(1, 1.001 - 2 ** (-10 * t));

export const rootScrollOptions = {
  lerp: 0.075,
  autoRaf: true,
  anchors: true,
  syncTouch: true,
  syncTouchLerp: 0.075,
  touchInertiaExponent: 1.65,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.1,
  allowNestedScroll: true,
  prevent: (node) => Boolean(node.closest('[data-nested-scroll="y"]')),
};

export const nestedScrollOptions = {
  lerp: 0.1,
  autoRaf: true,
  syncTouch: true,
  syncTouchLerp: 0.08,
  touchInertiaExponent: 1.6,
  overscroll: false,
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.15,
};
