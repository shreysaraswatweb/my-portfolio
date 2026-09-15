import { useEffect, useId, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Marquee } from "@/registry/eldoraui/marquee";

const skillTiles = [
  // Line 1 - Core Frontend
  {
    name: "React JS",
    icon: (
      <svg viewBox="-11.5 -10.23174 23 20.46348" className="size-full" fill="none" aria-hidden="true">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "JavaScript",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M7.5 18.5c0 1.5.8 2.2 2.2 2.2 1.3 0 2.1-.7 2.1-1.9v-6.3h-1.9v6.2c0 .5-.2.8-.7.8s-.6-.3-.6-.8v-3.5H6.7v3.3zm7.4 2.2c2.1 0 3.6-1.1 3.6-2.9 0-1.7-1-2.4-2.7-2.9l-.7-.2c-.9-.3-1.3-.6-1.3-1.1 0-.6.5-1 1.3-1 .8 0 1.4.3 1.8.9l1.3-1c-.7-.9-1.8-1.4-3.1-1.4-2 0-3.3 1.2-3.3 2.7 0 1.6 1 2.4 2.6 2.8l.8.2c1 .3 1.4.7 1.4 1.2 0 .7-.6 1.1-1.5 1.1-1.1 0-1.8-.5-2.3-1.3l-1.3 1.1c.8 1.1 2 1.7 3.4 1.7z" fill="#000000" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M4 8.5h6.5v2H8.3v7H6.2v-7H4v-2zm8.5 7.7c.6.5 1.4.8 2.3.8 1 0 1.6-.4 1.6-1.1 0-.6-.4-.9-1.5-1.3l-.7-.2c-1.7-.6-2.5-1.4-2.5-2.7 0-1.7 1.4-2.9 3.6-2.9 1.4 0 2.4.4 3.1 1.1l-1 1.6c-.6-.5-1.3-.7-2-.7-.9 0-1.5.4-1.5 1 0 .5.4.8 1.4 1.2l.7.3c1.9.7 2.7 1.6 2.7 2.9 0 1.8-1.4 3-3.8 3-1.6 0-2.8-.5-3.6-1.3l1.2-1.6z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "Redux Toolkit",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="none" aria-hidden="true">
        <path d="M14.5 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="#764ABC" />
        <path d="M9.5 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" fill="#764ABC" />
        <path d="M17.8 9.2a3.8 3.8 0 0 0-4.8-.4l-4.5 2.8a3.8 3.8 0 1 0 1.9 3.2c0-.4-.1-.8-.2-1.1l4.5-2.8c.8.6 1.9.8 2.9.2a2.3 2.3 0 0 0 .2-1.9z" fill="#764ABC" opacity="0.8" />
        <circle cx="6.5" cy="15.5" r="2.5" fill="#764ABC" />
      </svg>
    ),
  },
  {
    name: "HTML5",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <path d="M2.5 2l1.7 18.5L12 23l7.8-2.5L21.5 2H2.5z" fill="#E34F26" />
        <path d="M12 3.8v17.4l6.3-2 1.4-15.4H12z" fill="#EF652A" />
        <path d="M12 7.5H7.1l.3 3.3H12v-3.3zm0 5.8H9.3l.2 2.5 2.5.7v-3.2z" fill="#EBEBEB" />
        <path d="M12 7.5v3.3h4.6l-.4 4.5-4.2 1.2v3.3l6.5-1.8.9-10.5H12z" fill="#FFFFFF" />
      </svg>
    ),
  },

  // Line 2 - Modern UI & Architecture
  {
    name: "CSS3",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <path d="M2.5 2l1.7 18.5L12 23l7.8-2.5L21.5 2H2.5z" fill="#1572B6" />
        <path d="M12 3.8v17.4l6.3-2 1.4-15.4H12z" fill="#33A9DC" />
        <path d="M12 7.5H7.1l.3 3.3H12v-3.3zm0 5.8H9.3l.2 2.5 2.5.7v-3.2z" fill="#EBEBEB" />
        <path d="M12 7.5v3.3h4.6l-.4 4.5-4.2 1.2v3.3l6.5-1.8.9-10.5H12z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "Angular",
    icon: (
      <svg viewBox="0 0 250 250" className="size-full" aria-hidden="true">
        <polygon points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2" fill="#DD0031" />
        <polygon points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 203.9,186.3 218.1,63.2" fill="#C3002F" />
        <path d="M125,52.1L66.8,182.6h21.7l11.7-29.2h49.4l11.7,29.2h21.7L125,52.1z M141.6,135.5h-33.1l16.6-41.2L141.6,135.5z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <path d="M12 2l9.5 5.5v11L12 24l-9.5-5.5v-11L12 2z" fill="#339933" />
        <path d="M12 4.2l7.6 4.4v8.8L12 21.8l-7.6-4.4V8.6L12 4.2z" fill="#5FA04E" />
        <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 7.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="#06B6D4" aria-hidden="true">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    ),
  },
  {
    name: "Git",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="#F05032" aria-hidden="true">
        <path d="M21.62 10.59l-8.21-8.21a2.08 2.08 0 0 0-2.95 0L8.52 4.33l3.71 3.71a2.47 2.47 0 0 1 3.12 3.14l3.58 3.58a2.47 2.47 0 1 1-1.48 1.44l-3.34-3.34v4.54a2.48 2.48 0 1 1-2.08 0V12.7a2.47 2.47 0 0 1-1.32-3.24L6.5 7.24 2.38 11.36a2.08 2.08 0 0 0 0 2.95l8.21 8.21a2.08 2.08 0 0 0 2.95 0l8.08-8.08a2.08 2.08 0 0 0 0-2.95z" />
      </svg>
    ),
  },

  // Line 3 - Development, API & Databases
  {
    name: "GitLab",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <path d="M23.6 9.8l-1.3-4.1a.9.9 0 0 0-1.7 0l-1.3 4.1H4.7L3.4 5.7a.9.9 0 0 0-1.7 0L.4 9.8a1.6 1.6 0 0 0 .6 1.8l11 8a.7.7 0 0 0 .8 0l11-8a1.6 1.6 0 0 0 .6-1.8z" fill="#E24329" />
        <path d="M12 19.6L4.7 9.8h14.6L12 19.6z" fill="#E24329" />
        <path d="M12 19.6L4.7 9.8H.4l11.6 9.8z" fill="#FC6D26" />
        <path d="M12 19.6l7.3-9.8h4.3L12 19.6z" fill="#FC6D26" />
        <path d="M.4 9.8L2 4.8a.9.9 0 0 1 1.7 0l1 5H.4z" fill="#FCA326" />
        <path d="M23.6 9.8L22 4.8a.9.9 0 0 0-1.7 0l-1 5h4.3z" fill="#FCA326" />
      </svg>
    ),
  },
  {
    name: "Postman",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#FF6C37" />
        <path d="M16.5 12.8c-.3 0-.6.1-.8.4l-2.4-1.2c.1-.3.1-.6 0-.9l2.4-1.2c.2.3.5.4.8.4.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5c0 .1 0 .3.1.4l-2.4 1.2c-.3-.3-.7-.5-1.1-.5-.8 0-1.5.7-1.5 1.5 0 .1 0 .3.1.4L8.2 12.7c-.2-.2-.5-.3-.7-.3-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5c.3 0 .6-.1.8-.4l2.4 1.2c-.1.3-.1.6 0 .9-1.2.6-2.5 1-4.7 1.2 2.8 1.7 6.4 1.6 9-.3.6-.5 1-1.1 1.3-1.8-.2-.3-.5-.4-.8-.4z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="none" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#336791" />
        <path d="M16.8 9.2c-.3-.8-.9-1.4-1.7-1.7-.8-.3-1.8-.4-2.8-.2-.4.1-.7.2-1.1.4-.4-.8-1-1.3-1.8-1.5-.7-.2-1.5-.1-2.2.3-.6.3-1.1.8-1.3 1.4-.3.6-.3 1.3-.1 2 .2.7.7 1.2 1.3 1.5-.2.6-.1 1.2.2 1.8.3.6.8 1 1.4 1.2v2.8c0 .4.3.7.7.7s.7-.3.7-.7v-2.1c.3.1.7.1 1 .1 1.4 0 2.6-.5 3.5-1.4.9-.9 1.4-2.2 1.3-3.6 0-.4-.1-.7-.2-1.1z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: "MongoDB",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <path d="M12 1.5c-.3 0-.5.2-.6.4C10.1 4.7 6 10.6 6 15c0 3.5 2.5 6.7 6 7.5 3.5-.8 6-4 6-7.5 0-4.4-4.1-10.3-5.4-13.1-.1-.2-.3-.4-.6-.4z" fill="#47A248" />
        <path d="M12 2.2v19.8c3.2-.8 5.4-3.6 5.4-7 0-4-3.6-9.6-4.9-12.2-.1-.2-.3-.4-.5-.6z" fill="#499D4A" />
        <path d="M12 22.5c-.2 0-.3 0-.4-.1-2.8-1.2-4.6-3.8-4.6-6.9 0-3.5 3.2-8.5 4.6-10.7v17.7z" fill="#58B85B" />
      </svg>
    ),
  },
  {
    name: "REST APIs",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="#00A389" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <circle cx="8" cy="14" r="1.5" fill="#00A389" />
        <circle cx="12" cy="12" r="1.5" fill="#00A389" />
        <circle cx="16" cy="14" r="1.5" fill="#00A389" />
        <line x1="9.5" y1="13.5" x2="10.5" y2="12.5" />
        <line x1="13.5" y1="12.5" x2="14.5" y2="13.5" />
      </svg>
    ),
  },

  // Line 4 - Ecosystem, Web3 & UI Tools
  {
    name: "Web3.js",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <polygon points="12,1.5 4.5,12.5 12,16.5 19.5,12.5" fill="#627EEA" />
        <polygon points="12,1.5 12,16.5 19.5,12.5" fill="#455BC7" />
        <polygon points="12,17.8 4.5,13.8 12,22.5 19.5,13.8" fill="#627EEA" />
        <polygon points="12,17.8 12,22.5 19.5,13.8" fill="#455BC7" />
      </svg>
    ),
  },
  {
    name: "MetaMask",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <polygon points="21.5,2 14.5,7 16.5,3" fill="#E2761B" />
        <polygon points="2.5,2 9.5,7 7.5,3" fill="#E4761B" />
        <polygon points="19,16.5 16.5,20.5 21,22" fill="#E4761B" />
        <polygon points="5,16.5 3,22 7.5,20.5" fill="#E4761B" />
        <polygon points="7,10 9,13 6,13" fill="#E4761B" />
        <polygon points="17,10 18,13 15,13" fill="#E4761B" />
        <polygon points="9.5,7 12,2 14.5,7 16.5,3 21.5,2 18,9 17,10 12,8 7,10 6,9 2.5,2 7.5,3" fill="#F6851B" />
        <polygon points="7.5,20.5 12,22.5 16.5,20.5 19,16.5 12,18 5,16.5" fill="#D7C1B3" />
        <polygon points="12,12 9,13 10,15 12,14.5 14,15 15,13" fill="#233447" />
      </svg>
    ),
  },
  {
    name: "Material UI",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" aria-hidden="true">
        <path d="M0 2.475v10.39l3 1.733V7.674l6 3.466 6-3.466v6.924l-3 1.733v3.465l6 3.466 6-3.466V8.98L12 2.054 0 2.475zm12 6.932l-3-1.733 3-1.733 3 1.733-3 1.733z" fill="#007FFF" />
      </svg>
    ),
  },
  {
    name: "Recharts",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    name: "React Hook Form",
    icon: (
      <svg viewBox="0 0 24 24" className="size-full" fill="none" stroke="#EC5990" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 2h6a1 1 0 0 1 1 1v1H8V3a1 1 0 0 1 1-1z" />
        <path d="M9 11l2 2 4-4" />
      </svg>
    ),
  },
];

