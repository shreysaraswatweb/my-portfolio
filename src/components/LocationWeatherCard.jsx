import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Droplets, Wind } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import IconChip from "./ui/IconChip";
import LocationMapBackground from "./LocationMapBackground";
import "./LocationWeatherCard.css";

// ─── WMO Weather Code Mapper ────────────────────────────────────────────────
function getWeatherDetails(code, isDay = 1) {
  switch (code) {
    case 0:
      return {
        label: isDay ? "Clear Sky" : "Clear Night",
        type: isDay ? "clear-day" : "clear-night",
      };
    case 1:
      return {
        label: isDay ? "Mainly Clear" : "Mainly Clear",
        type: isDay ? "mostly-clear-day" : "mostly-clear-night",
      };
    case 2:
      return {
        label: "Partly Cloudy",
        type: isDay ? "partly-cloudy-day" : "partly-cloudy-night",
      };
    case 3:
      return {
        label: "Overcast",
        type: "overcast",
      };
    case 45:
    case 48:
      return {
        label: "Haze / Fog",
        type: "fog",
      };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        label: "Light Drizzle",
        type: "rain",
      };
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return {
        label: "Rain Showers",
        type: "rain",
      };
    case 71:
    case 73:
    case 75:
      return {
        label: "Snow Showers",
        type: "snow",
      };
    case 95:
    case 96:
    case 99:
      return {
        label: "Thunderstorm",
        type: "thunderstorm",
      };
    default:
      return {
        label: "Partly Cloudy",
        type: isDay ? "partly-cloudy-day" : "partly-cloudy-night",
      };
  }
}

