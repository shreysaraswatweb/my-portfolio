import { forwardRef } from "react";
import { ReactLenis } from "lenis/react";
import { nestedScrollOptions } from "../lib/scroll";

const SmoothOverflow = forwardRef(function SmoothOverflow(
  { axis = "x", className = "", children, ...props },
  ref,
) {
  return (
    <ReactLenis
      ref={ref}
      className={className}
      data-nested-scroll={axis}
      options={{
        ...nestedScrollOptions,
        orientation: axis === "x" ? "horizontal" : "vertical",
        gestureOrientation: axis === "x" ? "horizontal" : "vertical",
      }}
      {...props}
    >
      {children}
    </ReactLenis>
  );
});

export default SmoothOverflow;
