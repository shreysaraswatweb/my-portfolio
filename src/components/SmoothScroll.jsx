import { useEffect, useState } from "react";
import { rootScrollOptions } from "../lib/scroll";

const DESKTOP_LENIS_QUERY =
  "(hover: hover) and (pointer: fine) and (min-width: 1024px)";
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function shouldUseLenis() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia(DESKTOP_LENIS_QUERY).matches &&
    !window.matchMedia(REDUCE_MOTION_QUERY).matches
  );
}

export default function SmoothScroll({ children }) {
  const [useLenis, setUseLenis] = useState(shouldUseLenis);
  const [LenisRoot, setLenisRoot] = useState(null);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_LENIS_QUERY);
    const reduce = window.matchMedia(REDUCE_MOTION_QUERY);
    const update = () =>
      setUseLenis(desktop.matches && !reduce.matches);
    update();
    desktop.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!useLenis) {
      setLenisRoot(null);
      return undefined;
    }

    let cancelled = false;
    Promise.all([import("lenis/react"), import("lenis/dist/lenis.css")]).then(
      ([mod]) => {
        if (!cancelled) setLenisRoot(() => mod.ReactLenis);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [useLenis]);

  if (!useLenis || !LenisRoot) {
    return children;
  }

  return (
    <LenisRoot root options={rootScrollOptions}>
      {children}
    </LenisRoot>
  );
}
