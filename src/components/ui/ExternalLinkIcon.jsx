import { ArrowUpRight } from "lucide-react";

export default function ExternalLinkIcon({ className = "" }) {
  return (
    <ArrowUpRight
      className={[
        "h-space-5 w-space-5 text-text-secondary opacity-70",
        className,
      ].join(" ")}
      strokeWidth={1.75}
    />
  );
}
