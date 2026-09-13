import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarRange,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cuboid,
  Rocket,
} from "lucide-react";
import { motion } from "framer-motion";
import { experience } from "../data/profile";
import { cardEntrance, staggerContainer } from "../lib/motion";
import { easeOutExpo } from "../lib/scroll";
import GlassCard from "./ui/GlassCard";
import IconChip from "./ui/IconChip";
import SmoothOverflow from "./SmoothOverflow";

const tones = [
  {
    date: "text-accent-violet",
    node: "bg-accent-violet",
    line: "border-accent-violet",
    card: "border-accent-violet/35",
    glow: "shadow-[0_0_24px_rgba(139,92,246,0.18)]",
    hex: "#8B5CF6",
  },
  {
    date: "text-accent-end",
    node: "bg-accent-end",
    line: "border-accent-end",
    card: "border-accent-end/35",
    glow: "shadow-[0_0_24px_rgba(168,85,247,0.18)]",
    hex: "#A855F7",
  },
  {
    date: "text-accent-primary",
    node: "bg-accent-primary",
    line: "border-accent-primary",
    card: "border-accent-primary/35",
    glow: "shadow-[0_0_24px_rgba(245,166,35,0.18)]",
    hex: "#F5A623",
  },
  {
    date: "text-accent-primary",
    node: "bg-accent-primary",
    line: "border-accent-primary",
    card: "border-accent-primary/35",
    glow: "shadow-[0_0_24px_rgba(245,166,35,0.18)]",
    hex: "#F5A623",
  },
];

const nodeIcons = [Cuboid, Check, Check, Rocket];

const journey = [...experience].reverse();

/* ─── Desktop constants ────────────────────────────────────────── */
const CARD_SLOT = 120;
const CARD_CONTENT_COLLAPSED = 39;
const CARD_CONTENT_EXPANDED = 96;
const CARD_HEIGHT_TRANSITION = { duration: 0.45, ease: [0.4, 0, 0.2, 1] };

/* ─── Mobile animation variants ────────────────────────────────── */
const mobileEase = [0.16, 1, 0.3, 1];

const mobileNodeVariant = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: mobileEase },
  },
};

const mobileIconSpin = {
  hidden: { rotate: -90, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: mobileEase, delay: 0.15 },
  },
};

const mobileCardLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: mobileEase },
  },
};

const mobileCardRight = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: mobileEase },
  },
};

const mobileTrackGrow = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.6, ease: mobileEase },
  },
};

const mobileStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18 },
  },
};

const MOBILE_DETAIL_TRANSITION = { duration: 0.35, ease: [0.4, 0, 0.2, 1] };

/* ─── Desktop sub-components ───────────────────────────────────── */

function ExperienceDescriptionCard({ blurb, cardClass }) {
  const [active, setActive] = useState(false);

  return (
    <div className="relative w-full" style={{ height: CARD_SLOT }}>
      <button
        type="button"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className={[
          "absolute inset-x-0 top-0 z-10 box-border w-full rounded-lg border bg-surface-secondary px-space-4 py-space-3 text-left shadow-none focus-visible:outline-none",
          cardClass,
        ].join(" ")}
      >
        <motion.div
          initial={false}
          animate={{ height: active ? CARD_CONTENT_EXPANDED : CARD_CONTENT_COLLAPSED }}
          transition={CARD_HEIGHT_TRANSITION}
          className="overflow-hidden"
        >
          <p className="wrap-anywhere text-caption leading-[19.5px] text-text-secondary">
            {blurb}
          </p>
        </motion.div>
      </button>
    </div>
  );
}

function EdgeArrow({ label, onClick, side }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-space-8 w-3.75 items-center justify-center overflow-visible text-text-tertiary transition-colors duration-200 hover:text-text-primary"
    >
      <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
    </button>
  );
}

/* ─── Mobile vertical timeline item ────────────────────────────── */

