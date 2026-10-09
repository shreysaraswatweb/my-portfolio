import { motion } from "framer-motion";
import { hoverLift } from "../../lib/motion";

const variants = {
  gradient: "bg-accent-gradient text-text-fixed-light shadow-card",
  ghost:
    "border border-border-hairline bg-transparent text-text-primary hover:bg-surface-secondary",
  solid: "bg-text-primary text-text-on-accent",
};

export default function PillButton({
  as: Tag = "a",
  variant = "gradient",
  className = "",
  children,
  href,
  target,
  rel,
  ...props
}) {
  const isExternal =
    typeof href === "string" &&
    href !== "#" &&
    !href.startsWith("#") &&
    !href.startsWith("mailto:") &&
    !href.startsWith("tel:");

  const computedTarget = target || (isExternal ? "_blank" : undefined);
  const computedRel =
    rel || (computedTarget === "_blank" ? "noopener noreferrer" : undefined);

  return (
    <motion.div {...hoverLift} className="inline-flex">
      <Tag
        href={href}
        target={computedTarget}
        rel={computedRel}
        className={[
          "inline-flex items-center justify-center gap-space-2 rounded-lg px-space-6 py-space-3 text-body font-medium",
          variants[variant],
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
