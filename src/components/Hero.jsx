import { ArrowRight, Cake, MapPin, User } from 'lucide-react'
import { assets, bioLines, profile } from '../data/profile'
import GlassCard from './ui/GlassCard'
import PillButton from './ui/PillButton'
import AvatarFrame from './AvatarFrame'

export function IdentityHeader({ align = 'center' }) {
  return (
    <div className={align === 'left' ? 'text-left' : 'text-center'}>
      <h1 className="font-display text-h1 text-text-primary">{profile.displayName}</h1>
      <p className="mt-space-1 text-body text-text-secondary">{profile.handle}</p>
    </div>
  )
}

export function BioList() {
  return (
    <ul className="mt-space-5 space-y-space-2 text-center">
      {bioLines.map((line) => (
        <li key={line.text} className="flex items-center justify-center gap-space-2 text-body-lg text-text-primary">
          <span aria-hidden>{line.emoji}</span>
          <span>{line.text}</span>
        </li>
      ))}
    </ul>
  )
}

export function MetaRow() {
  return (
    <div className="mt-space-6 flex items-start justify-between gap-space-3 text-caption text-text-secondary">
      <span className="inline-flex min-w-0 items-center gap-space-2">
        <MapPin className="h-space-4 w-space-4 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{profile.location}</span>
      </span>
      <span className="inline-flex min-w-0 items-center gap-space-2">
        <Cake className="h-space-4 w-space-4 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{profile.joinedOn}</span>
      </span>
    </div>
  )
}

function DashboardHero() {
  const lastName = profile.lastName || profile.firstName

  return (
    <GlassCard id="home" className="relative overflow-hidden rounded-xl p-space-8">
      <div className="grid items-center gap-space-6 desktop:grid-cols-hero">
        <div>
          <p className="text-body-lg text-text-secondary">👋 {profile.greeting}</p>
          <h1 className="mt-space-2 font-display text-display text-text-primary">
            {profile.lastName ? (
              <>
                {profile.firstName}{' '}
                <span className="bg-accent-gradient bg-clip-text text-transparent">{profile.lastName}</span>
              </>
            ) : (
              <span className="bg-accent-gradient bg-clip-text text-transparent">{lastName}</span>
            )}
          </h1>
          <p className="mt-space-2 text-h2 text-text-secondary">{profile.role}</p>
          <p className="mt-space-4 max-w-xl text-body text-text-secondary">{profile.description}</p>
          <div className="mt-space-6 flex flex-wrap gap-space-3">
            <PillButton href="#projects">
              View My Work
              <ArrowRight className="h-space-4 w-space-4" strokeWidth={2} />
            </PillButton>
            <PillButton href="#about" variant="ghost">
              <User className="h-space-4 w-space-4" strokeWidth={1.75} />
              About Me
            </PillButton>
          </div>
        </div>
        <img
          src={assets.workstation}
          alt="Developer workstation"
          className="hidden w-full rounded-lg object-cover tablet:block"
        />
      </div>
    </GlassCard>
  )
}

export default function Hero({ variant = 'dashboard' }) {
  if (variant === 'identity') {
    return (
      <div className="relative pt-avatar-lift">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
          <AvatarFrame size="mobile" />
        </div>
        <GlassCard className="rounded-xl px-space-6 pb-space-6 pt-avatar-sink">
          <IdentityHeader />
          <BioList />
          <MetaRow />
        </GlassCard>
      </div>
    )
  }

  return <DashboardHero />
}
