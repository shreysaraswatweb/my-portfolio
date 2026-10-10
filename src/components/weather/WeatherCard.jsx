import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Droplets,
  Wind,
  Thermometer,
  Sun as SunIcon,
  Moon as MoonIcon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  RefreshCw,
  X,
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import IconChip from "../ui/IconChip";
import Tooltip from "../ui/Tooltip";
import LocationMapBackground, { LocationMapTrails } from "../LocationMapBackground";
import RippleBackground, { generateNoidaMapDataUri } from "../ui/RippleBackground";
import { useTheme } from "../../theme/ThemeProvider";
import useWeather from "../../hooks/useWeather";
import Sky from "./scene/Sky";
import Stars from "./scene/Stars";
import Sun from "./scene/Sun";
import Moon from "./scene/Moon";
import Clouds from "./scene/Clouds";
import Rain from "./scene/Rain";
import Lightning from "./scene/Lightning";
import Snow from "./scene/Snow";
import Fog from "./scene/Fog";
import "../LocationWeatherCard.css";

/**
 * Animated count-up component for temperature display.
 */
function CountUp({ value = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.round(value);
    const duration = 850;
    const startTime = performance.now();

    let animId;
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (end - start) * ease));

      if (progress < 1) {
        animId = requestAnimationFrame(update);
      }
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  return <span>{displayValue}</span>;
}

/**
 * Maps condition to compact hourly Lucide icon.
 */
function HourlyIcon({ condition, isDay = 1 }) {
  const iconProps = { className: "w-3 h-3", strokeWidth: 2.2 };

  switch (condition) {
    case "clear":
      return isDay ? (
        <SunIcon {...iconProps} className="w-3 h-3 text-amber-300" />
      ) : (
        <MoonIcon {...iconProps} className="w-3 h-3 text-sky-200" />
      );
    case "partly-cloudy":
      return isDay ? (
        <CloudSun {...iconProps} className="w-3 h-3 text-amber-200" />
      ) : (
        <CloudMoon {...iconProps} className="w-3 h-3 text-sky-200" />
      );
    case "cloudy":
      return <Cloud {...iconProps} className="w-3 h-3 text-slate-200" />;
    case "rain":
      return <CloudRain {...iconProps} className="w-3 h-3 text-sky-300" />;
    case "thunderstorm":
      return <CloudLightning {...iconProps} className="w-3 h-3 text-amber-300" />;
    case "snow":
      return <CloudSnow {...iconProps} className="w-3 h-3 text-blue-100" />;
    case "fog":
      return <CloudFog {...iconProps} className="w-3 h-3 text-slate-300" />;
    default:
      return <SunIcon {...iconProps} className="w-3 h-3 text-amber-300" />;
  }
}

/**
 * Dev Switcher Floating Panel for testing all phases x conditions.
 */
