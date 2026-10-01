import { memo } from "react";
import { motion } from "framer-motion";

function Fog({
  condition = "clear",
  isPaused = false,
  prefersReducedMotion = false,
}) {
  const isFog = condition === "fog";

  if (!isFog) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[4] overflow-hidden opacity-60"
      aria-hidden="true"
    >
      {/* Band 1 - Upper haze */}
      <motion.div
        className="absolute -left-1/3 top-8 w-[170%] h-16 rounded-full blur-xl pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 30%, rgba(200, 220, 240, 0.6) 60%, transparent 100%)",
        }}
        animate={
          isPaused || prefersReducedMotion
            ? { x: 0 }
            : { x: [-40, 40, -40] }
        }
        transition={{
          repeat: Infinity,
          duration: 16,
          ease: "easeInOut",
        }}
      />

      {/* Band 2 - Lower dense mist */}
      <motion.div
        className="absolute -left-1/4 bottom-4 w-[160%] h-20 rounded-full blur-2xl pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(240, 245, 255, 0.55) 40%, rgba(190, 215, 240, 0.7) 70%, transparent 100%)",
        }}
        animate={
          isPaused || prefersReducedMotion
            ? { x: 0 }
            : { x: [30, -30, 30] }
        }
        transition={{
          repeat: Infinity,
          duration: 22,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

export default memo(Fog);
