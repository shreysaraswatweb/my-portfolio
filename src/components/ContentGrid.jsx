import { motion } from 'framer-motion'
import { cardEntrance, staggerContainer, tileTap } from '../lib/motion'

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
          {...tileTap}
          className="aspect-square overflow-hidden rounded-lg"
        >
          <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
        </motion.button>
      ))}
    </motion.div>
  )
}
