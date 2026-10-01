import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Puffy SVG Cloud with volumetric 3D shading, specular top rim, and underbelly ambient shadow.
 */
function SingleCloud({
  width = 110,
  height = 56,
  colors,
  specular = true,
  opacity = 1,
  blur = 0,
}) {
  const { top, mid, bottom, shadow, rim } = colors;

  return (
    <svg
      viewBox="0 0 100 55"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        filter: blur ? `blur(${blur}px)` : undefined,
        opacity,
      }}
      className="drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)] overflow-visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`cloud-body-${top}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="45%" stopColor={mid} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>

        <linearGradient id={`cloud-underbelly-${bottom}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shadow} stopOpacity="0.2" />
          <stop offset="100%" stopColor={shadow} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Main Puffy Cloud Body */}
      <path
        d="M26 44 C18 44, 13 39.5, 13 34 C13 29, 17.5 25, 23 25 C24.2 25, 25.5 25.3, 26.5 25.8 C28.5 18.5, 36 13, 46 13 C55.5 13, 63.5 18.5, 65.5 26.5 C67 25.8, 69 25.5, 71 25.5 C78 25.5, 84 31, 84 38 C84 45, 78 50, 71 50 L27 50 C19.5 50, 14 44.5, 14 39"
        fill={`url(#cloud-body-${top})`}
      />

      {/* Cloud Underbelly Ambient Occlusion */}
      <path
        d="M20 44 Q46 51, 74 44 C71 48, 66 50, 61 50 L27 50 C22 50, 20 47, 20 44 Z"
        fill={`url(#cloud-underbelly-${bottom})`}
      />

      {/* Specular Rim Light Curve on Top Domes */}
      {specular && (
        <>
          <path
            d="M37 16 C40 14.5, 43.5 14, 47 14 C53.5 14, 59.5 17.5, 62.5 23"
            stroke={rim || "#ffffff"}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M68 27 C71 27, 75 29, 77 33"
            stroke={rim || "#ffffff"}
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.75"
          />
        </>
      )}
    </svg>
  );
}

function getCloudColors(phase, condition) {
  const isRain = condition === "rain" || condition === "thunderstorm";

  if (isRain) {
    return {
      top: "#505f75",
      mid: "#394657",
      bottom: "#242d38",
      shadow: "#0f1722",
      rim: "#94a3b8",
    };
  }

  if (phase === "night") {
    return {
      top: "#2a364a",
      mid: "#1b2434",
      bottom: "#111825",
      shadow: "#080c14",
      rim: "#64748b",
    };
  }

  if (phase === "evening") {
    return {
      top: "#fef08a",
      mid: "#fb923c",
      bottom: "#a21caf",
      shadow: "#581c87",
      rim: "#fef9c3",
    };
  }

  if (phase === "dawn") {
    return {
      top: "#fff1f2",
      mid: "#fecdd3",
      bottom: "#f472b6",
      shadow: "#9d174d",
      rim: "#ffffff",
    };
  }

  // Day default
  return {
    top: "#ffffff",
    mid: "#eaf2fb",
    bottom: "#c4ddf5",
    shadow: "#25537e",
    rim: "#ffffff",
  };
}

function Clouds({
  phase = "day",
  condition = "clear",
  parallax = { x: 0, y: 0 },
  isPaused = false,
  prefersReducedMotion = false,
}) {
  const colors = getCloudColors(phase, condition);

  // Cloud count by condition
  let cloudConfigs = [];

  if (condition === "clear") {
    // 0 clouds
    cloudConfigs = [];
  } else if (condition === "partly-cloudy") {
    // 2 clouds: one front right, one subtle back left
    cloudConfigs = [
      { id: "c1", width: 125, height: 64, top: "22%", duration: 28, delay: 0, startX: -140, endX: 380, blur: 0, opacity: 0.95 },
      { id: "c2", width: 85, height: 44, top: "12%", duration: 42, delay: -14, startX: -100, endX: 380, blur: 0.6, opacity: 0.8 },
    ];
  } else {
    // cloudy, rain, storm, fog: 4-5 layered clouds
    cloudConfigs = [
      { id: "c1", width: 135, height: 70, top: "25%", duration: 26, delay: 0, startX: -150, endX: 390, blur: 0, opacity: 0.96 },
      { id: "c2", width: 95, height: 50, top: "14%", duration: 38, delay: -8, startX: -120, endX: 390, blur: 0.5, opacity: 0.88 },
      { id: "c3", width: 115, height: 58, top: "35%", duration: 32, delay: -16, startX: -130, endX: 390, blur: 0, opacity: 0.92 },
      { id: "c4", width: 80, height: 42, top: "8%", duration: 48, delay: -24, startX: -100, endX: 390, blur: 1, opacity: 0.75 },
    ];
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[3] overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {cloudConfigs.map((cfg, idx) => (
          <motion.div
            key={cfg.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: cfg.opacity,
              scale: 1,
              x: prefersReducedMotion || isPaused ? 0 : [cfg.startX, cfg.endX],
            }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.8 } }}
            transition={
              prefersReducedMotion || isPaused
                ? { opacity: { duration: 0.6 } }
                : {
                    x: {
                      repeat: Infinity,
                      duration: cfg.duration,
                      delay: cfg.delay,
                      ease: "linear",
                    },
                    opacity: { duration: 0.6 },
                  }
            }
            className="absolute"
            style={{
              top: cfg.top,
              // Parallax mouse shift
              transform: `translate(${parallax.x * (idx % 2 === 0 ? -16 : -8)}px, ${
                parallax.y * (idx % 2 === 0 ? -8 : -4)
              }px)`,
            }}
          >
            <SingleCloud
              width={cfg.width}
              height={cfg.height}
              colors={colors}
              blur={cfg.blur}
              opacity={cfg.opacity}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default memo(Clouds);