function MobileTimelineItem({ item, index, total }) {
  const tone = tones[index] ?? tones[0];
  const nextTone = tones[index + 1] ?? tones[0];
  const Icon = nodeIcons[index] ?? Check;
  const isLeft = index % 2 === 0;
  const isLast = index === total - 1;
  const lineGradient = `linear-gradient(180deg, ${tone.hex} 0%, ${nextTone.hex} 100%)`;

  return (
    <motion.li
      variants={mobileStagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="relative grid grid-cols-[1fr_40px_1fr] items-start"
    >
      {/* ── Left column ────────────────────────────────── */}
      <div className={isLeft ? "flex justify-end pr-space-3" : ""}>
        {isLeft && (
          <motion.div variants={mobileCardLeft} className="w-full">
            <MobileCard item={item} tone={tone} align="right" />
          </motion.div>
        )}
      </div>

      {/* ── Center: node + connecting line ─────────────── */}
      <div className="relative flex flex-col items-center self-stretch">
        {/* Connecting line below node */}
        {!isLast && (
          <motion.span
            variants={mobileTrackGrow}
            aria-hidden
            className="absolute left-1/2 top-10 bottom-0 w-[3px] -translate-x-1/2 origin-top rounded-full opacity-50"
            style={{ background: lineGradient }}
          />
        )}

        {/* Node circle with icon motion */}
        <motion.span
          variants={mobileNodeVariant}
          className={[
            "relative z-10 flex h-space-10 w-space-10 shrink-0 items-center justify-center rounded-full text-text-fixed-light",
            tone.node,
            tone.glow,
          ].join(" ")}
        >
          <motion.span variants={mobileIconSpin} className="flex">
            <Icon className="h-space-5 w-space-5" strokeWidth={1.75} />
          </motion.span>
        </motion.span>
      </div>

      {/* ── Right column ───────────────────────────────── */}
      <div className={!isLeft ? "flex justify-start pl-space-3" : ""}>
        {!isLeft && (
          <motion.div variants={mobileCardRight} className="w-full">
            <MobileCard item={item} tone={tone} align="left" />
          </motion.div>
        )}
      </div>
    </motion.li>
  );
}

function MobileCard({ item, tone, align }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      onClick={() => setExpanded((v) => !v)}
      className={[
        "mb-space-5 w-full rounded-lg border bg-surface-secondary px-space-4 py-space-3 text-left transition-shadow duration-motion",
        tone.card,
        align === "right" ? "text-right" : "text-left",
        expanded ? tone.glow : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Date badge */}
      <span
        className={[
          "mb-space-1 inline-block text-micro font-semibold uppercase tracking-wide",
          tone.date,
        ].join(" ")}
      >
        {item.shortDate}
      </span>

      {/* Role */}
      <h3 className="text-caption font-medium leading-tight text-text-primary">
        {item.shortRole || item.role}
      </h3>

      {/* Company */}
      <p className="mt-space-1 text-micro text-text-secondary">{item.company}</p>

      {/* Expandable detail section */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={MOBILE_DETAIL_TRANSITION}
        className="overflow-hidden"
      >
        <p className="mt-space-2 text-micro text-text-tertiary">{item.period}</p>
        <p className="mt-space-1 text-micro leading-relaxed text-text-secondary">
          {item.blurb}
        </p>
      </motion.div>
    </button>
  );
}

/* ─── Main component ───────────────────────────────────────────── */

export default function ExperienceTimeline() {
  const scrollerRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const updateScroll = useCallback(() => {
    const wrapper = scrollerRef.current?.wrapper;
    if (!wrapper) return;
    const max = wrapper.scrollWidth - wrapper.clientWidth;
    setCanScroll({
      left: wrapper.scrollLeft > 8,
      right: max > 8 && wrapper.scrollLeft < max - 8,
    });
  }, []);

  useEffect(() => {
    let cleanup = () => {};
    let frame = 0;

    const bind = () => {
      const wrapper = scrollerRef.current?.wrapper;
      if (!wrapper) {
        frame = requestAnimationFrame(bind);
        return;
      }
      updateScroll();
      wrapper.addEventListener("scroll", updateScroll, { passive: true });
      const observer = new ResizeObserver(updateScroll);
      observer.observe(wrapper);
      cleanup = () => {
        wrapper.removeEventListener("scroll", updateScroll);
        observer.disconnect();
      };
    };

    bind();
    return () => {
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [updateScroll]);

  const scrollByPage = (direction) => {
    const wrapper = scrollerRef.current?.wrapper;
    const lenis = scrollerRef.current?.lenis;
    if (!wrapper) return;

    const distance = direction * Math.min(wrapper.clientWidth * 0.7, 320);
    const start = wrapper.scrollLeft;
    const end = Math.max(
      0,
      Math.min(wrapper.scrollWidth - wrapper.clientWidth, start + distance),
    );

    if (lenis) {
      lenis.scrollTo(end, { duration: 0.85, easing: easeOutExpo });
      return;
    }
    wrapper.scrollTo({ left: end, behavior: "smooth" });
  };

  return (
    <GlassCard id="experience" className="rounded-xl p-space-6">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="mb-space-8 flex items-center justify-between gap-space-4">
        <div className="flex min-w-0 items-center gap-space-3">
          <IconChip className="h-space-10 w-space-10 shrink-0">
            <CalendarRange
              className="h-space-5 w-space-5 text-accent-violet"
              strokeWidth={1.75}
            />
          </IconChip>
          <div className="min-w-0">
            <h2 className="font-display text-h2 text-text-primary">
              Experience Timeline
            </h2>
            <p className="text-caption text-text-secondary">
              My professional journey so far
            </p>
          </div>
        </div>
        <a href="#experience" className="hover-link shrink-0 text-caption text-accent-violet">
          View all
        </a>
      </div>

      {/* ═══════════════════════════════════════════════════
          DESKTOP — horizontal scrollable timeline
          (hidden on mobile, shown from tablet and up)
          ═══════════════════════════════════════════════════ */}
      <div className="hidden tablet:block">
        <div className="-mx-space-6 flex items-center">
          <div className="mx-0.5 flex w-3.75 shrink-0 items-center justify-center overflow-visible">
            {canScroll.left ? (
              <EdgeArrow
                label="Show earlier roles"
                side="left"
                onClick={() => scrollByPage(-1)}
              />
            ) : null}
          </div>

          <SmoothOverflow
            ref={scrollerRef}
            className="min-w-0 flex-1 overflow-x-auto overflow-y-visible pb-space-2 scrollbar-none"
          >
            <div className="min-w-4xl">
              <div className="grid grid-cols-4">
                {journey.map((item, index) => {
                  const tone = tones[index] ?? tones[0];
                  return (
                    <p
                      key={`${item.id}-date`}
                      className={[
                        "h-space-5 text-center text-caption font-medium leading-5",
                        tone.date,
                      ].join(" ")}
                    >
                      {item.shortDate}
                    </p>
                  );
                })}
              </div>

              <div className="relative my-space-3 grid grid-cols-4">
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-1/2 h-0.75 -translate-y-1/2 rounded-full bg-timeline-track"
                />
                {journey.map((item, index) => {
                  const tone = tones[index] ?? tones[0];
                  const Icon = nodeIcons[index] ?? Check;

                  return (
                    <div
                      key={`${item.id}-node`}
                      className="relative z-10 flex justify-center"
                    >
                      <span
                        className={[
                          "flex h-space-10 w-space-10 items-center justify-center rounded-full text-text-fixed-light",
                          tone.node,
                        ].join(" ")}
                      >
                        <Icon className="h-space-5 w-space-5" strokeWidth={1.75} />
                      </span>
                    </div>
                  );
                })}
              </div>

              <motion.ol
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative z-10 grid grid-cols-4 overflow-visible"
              >
                {journey.map((item, index) => {
                  const tone = tones[index] ?? tones[0];
                  const last = index === journey.length - 1;

                  return (
                    <motion.li
                      key={item.id}
                      variants={cardEntrance}
                      
                      className={[
                        "relative flex flex-col items-center px-space-3 text-center",
                        last ? "" : "border-r border-dashed border-border-hairline",
                        "has-[:hover,:focus-visible]:z-30",
                      ].filter(Boolean).join(" ")}
                    >
                      <div className="flex h-space-12 w-full items-center justify-center px-space-1">
                        <h3 className="text-center text-caption font-medium leading-tight text-text-primary">
                          {item.shortRole || item.role}
                        </h3>
                      </div>
                      <p
                        title={item.company}
                        className="h-space-8 w-full truncate px-space-1 leading-8 text-caption text-text-secondary"
                      >
                        {item.company}
                      </p>
                      <p className="h-space-5 text-micro text-text-tertiary">
                        {item.period}
                      </p>

                      <span
                        aria-hidden
                        className={[
                          "my-space-3 h-space-6 w-px border-l border-dashed",
                          tone.line,
                        ].join(" ")}
                      />

                      <ExperienceDescriptionCard
                        blurb={item.blurb}
                        cardClass={tone.card}
                      />
                    </motion.li>
                  );
                })}
              </motion.ol>
            </div>
          </SmoothOverflow>

          <div className="mx-0.5 flex w-3.75 shrink-0 items-center justify-center overflow-visible">
            {canScroll.right ? (
              <EdgeArrow
                label="Show later roles"
                side="right"
                onClick={() => scrollByPage(1)}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          MOBILE — vertical alternating timeline
          (shown on mobile only, hidden from tablet and up)
          ═══════════════════════════════════════════════════ */}
      <motion.ol
        variants={mobileStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="relative tablet:hidden"
      >
        {experience.map((item, index) => (
          <MobileTimelineItem
            key={item.id}
            item={item}
            index={index}
            total={experience.length}
          />
        ))}
      </motion.ol>

      {/* ── Footer summary chips ────────────────────────── */}
      <div className="mt-space-6 flex flex-wrap items-center justify-center gap-space-2">
        <span className="inline-flex items-center gap-space-2 rounded-full border border-border-hairline bg-surface-secondary px-space-4 py-space-2 text-caption text-text-secondary">
          <Cuboid className="h-space-4 w-space-4 text-accent-violet" strokeWidth={1.75} />
          ~1.5 years mechanical / automotive
        </span>
        <span className="inline-flex items-center gap-space-2 rounded-full border border-border-hairline bg-surface-secondary px-space-4 py-space-2 text-caption text-text-secondary">
          <Clock className="h-space-4 w-space-4 text-accent-primary" strokeWidth={1.75} />
          ~4.5 years in software
        </span>
      </div>
    </GlassCard>
  );
}
