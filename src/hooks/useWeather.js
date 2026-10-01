import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getWeatherCondition,
  calculatePhase,
  calculateSunPosition,
  calculateMoonPhase,
} from "../lib/weather";

const NOIDA_LAT = 28.5355;
const NOIDA_LON = 77.3910;
const OPEN_METEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${NOIDA_LAT}&longitude=${NOIDA_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,is_day&hourly=temperature_2m,weather_code,is_day&daily=sunrise,sunset&timezone=Asia%2FKolkata&forecast_days=2`;
const OPEN_METEO_AQI_URL = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${NOIDA_LAT}&longitude=${NOIDA_LON}&current=us_aqi,european_aqi`;

// Fallback initial state so the card never renders empty
const DEFAULT_WEATHER = {
  temperature: 29,
  feelsLike: 30,
  humidity: 47,
  windSpeed: 7,
  weatherCode: 0,
  isDay: 1,
  condition: "clear",
  label: "Clear Sky",
  city: "Noida",
  aqi: 142,
  aqiStatus: "Moderate",
  sunrise: null,
  sunset: null,
  hourly: [
    { time: "Now", temp: 29, condition: "clear", isDay: 1 },
    { time: "+1h", temp: 28, condition: "clear", isDay: 1 },
    { time: "+2h", temp: 27, condition: "clear", isDay: 0 },
    { time: "+3h", temp: 25, condition: "clear", isDay: 0 },
  ],
};

export default function useWeather() {
  const [data, setData] = useState(DEFAULT_WEATHER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hidden dev switcher state
  const [isDebugOpen, setIsDebugOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("debug") === "1";
    }
    return false;
  });
  const [forcedPhase, setForcedPhase] = useState(null); // 'dawn' | 'day' | 'evening' | 'night' | null
  const [forcedCondition, setForcedCondition] = useState(null); // 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'rain' | 'thunderstorm' | 'snow' | null

  // Time tracker for phase recomputation every minute
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut "D" to toggle debug switcher
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if focus is in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target?.isContentEditable
      ) {
        return;
      }
      if (e.key === "d" || e.key === "D") {
        setIsDebugOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch live weather & AQI from Open-Meteo
  const fetchWeather = useCallback(async () => {
    try {
      const [weatherRes, aqiRes] = await Promise.allSettled([
        fetch(OPEN_METEO_URL),
        fetch(OPEN_METEO_AQI_URL),
      ]);

      if (weatherRes.status !== "fulfilled" || !weatherRes.value.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const json = await weatherRes.value.json();
      const current = json.current;
      if (!current) {
        throw new Error("Missing current weather payload");
      }

      let aqiVal = 142;
      let aqiStatus = "Moderate";
      if (aqiRes.status === "fulfilled" && aqiRes.value.ok) {
        try {
          const aqiJson = await aqiRes.value.json();
          aqiVal = Math.round(aqiJson?.current?.us_aqi ?? 142);
          if (aqiVal <= 50) aqiStatus = "Good";
          else if (aqiVal <= 100) aqiStatus = "Moderate";
          else if (aqiVal <= 150) aqiStatus = "Sensitive";
          else if (aqiVal <= 200) aqiStatus = "Poor";
          else aqiStatus = "Very Poor";
        } catch {
          // Keep fallback
        }
      }

      const code = current.weather_code ?? 0;
      const { condition, label } = getWeatherCondition(code);

      const sunrise = json.daily?.sunrise?.[0] || null;
      const sunset = json.daily?.sunset?.[0] || null;

      // Extract next 4 hours for forecast strip
      let nextHours = [];
      if (json.hourly?.time && json.hourly?.temperature_2m) {
        const currentTimeIso = current.time || "";
        const times = json.hourly.time;
        // Find index of current hour
        let currentIndex = times.findIndex((t) => t >= currentTimeIso);
        if (currentIndex === -1) currentIndex = 0;

        nextHours = times.slice(currentIndex, currentIndex + 4).map((timeStr, idx) => {
          const hourDate = new Date(timeStr);
          let formattedHour = "Now";
          if (idx > 0) {
            const h = hourDate.getHours();
            const ampm = h >= 12 ? "PM" : "AM";
            const hour12 = h % 12 || 12;
            formattedHour = `${hour12} ${ampm}`;
          }

          const hCode = json.hourly.weather_code?.[currentIndex + idx] ?? 0;
          const hCond = getWeatherCondition(hCode).condition;
          const hTemp = Math.round(json.hourly.temperature_2m?.[currentIndex + idx] ?? current.temperature_2m);
          const hIsDay = json.hourly.is_day?.[currentIndex + idx] ?? 1;

          return {
            time: formattedHour,
            temp: hTemp,
            condition: hCond,
            isDay: hIsDay,
          };
        });
      }

      setData({
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m ?? 50),
        windSpeed: Math.round(current.wind_speed_10m ?? 8),
        weatherCode: code,
        isDay: current.is_day ?? 1,
        condition,
        label,
        city: "Noida",
        aqi: aqiVal,
        aqiStatus,
        sunrise,
        sunset,
        hourly: nextHours.length === 4 ? nextHours : DEFAULT_WEATHER.hourly,
      });

      setError(null);
      setLoading(false);
    } catch (err) {
      console.warn("[useWeather] Fetch error:", err);
      setError(err.message);
      setLoading(false);
      // Keep existing data on error (offline mode)
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  // Derive natural phase from sunrise/sunset
  const naturalPhase = useMemo(() => {
    return calculatePhase(now, data.sunrise, data.sunset);
  }, [now, data.sunrise, data.sunset]);

  // Effective phase & condition (allowing dev switcher override)
  const effectivePhase = forcedPhase || naturalPhase;
  const effectiveCondition = forcedCondition || data.condition;

  // Sun and Moon positions
  const sunPosition = useMemo(() => {
    return calculateSunPosition(now, data.sunrise, data.sunset, effectivePhase);
  }, [now, data.sunrise, data.sunset, effectivePhase]);

  const moonInfo = useMemo(() => {
    return calculateMoonPhase(now);
  }, [now]);

  return {
    data,
    loading,
    error,
    isOffline: Boolean(error),
    phase: effectivePhase,
    naturalPhase,
    condition: effectiveCondition,
    sunPosition,
    moonInfo,
    refresh: fetchWeather,
    // Dev Switcher
    isDebugOpen,
    setIsDebugOpen,
    forcedPhase,
    setForcedPhase,
    forcedCondition,
    setForcedCondition,
  };
}
