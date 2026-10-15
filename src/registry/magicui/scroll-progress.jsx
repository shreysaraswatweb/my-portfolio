import { forwardRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";

/**
 * ScrollProgress - Magic UI
 * Animated scroll progress bar with inertial spring smoothing.
 * Replaces default vertical side scrollbar with a sleek reading indicator.
 *
 * @param {string} [className] - Additional classes (e.g. "top-[65px]" to place below navbar)
 * @param {object} [springOptions] - Custom Framer Motion spring physics options
 */
export const ScrollProgress = forwardRef(
  ({ className, springOptions, ...props }, ref) => {
    const rawProgress = useMotionValue(0);
    const lenis = useLenis();

    useEffect(() => {
      const updateProgress = (progress) => {
        if (typeof progress === "number") {
          rawProgress.set(Math.min(1, Math.max(0, progress)));
          return;
        }
        const scrollEl = document.documentElement;
        const maxScroll = scrollEl.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) {
          rawProgress.set(0);
          return;
        }
        const current = window.scrollY || scrollEl.scrollTop || 0;
        rawProgress.set(Math.min(1, Math.max(0, current / maxScroll)));
      };

      // Initial measurement
      updateProgress();

      // 1. Lenis scroll listener
      let unsubLenis;
      if (lenis && typeof lenis.on === "function") {
        const onLenisScroll = (e) => {
          updateProgress(typeof e?.progress === "number" ? e.progress : undefined);
        };
        lenis.on("scroll", onLenisScroll);
        unsubLenis = () => {
          if (typeof lenis.off === "function") {
            lenis.off("scroll", onLenisScroll);
          }
        };
      }

      // 2. Native window scroll listener (coarse touch devices & fallback)
      const onWindowScroll = () => updateProgress();
      window.addEventListener("scroll", onWindowScroll, { passive: true });
      window.addEventListener("resize", onWindowScroll, { passive: true });

      return () => {
        if (unsubLenis) unsubLenis();
        window.removeEventListener("scroll", onWindowScroll);
        window.removeEventListener("resize", onWindowScroll);
      };
    }, [lenis, rawProgress]);

    const scaleX = useSpring(rawProgress, {
      stiffness: 280,
      damping: 30,
      restDelta: 0.001,
      ...springOptions,
    });

    // Clean fade-in once scroll starts so top of page has zero residual pixels/smudges
    const opacity = useTransform(rawProgress, [0, 0.002], [0, 1]);

    const hasCustomTop = className && /\btop-/.test(className);

    return (
      <motion.div
        ref={ref}
        className={cn(
          "fixed inset-x-0 z-[60] h-[2.5px] origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92] pointer-events-none",
          !hasCustomTop && "top-0",
          className,
        )}
        style={{
          scaleX,
          opacity,
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
