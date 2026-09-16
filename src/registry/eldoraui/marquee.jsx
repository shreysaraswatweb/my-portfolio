import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = "24s",
  style,
  ...props
}) {
  const containerRef = useRef(null);
  const currentRateRef = useRef(1);
  const targetRateRef = useRef(1);
  const lastTimeRef = useRef(0);
  const rafIdRef = useRef(null);

  const updateAnimationsRef = useRef(null);

  // Smooth playbackRate deceleration/acceleration engine via WAAPI
  const updateAnimations = useCallback(() => {
    if (!containerRef.current) return;

    const now = performance.now();
    const dt = lastTimeRef.current > 0 ? Math.min((now - lastTimeRef.current) / 1000, 0.1) : 0.016;
    lastTimeRef.current = now;

    const current = currentRateRef.current;
    const target = targetRateRef.current;
    const delta = target - current;

    // Time constant tau: 0.085s for smooth braking (~280ms stop), 0.12s for acceleration (~350ms start)
    const tau = target === 0 ? 0.085 : 0.12;
    const factor = 1 - Math.exp(-dt / tau);

    let nextRate = current + delta * factor;

    // Snap to target if within precision threshold
    if (Math.abs(target - nextRate) < 0.005) {
      nextRate = target;
    }

    currentRateRef.current = nextRate;

    // Apply smooth rate to CSS animations on all marquee tracks in this line
    const tracks = containerRef.current.querySelectorAll(
      ".animate-marquee, .animate-marquee-reverse, .animate-marquee-vertical"
    );

    tracks.forEach((track) => {
      if (typeof track.getAnimations === "function") {
        const anims = track.getAnimations();
        for (let i = 0; i < anims.length; i++) {
          anims[i].playbackRate = nextRate;
        }
      } else {
        // Fallback for older browsers
        track.style.animationPlayState = nextRate === 0 ? "paused" : "running";
      }
    });

    if (nextRate !== target) {
      rafIdRef.current = requestAnimationFrame(() => {
        updateAnimationsRef.current?.();
      });
    } else {
      rafIdRef.current = null;
      lastTimeRef.current = 0;
    }
  }, []);

  useEffect(() => {
    updateAnimationsRef.current = updateAnimations;
  }, [updateAnimations]);

  const setTargetRate = useCallback(
    (rate) => {
      targetRateRef.current = rate;
      if (rafIdRef.current === null) {
        lastTimeRef.current = performance.now();
        rafIdRef.current = requestAnimationFrame(updateAnimations);
      }
    },
    [updateAnimations]
  );

  const handlePointerEnter = useCallback(() => {
    if (pauseOnHover) {
      setTargetRate(0);
    }
  }, [pauseOnHover, setTargetRate]);

  const handlePointerLeave = useCallback(() => {
    if (pauseOnHover) {
      setTargetRate(1);
    }
  }, [pauseOnHover, setTargetRate]);

  const handleFocus = useCallback(() => {
    if (pauseOnHover) {
      setTargetRate(0);
    }
  }, [pauseOnHover, setTargetRate]);

  const handleBlur = useCallback(
    (e) => {
      if (
        pauseOnHover &&
        containerRef.current &&
        !containerRef.current.contains(e.relatedTarget)
      ) {
        setTargetRate(1);
      }
    },
    [pauseOnHover, setTargetRate]
  );

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
      style={{
        "--duration": duration,
        "--gap": "0.75rem",
        ...style,
      }}
      className={cn(
        "marquee-row group flex [gap:var(--gap)] overflow-hidden p-1",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-around [gap:var(--gap)]",
              reverse ? "animate-marquee-reverse" : "animate-marquee",
              vertical ? "animate-marquee-vertical flex-col" : "flex-row"
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

export default Marquee;
