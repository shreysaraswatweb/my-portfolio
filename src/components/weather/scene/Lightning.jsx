import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Lightning({
  condition = "clear",
  isPaused = false,
  prefersReducedMotion = false,
}) {
  const isThunder = condition === "thunderstorm";
  const [isFlashing, setIsFlashing] = useState(false);
  const [boltX, setBoltX] = useState(50);

  useEffect(() => {
    if (!isThunder || isPaused || prefersReducedMotion) {
      setIsFlashing(false);
      return;
    }

    let timeoutId;
    const triggerFlash = () => {
      // Pick random X position for bolt (30% to 70%)
      setBoltX(30 + Math.random() * 40);
      setIsFlashing(true);

      // Flash sequence lasts ~450ms (double flicker)
      setTimeout(() => {
        setIsFlashing(false);
      }, 450);

      // Next lightning in 5 to 9 seconds
      const nextDelay = 5000 + Math.random() * 4000;
      timeoutId = setTimeout(triggerFlash, nextDelay);
    };

    const initialDelay = 1500 + Math.random() * 2500;
    timeoutId = setTimeout(triggerFlash, initialDelay);

    return () => clearTimeout(timeoutId);
  }, [isThunder, isPaused, prefersReducedMotion]);

  if (!isThunder) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[5] overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {isFlashing && (
          <>
            {/* Ambient Whole-Card Screen Flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.75, 0.1, 0.9, 0] }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 bg-indigo-100/40 mix-blend-screen"
            />

            {/* Branching SVG Lightning Bolt */}
            <motion.div
              className="absolute top-10 w-16 h-28 -translate-x-1/2 pointer-events-none"
              style={{ left: `${boltX}%` }}
              initial={{ opacity: 0, scaleY: 0.6 }}
              animate={{
                opacity: [0, 1, 0.3, 1, 0],
                scaleY: [0.6, 1, 1, 1, 0.9],
              }}
              transition={{ duration: 0.42, ease: "easeOut" }}
            >
              <svg
                viewBox="0 0 60 110"
                className="w-full h-full drop-shadow-[0_0_12px_rgba(200,225,255,0.9)]"
                fill="none"
              >
                {/* Main Zig-zag Bolt */}
                <path
                  d="M28 0 L14 42 L26 42 L12 85 L38 52 L24 52 L42 0 Z"
                  fill="#ffffff"
                />
                {/* Core Electric Blue Stroke */}
                <path
                  d="M28 0 L14 42 L26 42 L12 85 L38 52 L24 52 L42 0 Z"
                  stroke="#93c5fd"
                  strokeWidth="1.5"
                />
                {/* Side Tiny Branch */}
                <path
                  d="M20 54 L8 68 M22 62 L32 76"
                  stroke="#bfdbfe"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(Lightning);