// ─── 3D Volumetric Weather Icon (matching reference picture) ───────────────
function Weather3DIcon({ type = "partly-cloudy-day", isDay = 1 }) {
  const isNight = isDay === 0 || type.includes("night");
  const isRain = type === "rain" || type === "drizzle";
  const isThunder = type === "thunderstorm";

  return (
    <motion.div
      className="weather-3d-wrap"
      animate={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 100 68"
        className="weather-3d-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sun Radial Glow */}
          <radialGradient id="sun-grad" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#FFF9E0" />
            <stop offset="35%" stopColor="#FFC837" />
            <stop offset="100%" stopColor="#FF8008" />
          </radialGradient>

          {/* Moon Radial Glow */}
          <radialGradient id="moon-grad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#D8E8F8" />
            <stop offset="100%" stopColor="#7E9EBD" />
          </radialGradient>

          {/* Cloud Body 3D Volume Gradient */}
          <linearGradient id="cloud-body-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F1F7FD" />
            <stop offset="85%" stopColor="#CCE0F4" />
            <stop offset="100%" stopColor="#A2C5E8" />
          </linearGradient>

          {/* Cloud Underbelly Ambient Occlusion */}
          <linearGradient id="cloud-ambient-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6C97BF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3B6991" stopOpacity="0.75" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="celestial-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="cloud-cast-shadow" x="-20%" y="-15%" width="140%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0A223D" floodOpacity="0.38" />
          </filter>
        </defs>

        {/* ─── Back Celestial Sphere (Sun or Moon) ────────────────────────── */}
        {!isNight ? (
          <g filter="url(#celestial-glow)">
            <motion.circle
              cx="67"
              cy="25"
              r="17"
              fill="url(#sun-grad)"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            />
          </g>
        ) : (
          <g filter="url(#celestial-glow)">
            <motion.circle
              cx="67"
              cy="25"
              r="15"
              fill="url(#moon-grad)"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            />
            {/* Crater Details on Moon */}
            <circle cx="63" cy="22" r="2" fill="#95B5D5" opacity="0.45" />
            <circle cx="70" cy="28" r="3" fill="#95B5D5" opacity="0.35" />
          </g>
        )}

        {/* ─── Volumetric 3D Cloud ────────────────────────────────────────── */}
        <g filter="url(#cloud-cast-shadow)">
          {/* Main Organic Cloud Silhouette */}
          <path
            d="M26 49 C19 49, 14 44.5, 14 38.5 C14 33, 18.5 28.5, 24 28.5 C25.2 28.5, 26.5 28.8, 27.5 29.2 C29.5 21.5, 36.8 16, 46 16 C55.5 16, 63.2 21.8, 65.2 30 C66.8 29.3, 68.5 29, 70.5 29 C77.5 29, 83 34.5, 83 41.5 C83 48.5, 77.5 54, 70.5 54 L27 54 C19.5 54, 14 48.5, 14 42"
            fill="url(#cloud-body-grad)"
          />

          {/* Cloud Underbelly Ambient Occlusion */}
          <path
            d="M20 48 Q46 56, 75 48 C72 52.5, 66 54, 61 54 L27 54 C22 54, 20 51, 20 48 Z"
            fill="url(#cloud-ambient-shadow)"
          />

          {/* Specular Rim Light Curve on Top of Domes */}
          <path
            d="M37 19 C40 17.5, 43.5 17, 47 17 C53.5 17, 59.5 20.5, 62.5 26"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M68 30 C71 30, 75 32, 77 36"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* Rain Droplets Animation (if rainy) */}
        {isRain && (
          <g opacity="0.9">
            <line x1="32" y1="58" x2="28" y2="65" stroke="#79C5FF" strokeWidth="2" strokeLinecap="round" />
            <line x1="48" y1="58" x2="44" y2="65" stroke="#79C5FF" strokeWidth="2" strokeLinecap="round" />
            <line x1="64" y1="58" x2="60" y2="65" stroke="#79C5FF" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Lightning Bolt (if thunderstorm) */}
        {isThunder && (
          <path
            d="M48 54 L43 62 L48 62 L44 70 L54 60 L49 60 Z"
            fill="#FFD233"
            filter="drop-shadow(0 0 4px #FFB800)"
          />
        )}
      </svg>
    </motion.div>
  );
}

// ─── Main Location & Weather Card with 3D Flip ──────────────────────────────
export default function LocationWeatherCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  // Initial deterministic state matching Noida time of day
  const initialHour = useMemo(() => new Date().getHours(), []);
  const initialIsDay = initialHour >= 6 && initialHour < 18 ? 1 : 0;

  const [weather, setWeather] = useState({
    temperature: 28,
    humidity: 65,
    windSpeed: 8,
    weatherCode: 1,
    isDay: initialIsDay,
    condition: initialIsDay ? "Mainly Clear" : "Clear Night",
    type: initialIsDay ? "mostly-clear-day" : "mostly-clear-night",
    city: "Noida",
    loaded: false,
  });

  // Fetch live real-time weather from Open-Meteo for Noida (Lat: 28.5355, Lon: 77.3910)
  useEffect(() => {
    let isMounted = true;

    async function fetchNoidaWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=28.5355&longitude=77.3910&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=Asia%2FKolkata"
        );
        if (!res.ok) return;

        const data = await res.json();
        const current = data.current;
        if (!current || !isMounted) return;

        const temp = Math.round(current.temperature_2m);
        const hum = Math.round(current.relative_humidity_2m);
        const wind = Math.round(current.wind_speed_10m);
        const code = current.weather_code ?? 1;
        const dayStatus = current.is_day ?? 1;
        const details = getWeatherDetails(code, dayStatus);

        setWeather({
          temperature: temp,
          humidity: hum,
          windSpeed: wind,
          weatherCode: code,
          isDay: dayStatus,
          condition: details.label,
          type: details.type,
          city: "Noida",
          loaded: true,
        });
      } catch (err) {
        console.warn("[weather] Error fetching Noida live weather:", err);
      }
    }

    fetchNoidaWeather();
    // Refresh weather every 15 minutes
    const interval = setInterval(fetchNoidaWeather, 15 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`location-flipper-container ${isFlipped ? "is-flipped" : ""}`}
      onClick={() => setIsFlipped((prev) => !prev)}
      role="region"
      aria-label="Location and Live Weather Card (Flip on hover or tap)"
    >
      <div className="location-flipper-inner">
        {/* Specular Light Sweep during flip */}
        <div className="location-flip-sheen" aria-hidden="true" />

        {/* ════════════════════════════════════════════════════════════════════
            FRONT FACE: LOCATION CARD (Map, Trails, Pin)
           ════════════════════════════════════════════════════════════════════ */}
        <div className="location-face-front">
          <GlassCard
            as="div"
            className="location-card group relative flex w-full h-full flex-col justify-between overflow-hidden rounded-lg p-space-4 transition-all duration-200 hover:border-accent-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            {/* Animated City Map Background Layer */}
            <LocationMapBackground />

            {/* Top Row: MapPin Icon + IST Live Badge */}
            <div className="relative z-[1] flex items-center justify-between">
              <IconChip className="h-space-8 w-space-8 bg-accent-primary/10 text-accent-primary transition-transform duration-200 group-hover:scale-105">
                <MapPin className="h-space-4 w-space-4" strokeWidth={1.75} />
              </IconChip>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-status-available/10 px-space-2 py-0.5 text-micro font-medium text-status-available border border-status-available/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-status-available animate-pulse" />
                  IST
                </span>
                <span className="text-[10px] text-text-tertiary/60 font-mono tracking-tighter hidden sm:inline" title="Hover to view live weather">
                  ↺
                </span>
              </div>
            </div>

            {/* Bottom Row: Location Typography */}
            <div className="relative z-[1] mt-space-3">
              <div className="flex items-center justify-between">
                <p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">
                  LOCATION
                </p>
                <span className="text-[10px] text-emerald-700 dark:text-accent-primary/70 font-medium tracking-tight">
                  Hover for weather →
                </span>
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
            BACK FACE: WEATHER CARD (Frosted Glass, Water Droplets, 3D Cloud)
           ════════════════════════════════════════════════════════════════════ */}
        <div className="location-face-back">
          <GlassCard
            as="div"
            className="weather-card-shell relative flex w-full h-full flex-col justify-between overflow-hidden rounded-lg p-space-4 text-center cursor-pointer transition-all duration-200 hover:border-sky-300/40"
          >
            {/* Ambient Frosted Cyan-Blue Glass Background & Caustics */}
            <div className="weather-frosted-backdrop" aria-hidden="true" />

            {/* Realistic Glass Condensation Water Droplets */}
            <span className="weather-droplet droplet-1" aria-hidden="true" />
            <span className="weather-droplet droplet-2" aria-hidden="true" />
            <span className="weather-droplet droplet-3" aria-hidden="true" />
            <span className="weather-droplet droplet-4" aria-hidden="true" />
            <span className="weather-droplet droplet-5" aria-hidden="true" />
            <span className="weather-droplet droplet-6" aria-hidden="true" />
            <span className="weather-droplet droplet-7" aria-hidden="true" />
            <span className="weather-droplet droplet-8" aria-hidden="true" />

            {/* Top Row: Location Name & Live Status */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-sky-200/75">
                WEATHER
              </span>
              <p className="font-display text-caption sm:text-body font-bold text-white tracking-wide">
                {weather.city}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-400/15 border border-sky-400/30 px-1.5 py-0.5 text-[9px] font-semibold text-sky-200">
                <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>

            {/* Center Content: 3D Cloud Illustration + Large Temperature + Condition */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-1">
              {/* 3D Volumetric Cloud & Sun/Moon Illustration */}
              <Weather3DIcon type={weather.type} isDay={weather.isDay} />

              {/* Bold Temperature Display */}
              <div className="mt-0.5">
                <p className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none drop-shadow-md">
                  {weather.temperature}°
                </p>
              </div>

              {/* Weather Condition Subtitle */}
              <p className="mt-1 text-micro sm:text-caption font-medium text-sky-100/90 capitalize tracking-wide drop-shadow-sm">
                {weather.condition}
              </p>
            </div>

            {/* Bottom Row: Humidity & Wind Metrics */}
            <div className="relative z-10 flex items-center justify-center gap-3 pt-1 border-t border-white/10 text-micro text-sky-100/85">
              <div className="flex items-center gap-1" title="Relative Humidity">
                <Droplets className="h-3 w-3 text-sky-300" strokeWidth={2.2} />
                <span>{weather.humidity}%</span>
              </div>

              <span className="text-white/20 select-none">|</span>

              <div className="flex items-center gap-1" title="Wind Speed">
                <Wind className="h-3 w-3 text-sky-300" strokeWidth={2.2} />
                <span>{weather.windSpeed} km/h</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
