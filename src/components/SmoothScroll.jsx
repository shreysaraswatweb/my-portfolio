import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { rootScrollOptions } from "../lib/scroll";

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={rootScrollOptions}>
      {children}
    </ReactLenis>
  );
}
