import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import HeaderControls from "./HeaderControls";
import DigitalClock from "./DigitalClock";

/**
 * Header:
 * Top header — sticky with top faded blur haze.
 * - Left: System status and timezone badges (Operational + IST)
 * - Right: Unified header controls (Search, Mood/Sun toggle, Theme dropdown)
 * - Atmosphere: Top faded blur that progressively dissolves cards as they scroll underneath.
 */
export default function Header({ className = "" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(scrollY > 4);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (lenis && typeof lenis.on === "function") {
      lenis.on("scroll", (e) => {
        setIsScrolled((e.scroll || 0) > 4);
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lenis && typeof lenis.off === "function") {
        lenis.off("scroll");
      }
    };
  }, [lenis]);

  return (
    <header
      className={`sticky top-0 z-50 flex w-full items-center justify-between px-space-6 py-space-3 pointer-events-none ${className}`}
    >
      {/* Top Faded Blur Atmosphere — dissolves scrolled content into the top haze */}
      <div
        className={[
          "pointer-events-none absolute inset-x-2 sm:inset-x-3 top-0 -z-10 h-24 sm:h-26 rounded-b-2xl overflow-hidden",
          "transition-opacity duration-300 ease-out",
          isScrolled ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 40%, rgba(0, 0, 0, 0.7) 65%, rgba(0, 0, 0, 0.25) 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 40%, rgba(0, 0, 0, 0.7) 65%, rgba(0, 0, 0, 0.25) 85%, transparent 100%)",
          background:
            "linear-gradient(to bottom, rgb(var(--rgb-canvas-mid) / 0.88) 0%, rgb(var(--rgb-canvas-mid) / 0.65) 45%, rgb(var(--rgb-canvas-mid) / 0.2) 75%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Left Status Badges (visible on desktop/tablet) */}
      <div className="pointer-events-auto hidden md:flex items-center gap-space-2.5">
        {/* Operational status badge */}
        {/* <div className="inline-flex h-9 items-center gap-space-2 rounded-lg border border-border-hairline bg-surface-pill/80 px-3.5 text-micro font-semibold uppercase tracking-wider text-text-primary backdrop-blur-md shadow-card">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>OPERATIONAL</span>
          <span className="text-text-tertiary">·</span>
          <span className="font-normal text-text-secondary">v2.4</span>
        </div> */}

        {/* Live Digital Clock with Animata Ticker Animation */}
        <DigitalClock />
      </div>

      {/* Right Header Controls Capsule */}
      <div className="pointer-events-auto flex flex-1 md:flex-none justify-end">
        <HeaderControls />
      </div>
    </header>
  );
}
