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

  return (
    <Component
      className={[
        elevated ? "bg-surface-elevated" : "bg-surface-card",
        "backdrop-blur-glass border border-border-glass glass-edge",
        className,
      ].join(" ")}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}

