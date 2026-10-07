import { motion } from "framer-motion";

export default function GlassCard({
  as: Tag = "div",
  className = "",
  elevated = false,
  children,
  whileHover,
  whileTap,
  animate,
  initial,
  exit,
  variants,
  transition,
  whileInView,
  viewport,
  ...props
}) {
  const hasMotion = Boolean(
    whileHover ||
    whileTap ||
    animate ||
    initial ||
    exit ||
    variants ||
    whileInView
  );

  const Component = hasMotion
    ? (typeof Tag === "string" ? motion[Tag] || motion.div : Tag)
    : Tag;

  const motionProps = hasMotion
    ? {
        whileHover,
        whileTap,
        animate,
        initial,
        exit,
        variants,
        transition,
        whileInView,
        viewport,
      }
    : {};

  // Strip transition-all when Framer Motion handles transform (e.g. whileHover / whileTap)
  // to prevent CSS transition engine from fighting JS frame-by-frame updates (causing stutter/two-step glitch)
  const sanitizedClassName = (whileHover || whileTap)
    ? className.replace(/\btransition-all\b/g, "transition-colors")
    : className;

  return (
    <Component
      className={[
        elevated ? "bg-surface-elevated" : "bg-surface-card",
        "backdrop-blur-glass border border-border-glass glass-edge",
        (whileHover || whileTap) ? "transform-gpu will-change-transform" : "",
        sanitizedClassName,
      ].filter(Boolean).join(" ")}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

