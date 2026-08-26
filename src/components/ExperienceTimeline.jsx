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
  },
  {
    date: "text-accent-end",
    node: "bg-accent-end",
    line: "border-accent-end",
    card: "border-accent-end/35",
  },
  {
    date: "text-accent-primary",
    node: "bg-accent-primary",
    line: "border-accent-primary",
    card: "border-accent-primary/35",
  },
  {
    date: "text-accent-primary",
    node: "bg-accent-primary",
    line: "border-accent-primary",
    card: "border-accent-primary/35",
  },
];

const nodeIcons = [Cuboid, Check, Check, Rocket];

const journey = [...experience].reverse();

const CARD_SLOT = 120;
const CARD_CONTENT_COLLAPSED = 39;
const CARD_CONTENT_EXPANDED = 96;
const CARD_HEIGHT_TRANSITION = { duration: 0.45, ease: [0.4, 0, 0.2, 1] };

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
          <p className="break-words text-caption leading-[19.5px] text-text-secondary [overflow-wrap:anywhere]">
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
      className="flex h-space-8 w-[15px] items-center justify-center overflow-visible text-text-tertiary transition-colors duration-200 hover:text-text-primary"
    >
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
    </button>
  );
}

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

      <div className="-mx-space-6 flex items-center">
        <div className="mx-[2px] flex w-[15px] shrink-0 items-center justify-center overflow-visible">
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
          <div className="min-w-[56rem]">
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
                className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-timeline-track"
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
                      "has-[:hover]:z-30 has-[:focus-visible]:z-30",
                    ].join(" ")}
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

        <div className="mx-[2px] flex w-[15px] shrink-0 items-center justify-center overflow-visible">
          {canScroll.right ? (
            <EdgeArrow
              label="Show later roles"
              side="right"
              onClick={() => scrollByPage(1)}
            />
          ) : null}
        </div>
      </div>

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
