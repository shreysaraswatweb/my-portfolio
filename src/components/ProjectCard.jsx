import { useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../data/profile'
import { cardEntrance, staggerContainer, tileTap } from '../lib/motion'
import GlassCard from './ui/GlassCard'
import ExternalLinkIcon from './ui/ExternalLinkIcon'

export function ProjectCard({ project }) {
  return (
    <motion.a
      href={project.href}
      {...tileTap}
      variants={cardEntrance}
      className="relative min-w-project-card flex-1 overflow-hidden rounded-lg"
    >
      <img src={project.image} alt={project.title} className="h-project-thumb w-full object-cover" />
      <div className="absolute right-space-3 top-space-3">
        <ExternalLinkIcon className="text-text-primary" />
      </div>
      <div className="bg-surface-elevated p-space-4">
        <h3 className="text-body-lg text-text-primary">{project.title}</h3>
        <p className="mt-space-1 text-caption text-text-secondary">{project.stack}</p>
      </div>
    </motion.a>
  )
}

export default function FeaturedProjects() {
  const [active, setActive] = useState(0)

  return (
    <GlassCard id="projects" className="rounded-xl p-space-6">
      <div className="mb-space-4 flex items-center justify-between">
        <h2 className="font-display text-h2 text-text-primary">Featured Projects</h2>
        <a href="#projects" className="text-caption text-accent-violet">
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
      <div className="mt-space-4 flex justify-center gap-space-2">
        {projects.map((project, index) => (
          <motion.button
            key={project.id}
            type="button"
            aria-label={`Show ${project.title}`}
            onClick={() => setActive(index)}
            animate={{ scale: active === index ? 1.15 : 1, opacity: active === index ? 1 : 0.4 }}
            transition={{ duration: 0.15 }}
            className={[
              'h-space-2 rounded-full',
              active === index ? 'w-space-6 bg-accent-primary' : 'w-space-2 bg-text-tertiary',
            ].join(' ')}
          />
        ))}
      </div>
    </GlassCard>
  )
}
