import { useMemo, memo } from "react";
import { motion } from "framer-motion";

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateRaindrops(count = 55) {
  const drops = [];
  for (let i = 0; i < count; i++) {
    const left = seededRandom(i * 19 + 3) * 110 - 5; // -5% to 105%
    const height = 12 + seededRandom(i * 31 + 7) * 18; // 12px to 30px
    const duration = 0.55 + seededRandom(i * 47 + 11) * 0.45; // 0.55s to 1s
    const delay = seededRandom(i * 61 + 13) * 2;
    const opacity = 0.4 + seededRandom(i * 73 + 17) * 0.45;

    drops.push({ id: i, left, height, duration, delay, opacity });
  }
  return drops;
}

function generateRipples(count = 7) {
  const ripples = [];
  for (let i = 0; i < count; i++) {
    const left = seededRandom(i * 37 + 5) * 88 + 6; // 6% to 94%
    const duration = 0.8 + seededRandom(i * 53 + 9) * 0.6;
    const delay = seededRandom(i * 79 + 15) * 2;

    ripples.push({ id: i, left, duration, delay });
  }
  return ripples;
}

function Rain({
  condition = "clear",
  isPaused = false,
  prefersReducedMotion = false,
}) {
  const isRain = condition === "rain" || condition === "thunderstorm";

  const drops = useMemo(() => generateRaindrops(52), []);
  const ripples = useMemo(() => generateRipples(6), []);

  if (!isRain) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[4] overflow-hidden"
      aria-hidden="true"
    >
      {/* ─── Falling Streaks (Angled 12deg) ──────────────────────────────── */}
      {drops.map((drop) => (
        <motion.span
          key={drop.id}
          className="absolute w-[1.5px] rounded-full"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(180, 220, 255, 0.4) 30%, rgba(220, 240, 255, 0.9) 100%)",
            opacity: drop.opacity,
            transform: "rotate(14deg)",
          }}
          initial={{ top: "-15%" }}
          animate={
            isPaused || prefersReducedMotion
              ? { top: "50%", opacity: drop.opacity }
              : { top: ["-15%", "108%"] }
          }
          transition={
            isPaused || prefersReducedMotion
              ? {}
              : {
                  repeat: Infinity,
                  duration: drop.duration,
                  delay: drop.delay,
                  ease: "linear",
                }
          }
        />
      ))}

      {/* ─── Bottom Splash Ripples ───────────────────────────────────────── */}
      {!prefersReducedMotion &&
        ripples.map((rip) => (
          <motion.span
            key={rip.id}
            className="absolute bottom-1.5 h-1.5 rounded-full border border-sky-200/50"
            style={{
              left: `${rip.left}%`,
              width: "14px",
            }}
            initial={{ scaleX: 0.2, scaleY: 0.1, opacity: 0 }}
            animate={
              isPaused
                ? { opacity: 0 }
                : {
                    scaleX: [0.2, 1.4, 2],
                    scaleY: [0.1, 0.6, 0.1],
                    opacity: [0, 0.8, 0],
                  }
            }
            transition={
              isPaused
                ? {}
                : {
                    repeat: Infinity,
                    duration: rip.duration,
                    delay: rip.delay,
                    ease: "easeOut",
                  }
            }
          />
        ))}
    </div>
  );
}

export default memo(Rain);
