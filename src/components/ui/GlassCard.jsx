export default function GlassCard({
  as: Tag = "div",
  className = "",
  elevated = false,
  children,
  ...props
}) {
  return (
    <Tag
      className={[
        elevated ? "bg-surface-elevated" : "bg-surface-card",
        "backdrop-blur-glass border border-border-glass glass-edge",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
