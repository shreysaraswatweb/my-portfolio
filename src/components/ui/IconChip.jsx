export default function IconChip({ className = "", children, ...props }) {
  return (
    <span
      className={[
        "inline-flex h-chip w-chip items-center justify-center rounded-md bg-surface-pill text-text-primary",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
