import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";
import { ReactLenis } from "lenis/react";
import { nestedScrollOptions, easeOutExpo } from "../lib/scroll";
import { cn } from "@/lib/utils";
import useFinePointer from "../hooks/useFinePointer";

/**
 * Frame-rate independent viscous damping function.
 * Mathematically guarantees exact exponential velocity decay regardless of 60Hz/120Hz/144Hz monitors.
 */
const damp = (current, target, lambda, dt) => {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
};

/**
 * SmoothOverflow
 * - For axis="x" (Horizontal, e.g. ExperienceTimeline):
 *   High-precision inertial smooth physics engine:
 *   1. Trackpad & horizontal wheel: time-delta normalized viscous damping (lambda=12) with continuous target accumulation
 *   2. Non-blocking vertical wheel: purely vertical gestures pass directly to root Lenis so vertical scrolling never stops
 *   3. Pointer drag & flick: 1:1 direct tracking with physical fling momentum (exponential velocity decay)
 *   4. Programmatic scrollTo: easeOutExpo physics easing for pagination buttons (< and >)
 *   5. Mobile & touch: touchAction="pan-y" preserves vertical page scroll while providing inertial horizontal drag
 * - For axis="y" (Vertical, e.g. Sidebar navigation):
 *   Uses ReactLenis configured for vertical confinement
 */
