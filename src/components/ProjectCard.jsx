import { useState } from "react";
import { motion } from "framer-motion";
import { projects } from "../data/profile";
import { cardEntrance, staggerContainer, hoverLift } from "../lib/motion";
import GlassCard from "./ui/GlassCard";
import ExternalLinkIcon from "./ui/ExternalLinkIcon";
import Tooltip from "./ui/Tooltip";
import {
  AngularIcon,
  TypeScriptIcon,
  ReactIcon,
  ReduxIcon,
} from "./icons/TechIcons";

const techIconMap = {
  Angular: AngularIcon,
  TypeScript: TypeScriptIcon,
  React: ReactIcon,
  Redux: ReduxIcon,
};

export function ProjectCard({ project }) {
  return (
    <motion.a
      href={project.href}
      {...hoverLift}
      variants={cardEntrance}
      className="hover-media relative min-w-project-card flex-1 overflow-hidden rounded-lg"
    >
      <img
        src={project.image}
        srcSet={project.imageSmall ? `${project.imageSmall} 320w, ${project.image} 640w` : undefined}
        sizes="(max-width: 640px) 280px, 320px"
        alt={`${project.title} — Frontend project by Shrey Saraswat`}
        width={640}
        height={427}
        loading="lazy"
        className="h-project-thumb w-full object-cover"
      />
      <div className="absolute right-space-3 top-space-3">
        <ExternalLinkIcon className="text-text-fixed-light" />
      </div>
      <div className="bg-surface-elevated p-space-4">
        <h3 className="text-body-lg text-text-primary">{project.title}</h3>
        {/* Tech stack icons */}
        {project.techIcons?.length > 0 ? (
          <div className="mt-space-2 flex items-center gap-space-2">
            {project.techIcons.map((tech) => {
              const Icon = techIconMap[tech];
              if (!Icon) return null;
              return (
                <Tooltip key={tech} content={tech} side="top">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border-hairline bg-surface-secondary transition-colors duration-200 hover:border-accent-violet/40">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                </Tooltip>
              );
            })}
          </div>
        ) : (
          <p className="mt-space-1 text-caption text-text-secondary">
            {project.stack}
          </p>
        )}
      </div>
    </motion.a>
  );
}

export default function FeaturedProjects() {
  const [active, setActive] = useState(0);

  return (
    <GlassCard as="section" id="projects" className="rounded-xl p-space-6">
      <div className="mb-space-4 flex items-center justify-between">
        <h2 className="font-display text-h2 text-text-primary">
          Featured Projects
        </h2>
        <a href="#projects" className="hover-link text-caption text-accent-violet">
          View all projects
        </a>
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex gap-space-4 overflow-x-auto pb-space-2 scrollbar-none"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
      <div className="mt-space-4 flex justify-center gap-space-1">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            aria-label={`Show ${project.title}`}
            onClick={() => setActive(index)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center p-1.5"
          >
            <motion.span
              animate={{
                scale: active === index ? 1.15 : 1,
                opacity: active === index ? 1 : 0.4,
              }}
              transition={{ duration: 0.15 }}
              className={[
                "block h-space-2 rounded-full",
                active === index
                  ? "w-space-6 bg-accent-primary"
                  : "w-space-2 bg-text-tertiary",
              ].join(" ")}
            />
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
