import { motion } from "framer-motion";

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
  ...props
}) {
  return (
    <motion.div {...{ whileTap: { scale: 0.97 } }} className="inline-flex">
      <Tag
        className={[
          "inline-flex items-center justify-center gap-space-2 rounded-full px-space-6 py-space-3 text-body font-medium",
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
