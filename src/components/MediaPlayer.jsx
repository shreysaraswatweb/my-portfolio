import { useState } from 'react'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import { tracks } from '../data/profile'
import GlassCard from './ui/GlassCard'

export default function MediaPlayer() {
  const [playing, setPlaying] = useState(true)
  const current = tracks[0]

  return (
    <GlassCard className="rounded-xl p-space-5">
      <div className="mb-space-4 flex items-center justify-between">
        <h2 className="font-display text-h2 text-text-primary">My Vibes</h2>
        <span className="text-caption text-accent-violet">View all</span>
      </div>
      <div className="grid gap-space-4 desktop:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <img src={current.cover} alt={current.title} className="mb-space-3 aspect-square w-full rounded-lg object-cover" />
          <p className="text-body-lg text-text-primary">{current.title}</p>
          <p className="text-caption text-text-secondary">{current.artist}</p>
          <span className="mt-space-2 inline-flex rounded-full bg-status-playing/20 px-space-3 py-space-1 text-micro text-status-playing">
            Playing now
          </span>
        </div>
        <ul className="space-y-space-3">
          {tracks.map((track) => (
            <li key={track.id} className="flex items-center gap-space-3">
              <img src={track.cover} alt="" className="h-space-10 w-space-10 rounded-sm object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption text-text-primary">{track.title}</p>
                <p className="truncate text-micro text-text-secondary">{track.artist}</p>
              </div>
              <span className="text-micro text-text-tertiary">{track.duration}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-space-5">
        <div className="mb-space-3 h-space-1 overflow-hidden rounded-full bg-surface-pill">
          <div className="h-full w-1/3 rounded-full bg-accent-violet" />
        </div>
        <div className="flex items-center justify-center gap-space-6 text-text-primary">
          <SkipBack className="h-space-5 w-space-5" strokeWidth={1.75} />
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="flex h-space-10 w-space-10 items-center justify-center rounded-full bg-text-primary text-text-on-accent"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause className="h-space-5 w-space-5" /> : <Play className="h-space-5 w-space-5" />}
          </button>
          <SkipForward className="h-space-5 w-space-5" strokeWidth={1.75} />
        </div>
      </div>
    </GlassCard>
  )
}
