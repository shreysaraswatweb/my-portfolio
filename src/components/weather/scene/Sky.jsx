import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSkyGradient } from "../../../lib/weather";

/**
 * Sky Component:
 * Provides a dynamic, living sky gradient with a smooth 1.8s cross-fade
 * between time-of-day phases and weather conditions.
 */
function Sky({ phase = "day", condition = "clear", isLight = false }) {
  const gradient = getSkyGradient(phase, condition, isLight);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      {/* Fallback persistent base */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{ background: gradient }}
      />

      {/* Cross-fading gradient transition layer */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`${gradient}-${isLight ? "light" : "dark"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ background: gradient }}
        />
      </AnimatePresence>

      {/* Vignette and Inner Glow for Depth (clean luminous in light mode, cosmic deep in dark mode) */}
      <div
        className="absolute inset-0"
        style={{
          background: isLight
            ? "radial-gradient(ellipse at 50% 25%, transparent 60%, rgba(100, 160, 225, 0.12) 100%)"
            : "radial-gradient(ellipse at 50% 30%, transparent 50%, rgba(0, 0, 0, 0.35) 100%)",
        }}
      />

      {/* Glossy Top Glass Horizon Sheen */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none opacity-40"
        style={{
          background: isLight
            ? "linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 45%, transparent 100%)"
            : "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 100%)",
        }}
      />
    </div>
  );
}

export default memo(Sky);
