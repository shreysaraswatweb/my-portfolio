import { useMemo, useState } from 'react'
import { gallery, videos } from '../data/profile'
import GlassCard from '../components/ui/GlassCard'
import Hero from '../components/Hero'
import StatRow from '../components/StatRow'
import SegmentedTabBar from '../components/SegmentedTabBar'
import ContentGrid from '../components/ContentGrid'
import ContactGrid from '../components/ContactGrid'
import ExperienceTimeline from '../components/ExperienceTimeline'
import FeaturedProjects from '../components/ProjectCard'
import SkillsCard from '../components/SkillsCard'
import AchievementCard from '../components/AchievementCard'
import CertificationGrid from '../components/CertificationTile'
import MediaPlayer from '../components/MediaPlayer'

export default function MobileApp() {
  const [tab, setTab] = useState('Photos')

  const gridItems = useMemo(() => {
    if (tab === 'Videos') return videos
    return gallery
  }, [tab])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-canvas-glow px-space-4 pb-space-12 pt-space-6">
      <div className="mx-auto w-full max-w-mobile tablet:max-w-app">
        <Hero variant="identity" />

        <section className="mt-space-4">
          <ContactGrid layout="mobile" />
        </section>

        <section className="mt-space-8">
          <GlassCard className="rounded-xl px-space-5 py-space-5">
            <StatRow variant="social" />
            <div className="mt-space-6">
              <SegmentedTabBar value={tab} onChange={setTab} />
            </div>
          </GlassCard>
          <div className="mt-space-4">
            {tab === 'All' ? <FeaturedProjects /> : null}
            {tab === 'Photos' ? <ContentGrid items={gridItems} /> : null}
            {tab === 'Music' ? <MediaPlayer /> : null}
            {tab === 'Videos' ? <ContentGrid items={gridItems} /> : null}
          </div>
        </section>

        <div className="mt-space-5 space-y-space-4">
          {tab !== 'All' ? <FeaturedProjects /> : null}
          <ExperienceTimeline />
          <SkillsCard />
          <AchievementCard />
          <CertificationGrid />
        </div>
      </div>
    </div>
  )
}
