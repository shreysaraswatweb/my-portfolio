import { ArrowRight, Cake, MapPin, User } from "lucide-react";
import { assets, bioLines, profile } from "../data/profile";
import GlassCard from "./ui/GlassCard";
import PillButton from "./ui/PillButton";
import AvatarFrame from "./AvatarFrame";
import { useRef, useState, useEffect } from "react";
import "../assets/styles/Hero.css";

export function IdentityHeader({ align = "center" }) {
  return (
    <div className={align === "left" ? "text-left" : "text-center"}>
      <h1 className="font-display text-h1 text-text-primary">
        {profile.displayName}
      </h1>
      <p className="mt-space-1 text-body text-text-secondary">
        {profile.handle}
      </p>
    </div>
  );
}

export function BioList() {
  return (
    <ul className="mt-space-5 space-y-space-2 text-center">
      {bioLines.map((line) => (
        <li
          key={line.text}
          className="flex items-center justify-center gap-space-2 text-body-lg text-text-primary"
        >
          <span aria-hidden>{line.emoji}</span>
          <span>{line.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function MetaRow() {
  return (
    <div className="mt-space-6 flex items-start justify-between gap-space-3 text-caption text-text-secondary">
      <span className="inline-flex min-w-0 items-center gap-space-2">
        <MapPin className="h-space-4 w-space-4 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{profile.location}</span>
      </span>
      <span className="inline-flex min-w-0 items-center gap-space-2">
        <Cake className="h-space-4 w-space-4 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{profile.joinedOn}</span>
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
      id="home"
      className={`hero-card relative overflow-hidden rounded-xl p-space-8 ${
        lightOn ? "light-on" : "light-off"
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
            src={assets.workstation}
            alt="Developer workstation"
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
              ? "Click bulb to change shade, pull to turn off"
              : "Pull bulb to turn light on"
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

      {/* Tooltip Hints */}
      {!lightOn && pullY === 0 && (
        <div className="bulb-hint">
          <span>💡</span>
          <span>Pull the bulb</span>
        </div>
      )}

      {lightOn && pullY === 0 && (
        <div className="bulb-hint color-hint">
          <span>🎨</span>
          <span>Click bulb to change shade</span>
        </div>
      )}
    </GlassCard>
  );
}

export default function Hero({ variant = "dashboard" }) {
  if (variant === "identity") {
    return (
      <div className="relative pt-avatar-lift">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
          <AvatarFrame size="mobile" />
        </div>
        <GlassCard className="rounded-xl px-space-6 pb-space-6 pt-avatar-sink">
          <IdentityHeader />
          <BioList />
          <MetaRow />
        </GlassCard>
      </div>
    );
  }

  return <DashboardHero />;
}
