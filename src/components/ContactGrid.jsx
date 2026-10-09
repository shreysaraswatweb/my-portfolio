import { motion } from "framer-motion";
import { profile, socials } from "../data/profile";
import { cardEntrance, staggerContainer, hoverLift } from "../lib/motion";
import GlassCard from "./ui/GlassCard";
import ExternalLinkIcon from "./ui/ExternalLinkIcon";
import PillButton from "./ui/PillButton";
import {
  Devto3D,
  DevtoMark,
  Github3D,
  GithubMark,
  LinkedIn3D,
  LinkedInMark,
  Mail3D,
  MailMark,
  X3D,
  XMark,
} from "./icons/BrandIcons";

const compactMarks = {
  email: MailMark,
  linkedin: LinkedInMark,
  facebook: LinkedInMark,
  github: GithubMark,
  x: XMark,
  figma: XMark,
  devto: DevtoMark,
};

const bentoMarks = {
  email: Mail3D,
  linkedin: LinkedIn3D,
  facebook: LinkedIn3D,
  github: Github3D,
  x: X3D,
  figma: X3D,
  devto: Devto3D,
};

const bentoSurfaces = {
  email: "bg-email-card",
  linkedin: "bg-linkedin-card",
  facebook: "bg-linkedin-card",
  github: "bg-github-card ring-1 ring-inset ring-border-glass",
  x: "bg-x-card ring-1 ring-inset ring-border-glass",
  figma: "bg-x-card ring-1 ring-inset ring-border-glass",
  devto: "bg-devto-card",
};

const isExternalLink = (url) =>
  typeof url === "string" &&
  url !== "#" &&
  !url.startsWith("#") &&
  !url.startsWith("mailto:") &&
  !url.startsWith("tel:");

function BentoTile({ item, className = "" }) {
  if (!item) return null;
  const Mark = bentoMarks[item.id];
  const isLight = item.variant === "devto";
  const isGithub = item.variant === "github";
  const isExternal = isExternalLink(item.href);

  return (
    <motion.a
      href={item.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      variants={cardEntrance}
      {...hoverLift}
      className={[
        "relative flex min-h-tile min-w-0 min-h-[44px] min-w-[44px] flex-col justify-between rounded-xl p-space-5 shadow-card",
        bentoSurfaces[item.variant] || "bg-surface-card border-border-glass",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-space-3">
        <div className="flex min-w-0 items-center gap-space-3">
          {Mark ? <Mark className="h-icon-3d w-icon-3d shrink-0" /> : null}
          {isGithub && item.action ? (
            <span className="inline-flex rounded-md bg-text-primary px-space-4 py-space-2 text-caption font-medium text-text-on-accent">
              {item.action}
            </span>
          ) : null}
        </div>
        <ExternalLinkIcon
          className={isLight ? "text-text-fixed-dark" : "text-text-fixed-light"}
        />
      </div>
      <div>
        <p
          className={[
            "text-body-lg font-semibold",
            isLight ? "text-text-fixed-dark" : "text-text-fixed-light",
          ].join(" ")}
        >
          {item.label}
        </p>
        <p
          className={[
            "mt-space-1 truncate text-caption",
            isLight ? "text-text-fixed-dark/80" : "text-text-fixed-light/80",
          ].join(" ")}
        >
          {item.handle}
        </p>
      </div>
    </motion.a>
  );
}

function DesktopTile({ item }) {
  if (!item) return null;
  const Mark = compactMarks[item.id];
  const isLight = item.variant === "devto";
  const isExternal = isExternalLink(item.href);

  return (
    <motion.a
      href={item.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      variants={cardEntrance}
      {...hoverLift}
      className={[
        "relative flex min-h-tile min-w-0 min-h-[44px] min-w-[44px] flex-col justify-between rounded-lg p-space-5 shadow-card",
        bentoSurfaces[item.variant] || "bg-surface-card border-border-glass",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        {Mark ? (
          <Mark
            className={
              isLight
                ? "h-space-8 w-space-12"
                : "h-space-10 w-space-10 text-text-fixed-light"
            }
          />
        ) : null}
        <ExternalLinkIcon
          className={isLight ? "text-text-fixed-dark" : "text-text-fixed-light"}
        />
      </div>
      <div className="flex items-end justify-between gap-space-3">
        <div className="min-w-0">
          <p
            className={[
              "text-body-lg",
              isLight ? "text-text-fixed-dark" : "text-text-fixed-light",
            ].join(" ")}
          >
            {item.label}
          </p>
          <p
            className={[
              "truncate text-caption",
              isLight ? "text-text-fixed-dark/80" : "text-text-fixed-light/75",
            ].join(" ")}
          >
            {item.handle}
          </p>
        </div>
        {item.action ? (
          <span className="inline-flex shrink-0 rounded-md bg-text-primary px-space-4 py-space-2 text-caption font-medium text-text-on-accent">
            {item.action}
          </span>
        ) : null}
      </div>
    </motion.a>
  );
}

export default function ContactGrid({ layout = "mobile" }) {
  const email = socials.find((item) => item.id === "email");
  const linkedin = socials.find((item) => item.id === "linkedin");
  const github = socials.find((item) => item.id === "github");
  const x = socials.find((item) => item.id === "x");
  const devto = socials.find((item) => item.id === "devto");

  if (layout === "desktop") {
    return (
      <motion.div
        id="contact"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 gap-space-3 laptop:grid-cols-4"
      >
        {[email, linkedin, github, x].map((item) => (
          <DesktopTile key={item?.id || Math.random()} item={item} />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      id="contact"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-space-3"
    >
      <BentoTile item={email} />
      <BentoTile item={linkedin} />
      <BentoTile item={github} className="col-span-2 min-h-tile-row" />
      <BentoTile item={x} />
      <BentoTile item={devto} />
    </motion.div>
  );
}

export function QuickLinks() {
  const items = socials.filter((item) =>
    ["email", "linkedin", "github", "x"].includes(item.id),
  );
  const devto = socials.find((item) => item.id === "devto");

  return (
    <GlassCard className="rounded-xl p-space-5">
      <h2 className="mb-space-4 font-display text-h2 text-text-primary">
        Quick Links
      </h2>
      <div className="grid grid-cols-2 gap-space-3">
        {items.map((item) => {
          const Mark = compactMarks[item.id];
          const isExternal = isExternalLink(item.href);
          return (
            <a
              key={item.id}
              href={item.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="hover-lift flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-space-2 rounded-lg bg-surface-secondary px-space-3 py-space-4"
            >
              <Mark className="h-space-8 w-space-8 text-text-primary" />
              <span className="text-caption text-text-secondary">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
      <div className="mt-space-3 flex flex-col gap-space-3">
        <a
          href={devto.href}
          target={isExternalLink(devto.href) ? "_blank" : undefined}
          rel={isExternalLink(devto.href) ? "noopener noreferrer" : undefined}
          className="hover-lift flex min-h-[44px] items-center justify-center rounded-lg bg-text-primary py-space-3 text-caption font-bold text-text-on-accent"
        >
          DEV.to
        </a>
        <PillButton href={profile.cvUrl || "#contact"} variant="ghost" className="w-full min-h-[44px]">
          Download CV
        </PillButton>
      </div>
    </GlassCard>
  );
}
