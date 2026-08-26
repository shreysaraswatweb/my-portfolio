import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { tabs } from "../data/profile";

export default function SegmentedTabBar({ value, onChange }) {
  const refs = useRef({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const node = refs.current[value];
    if (!node) return;
    setUnderline({ left: node.offsetLeft, width: node.offsetWidth });
  }, [value]);

  return (
    <div className="relative flex items-center justify-center gap-space-6 pt-space-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          ref={(node) => {
            refs.current[tab] = node;
          }}
          onClick={() => onChange(tab)}
          className={[
            "pb-space-2 text-body",
            value === tab ? "text-text-primary" : "hover-link text-text-secondary",
          ].join(" ")}
        >
          {tab}
        </button>
      ))}
      <motion.span
        className="absolute bottom-0 h-underline rounded-full bg-accent-primary"
        animate={{ left: underline.left, width: underline.width }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
    </div>
  );
}
