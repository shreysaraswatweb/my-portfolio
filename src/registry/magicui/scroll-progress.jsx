import { forwardRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ScrollProgress - Magic UI
 * Animated scroll progress bar with inertial spring smoothing.
 * Replaces default vertical side scrollbar with a sleek top reading indicator.
 *
 * @param {string} [className] - Additional classes (e.g. "top-[65px]" to place below navbar)
 * @param {object} [springOptions] - Custom Framer Motion spring physics options
 */
export const ScrollProgress = forwardRef(
  ({ className, springOptions, ...props }, ref) => {
    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
      stiffness: 280,
      damping: 30,
      restDelta: 0.001,
      ...springOptions,
    });

    const hasCustomTop = className && /\btop-/.test(className);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "fixed inset-x-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92] shadow-[0_0_12px_rgba(243,140,184,0.45)] pointer-events-none",
          !hasCustomTop && "top-0",
          className,
        )}
        style={{
          scaleX,
        }}
        {...props}
      />
    );
  },
);

ScrollProgress.displayName = "ScrollProgress";

/**
 * ScrollProgressDemo - Magic UI Demo Component
 */
export function ScrollProgressDemo() {
  return (
    <div className="z-10 rounded-lg p-4">
      <ScrollProgress className="top-[65px]" />
      <h2 className="pb-4 font-bold">
        Note: The scroll progress is shown below the navbar of the page.
      </h2>
    </div>
  );
}

export default ScrollProgress;
