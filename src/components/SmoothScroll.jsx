import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { rootScrollOptions } from "../lib/scroll";

/** Matches `--breakpoint-tablet` so tablet and desktop share Lenis wheel smoothing. */
const TABLET_UP_QUERY = "(min-width: 480px)";
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function shouldUseLenis() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia(REDUCE_MOTION_QUERY).matches) return false;
  return (
    window.matchMedia(TABLET_UP_QUERY).matches ||
    window.matchMedia(FINE_POINTER_QUERY).matches
  );
}

export default function SmoothScroll({ children }) {
  const [useLenis, setUseLenis] = useState(shouldUseLenis);

  useEffect(() => {
    const tabletUp = window.matchMedia(TABLET_UP_QUERY);
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const reduce = window.matchMedia(REDUCE_MOTION_QUERY);
    const update = () =>
      setUseLenis(
        !reduce.matches && (tabletUp.matches || finePointer.matches),
      );
    update();
    tabletUp.addEventListener("change", update);
    finePointer.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      tabletUp.removeEventListener("change", update);
      finePointer.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  if (!useLenis) {
    return children;
  }

  return (
    <ReactLenis root options={rootScrollOptions}>
      {children}
    </ReactLenis>
  );
}
