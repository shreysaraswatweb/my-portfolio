import { lazy, Suspense } from "react";
import Hero from "../components/Hero";
import StatRow from "../components/StatRow";
import AboutCard from "../components/AboutCard";
import ContactGrid, { QuickLinks } from "../components/ContactGrid";
import FeaturedProjects from "../components/ProjectCard";
import SkillsCard from "../components/SkillsCard";
import { profile } from "../data/profile";

const ExperienceTimeline = lazy(() => import("../components/ExperienceTimeline"));
const CertificationGrid = lazy(() => import("../components/CertificationTile"));
const AchievementCard = lazy(() => import("../components/AchievementCard"));
const MediaPlayer = lazy(() => import("../components/MediaPlayer"));

export default function DesktopDashboard() {
  return (
    <div className="mx-auto flex min-h-screen max-w-shell flex-col laptop:flex-row laptop:gap-space-5">
      <div className="min-w-0 flex-1 space-y-space-5 p-space-6">
        <Hero variant="dashboard" />
        <StatRow variant="info" />
        <AboutCard />
        <ContactGrid layout="desktop" />
        <FeaturedProjects />
        <Suspense fallback={null}>
          <ExperienceTimeline />
        </Suspense>
        <Suspense fallback={null}>
          <CertificationGrid />
        </Suspense>
        <footer className="pt-space-6 text-center text-micro text-text-tertiary">
          © {new Date().getFullYear()} {profile.displayName} — {profile.role}
        </footer>
      </div>
      <aside className="w-full p-space-6 pt-0 laptop:w-rail laptop:p-space-6 laptop:pl-0">
        <div className="grid grid-cols-1 gap-space-4 tablet:grid-cols-2 laptop:grid-cols-1">
          <SkillsCard />
          <QuickLinks />
          <Suspense fallback={null}>
            <AchievementCard />
          </Suspense>
          <Suspense fallback={null}>
            <MediaPlayer />
          </Suspense>
        </div>
      </aside>
    </div>
  );
}
