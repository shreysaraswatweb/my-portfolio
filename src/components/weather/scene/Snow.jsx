import { useMemo, memo } from "react";
import { motion } from "framer-motion";

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateSnowflakes(count = 32) {
  const flakes = [];
  for (let i = 0; i < count; i++) {
    const left = seededRandom(i * 23 + 5) * 100;
    const size = 2 + seededRandom(i * 41 + 9) * 3.5; // 2px to 5.5px
    const duration = 2.8 + seededRandom(i * 59 + 13) * 2.5; // 2.8s to 5.3s
    const delay = seededRandom(i * 71 + 17) * 4;
    const sway = 8 + seededRandom(i * 83 + 19) * 12; // 8px to 20px
    const opacity = 0.5 + seededRandom(i * 97 + 23) * 0.45;

    flakes.push({ id: i, left, size, duration, delay, sway, opacity });
  }
  return flakes;
}

function Snow({
  condition = "clear",
  isPaused = false,
  prefersReducedMotion = false,
}) {
  const isSnow = condition === "snow";
  const flakes = useMemo(() => generateSnowflakes(30), []);

  if (!isSnow) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[4] overflow-hidden"
      aria-hidden="true"
    >
      {flakes.map((flake) => (
        <motion.span
          key={flake.id}
          className="absolute rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.85)]"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
          }}
          initial={{ top: "-10%", x: 0 }}
          animate={
            isPaused || prefersReducedMotion
              ? { top: "45%" }
              : {
                  top: ["-10%", "108%"],
                  x: [0, flake.sway, -flake.sway, 0],
                }
          }
          transition={
            isPaused || prefersReducedMotion
              ? {}
              : {
                  top: {
                    repeat: Infinity,
                    duration: flake.duration,
                    delay: flake.delay,
                    ease: "linear",
                  },
                  x: {
                    repeat: Infinity,
                    duration: flake.duration * 0.75,
                    delay: flake.delay,
                    ease: "easeInOut",
                  },
                }
          }
        />
      ))}
    </div>
  );
}

export default memo(Snow);
