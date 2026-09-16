import { motion } from "framer-motion";
import { tabs } from "../data/profile";

export default function SegmentedTabBar({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Portfolio sections"
      className="relative flex items-center justify-center gap-space-6 pt-space-2"
    >
      {tabs.map((tab) => {
        const isActive = value === tab;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={[
              "relative pb-space-2 text-body transition-colors",
              isActive ? "text-text-primary font-medium" : "hover-link text-text-secondary",
            ].join(" ")}
          >
            {tab}
            {isActive ? (
              <motion.span
                layoutId="segmentedTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-underline rounded-full bg-accent-primary"
                transition={{ duration: 0.22, ease: "easeOut" }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
