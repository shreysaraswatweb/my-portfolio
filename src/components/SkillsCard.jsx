"use client";

import Integrations from "@/registry/eldoraui/integrations";
import { primarySkills, secondarySkills, skillBalance } from "../data/profile";
import GlassCard from "./ui/GlassCard";

export function IntegrationsDemo() {
  return (
    <div className="relative z-10 h-[320px] w-full overflow-hidden rounded-xl border border-border-glass bg-surface-card glass-edge">
      <Integrations />
    </div>
  );
}

export default function SkillsCard() {
  const allSkills = [...primarySkills, ...secondarySkills];

  return (
    <GlassCard as="section" id="skills" className="rounded-xl p-space-6 overflow-hidden">
      <div className="mb-space-4 flex items-center justify-between">
        <h2 className="font-display text-h2 text-text-primary">
          Skills & Tools
        </h2>
        <a
          href="#skills"
          className="hover-link text-caption text-accent-violet font-medium"
          aria-label="View all skills and tools"
        >
          View all
        </a>
      </div>

      {/* Screen-reader accessible skills list for 100% Accessibility & SEO */}
      <div className="sr-only">
        <h3>Primary and Production Skills</h3>
        <ul>
          {allSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Eldora UI Animated Integrations Showcase */}
      <div className="relative my-space-2 rounded-xl overflow-hidden py-space-1">
        <Integrations />
      </div>

      {/* Design vs Development Balance Slider */}
      <div className="mt-space-5">
        <div className="mb-space-2 flex items-center justify-between text-caption">
          <span className="text-accent-primary font-medium">Design</span>
          <span className="text-accent-violet font-medium">Development</span>
        </div>
        <div className="relative h-space-2 rounded-full bg-surface-pill">
          <div className="h-full w-full rounded-full bg-accent-gradient" />
          <span
            className="absolute top-1/2 h-space-4 w-space-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-glass bg-text-primary shadow-card"
            style={{ left: `${skillBalance.design}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </GlassCard>
  );
}
