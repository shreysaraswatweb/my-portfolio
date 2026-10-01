import { memo } from "react";
import { motion } from "framer-motion";

function Sun({
  phase = "day",
  condition = "clear",
  sunPosition,
  parallax = { x: 0, y: 0 },
  isPaused = false,
  prefersReducedMotion = false,
}) {
  if (phase === "night") return null;

  // Position and appearance based on real calculation
  const pos = sunPosition || {
    x: 74,
    y: 22,
    opacity: 1,
    scale: 1,
    color: "#ffc837",
  };

  const isCloudyOrRain =
    condition === "cloudy" ||
    condition === "rain" ||
    condition === "thunderstorm" ||
    condition === "fog";

  // Dim sun under thick clouds / rain
  const effectiveOpacity = isCloudyOrRain
    ? pos.opacity * 0.28
    : pos.opacity;

  const isDawn = phase === "dawn";
  const isEvening = phase === "evening";

  // Primary palette tints
  const coreGradStart = isDawn ? "#fff0f0" : isEvening ? "#fff2d6" : "#ffffff";
  const coreGradMid = isDawn ? "#fca5a5" : isEvening ? "#fb923c" : "#fde047";
  const coreGradEnd = isDawn ? "#f43f5e" : isEvening ? "#ea580c" : "#eab308";
  const haloColor = isDawn ? "rgba(251, 113, 133, 0.45)" : isEvening ? "rgba(249, 115, 22, 0.55)" : "rgba(250, 204, 21, 0.5)";

  return (
    <motion.div
      className="absolute pointer-events-none select-none z-[2]"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        opacity: effectiveOpacity,
      }}
      animate={{
        x: parallax.x * -12,
        y: parallax.y * -12,
        scale: pos.scale,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 25 }}
      aria-hidden="true"
    >
      <div className="-translate-x-1/2 -translate-y-1/2 relative w-20 h-20 flex items-center justify-center">
        {/* Outer Radiant Glow / Bloom */}
        <motion.div
          className="absolute inset-0 rounded-full blur-lg"
          style={{
            background: `radial-gradient(circle, ${haloColor} 0%, transparent 72%)`,
          }}
          animate={
            isPaused || prefersReducedMotion
              ? { scale: 1, opacity: 0.8 }
              : {
                  scale: [0.95, 1.12, 0.95],
                  opacity: [0.75, 1, 0.75],
                }
          }
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut",
          }}
        />

        {/* Soft Ray Halo (Rotating) */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-1"
            animate={isPaused ? { rotate: 0 } : { rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 35,
              ease: "linear",
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
              <defs>
                <radialGradient id="ray-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor={coreGradMid} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={coreGradEnd} stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* 12 Radiant Petal Rays */}
              {[...Array(12)].map((_, i) => (
                <rect
                  key={i}
                  x="48"
                  y="10"
                  width="4"
                  height="16"
                  rx="2"
                  fill="url(#ray-grad)"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
            </svg>
          </motion.div>
        )}

        {/* Glossy 3D Sun Sphere */}
        <div
          className="relative w-9 h-9 rounded-full shadow-[0_0_18px_rgba(255,200,60,0.65)]"
          style={{
            background: `radial-gradient(circle at 35% 32%, ${coreGradStart} 0%, ${coreGradMid} 42%, ${coreGradEnd} 100%)`,
          }}
        >
          {/* Top Specular Glint Reflection */}
          <div
            className="absolute top-1 left-1.5 w-3 h-1.5 rounded-full rotate-[-25deg] opacity-75"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.1) 100%)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default memo(Sun);
