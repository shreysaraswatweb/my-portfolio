import { Briefcase, CalendarDays, Cake, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { infoStats, socials } from '../data/profile'
import { cardEntrance, staggerContainer, tileTap } from '../lib/motion'
import GlassCard from './ui/GlassCard'
import IconChip from './ui/IconChip'
import { FacebookMark, FigmaMark, GithubMark, InstagramMark } from './icons/BrandIcons'

const infoIcons = {
  calendar: CalendarDays,
  briefcase: Briefcase,
  pin: MapPin,
  cake: Cake,
}

const socialMarks = {
  facebook: FacebookMark,
  github: GithubMark,
  figma: FigmaMark,
  instagram: InstagramMark,
}

function InfoRow() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-space-3 desktop:grid-cols-4"
    >
      {infoStats.map((stat) => {
        const Icon = infoIcons[stat.icon]
        return (
          <motion.div key={stat.id} variants={cardEntrance}>
            <GlassCard className="flex items-center gap-space-3 rounded-lg p-space-4">
              <IconChip>
                <Icon className="h-space-5 w-space-5 text-accent-primary" strokeWidth={1.75} />
              </IconChip>
              <div>
                <p className="text-body font-medium text-text-primary">{stat.value}</p>
                <p className="text-caption text-text-secondary">{stat.label}</p>
              </div>
            </GlassCard>
          </motion.div>
        )
      })}
    </motion.div>
  )
}

function SocialRow() {
  const chips = socials.filter((item) => socialMarks[item.id])

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex justify-center gap-space-5 overflow-x-auto scrollbar-none"
    >
      {chips.map((item) => {
        const Mark = socialMarks[item.id]
        return (
          <motion.a
            key={item.id}
            href={item.href}
            variants={cardEntrance}
            {...tileTap}
            className="flex min-w-chip flex-col items-center gap-space-2"
          >
            <IconChip>
              <Mark className="h-space-6 w-space-6" />
            </IconChip>
            <span className="text-caption font-bold text-text-primary">{item.stat}</span>
          </motion.a>
        )
      })}
    </motion.div>
  )
}

export default function StatRow({ variant = 'info' }) {
  if (variant === 'social') return <SocialRow />
  return <InfoRow />
}
