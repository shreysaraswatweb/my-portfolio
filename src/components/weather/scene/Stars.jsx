import { useMemo, memo } from "react";
import { motion } from "framer-motion";

/**
 * Deterministic pseudo-random generator so star positions stay static across renders.
 */
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateStars(count = 50) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const x = seededRandom(i * 13 + 1) * 96 + 2; // 2% to 98%
    const y = seededRandom(i * 29 + 7) * 75 + 3; // 3% to 78% (mostly upper sky)
    const size = seededRandom(i * 47 + 3) > 0.8 ? 2 : seededRandom(i * 47 + 3) > 0.4 ? 1.5 : 1;
    const baseOpacity = 0.35 + seededRandom(i * 71 + 9) * 0.55;
    const duration = 1.8 + seededRandom(i * 89 + 11) * 2.5;
    const delay = seededRandom(i * 101 + 17) * 3;

    stars.push({ id: i, x, y, size, baseOpacity, duration, delay });
  }
  return stars;
}

function Stars({ phase = "night", condition = "clear", isPaused = false, prefersReducedMotion = false }) {
  const stars = useMemo(() => generateStars(52), []);

  // Compute master visibility and opacity
  const isNight = phase === "night";
  const isTwilight = phase === "dawn" || phase === "evening";
  const isOvercast = condition === "cloudy" || condition === "rain" || condition === "thunderstorm" || condition === "fog";

  if (phase === "day" || (isOvercast && !isNight)) {
    return null;
  }

  let masterOpacity = isNight ? 1 : isTwilight ? 0.35 : 0;
  if (isOvercast) {
    masterOpacity *= 0.15; // Heavily obscured
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[1] transition-opacity duration-1000"
      style={{ opacity: masterOpacity }}
      aria-hidden="true"
    >
      {/* ─── Static / Twinkling Stars ───────────────────────────────────── */}
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-white shadow-[0_0_3px_rgba(255,255,255,0.8)]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          initial={{ opacity: star.baseOpacity }}
          animate={
            isPaused || prefersReducedMotion
              ? { opacity: star.baseOpacity }
              : {
                  opacity: [star.baseOpacity * 0.3, star.baseOpacity, star.baseOpacity * 0.3],
                  scale: [0.85, 1.15, 0.85],
                }
          }
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ─── Occasional Shooting Star on Clear Nights ───────────────────── */}
      {isNight && (condition === "clear" || condition === "partly-cloudy") && !prefersReducedMotion && (
        <motion.div
          className="absolute h-[1.5px] rounded-full pointer-events-none"
          style={{
            width: "55px",
            background: "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(200,230,255,0.4) 60%, transparent 100%)",
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
            transform: "rotate(-32deg)",
          }}
          initial={{ left: "20%", top: "8%", opacity: 0, scaleX: 0 }}
          animate={
            isPaused
              ? { opacity: 0 }
              : {
                  left: ["20%", "75%"],
                  top: ["8%", "45%"],
                  opacity: [0, 1, 1, 0],
                  scaleX: [0, 1, 1, 0.2],
                }
          }
          transition={{
            repeat: Infinity,
            repeatDelay: 9.5,
            duration: 0.9,
            ease: "easeOut",
          }}
        />
      )}
    </div>
  );
}

export default memo(Stars);