const row1 = skillTiles.slice(0, 5);
const row2 = skillTiles.slice(5, 10);
const row3 = skillTiles.slice(10, 15);
const row4 = skillTiles.slice(15, 20);

function Card({ icon, name }) {
  const id = useId();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        transition: { delay: Math.random() * 0.2, ease: "easeOut", duration: 0.4 },
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      key={id}
      ref={ref}
      initial={{ opacity: 0.85 }}
      animate={controls}
      className={cn(
        // Clean theme-adaptive squircle card, no clashing colored blur
        "group/card relative size-12 sm:size-14 cursor-pointer overflow-hidden rounded-xl p-2.5 sm:p-3 flex items-center justify-center shrink-0",
        "bg-surface-secondary/70 hover:bg-surface-secondary/90 transition-all duration-300 ease-out",
        "hover:scale-110 hover:shadow-card active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet/60"
      )}
      title={name}
      aria-label={name}
      tabIndex={0}
    >
      <div className="relative z-10 size-full flex items-center justify-center pointer-events-none">
        {icon}
      </div>
    </motion.div>
  );
}

export default function Integrations({ className = "" }) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden py-1 select-none",
        // Crisp horizontal fade mask without blur artifacts
        "[mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]",
        className
      )}
      role="region"
      aria-label="Animated skills and tools showcase"
    >
      {/* Line 1 - Fast speed (13s) */}
      <Marquee
        reverse
        duration="13s"
        className="py-1"
        repeat={4}
        pauseOnHover
      >
        {row1.map((skill, idx) => (
          <Card key={`${skill.name}-1-${idx}`} {...skill} />
        ))}
      </Marquee>

      {/* Line 2 - Slow speed (29s) */}
      <Marquee
        reverse
        duration="29s"
        className="py-1"
        repeat={4}
        pauseOnHover
      >
        {row2.map((skill, idx) => (
          <Card key={`${skill.name}-2-${idx}`} {...skill} />
        ))}
      </Marquee>

      {/* Line 3 - Medium speed (18s) */}
      <Marquee
        reverse
        duration="18s"
        className="py-1"
        repeat={4}
        pauseOnHover
      >
        {row3.map((skill, idx) => (
          <Card key={`${skill.name}-3-${idx}`} {...skill} />
        ))}
      </Marquee>

      {/* Line 4 - Gentle slow speed (38s) */}
      <Marquee
        reverse
        duration="38s"
        className="py-1"
        repeat={4}
        pauseOnHover
      >
        {row4.map((skill, idx) => (
          <Card key={`${skill.name}-4-${idx}`} {...skill} />
        ))}
      </Marquee>

      {/* Clean edge gradient fades matching the active theme card color */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[var(--color-surface-card)] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[var(--color-surface-card)] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--color-surface-card)] to-transparent z-10" />
    </div>
  );
}

export function IntegrationsDemo() {
  return (
    <div className="bg-surface-card relative z-10 h-[500px] w-full overflow-hidden rounded-xl glass-edge flex items-center justify-center">
      <Integrations />
    </div>
  );
}
