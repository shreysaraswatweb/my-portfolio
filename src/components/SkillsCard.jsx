import { skills, skillBalance } from "../data/profile";
import GlassCard from "./ui/GlassCard";

export default function SkillsCard() {
  return (
    <GlassCard id="skills" className="rounded-xl p-space-6">
      <div className="mb-space-4 flex items-center justify-between">
        <h2 className="font-display text-h2 text-text-primary">
          Skills & Tools
        </h2>
        <a href="#skills" className="text-caption text-accent-violet">
          View all
        </a>
      </div>
      <div className="flex flex-wrap gap-space-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-surface-pill px-space-3 py-space-2 text-caption text-text-secondary"
          >
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-space-6">
        <div className="mb-space-2 flex items-center justify-between text-caption">
          <span className="text-accent-primary">Design</span>
          <span className="text-accent-violet">Development</span>
        </div>
        <div className="relative h-space-2 rounded-full bg-surface-pill">
          <div className="h-full w-full rounded-full bg-accent-gradient" />
          <span
            className="absolute top-1/2 h-space-4 w-space-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-glass bg-text-primary shadow-card"
            style={{ left: `${skillBalance.design}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
