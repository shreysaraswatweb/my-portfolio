import Hero from "../components/Hero";
import StatRow from "../components/StatRow";
import ContactGrid, { QuickLinks } from "../components/ContactGrid";
import FeaturedProjects from "../components/ProjectCard";
import ExperienceTimeline from "../components/ExperienceTimeline";
import SkillsCard from "../components/SkillsCard";
import AchievementCard from "../components/AchievementCard";
import CertificationGrid from "../components/CertificationTile";
import MediaPlayer from "../components/MediaPlayer";

export default function DesktopDashboard() {
  return (
    <div className="mx-auto flex min-h-screen max-w-shell flex-col laptop:flex-row laptop:gap-space-5">
      <div className="min-w-0 flex-1 space-y-space-5 p-space-6">
        <Hero variant="dashboard" />
        <StatRow variant="info" />
        <ContactGrid layout="desktop" />
        <FeaturedProjects />
        <ExperienceTimeline />
        <CertificationGrid />
      </div>
      <aside className="w-full p-space-6 pt-0 laptop:w-rail laptop:p-space-6 laptop:pl-0">
        <div className="grid grid-cols-1 gap-space-4 tablet:grid-cols-2 laptop:grid-cols-1">
          <SkillsCard />
          <QuickLinks />
          <AchievementCard />
          <MediaPlayer />
        </div>
      </aside>
    </div>
  );
}
