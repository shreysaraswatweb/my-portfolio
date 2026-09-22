import { useMemo } from "react";
import { ReactLenis } from "lenis/react";
import { rootScrollOptions } from "../lib/scroll";
import useFinePointer from "../hooks/useFinePointer";

/**
 * SmoothScroll:
 * Inertial physical scrolling via Lenis for desktop mouse/trackpad viewports.
 * Strict native compositor scrolling for mobile/tablet touch screens (syncTouch: false).
 */
export default function SmoothScroll({ children }) {
  const isFinePointer = useFinePointer();

  const options = useMemo(() => {
    // Only smooth wheel on devices with a fine pointer (mouse/trackpad).
    // On coarse touch devices (phones/tablets without mouse), smoothWheel is false
    // and syncTouch is false, guaranteeing 100% native compositor scrolling.
    return {
      ...rootScrollOptions,
      smoothWheel: isFinePointer,
      autoRaf: isFinePointer,
    };
  }, [isFinePointer]);

  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}

