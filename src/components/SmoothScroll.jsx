/**
 * SmoothScroll:
 * Provides the same native compositor momentum and fluid deceleration
 * across all screen sizes (mobile, tablet, desktop) without synthetic
 * wheel hijacking, rounding snaps, or stopping jerks.
 */

export function shouldUseLenis() {
  return false;
}

export default function SmoothScroll({ children }) {
  return children;
}