const SmoothOverflow = forwardRef(function SmoothOverflow(
  { axis = "x", className = "", children, ...props },
  ref,
) {
  const domRef = useRef(null);
  const targetScrollRef = useRef(0);
  const wheelRafRef = useRef(null);
  const momentumRafRef = useRef(null);
  const programmaticRafRef = useRef(null);

  // Pointer drag physics state
  const isDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const velocityHistoryRef = useRef([]);
  const hasDraggedRef = useRef(false);
  const isFinePointer = useFinePointer();

  // Stop all active physics animations
  const stopAllAnimations = () => {
    if (wheelRafRef.current) {
      cancelAnimationFrame(wheelRafRef.current);
      wheelRafRef.current = null;
    }
    if (momentumRafRef.current) {
      cancelAnimationFrame(momentumRafRef.current);
      momentumRafRef.current = null;
    }
    if (programmaticRafRef.current) {
      cancelAnimationFrame(programmaticRafRef.current);
      programmaticRafRef.current = null;
    }
  };

  // Expose imperative API for scrollerRef
  useImperativeHandle(ref, () => ({
    get wrapper() {
      return domRef.current;
    },
    get current() {
      return domRef.current;
    },
    scrollTo: (target, options = {}) => {
      const container = domRef.current;
      if (!container) return;

      const max = container.scrollWidth - container.clientWidth;
      const targetX = Math.max(
        0,
        Math.min(max, typeof target === "number" ? target : target?.left ?? 0)
      );
      const startX = container.scrollLeft;
      const change = targetX - startX;
      if (Math.abs(change) < 0.5) return;

      const duration = options.duration ?? 750;
      const easing = options.easing ?? easeOutExpo;
      const startTime = performance.now();

      stopAllAnimations();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = easing(progress);

        container.scrollLeft = startX + change * eased;
        targetScrollRef.current = container.scrollLeft;

        if (progress < 1) {
          programmaticRafRef.current = requestAnimationFrame(step);
        } else {
          programmaticRafRef.current = null;
        }
      };

      programmaticRafRef.current = requestAnimationFrame(step);
    },
  }));

  // Horizontal Wheel & Trackpad Physics (Axis === "x")
  useEffect(() => {
    if (axis !== "x" || !isFinePointer) return;
    const container = domRef.current;
    if (!container) return;

    targetScrollRef.current = container.scrollLeft;

    const onWheel = (e) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      // Detect horizontal intent: Shift + wheel or horizontal trackpad gesture
      const isShift = e.shiftKey && absY > 0;
      const isHorizontal = absX > absY || isShift;

      // If predominantly vertical: NEVER block or prevent default.
      // Allows the event to bubble freely to the window / root Lenis so vertical page scrolling flows uninterrupted!
      if (!isHorizontal) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const delta = isShift ? e.deltaY : e.deltaX;
      const max = container.scrollWidth - container.clientWidth;

      // Accumulate target scroll smoothly
      targetScrollRef.current = Math.max(
        0,
        Math.min(max, targetScrollRef.current + delta * 1.05)
      );

      // If wheel animation loop is already running, let it continue damping towards the updated target.
      // If not running, initiate the viscous damping loop.
      if (!wheelRafRef.current) {
        let lastTime = performance.now();

        const tick = (now) => {
          const dt = Math.min(32, now - lastTime) / 1000;
          lastTime = now;

          const current = container.scrollLeft;
          const target = targetScrollRef.current;
          const next = damp(current, target, 12, dt); // lambda=12: buttery responsive glide

          if (Math.abs(target - next) > 0.3) {
            container.scrollLeft = next;
            wheelRafRef.current = requestAnimationFrame(tick);
          } else {
            container.scrollLeft = target;
            wheelRafRef.current = null;
          }
        };

        wheelRafRef.current = requestAnimationFrame(tick);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", onWheel);
      stopAllAnimations();
    };
  }, [axis, isFinePointer]);

  // Pointer drag is desktop-only. On Android, capture + pan-y fights native scroll.
  useEffect(() => {
    if (axis !== "x" || !isFinePointer) return;
    const container = domRef.current;
    if (!container) return;

    const onPointerDown = (e) => {
      // Primary button only
      if (e.button !== 0 && e.pointerType === "mouse") return;

      isDownRef.current = true;
      isDraggingRef.current = false;
      hasDraggedRef.current = false;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      startScrollLeftRef.current = container.scrollLeft;
      targetScrollRef.current = container.scrollLeft;

      const now = performance.now();
      velocityHistoryRef.current = [{ x: e.clientX, time: now }];

      // Tap/click immediately catches any active inertia
      stopAllAnimations();
    };

    const onPointerMove = (e) => {
      if (!isDownRef.current) return;

      const dx = e.clientX - startXRef.current;
      const dy = e.clientY - startYRef.current;

      // Threshold check to distinguish intentional drag from a static click
      if (!isDraggingRef.current) {
        if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
          isDraggingRef.current = true;
          hasDraggedRef.current = true;
          try {
            container.setPointerCapture(e.pointerId);
          } catch {
            // ignore if pointer capture fails
          }
          container.classList.add("cursor-grabbing");
          container.classList.remove("cursor-grab");
        } else if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          // Vertical movement detected; relinquish control so page vertical scroll proceeds
          isDownRef.current = false;
          return;
        }
      }

      if (isDraggingRef.current) {
        const now = performance.now();
        velocityHistoryRef.current.push({ x: e.clientX, time: now });
        velocityHistoryRef.current = velocityHistoryRef.current.filter(
          (p) => now - p.time < 100
        );

        const max = container.scrollWidth - container.clientWidth;
        const next = Math.max(0, Math.min(max, startScrollLeftRef.current - dx));
        container.scrollLeft = next;
        targetScrollRef.current = next;
      }
    };

    const onPointerUp = (e) => {
      if (!isDownRef.current) return;
      isDownRef.current = false;

      try {
        container.releasePointerCapture(e.pointerId);
      } catch {
        // ignore capture error if pointer was already released
      }

      container.classList.remove("cursor-grabbing");
      container.classList.add("cursor-grab");

      if (isDraggingRef.current) {
        isDraggingRef.current = false;

        const max = container.scrollWidth - container.clientWidth;
        const now = performance.now();
        const history = velocityHistoryRef.current.filter((p) => now - p.time < 100);

        if (history.length >= 2) {
          const oldest = history[0];
          const newest = history[history.length - 1];
          const dt = newest.time - oldest.time;
          const dx = newest.x - oldest.x;

          if (dt > 10 && Math.abs(dx) > 5) {
            // Velocity in px/ms: dragging left (dx < 0) requires scrolling right (velocity > 0)
            let velocity = -(dx / dt);

            // Cap maximum launch velocity for smooth control
            velocity = Math.max(-3.2, Math.min(3.2, velocity));

            if (Math.abs(velocity) > 0.12) {
              let lastFrameTime = performance.now();
              const friction = 0.0038; // viscous friction factor (per ms)

              const momentumTick = (frameNow) => {
                const deltaMs = Math.min(32, frameNow - lastFrameTime);
                lastFrameTime = frameNow;

                // Exponential velocity decay
                velocity *= Math.exp(-friction * deltaMs);

                if (Math.abs(velocity) > 0.02) {
                  const curr = container.scrollLeft;
                  const next = curr + velocity * deltaMs;
                  const clamped = Math.max(0, Math.min(max, next));

                  container.scrollLeft = clamped;
                  targetScrollRef.current = clamped;

                  if (clamped > 0 && clamped < max) {
                    momentumRafRef.current = requestAnimationFrame(momentumTick);
                  } else {
                    momentumRafRef.current = null;
                  }
                } else {
                  momentumRafRef.current = null;
                }
              };

              momentumRafRef.current = requestAnimationFrame(momentumTick);
            }
          }
        }
      }
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      stopAllAnimations();
    };
  }, [axis, isFinePointer]);

  // Click capture to prevent activating cards/buttons when dragging
  const handleClickCapture = (e) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      // Clear flag on next frame
      requestAnimationFrame(() => {
        hasDraggedRef.current = false;
      });
    }
  };

  // Horizontal container (e.g. Experience Timeline)
  if (axis === "x") {
    return (
      <div
        ref={domRef}
        className={cn(
          className,
          "overflow-x-auto overflow-y-hidden",
          isFinePointer && "cursor-grab select-none active:cursor-grabbing",
        )}
        data-nested-scroll="x"
        onClickCapture={handleClickCapture}
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          overscrollBehaviorY: "auto",
          touchAction: isFinePointer ? "pan-y" : "pan-x pan-y",
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Vertical container (e.g. Sidebar navigation)
  return (
    <ReactLenis
      ref={ref}
      className={className}
      data-nested-scroll="y"
      data-lenis-prevent-vertical="true"
      options={{
        ...nestedScrollOptions,
        orientation: "vertical",
        gestureOrientation: "vertical",
      }}
      {...props}
    >
      {children}
    </ReactLenis>
  );
});

export default SmoothOverflow;

