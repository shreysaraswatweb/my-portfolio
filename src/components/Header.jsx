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
      const nextScrolled = scrollY > 4;
      setIsScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (lenis && typeof lenis.on === "function") {
      lenis.on("scroll", (e) => {
        const nextScrolled = (e.scroll || 0) > 4;
        setIsScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev));
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
      className={`sticky top-0 z-50 flex w-full items-center justify-between px-space-4 tablet:px-space-6 py-space-2 tablet:py-space-3 pointer-events-none relative ${className}`}
    >
      {/* Top Faded Blur Atmosphere — dissolves scrolled content into the top haze */}
      <div
        className={[
          "pointer-events-none absolute inset-x-0 tablet:inset-x-3 top-0 -z-10 h-20 tablet:h-24 tablet:rounded-b-2xl overflow-hidden",
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

      {/* Desktop Left: DigitalClock (hidden on mobile/tablet < 1024px) */}
      <div className="pointer-events-auto hidden lg:flex items-center gap-space-2.5">
        <DigitalClock />
      </div>

      {/* Header Controls Capsule (Dead-centered on mobile/tablet with w-full justify-center, Right-aligned on desktop with lg:ml-auto) */}
      <div className="pointer-events-auto flex w-full lg:w-auto lg:ml-auto items-center justify-center lg:justify-end">
        <HeaderControls />
      </div>
    </header>
  );
}
