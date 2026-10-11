import { motion } from "framer-motion";
import { profile, socials } from "../data/profile";
import { cardEntrance, staggerContainer, hoverLift } from "../lib/motion";
import { useTheme } from "../theme/ThemeProvider";
import GlassCard from "./ui/GlassCard";
import ExternalLinkIcon from "./ui/ExternalLinkIcon";
import PillButton from "./ui/PillButton";
import {
  Devto3D,
  DevtoMark,
  Github3D,
  GithubMark,
  Gmail3D,
  GmailMark,
  LinkedIn3D,
  LinkedInMark,
  X3D,
  XMark,
} from "./icons/BrandIcons";

const compactMarks = {
  gmail: GmailMark,
  email: GmailMark,
  linkedin: LinkedInMark,
  facebook: LinkedInMark,
  github: GithubMark,
  x: XMark,
  figma: XMark,
  devto: DevtoMark,
};

const bentoMarks = {
  gmail: Gmail3D,
  email: Gmail3D,
  linkedin: LinkedIn3D,
  facebook: LinkedIn3D,
  github: Github3D,
  x: X3D,
  figma: X3D,
  devto: Devto3D,
};

const bentoSurfaces = {
  gmail: "bg-gmail-card",
  email: "bg-gmail-card",
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

const resolveSocialHref = (item) => {
  if (!item) return "#";
  const isGmail = item.id === "gmail" || item.id === "email";
  if (isGmail) {
    if (item.href?.startsWith("mailto:")) {
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${item.href.replace("mailto:", "")}`;
    }
    if (!item.href || item.href === "#") {
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email || "shreysaraswat1998@gmail.com"}`;
    }
  }
  return item.href;
};

function BentoTile({ item, className = "" }) {
  if (!item) return null;
  const Mark = bentoMarks[item.id];
  const isLight = item.variant === "devto";
  const isGithub = item.variant === "github";
  const href = resolveSocialHref(item);
  const isExternal = isExternalLink(href);

  return (
    <motion.a
      href={href}
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
  const Mark = compactMarks[item.id] || compactMarks[item.variant];
  const isLight = item.variant === "devto";
  const isGmail = item.id === "gmail" || item.id === "email";
  const href = resolveSocialHref(item);
  const isExternal = isExternalLink(href);

  return (
    <motion.a
      href={href}
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
        {isGmail ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm p-1.5">
            <Mark className="h-full w-full" />
          </div>
        ) : Mark ? (
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
  const gmail = socials.find((item) => item.id === "gmail" || item.id === "email");
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
        {[linkedin, github, x, gmail].map((item) => (
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
      <BentoTile item={gmail} />
      <BentoTile item={linkedin} />
      <BentoTile item={github} className="col-span-2 min-h-tile-row" />
      <BentoTile item={x} />
      <BentoTile item={devto} />
    </motion.div>
  );
}

const quickLinkCardStyles = {
  dark: {
    linkedin: {
      bg: "bg-gradient-to-br from-[#0077B5] via-[#0A66C2] to-[#004182] text-white shadow-md shadow-[#0A66C2]/30 border border-blue-400/30",
      hover: "hover:shadow-lg hover:shadow-[#0A66C2]/45 hover:border-blue-300/50",
      icon: "text-white drop-shadow-sm",
      label: "text-white",
      badge: "bg-white shadow-sm",
    },
    github: {
      bg: "bg-gradient-to-br from-[#2D333B] via-[#24292E] to-[#161B22] text-white shadow-md shadow-black/50 border border-white/20",
      hover: "hover:shadow-lg hover:shadow-black/70 hover:border-white/35",
      icon: "text-white drop-shadow-sm",
      label: "text-white",
      badge: "bg-white shadow-sm",
    },
    x: {
      bg: "bg-gradient-to-br from-[#22252B] via-[#121418] to-[#000000] text-white shadow-md shadow-black/50 border border-white/20",
      hover: "hover:shadow-lg hover:shadow-black/70 hover:border-white/35",
      icon: "text-white drop-shadow-sm",
      label: "text-white",
      badge: "bg-white shadow-sm",
    },
    gmail: {
      bg: "bg-gradient-to-br from-[#EA4335] via-[#D93025] to-[#B31412] text-white shadow-md shadow-[#EA4335]/30 border border-red-400/30",
      hover: "hover:shadow-lg hover:shadow-[#EA4335]/45 hover:border-red-300/50",
      icon: "text-white drop-shadow-sm",
      label: "text-white",
      badge: "bg-white shadow-sm",
    },
    email: {
      bg: "bg-gradient-to-br from-[#EA4335] via-[#D93025] to-[#B31412] text-white shadow-md shadow-[#EA4335]/30 border border-red-400/30",
      hover: "hover:shadow-lg hover:shadow-[#EA4335]/45 hover:border-red-300/50",
      icon: "text-white drop-shadow-sm",
      label: "text-white",
      badge: "bg-white shadow-sm",
    },
  },
  light: {
    linkedin: {
      bg: "bg-gradient-to-br from-blue-50/90 via-sky-50/70 to-blue-100/60 border border-blue-200/90 shadow-xs shadow-blue-500/10",
      hover: "hover:bg-blue-100/80 hover:border-blue-400/80 hover:shadow-md hover:shadow-blue-500/15",
      icon: "text-[#0A66C2]",
      label: "text-slate-800",
      badge: "bg-white shadow-xs border border-blue-100",
    },
    github: {
      bg: "bg-gradient-to-br from-[#F6F8FA] via-[#F3F4F6] to-[#E5E7EB] border border-slate-300/80 shadow-xs shadow-slate-900/5",
      hover: "hover:bg-slate-200/70 hover:border-slate-400 hover:shadow-md hover:shadow-slate-900/10",
      icon: "text-[#24292E]",
      label: "text-slate-800",
      badge: "bg-white shadow-xs border border-slate-200",
    },
    x: {
      bg: "bg-gradient-to-br from-[#FFFFFF] via-[#F8F9FA] to-[#EDEFF2] border border-neutral-300/80 shadow-xs shadow-black/5",
      hover: "hover:bg-neutral-100/90 hover:border-neutral-400 hover:shadow-md hover:shadow-black/10",
      icon: "text-neutral-900",
      label: "text-neutral-900",
      badge: "bg-white shadow-xs border border-neutral-200",
    },
    gmail: {
      bg: "bg-gradient-to-br from-red-50/90 via-rose-50/70 to-red-100/60 border border-red-200/90 shadow-xs shadow-red-500/10",
      hover: "hover:bg-red-100/80 hover:border-red-400/80 hover:shadow-md hover:shadow-red-500/15",
      icon: "text-[#D93025]",
      label: "text-slate-800",
      badge: "bg-white shadow-xs border border-red-100",
    },
    email: {
      bg: "bg-gradient-to-br from-red-50/90 via-rose-50/70 to-red-100/60 border border-red-200/90 shadow-xs shadow-red-500/10",
      hover: "hover:bg-red-100/80 hover:border-red-400/80 hover:shadow-md hover:shadow-red-500/15",
      icon: "text-[#D93025]",
      label: "text-slate-800",
      badge: "bg-white shadow-xs border border-red-100",
    },
  },
};

export function QuickLinks() {
  const { resolved } = useTheme();
  const isLight = resolved === "light";
  const themeCardStyles = isLight ? quickLinkCardStyles.light : quickLinkCardStyles.dark;

  const desiredOrder = ["linkedin", "github", "x", "gmail"];
  const items = desiredOrder
    .map((id) =>
      socials.find(
        (item) => item.id === id || (id === "gmail" && item.id === "email")
      )
    )
    .filter(Boolean);

  const devto = socials.find((item) => item.id === "devto") || {
    href: profile.devto || "https://dev.to/shreysaraswatweb",
  };

  return (
    <GlassCard className="rounded-xl p-space-5">
      <h2 className="mb-space-4 font-display text-h2 text-text-primary">
        Quick Links
      </h2>
      <div className="grid grid-cols-2 gap-space-3">
        {items.map((item) => {
          const Mark = compactMarks[item.id] || compactMarks[item.variant];
          const href = resolveSocialHref(item);
          const isExternal = isExternalLink(href);
          const style =
            themeCardStyles[item.id] ||
            themeCardStyles[item.variant] || {
              bg: isLight
                ? "bg-white/80 border border-slate-200/80 shadow-xs"
                : "bg-surface-secondary border border-white/10",
              hover: isLight
                ? "hover:bg-white hover:border-slate-300"
                : "hover:bg-surface-pill",
              icon: isLight ? "text-slate-800" : "text-white",
              label: isLight ? "text-slate-800" : "text-white",
              badge: "bg-white shadow-xs",
            };
          const isGmail = item.id === "gmail" || item.id === "email";

          return (
            <a
              key={item.id}
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={[
                "hover-lift flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-space-2 rounded-lg px-space-3 py-space-4 transition-all duration-200",
                style.bg,
                style.hover,
              ].join(" ")}
            >
              <div className="flex h-8 w-8 items-center justify-center">
                {isGmail ? (
                  <div
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-lg p-1",
                      style.badge,
                    ].join(" ")}
                  >
                    <Mark className="h-full w-full" />
                  </div>
                ) : Mark ? (
                  <Mark
                    className={["h-space-8 w-space-8", style.icon].join(" ")}
                  />
                ) : null}
              </div>
              <span
                className={[
                  "text-caption font-semibold tracking-wide",
                  style.label,
                ].join(" ")}
              >
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
          className={[
            "hover-lift flex min-h-[44px] items-center justify-center rounded-lg py-space-3 text-caption font-bold transition-all duration-200",
            isLight
              ? "border border-slate-200/90 bg-white/90 text-slate-800 shadow-xs hover:border-slate-300 hover:bg-white hover:shadow-sm"
              : "bg-white text-neutral-950 shadow-md shadow-black/20 hover:bg-neutral-100",
          ].join(" ")}
        >
          DEV.to
        </a>
        <PillButton
          href={profile.cvUrl || "#contact"}
          variant="ghost"
          className="w-full min-h-[44px]"
        >
          Download Resume
        </PillButton>
      </div>
    </GlassCard>
  );
}
