import { memo } from "react";
import { motion } from "framer-motion";

function Moon({
  phase = "night",
  condition = "clear",
  moonInfo,
  parallax = { x: 0, y: 0 },
  isPaused = false,
  prefersReducedMotion = false,
  isWide = false,
}) {
  if (phase !== "night") return null;

  const isCloudyOrRain =
    condition === "cloudy" ||
    condition === "rain" ||
    condition === "thunderstorm" ||
    condition === "fog";

  const effectiveOpacity = isCloudyOrRain ? 0.35 : 1;
  const isCrescent = moonInfo?.isCrescent ?? true;

  return (
    <motion.div
      className="absolute pointer-events-none select-none z-[2]"
      style={{
        ...(isWide
          ? { left: "35%", top: "13%" }
          : { right: "18%", top: "16%" }),
        opacity: effectiveOpacity,
      }}
      animate={{
        x: parallax.x * -10,
        y: parallax.y * -10,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 25 }}
      aria-hidden="true"
    >
      <motion.div
        className="relative w-16 h-16 flex items-center justify-center"
        animate={
          isPaused || prefersReducedMotion
            ? { y: 0 }
            : { y: [0, -4, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: 4.8,
          ease: "easeInOut",
        }}
      >
        {/* Moon Ambient Cyan-Silver Outer Halo */}
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(175, 215, 255, 0.5) 0%, transparent 70%)",
          }}
        />

        {/* 3D Moon Body */}
        <svg
          viewBox="0 0 48 48"
          className="w-11 h-11 drop-shadow-[0_0_14px_rgba(200,230,255,0.7)]"
        >
          <defs>
            <radialGradient id="moon-sphere-grad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#Dceaf8" />
              <stop offset="100%" stopColor="#8baecf" />
            </radialGradient>

            <linearGradient id="crater-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6e8fae" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#53728f" stopOpacity="0.75" />
            </linearGradient>

            {/* Mask for Crescent shape if not full moon */}
            {isCrescent && (
              <mask id="crescent-mask">
                <rect x="0" y="0" width="48" height="48" fill="white" />
                <circle cx="31" cy="21" r="17" fill="black" />
              </mask>
            )}
          </defs>

          {/* Main Moon Sphere */}
          <circle
            cx="24"
            cy="24"
            r="19"
            fill="url(#moon-sphere-grad)"
            mask={isCrescent ? "url(#crescent-mask)" : undefined}
          />

          {/* Realistic Craters */}
          <g mask={isCrescent ? "url(#crescent-mask)" : undefined}>
            <circle cx="18" cy="18" r="3.2" fill="url(#crater-grad)" />
            <circle cx="19" cy="30" r="4" fill="url(#crater-grad)" />
            <circle cx="28" cy="25" r="2.4" fill="url(#crater-grad)" />
            <circle cx="14" cy="24" r="1.8" fill="url(#crater-grad)" />
          </g>

          {/* Specular Rim Arc */}
          <path
            d="M9 24 A15 15 0 0 1 24 9"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.7"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default memo(Moon);
