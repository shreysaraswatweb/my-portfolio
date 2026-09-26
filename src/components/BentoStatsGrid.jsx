import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  MapPin,
  Sparkles,
} from "lucide-react";
import { profile } from "../data/profile";
import { cardEntrance, hoverLift, staggerContainer } from "../lib/motion";
import GlassCard from "./ui/GlassCard";
import IconChip from "./ui/IconChip";
import ExternalLinkIcon from "./ui/ExternalLinkIcon";
import { GithubMark } from "./icons/BrandIcons";
import {
  AngularIcon,
  ReactIcon,
  ReduxIcon,
  TypeScriptIcon,
} from "./icons/TechIcons";

// Generate deterministic, realistic contribution activity for GitHub calendar
function generateContributionWeeks(totalWeeks = 24) {
  const weeks = [];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday

  let seed = 42;
  function random() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const totalDays = totalWeeks * 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays + (7 - dayOfWeek));

  let totalCommits = 0;

  for (let w = 0; w < totalWeeks; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + w * 7 + d);

      const isFuture = date > today;
      let count = 0;
      let level = 0;

      if (!isFuture) {
        const rand = random();
        const isWeekend = d === 0 || d === 6;

        if (isWeekend) {
          if (rand > 0.65) {
            count = Math.floor(rand * 4) + 1;
            level = count >= 3 ? 2 : 1;
          }
        } else {
          if (rand > 0.15) {
            count = Math.floor(rand * 9) + 1;
            if (count >= 7) level = 4;
            else if (count >= 5) level = 3;
            else if (count >= 3) level = 2;
            else level = 1;
          }
        }
        totalCommits += count;
      }

      days.push({
        date: date.toISOString().split("T")[0],
        count,
        level,
        isFuture,
      });
    }
    weeks.push(days);
  }

  return { weeks, totalCommits };
}

const levelColors = [
  "bg-white/[0.05] dark:bg-white/[0.06] border border-white/[0.04]",
  "bg-emerald-950/70 border border-emerald-800/40 dark:bg-emerald-900/60",
  "bg-emerald-700/80 border border-emerald-600/40 dark:bg-emerald-700/80",
  "bg-emerald-500 border border-emerald-400/50 dark:bg-emerald-500",
  "bg-emerald-400 border border-emerald-300/60 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]",
];

const topSkills = [
  { id: "react", name: "React", Icon: ReactIcon },
  { id: "angular", name: "Angular", Icon: AngularIcon },
  { id: "typescript", name: "TypeScript", Icon: TypeScriptIcon },
  { id: "redux", name: "Redux", Icon: ReduxIcon },
];

