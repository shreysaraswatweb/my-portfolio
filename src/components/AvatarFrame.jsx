import { motion } from 'framer-motion'
import { assets, profile } from '../data/profile'

const boxMotion = {
  y: [0, -5, 0],
  transition: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
}

const imageMotion = {
  scale: [1.02, 1.05, 1.02],
  transition: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
}

export default function AvatarFrame({
  size = 'mobile',
  showBadge = false,
  compact = false,
  float = true,
  className = '',
}) {
  const box =
    compact
      ? 'h-avatar-compact w-avatar-compact'
      : size === 'desktop'
        ? 'h-avatar-desktop w-avatar-desktop'
        : 'h-avatar-mobile w-avatar-mobile'

  return (
    <div className={['relative', className].join(' ')}>
      <motion.div
        className={[box, 'relative isolate overflow-hidden rounded-xl shadow-avatar'].join(' ')}
        animate={float ? boxMotion : false}
      >
        <img
          src={assets.avatar}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain"
        />
        <motion.img
          src={assets.avatar}
          alt={`${profile.displayName} avatar`}
          className="relative h-full w-full object-contain"
          animate={float ? imageMotion : false}
        />
      </motion.div>
      {showBadge && profile.available ? (
        <span className="absolute -bottom-space-2 left-space-3 inline-flex items-center gap-space-2 rounded-full bg-surface-elevated px-space-3 py-space-1 text-micro text-text-primary shadow-card">
          <span className="h-space-2 w-space-2 rounded-full bg-status-available" />
          Available
        </span>
      ) : null}
    </div>
  )
}
