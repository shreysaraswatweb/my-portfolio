import { motion } from "framer-motion";
import { cardEntrance, staggerContainer, hoverLift } from "../lib/motion";

export default function ContentGrid({ items }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-3 gap-space-3"
    >
      {items.map((item) => (
        <motion.button
          type="button"
          key={item.id}
          variants={cardEntrance}
          {...hoverLift}
          className="hover-media aspect-square overflow-hidden rounded-lg"
        >
          <img
            src={item.srcSmall || item.src}
            srcSet={item.srcSmall ? `${item.srcSmall} 200w, ${item.src} 400w` : undefined}
            sizes="(max-width: 640px) 120px, 200px"
            alt={item.alt}
            width={200}
            height={200}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </motion.button>
      ))}
    </motion.div>
  );
}
