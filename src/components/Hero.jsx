import { ArrowRight, Cake, MapPin, User } from "lucide-react";
import { motion } from "framer-motion";
import { assets, bioLines, profile } from "../data/profile";
import GlassCard from "./ui/GlassCard";
import PillButton from "./ui/PillButton";
import { useRef, useState, useEffect, useLayoutEffect, useMemo } from "react";
import "../assets/styles/Hero.css";

export function IdentityHeader({ align = "center" }) {
  return (
    <header className={align === "left" ? "text-left" : "text-center"}>
      <h1 className="font-display text-h1 text-text-primary">
        {profile.displayName}
      </h1>
      <p className="mt-space-1 text-body text-text-secondary">
        {profile.handle}
      </p>
    </header>
  );
}

export function BioList() {
  return (
    <ul className="mt-space-5 flex flex-col items-center gap-space-2">
      {bioLines.map((line) => (
        <li
          key={line.text}
          className="flex items-start gap-space-2 text-body-lg text-text-primary"
        >
          <span aria-hidden className="shrink-0 leading-[1.5]">{line.emoji}</span>
          <span>{line.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function MetaRow() {
  return (
    <div className="mt-space-6 flex flex-wrap items-center justify-center gap-x-space-6 gap-y-space-2 text-caption text-text-secondary">
      <span className="inline-flex items-center gap-space-2">
        <MapPin className="h-space-4 w-space-4 shrink-0" strokeWidth={1.75} />
        <span>{profile.location}</span>
      </span>
      <span className="inline-flex items-center gap-space-2">
        <Cake className="h-space-4 w-space-4 shrink-0" strokeWidth={1.75} />
        <span>{profile.joinedOn}</span>
      </span>
    </div>
  );
}

// function DashboardHero() {
//   const lastName = profile.lastName || profile.firstName;

//   return (
//     <GlassCard
//       id="home"
//       className="relative overflow-hidden rounded-xl p-space-8"
//     >
//       <div className="grid items-center gap-space-6 desktop:grid-cols-hero">
//         <div>
//           <p className="text-body-lg text-text-secondary">
//             👋 {profile.greeting}
//           </p>
//           <h1 className="mt-space-2 font-display text-display text-text-primary">
//             {profile.lastName ? (
//               <>
//                 {profile.firstName}{" "}
//                 <span className="bg-accent-gradient bg-clip-text text-transparent">
//                   {profile.lastName}
//                 </span>
//               </>
//             ) : (
//               <span className="bg-accent-gradient bg-clip-text text-transparent">
//                 {lastName}
//               </span>
//             )}
//           </h1>
//           <p className="mt-space-2 text-h2 text-text-secondary">
//             {profile.role}
//           </p>
//           <p className="mt-space-4 max-w-xl text-body text-text-secondary">
//             {profile.description}
//           </p>
//           <div className="mt-space-6 flex flex-wrap gap-space-3">
//             <PillButton href="#projects">
//               View My Work
//               <ArrowRight className="h-space-4 w-space-4" strokeWidth={2} />
//             </PillButton>
//             <PillButton href="#about" variant="ghost">
//               <User className="h-space-4 w-space-4" strokeWidth={1.75} />
//               About Me
//             </PillButton>
//           </div>
//         </div>
//         <img
//           src={assets.workstation}
//           alt="Developer workstation"
//           className="hidden w-full rounded-lg object-cover tablet:block"
//         />
//       </div>
//     </GlassCard>
//   );
// }

const BASE_CORD_LENGTH = 55;
const MAX_PULL = 80;
const TOGGLE_THRESHOLD = 45;
// 4 Color presets mapped directly to your UI palette & gradients
const THEMES = [
  {
    name: "amber",
    bulbGlow: "#ffad32",
    bulbDeep: "#e66f1c",
    filament: "#fff4bd",
    filamentGlow: "#ffbd42",
    bloomRgb: "255, 174, 57",
    beamPrimary: "255, 211, 140",
    beamSecondary: "255, 180, 80",
    bgGlow: "rgba(255, 150, 45, 0.18)",
    deskGlow: "rgba(255, 174, 77, 0.3)",
    deskShadow: "rgba(255, 170, 75, 0.18)",
  },
  {
    name: "purple",
    bulbGlow: "#b66cff",
    bulbDeep: "#713cff",
    filament: "#f3e8ff",
    filamentGlow: "#a855f7",
    bloomRgb: "168, 85, 247",
    beamPrimary: "192, 132, 252",
    beamSecondary: "147, 51, 234",
    bgGlow: "rgba(168, 85, 247, 0.22)",
    deskGlow: "rgba(168, 85, 247, 0.3)",
    deskShadow: "rgba(147, 51, 234, 0.22)",
  },
  {
    name: "cyan",
    bulbGlow: "#38bdf8",
    bulbDeep: "#0284c7",
    filament: "#e0f2fe",
    filamentGlow: "#38bdf8",
    bloomRgb: "56, 189, 248",
    beamPrimary: "125, 211, 252",
    beamSecondary: "14, 165, 233",
    bgGlow: "rgba(56, 189, 248, 0.2)",
    deskGlow: "rgba(56, 189, 248, 0.28)",
    deskShadow: "rgba(14, 165, 233, 0.2)",
  },
  {
    name: "rose",
    bulbGlow: "#fb7185",
    bulbDeep: "#e11d48",
    filament: "#ffe4e6",
    filamentGlow: "#f43f5e",
    bloomRgb: "244, 63, 94",
    beamPrimary: "253, 164, 175",
    beamSecondary: "225, 29, 72",
    bgGlow: "rgba(244, 63, 94, 0.2)",
    deskGlow: "rgba(244, 63, 94, 0.28)",
    deskShadow: "rgba(225, 29, 72, 0.2)",
  },
];
// function DashboardHero() {
//   const [lightOn, setLightOn] = useState(false);
//   const [pullY, setPullY] = useState(0);
//   const [wobbleOffset, setWobbleOffset] = useState(0);

//   const draggingRef = useRef(false);
//   const startYRef = useRef(0);
//   const currentPullRef = useRef(0);
//   const animationFrameRef = useRef(null);

//   const lastName = profile.lastName || profile.firstName;

//   const handlePointerDown = (event) => {
//     event.preventDefault();
//     event.currentTarget.setPointerCapture(event.pointerId);

//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//     }

//     draggingRef.current = true;
//     startYRef.current = event.clientY;
//     currentPullRef.current = 0;
//     setWobbleOffset(0);
//     setPullY(0);
//   };

//   const handlePointerMove = (event) => {
//     if (!draggingRef.current) return;
//     event.preventDefault();

//     const rawDelta = event.clientY - startYRef.current;
//     const dampedDelta = Math.max(0, Math.min(rawDelta * 0.85, MAX_PULL));

//     currentPullRef.current = dampedDelta;
//     setPullY(dampedDelta);
//   };

//   const releaseBulb = () => {
//     if (!draggingRef.current) return;
//     draggingRef.current = false;

//     const pulledEnough = currentPullRef.current >= TOGGLE_THRESHOLD;
//     if (pulledEnough) {
//       setLightOn((prev) => !prev);
//     }

//     // Damped harmonic oscillation for the "toing" snap & lateral waves
//     let time = 0;
//     const initialDisplacement = currentPullRef.current;
//     const decay = 6.2;
//     const frequency = 22;

//     const animateRelease = () => {
//       time += 0.016;
//       const envelope = Math.exp(-decay * time);

//       const verticalPos = initialDisplacement * envelope * Math.cos(frequency * time);
//       const lateralWobble = initialDisplacement * 0.45 * envelope * Math.sin(frequency * 1.35 * time);

//       if (envelope > 0.005) {
//         setPullY(Math.max(0, verticalPos));
//         setWobbleOffset(lateralWobble);
//         animationFrameRef.current = requestAnimationFrame(animateRelease);
//       } else {
//         setPullY(0);
//         setWobbleOffset(0);
//       }
//     };

//     animationFrameRef.current = requestAnimationFrame(animateRelease);
//   };

//   useEffect(() => {
//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, []);

//   const totalLength = BASE_CORD_LENGTH + pullY;
//   const svgPath = `M 25 0 Q ${25 + wobbleOffset} ${totalLength * 0.35}, ${25 - wobbleOffset * 0.6} ${totalLength * 0.7} T 25 ${totalLength}`;

//   return (
//     <GlassCard
//       id="home"
//       className={`hero-card relative overflow-hidden rounded-xl p-space-8 ${
//         lightOn ? "light-on" : "light-off"
//       }`}
//     >
//       {/* Background Ambience */}
//       <div className="hero-glow" />
//       <div className="hero-dots" />

//       {/* Main Grid Content */}
//       <div className="relative z-20 grid items-center gap-space-6 desktop:grid-cols-hero">
//         <div>
//           <p className="text-body-lg text-text-secondary">
//             👋 {profile.greeting}
//           </p>
//           <h1 className="mt-space-2 font-display text-display text-text-primary">
//             {profile.lastName ? (
//               <>
//                 {profile.firstName}{" "}
//                 <span className="bg-accent-gradient bg-clip-text text-transparent">
//                   {profile.lastName}
//                 </span>
//               </>
//             ) : (
//               <span className="bg-accent-gradient bg-clip-text text-transparent">
//                 {lastName}
//               </span>
//             )}
//           </h1>
//           <p className="mt-space-2 text-h2 text-text-secondary">
//             {profile.role}
//           </p>
//           <p className="mt-space-4 max-w-xl text-body text-text-secondary">
//             {profile.description}
//           </p>
//           <div className="mt-space-6 flex flex-wrap gap-space-3">
//             <PillButton href="#projects">
//               View My Work
//               <ArrowRight className="h-space-4 w-space-4" strokeWidth={2} />
//             </PillButton>
//             <PillButton href="#about" variant="ghost">
//               <User className="h-space-4 w-space-4" strokeWidth={1.75} />
//               About Me
//             </PillButton>
//           </div>
//         </div>

//         {/* Workstation Image & Ambient Glow */}
//         <div className="relative hidden w-full items-end justify-center tablet:flex">
//           <div className="desk-light" />
//           <img
//             src={assets.workstation}
//             alt="Developer workstation"
//             className="developer-desk w-full rounded-lg object-cover"
//           />
//         </div>
//       </div>

//       {/* Stretching Rubber Cord & Bulb System */}
//       <div className="bulb-system">
//         <svg
//           className="bulb-cord-svg"
//           viewBox={`0 0 50 ${Math.max(1, totalLength + 10)}`}
//           style={{ height: `${totalLength + 5}px` }}
//         >
//           <path
//             d={svgPath}
//             fill="none"
//             stroke="#495160"
//             strokeWidth={Math.max(1.2, 2.2 - pullY * 0.012)}
//             strokeLinecap="round"
//           />
//         </svg>

//         <button
//           type="button"
//           className="bulb-button"
//           style={{
//             transform: `translate(calc(-50% + ${wobbleOffset * 0.15}px), ${totalLength}px)`,
//           }}
//           aria-label={lightOn ? "Pull bulb to turn light off" : "Pull bulb to turn light on"}
//           aria-pressed={lightOn}
//           onPointerDown={handlePointerDown}
//           onPointerMove={handlePointerMove}
//           onPointerUp={releaseBulb}
//           onPointerCancel={releaseBulb}
//         >
//           <div className="bulb-holder">
//             <div className="bulb-holder-line" />
//             <div className="bulb-holder-line" />
//             <div className="bulb-holder-line" />
//           </div>

//           <div className="bulb-glass">
//             <div className="bulb-filament">
//               <span />
//               <span />
//             </div>
//             <div className="bulb-highlight" />
//           </div>

//           <div className="bulb-bloom" />
//         </button>
//       </div>

//       {/* Volumetric Beam */}
//       <div className="light-beam">
//         <div className="light-core" />
//         <div className="light-haze" />
//       </div>

//       {/* Helper Tooltip */}
//       {!lightOn && pullY === 0 && (
//         <div className="bulb-hint">
//           <span>💡</span>
//           <span>Pull the bulb</span>
//         </div>
//       )}
//     </GlassCard>
//   );
// }
function DashboardHero() {
  const [lightOn, setLightOn] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [pullY, setPullY] = useState(0);
  const [wobbleOffset, setWobbleOffset] = useState(0);

  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const currentPullRef = useRef(0);
  const animationFrameRef = useRef(null);

  const lastName = profile.lastName || profile.firstName;
  const currentTheme = THEMES[colorIndex];

  const handlePointerDown = (event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    draggingRef.current = true;
    startYRef.current = event.clientY;
    currentPullRef.current = 0;
    setWobbleOffset(0);
    setPullY(0);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    event.preventDefault();

    const rawDelta = event.clientY - startYRef.current;
    const dampedDelta = Math.max(0, Math.min(rawDelta * 0.85, MAX_PULL));

    currentPullRef.current = dampedDelta;
    setPullY(dampedDelta);
  };

  const releaseBulb = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    const pullDist = currentPullRef.current;

    // CLICK / TAP: Click bulb while ON to cycle colors
    if (pullDist < 10) {
      if (lightOn) {
        setColorIndex((prev) => (prev + 1) % THEMES.length);
      }
    } else if (pullDist >= TOGGLE_THRESHOLD) {
      // PULL: Toggle state
      setLightOn((prev) => !prev);
    }

    // Damped harmonic oscillation for the spring snap & wave wiggle
    let time = 0;
    const initialDisplacement = pullDist;
    const decay = 6.2;
    const frequency = 22;

    const animateRelease = () => {
      time += 0.016;
      const envelope = Math.exp(-decay * time);

      const verticalPos = initialDisplacement * envelope * Math.cos(frequency * time);
      const lateralWobble = initialDisplacement * 0.45 * envelope * Math.sin(frequency * 1.35 * time);

      if (envelope > 0.005) {
        setPullY(Math.max(0, verticalPos));
        setWobbleOffset(lateralWobble);
        animationFrameRef.current = requestAnimationFrame(animateRelease);
      } else {
        setPullY(0);
        setWobbleOffset(0);
      }
    };

    if (pullDist > 0) {
      animationFrameRef.current = requestAnimationFrame(animateRelease);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const totalLength = BASE_CORD_LENGTH + pullY;
  const cordOverlap = 8;
  const cordSvgLength = totalLength + cordOverlap;
  const svgPath = `M 25 0 Q ${25 + wobbleOffset} ${totalLength * 0.35}, ${25 - wobbleOffset * 0.6} ${totalLength * 0.7} T 25 ${cordSvgLength}`;

  return (
    <GlassCard
      as="header"
      id="home"
      className={`hero-card relative overflow-hidden rounded-xl p-space-8 ${lightOn ? "light-on" : "light-off"
        }`}
      style={{
        "--bulb-glow": currentTheme.bulbGlow,
        "--bulb-deep": currentTheme.bulbDeep,
        "--filament-color": currentTheme.filament,
        "--filament-glow": currentTheme.filamentGlow,
        "--bloom-rgb": currentTheme.bloomRgb,
        "--beam-primary": currentTheme.beamPrimary,
        "--beam-secondary": currentTheme.beamSecondary,
        "--bg-glow": currentTheme.bgGlow,
        "--desk-glow": currentTheme.deskGlow,
        "--desk-shadow": currentTheme.deskShadow,
      }}
    >
      {/* Background Ambience */}
      <div className="hero-glow" />
      <div className="hero-dots" />

      {/* Main Grid Content */}
      <div className="relative z-20 grid items-center gap-space-6 desktop:grid-cols-hero">
        <div>
          <p className="text-body-lg text-text-secondary">
            👋 {profile.greeting}
          </p>
          <h1 className="mt-space-2 font-display text-display text-text-primary">
            {profile.lastName ? (
              <>
                {profile.firstName}{" "}
                <span className="bg-accent-gradient bg-clip-text text-transparent">
                  {profile.lastName}
                </span>
              </>
            ) : (
              <span className="bg-accent-gradient bg-clip-text text-transparent">
                {lastName}
              </span>
            )}
          </h1>
          <p className="mt-space-2 text-h2 text-text-secondary">
            {profile.role}
          </p>
          <p className="mt-space-4 max-w-xl text-body text-text-secondary">
            {profile.description}
          </p>
          <div className="mt-space-6 flex flex-wrap gap-space-3">
            <PillButton href="#projects">
              View My Work
              <ArrowRight className="h-space-4 w-space-4" strokeWidth={2} />
            </PillButton>
            <PillButton href="#about" variant="ghost">
              <User className="h-space-4 w-space-4" strokeWidth={1.75} />
              About Me
            </PillButton>
          </div>
        </div>

        {/* Workstation Image & Ambient Glow */}
        <div className="relative hidden w-full items-end justify-center tablet:flex">
          <div className="desk-light" />
          <img
            src={assets.workstation400}
            srcSet={`${assets.workstation400} 400w, ${assets.workstation} 800w`}
            sizes="(max-width: 600px) 400px, 800px"
            alt="Developer workstation desk setup with code on screen"
            width={400}
            height={267}
            loading="eager"
            fetchPriority="high"
            className="developer-desk w-full rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Stretching Rubber Cord & Bulb System */}
      <div className="bulb-system">
        <svg
          className="bulb-cord-svg"
          viewBox={`0 0 50 ${Math.max(1, cordSvgLength)}`}
          style={{ height: `${cordSvgLength}px` }}
        >
          <path
            d={svgPath}
            fill="none"
            stroke="#495160"
            strokeWidth={Math.max(1.2, 2.2 - pullY * 0.012)}
            strokeLinecap="round"
          />
        </svg>

        <button
          type="button"
          className="bulb-button"
          style={{
            transform: `translate(calc(-50% + ${wobbleOffset * 0.15}px), ${totalLength}px)`,
          }}
          aria-label={
            lightOn
              ? "Click Me"
              : "Pull Me"
          }
          aria-pressed={lightOn}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={releaseBulb}
          onPointerCancel={releaseBulb}
        >
          <div className="bulb-holder">
            <div className="bulb-holder-line" />
            <div className="bulb-holder-line" />
            <div className="bulb-holder-line" />
          </div>

          <div className="bulb-glass">
            <div className="bulb-filament">
              <span />
              <span />
            </div>
            <div className="bulb-highlight" />
          </div>

          <div className="bulb-bloom" />
        </button>
      </div>

      {/* Volumetric Beam */}
      <div className="light-beam">
        <div className="light-core" />
        <div className="light-haze" />
      </div>

      {/* Doodle Tooltip Hints */}
      {!lightOn && pullY === 0 && (
        <div className="bulb-hint" role="status">
          <svg
            className="bulb-doodle-arrow"
            viewBox="0 0 44 22"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 41 16 C 28 6, 14 6, 3 10"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 3 10 L 11 5 M 3 10 L 10 16"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="bulb-doodle-text">Pull Me</span>
        </div>
      )}

      {lightOn && pullY === 0 && (
        <div className="bulb-hint color-hint" role="status">
          <svg
            className="bulb-doodle-arrow"
            viewBox="0 0 44 22"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 41 16 C 28 6, 14 6, 3 10"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 3 10 L 11 5 M 3 10 L 10 16"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="bulb-doodle-text">Click Me</span>
        </div>
      )}
    </GlassCard>
  );
}

function getSculptedCardPath(w, h) {
  const W = Math.max(w || 356, 280);
  const H = Math.max(h || 380, 200);
  const isSm = W >= 365;
  const xCenter = W / 2;
  const halfNotch = isSm ? 117 : 112;
  const x1 = Math.round(xCenter - halfNotch);
  const x2 = Math.round(xCenter + halfNotch);
  const yFloor = isSm ? 164 : 154;
  const rf = isSm ? 30 : 28; // Equal circular fillet radius at both bottom corners of cutout
  const ri = 16; // Inner corner radius at shoulder tops
  const ro = 24; // Outer corner radius at shoulder tops
  const rb = 28; // Outer bottom card corner radius

  return [
    `M 0,${ro}`,
    `C 0,${(ro * 0.4477).toFixed(1)} ${(ro * 0.4477).toFixed(1)},0 ${ro},0`,
    `L ${x1 - ri},0`,
    `C ${(x1 - ri + ri * 0.5523).toFixed(1)},0 ${x1},${(ri * 0.4477).toFixed(1)} ${x1},${ri}`,
    `L ${x1},${yFloor - rf}`,
    `C ${x1},${(yFloor - rf + rf * 0.5523).toFixed(1)} ${(x1 + rf - rf * 0.5523).toFixed(1)},${yFloor} ${x1 + rf},${yFloor}`,
    `L ${x2 - rf},${yFloor}`,
    `C ${(x2 - rf + rf * 0.5523).toFixed(1)},${yFloor} ${x2},${(yFloor - rf + rf * 0.5523).toFixed(1)} ${x2},${yFloor - rf}`,
    `L ${x2},${ri}`,
    `C ${x2},${(ri * 0.4477).toFixed(1)} ${(x2 + ri - ri * 0.5523).toFixed(1)},0 ${x2 + ri},0`,
    `L ${W - ro},0`,
    `C ${(W - ro + ro * 0.5523).toFixed(1)},0 ${W},${(ro * 0.4477).toFixed(1)} ${W},${ro}`,
    `L ${W},${H - rb}`,
    `C ${W},${(H - rb + rb * 0.5523).toFixed(1)} ${(W - rb + rb * 0.5523).toFixed(1)},${H} ${W - rb},${H}`,
    `L ${rb},${H}`,
    `C ${(rb * 0.4477).toFixed(1)},${H} 0,${(H - rb + rb * 0.5523).toFixed(1)} 0,${H - rb}`,
    "Z",
  ].join(" ");
}

export function IdentityHero() {
  const cardRef = useRef(null);
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window === "undefined") return { width: 356, height: 380 };
    const isSm = window.innerWidth >= 640;
    const w = isSm ? 370 : Math.min(356, Math.max(280, window.innerWidth - 32));
    return { width: w, height: 380 };
  });

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const updateSize = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const w = Math.round(rect.width);
          const h = Math.round(rect.height);
          setDimensions((prev) =>
            prev.width !== w || prev.height !== h ? { width: w, height: h } : prev
          );
        }
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, []);

  const pathD = useMemo(
    () => getSculptedCardPath(dimensions.width, dimensions.height),
    [dimensions.width, dimensions.height]
  );

  const clipId = `sculpted-profile-card-clip-${dimensions.width}-${dimensions.height}`;

  return (
    <div id="home" className="relative w-full max-w-[356px] sm:max-w-[370px] mx-auto mt-6 sm:mt-7 pt-[32px] filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_14px_32px_rgba(0,0,0,0.5)]">
      {/* ─── Hidden SVG Definition with Exact Pixel Coordinates (Zero Distortion) ─── */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={pathD} />
          </clipPath>
        </defs>
      </svg>

      {/* ─── Single Unified Glass Card Body (Zero Seams, Zero Color Split) ─── */}
      <div
        ref={cardRef}
        className="relative w-full overflow-hidden"
        style={{
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`,
          transform: "translateZ(0)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Anti-aliased Bleed Backdrop Glass Layer (Eliminates Skia/WebKit clip-path white edge lines) */}
        <div
          className="absolute -inset-2 bg-surface-card backdrop-blur-glass pointer-events-none"
          aria-hidden="true"
        />

        {/* Card Content (Padded below the U-notch) */}
        <div className="relative z-10 px-5 sm:px-6 pb-6 pt-[166px] sm:pt-[176px]">
          {/* Name */}
          <h1 className="font-display text-[22px] sm:text-2xl font-bold tracking-tight text-text-primary text-center leading-tight">
            {profile.displayName}
          </h1>

          {/* Handle */}
          <p className="text-xs sm:text-[13px] font-medium text-text-tertiary text-center mt-1">
            @shreysaraswat
          </p>

          {/* 3 Bio Bullets (Centered Block, Left-Aligned Rows) */}
          <div className="mt-4 flex flex-col items-center">
            <div className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-[13px] text-text-secondary font-medium">
              {bioLines.map((line) => (
                <div key={line.text} className="flex items-center gap-2.5">
                  <span className="text-sm shrink-0">{line.emoji}</span>
                  <span>{line.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Meta Row */}
          <div className="mt-5 pt-3.5 border-t border-border-hairline/60 flex items-center justify-between text-micro sm:text-caption text-text-tertiary font-medium px-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-text-tertiary" strokeWidth={1.75} />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cake className="h-3.5 w-3.5 shrink-0 text-text-tertiary" strokeWidth={1.75} />
              <span>{profile.joinedOn}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Large Prominent Avatar Positioned at top: -26px ─── */}
      <div className="absolute -top-[26px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <motion.div
          animate={{ y: [0, -3.5, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[204px] h-[204px] sm:w-[214px] sm:h-[214px] rounded-[30px] overflow-hidden border border-amber-300/30 dark:border-white/10 shadow-[0_12px_36px_rgba(245,184,46,0.32)] bg-[#f5b82e]"
        >
          <img
            src={assets.avatar}
            alt={profile.displayName}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function Hero({ variant = "dashboard" }) {
  if (variant === "identity") {
    return <IdentityHero />;
  }

  return <DashboardHero />;
}