export default function BentoStatsGrid() {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const { weeks, totalCommits } = useMemo(() => generateContributionWeeks(24), []);

  return (
    <motion.section
      id="overview-bento"
      aria-label="Overview & Stats"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      className="grid grid-cols-2 laptop:grid-cols-4 gap-space-3 laptop:gap-space-4"
    >
      {/* ─── ROW 1: BOX 1 - WORK EXP ────────────────────────────────────────── */}
      <motion.div variants={cardEntrance} className="col-span-1 flex">
        <GlassCard
          as="a"
          href="#experience"
          {...hoverLift}
          className="group relative flex w-full flex-col justify-between rounded-lg p-space-4 transition-all duration-200 hover:border-accent-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          <div className="flex items-center justify-between">
            <IconChip className="h-space-8 w-space-8 bg-accent-primary/10 text-accent-primary transition-transform duration-200 group-hover:scale-105">
              <Briefcase className="h-space-4 w-space-4" strokeWidth={1.75} />
            </IconChip>
            <span className="rounded-full bg-surface-pill px-space-2 py-0.5 text-micro font-medium uppercase tracking-wider text-text-secondary border border-border-hairline">
              Active
            </span>
          </div>

          <div className="mt-space-3">
            <p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">
              WORK EXP
            </p>
            <p className="mt-0.5 font-display text-body-lg sm:text-h2 font-bold text-text-primary leading-tight">
              ~4.5 Years
            </p>
            <p className="mt-0.5 truncate text-micro text-text-tertiary">
              Software & UI
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* ─── ROW 1: BOX 2 - LOCATION ────────────────────────────────────────── */}
      <motion.div variants={cardEntrance} className="col-span-1 flex">
        <GlassCard
          as="a"
          href="https://maps.google.com/?q=Gurugram,India"
          target="_blank"
          rel="noopener noreferrer"
          {...hoverLift}
          className="group relative flex w-full flex-col justify-between rounded-lg p-space-4 transition-all duration-200 hover:border-accent-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          <div className="flex items-center justify-between">
            <IconChip className="h-space-8 w-space-8 bg-accent-primary/10 text-accent-primary transition-transform duration-200 group-hover:scale-105">
              <MapPin className="h-space-4 w-space-4" strokeWidth={1.75} />
            </IconChip>
            <span className="inline-flex items-center gap-1 rounded-full bg-status-available/10 px-space-2 py-0.5 text-micro font-medium text-status-available border border-status-available/20">
              <span className="h-1.5 w-1.5 rounded-full bg-status-available animate-pulse" />
              IST
            </span>
          </div>

          <div className="mt-space-3">
            <p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">
              LOCATION
            </p>
            <p className="mt-0.5 font-display text-body-lg sm:text-h2 font-bold text-text-primary leading-tight">
              Gurugram
            </p>
            <p className="mt-0.5 truncate text-micro text-text-tertiary">
              India · GMT+5:30
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* ─── ROW 1: BOX 3 - GIT CALENDER (Spans 2 columns on all viewports) ─── */}
      <motion.div
        variants={cardEntrance}
        className="col-span-2 laptop:col-span-2 flex"
      >
        <GlassCard
          as="a"
          href="https://github.com/shreysaraswatweb"
          target="_blank"
          rel="noopener noreferrer"
          {...hoverLift}
          className="group relative flex w-full flex-col justify-between rounded-lg p-space-4 transition-all duration-200 hover:border-emerald-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-space-2">
            <div className="flex items-center gap-space-2.5">
              <IconChip className="h-space-8 w-space-8 bg-white/5 text-text-primary transition-transform duration-200 group-hover:scale-105">
                <GithubMark className="h-space-4 w-space-4 text-text-primary" />
              </IconChip>
              <div>
                <p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">
                  GIT CALENDER
                </p>
                <p className="text-caption sm:text-body font-bold text-text-primary leading-tight">
                  Contributions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-space-2 py-0.5 text-micro font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {totalCommits}+ Commits
              </span>
              <ExternalLinkIcon className="h-space-3 w-space-3 text-text-tertiary transition-colors duration-200 group-hover:text-text-primary" />
            </div>
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="mt-space-3 overflow-x-auto scrollbar-none pb-0.5 touch-pan-x" data-nested-scroll="x">
            <div className="inline-flex flex-col gap-1 min-w-full">
              <div className="flex gap-[3px] items-center">
                {weeks.map((week, wIndex) => (
                  <div key={wIndex} className="flex flex-col gap-[3px]">
                    {week.map((day, dIndex) => (
                      <div
                        key={dIndex}
                        onMouseEnter={() =>
                          !day.isFuture &&
                          setActiveTooltip(`${day.count} commits on ${day.date}`)
                        }
                        onMouseLeave={() => setActiveTooltip(null)}
                        title={
                          day.isFuture
                            ? undefined
                            : `${day.count} commits on ${day.date}`
                        }
                        className={[
                          "h-[9px] w-[9px] sm:h-[10px] sm:w-[10px] rounded-[2px] transition-transform duration-150 hover:scale-125 cursor-pointer",
                          day.isFuture
                            ? "bg-transparent opacity-0 pointer-events-none"
                            : levelColors[day.level],
                        ].join(" ")}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Legend & Tooltip status line */}
              <div className="mt-space-2 flex items-center justify-between text-micro text-text-tertiary">
                <span className="truncate pr-space-2">
                  {activeTooltip || "github.com/shreysaraswatweb"}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px]">Less</span>
                  <span className="h-[7px] w-[7px] rounded-[1px] bg-white/[0.06] border border-white/[0.04]" />
                  <span className="h-[7px] w-[7px] rounded-[1px] bg-emerald-950/70" />
                  <span className="h-[7px] w-[7px] rounded-[1px] bg-emerald-700/80" />
                  <span className="h-[7px] w-[7px] rounded-[1px] bg-emerald-500" />
                  <span className="h-[7px] w-[7px] rounded-[1px] bg-emerald-400" />
                  <span className="text-[10px]">More</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ─── ROW 2: BOX 4 - Project Analysis ─────────────────────────────────── */}
      <motion.div variants={cardEntrance} className="col-span-1 flex">
        <GlassCard
          as="a"
          href="#projects"
          {...hoverLift}
          className="group relative flex w-full flex-col justify-between rounded-lg p-space-4 transition-all duration-200 hover:border-accent-violet/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
        >
          <div className="flex items-center justify-between">
            <IconChip className="h-space-8 w-space-8 bg-accent-violet/10 text-accent-violet transition-transform duration-200 group-hover:scale-105">
              <FolderKanban className="h-space-4 w-space-4" strokeWidth={1.75} />
            </IconChip>
            <ExternalLinkIcon className="h-space-3 w-space-3 text-text-tertiary transition-colors duration-200 group-hover:text-text-primary" />
          </div>

          <div className="mt-space-3">
            <p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">
              Project Analysis
            </p>
            <p className="mt-0.5 font-display text-body-lg sm:text-h2 font-bold text-text-primary leading-tight">
              15+ Built
            </p>
            <p className="mt-0.5 truncate text-micro text-text-tertiary">
              Telecom · Fintech · Web3
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* ─── ROW 2: BOX 5 - EDUCATION ────────────────────────────────────────── */}
      <motion.div variants={cardEntrance} className="col-span-1 flex">
        <GlassCard
          as="a"
          href="#experience"
          {...hoverLift}
          className="group relative flex w-full flex-col justify-between rounded-lg p-space-4 transition-all duration-200 hover:border-accent-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
        >
          <div className="flex items-center justify-between">
            <IconChip className="h-space-8 w-space-8 bg-accent-primary/10 text-accent-primary transition-transform duration-200 group-hover:scale-105">
              <GraduationCap className="h-space-4 w-space-4" strokeWidth={1.75} />
            </IconChip>
            <span className="rounded-full bg-surface-pill px-space-2 py-0.5 text-micro font-medium uppercase tracking-wider text-text-secondary border border-border-hairline">
              B.Tech
            </span>
          </div>

          <div className="mt-space-3">
            <p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">
              EDUCATION
            </p>
            <p className="mt-0.5 font-display text-body-lg sm:text-h2 font-bold text-text-primary leading-tight">
              GLA Univ.
            </p>
            <p className="mt-0.5 truncate text-micro text-text-tertiary">
              Mechanical Eng. (2015–19)
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* ─── ROW 2: BOX 6 - TOPSKILLS (Spans 2 columns on all viewports) ────── */}
      <motion.div
        variants={cardEntrance}
        className="col-span-2 laptop:col-span-2 flex"
      >
        <GlassCard
          className="relative flex w-full flex-col justify-between rounded-lg p-space-4 transition-all duration-200 hover:border-accent-violet/40"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-2.5">
              <IconChip className="h-space-8 w-space-8 bg-accent-violet/10 text-accent-violet">
                <Sparkles className="h-space-4 w-space-4" strokeWidth={1.75} />
              </IconChip>
              <div>
                <p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">
                  TOPSKILLS
                </p>
                <p className="text-caption sm:text-body font-bold text-text-primary leading-tight">
                  Core Frameworks & Tools
                </p>
              </div>
            </div>

            <a
              href="#skills"
              className="hover-link inline-flex items-center gap-1 text-micro font-semibold text-accent-violet"
            >
              View all →
            </a>
          </div>

          {/* 4 Icon Boxes (icon1, icon2, icon3, icon4) */}
          <div className="mt-space-3 grid grid-cols-4 gap-space-2 sm:gap-space-3">
            {topSkills.map(({ id, name, Icon }) => (
              <div
                key={id}
                className="group/skill relative flex flex-col items-center justify-center rounded-md border border-border-hairline bg-surface-secondary/70 p-space-2 transition-all duration-200 hover:-translate-y-1 hover:border-accent-violet/50 hover:bg-surface-pill hover:shadow-card cursor-default"
              >
                <Icon className="h-space-5 w-space-5 sm:h-space-6 sm:w-space-6 transition-transform duration-200 group-hover/skill:scale-110" />
                <span className="mt-1 truncate text-micro font-medium text-text-secondary group-hover/skill:text-text-primary">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.section>
  );
}
