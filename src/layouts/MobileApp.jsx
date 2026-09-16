import { lazy, Suspense, useMemo, useState } from "react";
import { gallery, profile, videos } from "../data/profile";
import GlassCard from "../components/ui/GlassCard";
import Hero from "../components/Hero";
import StatRow from "../components/StatRow";
import SegmentedTabBar from "../components/SegmentedTabBar";
import ContentGrid from "../components/ContentGrid";
import ContactGrid from "../components/ContactGrid";
import AboutCard from "../components/AboutCard";
import ThemeToggle from "../components/ThemeToggle";

const FeaturedProjects = lazy(() => import("../components/ProjectCard"));
const SkillsCard = lazy(() => import("../components/SkillsCard"));
const AchievementCard = lazy(() => import("../components/AchievementCard"));
const CertificationGrid = lazy(() => import("../components/CertificationTile"));
const ExperienceTimeline = lazy(() => import("../components/ExperienceTimeline"));
const MediaPlayer = lazy(() => import("../components/MediaPlayer"));

export default function MobileApp() {
  const [tab, setTab] = useState("Photos");

  const gridItems = useMemo(() => {
    if (tab === "Videos") return videos;
    return gallery;
  }, [tab]);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip px-space-4 pb-space-12 pt-space-6 tablet:px-space-6">
      <div className="mx-auto w-full max-w-mobile tablet:max-w-2xl min-[768px]:max-w-3xl">
        <div className="mb-space-4 flex justify-end">
          <ThemeToggle compact />
        </div>
        <Hero variant="identity" />

        <section className="mt-space-4">
          <ContactGrid layout="mobile" />
        </section>

        <AboutCard />

        <section className="mt-space-8">
          <GlassCard className="rounded-xl px-space-5 py-space-5">
            <StatRow variant="social" />
            <div className="mt-space-6">
              <SegmentedTabBar value={tab} onChange={setTab} />
            </div>
          </GlassCard>
          <div className="mt-space-4">
            {tab === "All" ? (
              <Suspense fallback={null}>
                <FeaturedProjects />
              </Suspense>
            ) : null}
            {tab === "Photos" ? <ContentGrid items={gridItems} /> : null}
            {tab === "Music" ? (
              <Suspense fallback={null}>
                <MediaPlayer />
              </Suspense>
            ) : null}
            {tab === "Videos" ? <ContentGrid items={gridItems} /> : null}
          </div>
        </section>

        <div className="mt-space-5 space-y-space-4">
          <Suspense fallback={null}>
            {tab !== "All" ? <FeaturedProjects /> : null}
            <SkillsCard />
            <AchievementCard />
            <ExperienceTimeline />
            <CertificationGrid />
          </Suspense>
        </div>

        <footer className="mt-space-8 text-center text-micro text-text-tertiary">
          © {new Date().getFullYear()} {profile.displayName} — {profile.role}
        </footer>
      </div>
    </div>
  );
}
