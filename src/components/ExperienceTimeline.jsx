import { motion } from 'framer-motion'
import { experience } from '../data/profile'
import { cardEntrance, staggerContainer } from '../lib/motion'
import GlassCard from './ui/GlassCard'

export default function ExperienceTimeline() {
  return (
    <GlassCard id="experience" className="rounded-xl p-space-6">
      <h2 className="mb-space-6 font-display text-h2 text-text-primary">Experience</h2>
      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative space-y-space-5 before:absolute before:bottom-space-2 before:left-space-2 before:top-space-2 before:w-px before:bg-border-hairline"
      >
        {experience.map((item) => (
          <motion.li key={item.id} variants={cardEntrance} className="relative pl-space-8">
            <span className="absolute left-0 top-space-1 h-space-4 w-space-4 rounded-full bg-accent-gradient" />
            <p className="text-caption text-text-tertiary">{item.period}</p>
            <h3 className="mt-space-1 text-body-lg text-text-primary">{item.role}</h3>
            <p className="text-caption text-accent-primary">{item.company}</p>
            <p className="mt-space-2 text-body text-text-secondary">{item.summary}</p>
          </motion.li>
        ))}
      </motion.ol>
    </GlassCard>
  )
}