function DevSwitcher({
  isOpen,
  onClose,
  currentPhase,
  naturalPhase,
  forcedPhase,
  onSetPhase,
  currentCondition,
  naturalCondition,
  forcedCondition,
  onSetCondition,
  onRefresh,
}) {
  if (!isOpen) return null;

  const phases = ["dawn", "day", "evening", "night"];
  const conditions = [
    "clear",
    "partly-cloudy",
    "cloudy",
    "fog",
    "rain",
    "thunderstorm",
    "snow",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      onClick={(e) => e.stopPropagation()}
      className="absolute inset-x-2 top-2 z-50 rounded-xl bg-neutral-950/95 border border-white/20 p-3 text-white shadow-2xl backdrop-blur-xl text-left"
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-neutral-100">
            Weather Dev Preview
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onRefresh}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Refresh Live Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Phase Selector */}
      <div className="mt-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Phase <span className="text-amber-300 font-mono">({currentPhase})</span>
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => onSetPhase(null)}
            className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${forcedPhase === null
              ? "bg-amber-500 text-black font-bold"
              : "bg-white/10 text-neutral-300 hover:bg-white/20"
              }`}
          >
            Auto ({naturalPhase})
          </button>
          {phases.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onSetPhase(p)}
              className={`px-2 py-0.5 text-[10px] rounded font-medium capitalize transition-colors ${forcedPhase === p
                ? "bg-amber-500 text-black font-bold"
                : "bg-white/10 text-neutral-300 hover:bg-white/20"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Condition Selector */}
      <div className="mt-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Condition <span className="text-cyan-300 font-mono">({currentCondition})</span>
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => onSetCondition(null)}
            className={`px-2 py-0.5 text-[10px] rounded font-medium transition-colors ${forcedCondition === null
              ? "bg-cyan-500 text-black font-bold"
              : "bg-white/10 text-neutral-300 hover:bg-white/20"
              }`}
          >
            Auto ({naturalCondition})
          </button>
          {conditions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onSetCondition(c)}
              className={`px-2 py-0.5 text-[10px] rounded font-medium capitalize transition-colors ${forcedCondition === c
                ? "bg-cyan-500 text-black font-bold"
                : "bg-white/10 text-neutral-300 hover:bg-white/20"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-[9px] text-neutral-400 font-mono text-center">
        Press <kbd className="px-1 py-0.2 bg-white/15 rounded text-white">D</kbd> or click ✕ to toggle
      </p>
    </motion.div>
  );
}

function WeatherCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHourly, setShowHourly] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [glint, setGlint] = useState({ x: 50, y: 50 });

  const { resolved } = useTheme();
  const isLight = resolved === "light";
  const mapDataUri = useMemo(() => generateNoidaMapDataUri(isLight), [isLight]);

  const {
    data,
    loading,
    isOffline,
    phase,
    naturalPhase,
    condition,
    sunPosition,
    moonInfo,
    refresh,
    isDebugOpen,
    setIsDebugOpen,
    forcedPhase,
    setForcedPhase,
    forcedCondition,
    setForcedCondition,
  } = useWeather();

  // Determines if the live sky background behind the text is visually dark or light.
  // - In dark mode: all skies are dark -> isDarkSky is true.
  // - In light mode:
  //   - 'night': deep navy twilight sky with moon/stars -> isDarkSky is true (requires crisp white text)
  //   - 'evening': rich sunset purple & fiery amber -> isDarkSky is true (requires crisp white text)
  //   - 'day' & 'dawn': soft sky blue & pastel morning -> isDarkSky is false (uses crisp slate-800 text)
  const isDarkSky = !isLight || phase === "night" || phase === "evening";

  const cardRef = useRef(null);
  const [isWide, setIsWide] = useState(() => {
    if (typeof window !== "undefined") {
      const w = window.innerWidth;
      return w >= 600 && w < 1280;
    }
    return false;
  });

  // Track card width to automatically toggle tablet landscape vs compact mobile layout
  useEffect(() => {
    if (!cardRef.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsWide(entry.contentRect.width >= 250);
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Performance guards: pause off-screen & background tabs
  const [isInView, setIsInView] = useState(true);
  const [isDocVisible, setIsDocVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  // Monitor page visibility
  useEffect(() => {
    const handleVisibility = () => {
      setIsDocVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // IntersectionObserver to pause when card scrolled off-screen
  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const isPaused = !isInView || !isDocVisible;

  // Mouse move handler for sheen glint & scene parallax
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setGlint({
      x: (x + 0.5) * 100,
      y: (y + 0.5) * 100,
    });
    setParallax({ x: x * 2, y: y * 2 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setParallax({ x: 0, y: 0 });
    setGlint({ x: 50, y: 50 });
    // On desktop, ensure card returns to map when cursor leaves
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches) {
      setIsFlipped(false);
    }
  }, []);

  const handleCardClick = useCallback((e) => {
    // If click originated from an explicit button or interactive element, do nothing
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".no-flip")) {
      return;
    }
    // Only toggle flip state on mobile/touch screens where hover doesn't exist
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsFlipped((prev) => !prev);
    }
  }, []);

  const ariaLabel = isFlipped
    ? `Live Weather in ${data.city}: ${data.temperature} degrees, ${data.label}`
    : "Location: Noida, India. Hover to view live weather.";

  return (
    <div
      ref={cardRef}
      className={`location-flipper-container ${isFlipped ? "is-flipped" : ""}`}
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
    >
      <div className="location-flipper-inner">
        {/* Specular Light Sweep during 3D flip */}
        <div className="location-flip-sheen" aria-hidden="true" />

        {/* ════════════════════════════════════════════════════════════════════
            FRONT FACE: LOCATION CARD (Map, Trails, Pin)
           ════════════════════════════════════════════════════════════════════ */}
        <div className="location-face-front">
          <GlassCard
            as="div"
            className="location-card group relative flex w-full h-full flex-col justify-between overflow-hidden rounded-lg p-3 sm:p-space-4 transition-colors duration-200 hover:border-emerald-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {/* Animated City Map Background Layer with WebGL Ripple Effect */}
            <RippleBackground
              image={mapDataUri}
              isLight={isLight}
              center={[0.5, 0.54]}
              fallback={<LocationMapBackground />}
            >
              {/* Old Green Animated Light Trails */}
              <LocationMapTrails />
            </RippleBackground>

            {/* Readability gradient behind typography to guarantee WCAG AAA contrast in both themes */}
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-lg transition-colors duration-300 ${isLight
                ? "bg-gradient-to-t from-[#eae5dc]/90 via-[#eae5dc]/50 to-transparent"
                : "bg-gradient-to-t from-[#080b10]/90 via-[#080b10]/50 to-transparent"
                }`}
              aria-hidden="true"
            />

            {/* Top Row: MapPin Icon + IST Live Badge + Flip Icon */}
            <div className="relative z-[1] flex items-center justify-between">
              <IconChip className="h-space-8 w-space-8 bg-surface-pill text-text-primary transition-transform duration-200 group-hover:scale-105">
                <MapPin className="h-space-4 w-space-4" strokeWidth={1.75} />
              </IconChip>
              <div className="flex items-center gap-1.5">
                <Tooltip content="Indian Standard Time (UTC+5:30) • Live Clock" side="bottom">
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-available/10 px-space-2 py-0.5 text-micro font-medium text-status-available border border-status-available/20 cursor-pointer">
                    <span className="h-1.5 w-1.5 rounded-full bg-status-available animate-pulse" />
                    IST
                  </span>
                </Tooltip>
              </div>
            </div>

            {/* Bottom Row: Location Typography */}
            <div className="relative z-[1] mt-space-3">
              <div className="flex items-center justify-between">
                <p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">
                  LOCATION
                </p>
              </div>
              <p className="mt-0.5 font-display text-body-lg sm:text-h2 font-bold text-text-primary leading-tight">
                Noida
              </p>
              <p className="mt-0.5 truncate text-micro text-text-tertiary">
                India · GMT+5:30
              </p>
            </div>
          </GlassCard>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            BACK FACE: LIVE ANIMATED REAL-TIME WEATHER CARD
           ════════════════════════════════════════════════════════════════════ */}
        <div className="location-face-back">
          <div
            className={`group relative flex w-full h-full ${isWide
              ? "flex-row items-stretch p-2.5 sm:p-3"
              : "flex-col justify-between p-2 sm:p-2.5"
              } overflow-hidden rounded-lg transition-all duration-300 ${isLight
                ? "bg-white/80 border border-slate-200/90 shadow-[0_8px_30px_rgba(30,80,140,0.08)]"
                : "bg-surface-card border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              }`}
            style={{
              transform:
                isHovered && !prefersReducedMotion
                  ? `perspective(900px) rotateX(${-parallax.y * 6}deg) rotateY(${parallax.x * 6}deg)`
                  : "perspective(900px) rotateX(0deg) rotateY(0deg)",
              transition: isHovered
                ? "transform 0.08s ease-out, box-shadow 0.3s ease"
                : "transform 0.4s ease-out, box-shadow 0.3s ease",
            }}
          >
            {/* Animated Scene Layers (Back to Front) */}
            <Sky phase={phase} condition={condition} isLight={isLight} />
            <Stars
              phase={phase}
              condition={condition}
              isPaused={isPaused}
              prefersReducedMotion={prefersReducedMotion}
            />
            <Sun
              phase={phase}
              condition={condition}
              sunPosition={sunPosition}
              parallax={parallax}
              isPaused={isPaused}
              prefersReducedMotion={prefersReducedMotion}
              isWide={isWide}
            />
            <Moon
              phase={phase}
              condition={condition}
              moonInfo={moonInfo}
              parallax={parallax}
              isPaused={isPaused}
              prefersReducedMotion={prefersReducedMotion}
              isWide={isWide}
            />
            <Clouds
              phase={phase}
              condition={condition}
              parallax={parallax}
              isPaused={isPaused}
              prefersReducedMotion={prefersReducedMotion}
            />
            <Fog
              condition={condition}
              isPaused={isPaused}
              prefersReducedMotion={prefersReducedMotion}
            />
            <Rain
              condition={condition}
              isPaused={isPaused}
              prefersReducedMotion={prefersReducedMotion}
            />
            <Snow
              condition={condition}
              isPaused={isPaused}
              prefersReducedMotion={prefersReducedMotion}
            />
            <Lightning
              condition={condition}
              isPaused={isPaused}
              prefersReducedMotion={prefersReducedMotion}
            />

            {/* Dynamic Moving Glossy Sheen Highlight */}
            <div
              className="absolute inset-0 pointer-events-none z-[6] transition-opacity duration-300"
              style={{
                opacity: isHovered ? (isLight ? 0.25 : 0.35) : 0.08,
                background: `radial-gradient(circle at ${glint.x}% ${glint.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`,
              }}
              aria-hidden="true"
            />

            {/* Dev Switcher Overlay (When Active) */}
            <AnimatePresence>
              {isDebugOpen && (
                <DevSwitcher
                  isOpen={isDebugOpen}
                  onClose={() => setIsDebugOpen(false)}
                  currentPhase={phase}
                  naturalPhase={naturalPhase}
                  forcedPhase={forcedPhase}
                  onSetPhase={setForcedPhase}
                  currentCondition={condition}
                  naturalCondition={data.condition}
                  forcedCondition={forcedCondition}
                  onSetCondition={setForcedCondition}
                  onRefresh={refresh}
                />
              )}
            </AnimatePresence>

            {isWide ? (
              /* ══════════════════════════════════════════════════════════════
                 WIDE TABLET MODE: Left Weather Scene + Right Border Capsules
                 ══════════════════════════════════════════════════════════════ */
              <>
                {/* Left Section: Noida Header, Big Temperature, Condition */}
                <div className="relative z-10 flex-1 flex flex-col justify-between h-full min-w-0 pr-2 sm:pr-3">
                  {/* Top: Header */}
                  <div className="flex items-start justify-between w-full">
                    <div className="flex flex-col items-start">
                      <p
                        className={`font-display text-sm sm:text-base font-bold leading-tight select-none transition-colors duration-300 ${isDarkSky ? "text-white" : "text-slate-800"
                          }`}
                        style={
                          isDarkSky
                            ? { textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)" }
                            : undefined
                        }
                      >
                        Noida
                      </p>
                      <Tooltip content={`Air Quality Index: ${data.aqi}`} side="bottom">
                        <div className="mt-0.5 flex items-center gap-1.5 text-[9px] sm:text-[9.5px] select-none cursor-pointer">
                          <span
                            className={`h-1.5 w-1.5 rounded-full shrink-0 ${data.aqi <= 50
                              ? "bg-emerald-500"
                              : data.aqi <= 100
                                ? "bg-amber-400"
                                : data.aqi <= 150
                                  ? "bg-orange-500"
                                  : "bg-rose-500"
                              }`}
                          />
                          <span
                            className={`font-medium tracking-tight transition-colors duration-300 ${isDarkSky ? "text-white/85" : "text-slate-600"
                              }`}
                            style={
                              isDarkSky
                                ? { textShadow: "0 1px 2px rgba(0, 0, 0, 0.35)" }
                                : undefined
                            }
                          >
                            AQI {data.aqi}
                          </span>
                        </div>
                      </Tooltip>
                    </div>

                    {/* Green Blinking Dot */}
                    <Tooltip content={isOffline ? "Offline (cached data)" : "Live real-time weather feed"} side="bottom">
                      <div className="flex items-center pt-0.5 cursor-pointer">
                        <span className="relative flex h-2 w-2">
                          {!isOffline && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-available opacity-75" />
                          )}
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${isOffline
                              ? "bg-neutral-500"
                              : "bg-status-available shadow-[0_0_8px_rgba(34,197,94,0.7)]"
                              }`}
                          />
                        </span>
                      </div>
                    </Tooltip>
                  </div>

                  {/* Center/Bottom-Left: Temperature & Condition */}
                  <div className="my-auto py-0.5 text-left flex flex-col items-start justify-center">
                    {loading ? (
                      <div className="flex flex-col items-start gap-1 py-1">
                        <div
                          className={`h-8 w-16 rounded-md animate-pulse ${isDarkSky ? "bg-white/10" : "bg-black/10"
                            }`}
                        />
                        <div
                          className={`h-3 w-20 rounded animate-pulse ${isDarkSky ? "bg-white/10" : "bg-black/10"
                            }`}
                        />
                      </div>
                    ) : (
                      <>
                        <div
                          className={`font-display text-3xl sm:text-4xl font-light tracking-tight leading-none select-none flex items-start justify-start transition-colors duration-300 ${isDarkSky ? "text-white" : "text-slate-800"
                            }`}
                          style={
                            isDarkSky
                              ? { textShadow: "0 2px 10px rgba(0, 0, 0, 0.55)" }
                              : undefined
                          }
                        >
                          <CountUp value={data.temperature} />
                          <span className="text-xl sm:text-2xl font-extralight ml-0.5 opacity-90">°</span>
                        </div>

                        <p
                          className={`mt-1 text-[11px] font-medium capitalize tracking-wide select-none transition-colors duration-300 ${isDarkSky ? "text-white/90" : "text-slate-600"
                            }`}
                          style={
                            isDarkSky
                              ? { textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)" }
                              : undefined
                          }
                        >
                          {data.label}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Section: Capsules vertically aligned on right border */}
                <div
                  className={`relative z-10 shrink-0 w-[114px] sm:w-[124px] pl-2 sm:pl-2.5 flex flex-col justify-between items-stretch h-full border-l no-flip transition-colors duration-300 ${isDarkSky ? "border-white/15" : "border-slate-300/60"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHourly((prev) => !prev);
                  }}
                >
                  {showHourly ? (
                    <motion.div
                      key="hourly-wide"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="grid grid-cols-2 gap-1 w-full my-auto text-center cursor-pointer"
                    >
                      {data.hourly.map((h, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col items-center justify-center backdrop-blur-md rounded-[5px] py-0.5 px-0.5 border min-w-0 ${isLight
                            ? "bg-white/60 border-slate-200/80 text-slate-800"
                            : "bg-surface-pill/50 border-white/15 text-white"
                            }`}
                        >
                          <span
                            className={`text-[7.5px] font-medium leading-tight truncate w-full ${isLight ? "text-slate-600" : "text-neutral-300"
                              }`}
                          >
                            {h.time}
                          </span>
                          <div className="my-0 scale-[0.68]">
                            <HourlyIcon condition={h.condition} isDay={h.isDay} />
                          </div>
                          <span
                            className={`text-[8.5px] font-bold leading-tight ${isLight ? "text-slate-800" : "text-white"
                              }`}
                          >
                            {h.temp}°
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chips-wide"
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.18 }}
                      className="flex flex-col justify-center gap-1.5 w-full my-auto cursor-pointer"
                    >
                      {/* Humidity Chip */}
                      <Tooltip content={`Relative Humidity: ${data.humidity}%`} side="left">
                        <div
                          className={`w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full backdrop-blur-md text-[10px] font-semibold whitespace-nowrap shadow-xs border ${isLight
                            ? "bg-white/60 border-slate-200/80 text-slate-800"
                            : "bg-surface-pill/50 border-white/15 text-white"
                            }`}
                        >
                          <Droplets className="h-3 w-3 text-sky-500 shrink-0" strokeWidth={2.2} />
                          <span className="tabular-nums leading-none">{data.humidity}%</span>
                        </div>
                      </Tooltip>

                      {/* Wind Speed Chip - Full width in vertical stack with ample padding */}
                      <Tooltip content={`Wind Speed: ${data.windSpeed} km/h`} side="left">
                        <div
                          className={`w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full backdrop-blur-md text-[10px] font-semibold whitespace-nowrap shadow-xs border ${isLight
                            ? "bg-white/60 border-slate-200/80 text-slate-800"
                            : "bg-surface-pill/50 border-white/15 text-white"
                            }`}
                        >
                          <Wind className="h-3 w-3 text-teal-500 shrink-0" strokeWidth={2.2} />
                          <span className="tabular-nums leading-none">{data.windSpeed} km/h</span>
                        </div>
                      </Tooltip>

                      {/* Feels Like Chip */}
                      <Tooltip content={`Feels Like Temperature: ${data.feelsLike}°`} side="left">
                        <div
                          className={`w-full flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full backdrop-blur-md text-[10px] font-semibold whitespace-nowrap shadow-xs border ${isLight
                            ? "bg-white/60 border-slate-200/80 text-slate-800"
                            : "bg-surface-pill/50 border-white/15 text-white"
                            }`}
                        >
                          <Thermometer className="h-3 w-3 text-amber-500 shrink-0" strokeWidth={2.2} />
                          <span className="tabular-nums leading-none">{data.feelsLike}°</span>
                        </div>
                      </Tooltip>
                    </motion.div>
                  )}

                  {/* Bottom Toggle Button */}
                  <div className="w-full flex items-center justify-center select-none pt-1">
                    {/* <Tooltip
                      content={showHourly ? "Click to view current conditions" : "Click to view 4-hour forecast"}
                      side="top"
                    > */}
                    <button
                      type="button"
                      className={`w-full inline-flex items-center justify-center gap-1 py-0.5 px-1.5 rounded-full text-[8.5px] font-medium tracking-tight transition-all duration-200 cursor-pointer ${isDarkSky
                        ? "bg-white/15 hover:bg-white/25 text-white/90 hover:text-white border border-white/20 shadow-xs backdrop-blur-sm"
                        : "bg-slate-900/5 hover:bg-slate-900/10 text-slate-700 hover:text-slate-900 border border-slate-900/10 shadow-xs"
                        }`}
                    >
                      <span>{showHourly ? "Tap for metrics" : "Tap for 4h forecast"}</span>
                    </button>
                    {/* </Tooltip> */}
                  </div>
                </div>
              </>
            ) : (
              /* ══════════════════════════════════════════════════════════════
                 COMPACT MODE: Mobile & 4-Col Desktop Stacked Layout
                 ══════════════════════════════════════════════════════════════ */
              <>
                {/* Header: Noida + AQI + Green Dot (Smaller Text for Mobile) */}
                <div className="relative z-10 flex items-start justify-between w-full">
                  <div className="flex flex-col items-start">
                    <p
                      className={`font-display text-[13px] sm:text-sm font-bold leading-tight select-none transition-colors duration-300 ${isDarkSky ? "text-white" : "text-slate-800"
                        }`}
                      style={
                        isDarkSky
                          ? { textShadow: "0 1px 3px rgba(0, 0, 0, 0.45)" }
                          : undefined
                      }
                    >
                      Noida
                    </p>
                    <Tooltip content={`Air Quality Index: ${data.aqi}`} side="bottom">
                      <div className="mt-0.5 flex items-center gap-1 text-[8.5px] sm:text-[9.5px] select-none cursor-pointer">
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${data.aqi <= 50
                            ? "bg-emerald-500"
                            : data.aqi <= 100
                              ? "bg-amber-400"
                              : data.aqi <= 150
                                ? "bg-orange-500"
                                : "bg-rose-500"
                            }`}
                        />
                        <span
                          className={`font-medium tracking-tight transition-colors duration-300 ${isDarkSky ? "text-white/85" : "text-slate-600"
                            }`}
                          style={
                            isDarkSky
                              ? { textShadow: "0 1px 2px rgba(0, 0, 0, 0.35)" }
                              : undefined
                          }
                        >
                          AQI {data.aqi}
                        </span>
                      </div>
                    </Tooltip>
                  </div>

                  {/* Top-Right: Cool Green Blinking Dot */}
                  <Tooltip content={isOffline ? "Offline (cached data)" : "Live real-time weather feed"} side="bottom">
                    <div className="flex items-center pt-0.5 cursor-pointer">
                      <span className="relative flex h-2 w-2">
                        {!isOffline && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-available opacity-75" />
                        )}
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${isOffline
                            ? "bg-neutral-500"
                            : "bg-status-available shadow-[0_0_8px_rgba(34,197,94,0.7)]"
                            }`}
                        />
                      </span>
                    </div>
                  </Tooltip>
                </div>

                {/* Center: Scaled Temperature & Weather Condition */}
                <div className="relative z-10 my-auto py-0 text-center flex flex-col items-center justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center gap-1 py-1">
                      <div
                        className={`h-7 w-14 rounded-md animate-pulse ${isDarkSky ? "bg-white/10" : "bg-black/10"
                          }`}
                      />
                      <div
                        className={`h-2.5 w-16 rounded animate-pulse ${isDarkSky ? "bg-white/10" : "bg-black/10"
                          }`}
                      />
                    </div>
                  ) : (
                    <>
                      <div
                        className={`font-display text-[26px] sm:text-[30px] font-light tracking-tight leading-none select-none flex items-start justify-center transition-colors duration-300 ${isDarkSky ? "text-white" : "text-slate-800"
                          }`}
                        style={
                          isDarkSky
                            ? {
                              textShadow: "0 2px 10px rgba(0, 0, 0, 0.55)",
                            }
                            : undefined
                        }
                      >
                        <CountUp value={data.temperature} />
                        <span className="text-base sm:text-lg font-extralight ml-0.5 opacity-90">°</span>
                      </div>

                      <p
                        className={`mt-0.5 text-[9.5px] sm:text-[10.5px] font-medium capitalize tracking-wide select-none transition-colors duration-300 ${isDarkSky ? "text-white/90" : "text-slate-600"
                          }`}
                        style={
                          isDarkSky
                            ? { textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)" }
                            : undefined
                        }
                      >
                        {data.label}
                      </p>
                    </>
                  )}
                </div>

                {/* Bottom Area: Capsules with Generous Padding + Adequate Border Clearance */}
                <div
                  className={`relative z-10 w-full pt-1 border-t no-flip transition-colors duration-300 ${isDarkSky ? "border-white/15" : "border-slate-300/60"
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHourly((prev) => !prev);
                  }}
                >
                  {showHourly ? (
                    <motion.div
                      key="hourly"
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.18 }}
                      className="grid grid-cols-4 gap-0.5 w-full text-center py-0.5 cursor-pointer"
                    >
                      {data.hourly.map((h, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col items-center justify-center backdrop-blur-md rounded-[5px] py-0.5 px-0.5 border min-w-0 ${isLight
                            ? "bg-white/60 border-slate-200/80 text-slate-800"
                            : "bg-surface-pill/50 border-white/15 text-white"
                            }`}
                        >
                          <span
                            className={`text-[7px] sm:text-[7.5px] font-medium leading-tight truncate w-full ${isLight ? "text-slate-600" : "text-neutral-300"
                              }`}
                          >
                            {h.time}
                          </span>
                          <div className="my-0 scale-[0.68]">
                            <HourlyIcon condition={h.condition} isDay={h.isDay} />
                          </div>
                          <span
                            className={`text-[8px] sm:text-[8.5px] font-bold leading-tight ${isLight ? "text-slate-800" : "text-white"
                              }`}
                          >
                            {h.temp}°
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chips"
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      transition={{ duration: 0.18 }}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-1 w-full cursor-pointer"
                    >
                      {/* Humidity Chip - Snug & Compact */}
                      <Tooltip content={`Relative Humidity: ${data.humidity}%`} side="top">
                        <div
                          className={`w-max shrink-0 flex items-center justify-center gap-0.5 py-0.5 px-1 sm:px-1.5 rounded-full backdrop-blur-md text-[8px] sm:text-[8.5px] font-semibold whitespace-nowrap shadow-xs border ${isLight
                            ? "bg-white/60 border-slate-200/80 text-slate-800"
                            : "bg-surface-pill/50 border-white/15 text-white"
                            }`}
                        >
                          <Droplets className="h-2.5 w-2.5 text-sky-500 shrink-0" strokeWidth={2.2} />
                          <span className="tabular-nums leading-none">{data.humidity}%</span>
                        </div>
                      </Tooltip>

                      {/* Wind Speed Chip - Optimized with snug padding so all content fits properly */}
                      <Tooltip content={`Wind Speed: ${data.windSpeed} km/h`} side="top">
                        <div
                          className={`w-full min-w-0 flex items-center justify-center gap-0.5 py-0.5 px-1 sm:px-1.5 rounded-full backdrop-blur-md text-[8px] sm:text-[8.5px] font-semibold whitespace-nowrap shadow-xs border ${isLight
                            ? "bg-white/60 border-slate-200/80 text-slate-800"
                            : "bg-surface-pill/50 border-white/15 text-white"
                            }`}
                        >
                          <Wind className="h-2.5 w-2.5 text-teal-500 shrink-0" strokeWidth={2.2} />
                          <span className="tabular-nums leading-none tracking-tight whitespace-nowrap">{data.windSpeed} km/h</span>
                        </div>
                      </Tooltip>

                      {/* Feels Like Chip - Snug & Compact */}
                      <Tooltip content={`Feels Like Temperature: ${data.feelsLike}°`} side="top">
                        <div
                          className={`w-max shrink-0 flex items-center justify-center gap-0.5 py-0.5 px-1 sm:px-1.5 rounded-full backdrop-blur-md text-[8px] sm:text-[8.5px] font-semibold whitespace-nowrap shadow-xs border ${isLight
                            ? "bg-white/60 border-slate-200/80 text-slate-800"
                            : "bg-surface-pill/50 border-white/15 text-white"
                            }`}
                        >
                          <Thermometer className="h-2.5 w-2.5 text-amber-500 shrink-0" strokeWidth={2.2} />
                          <span className="tabular-nums leading-none">{data.feelsLike}°</span>
                        </div>
                      </Tooltip>
                    </motion.div>
                  )}

                  {/* Bottom Subtle Indicator with ample clearance above bottom border */}
                  <div className="mt-0.5 sm:mt-1 flex items-center justify-center select-none">
                    {/* <Tooltip
                      content={showHourly ? "Click to view current conditions" : "Click to view 4-hour forecast"}
                      side="top"
                    > */}
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[8.5px] font-medium tracking-tight transition-all duration-200 cursor-pointer ${isDarkSky
                        ? "bg-white/15 hover:bg-white/25 text-white/90 hover:text-white border border-white/20 shadow-xs backdrop-blur-sm"
                        : "bg-slate-900/5 hover:bg-slate-900/10 text-slate-700 hover:text-slate-900 border border-slate-900/10 shadow-xs"
                        }`}
                    >
                      <span>{showHourly ? "Tap for metrics" : "Tap for 4h forecast"}</span>
                    </button>
                    {/* </Tooltip> */}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(WeatherCard);
