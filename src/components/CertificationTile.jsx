import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { certifications } from "../data/profile";
import { cardEntrance, staggerContainer, tileTap } from "../lib/motion";
import GlassCard from "./ui/GlassCard";

export function CertificationTile({ cert }) {
  return (
    <motion.article
      variants={cardEntrance}
      {...tileTap}
      className="rounded-lg bg-surface-secondary p-space-4"
    >
      <div className="mb-space-3 flex h-space-10 w-space-10 items-center justify-center rounded-md bg-surface-pill text-accent-primary">
        <Award className="h-space-5 w-space-5" strokeWidth={1.75} />
      </div>
      <h3 className="text-body font-medium text-text-primary">{cert.title}</h3>
      <p className="text-caption text-text-secondary">
        {cert.issuer} · {cert.year}
      </p>
    </motion.article>
  );
}

export default function CertificationGrid() {
  return (
    <GlassCard id="blog" className="rounded-xl p-space-6">
      <h2 className="mb-space-4 font-display text-h2 text-text-primary">
        More projects
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 gap-space-3 tablet:grid-cols-3"
      >
        {certifications.map((cert) => (
          <CertificationTile key={cert.id} cert={cert} />
        ))}
      </motion.div>
    </GlassCard>
  );
}
