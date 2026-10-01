/**
 * Weather utility functions, WMO weather code mapping, phase calculation,
 * sun/moon positions, and sky gradients for the live animated weather card.
 */

// ─── WMO Code to Condition & Label Mapping ──────────────────────────────────
export const WMO_MAP = {
  0: { condition: "clear", label: "Clear Sky" },
  1: { condition: "clear", label: "Mainly Clear" },
  2: { condition: "partly-cloudy", label: "Partly Cloudy" },
  3: { condition: "cloudy", label: "Overcast" },
  45: { condition: "fog", label: "Foggy Haze" },
  48: { condition: "fog", label: "Depositing Rime Fog" },
  51: { condition: "rain", label: "Light Drizzle", intensity: "light" },
  53: { condition: "rain", label: "Moderate Drizzle", intensity: "moderate" },
  55: { condition: "rain", label: "Dense Drizzle", intensity: "heavy" },
  56: { condition: "rain", label: "Freezing Drizzle", intensity: "light" },
  57: { condition: "rain", label: "Dense Freezing Drizzle", intensity: "heavy" },
  61: { condition: "rain", label: "Slight Rain", intensity: "light" },
  63: { condition: "rain", label: "Moderate Rain", intensity: "moderate" },
  65: { condition: "rain", label: "Heavy Rain", intensity: "heavy" },
  66: { condition: "rain", label: "Freezing Rain", intensity: "moderate" },
  67: { condition: "rain", label: "Heavy Freezing Rain", intensity: "heavy" },
  71: { condition: "snow", label: "Slight Snow", intensity: "light" },
  73: { condition: "snow", label: "Moderate Snow", intensity: "moderate" },
  75: { condition: "snow", label: "Heavy Snow", intensity: "heavy" },
  77: { condition: "snow", label: "Snow Grains", intensity: "light" },
  80: { condition: "rain", label: "Slight Rain Showers", intensity: "light" },
  81: { condition: "rain", label: "Moderate Rain Showers", intensity: "moderate" },
  82: { condition: "rain", label: "Violent Rain Showers", intensity: "heavy" },
  85: { condition: "snow", label: "Slight Snow Showers", intensity: "light" },
  86: { condition: "snow", label: "Heavy Snow Showers", intensity: "heavy" },
  95: { condition: "thunderstorm", label: "Thunderstorm", intensity: "moderate" },
  96: { condition: "thunderstorm", label: "Thunderstorm with Hail", intensity: "heavy" },
  99: { condition: "thunderstorm", label: "Heavy Thunderstorm", intensity: "heavy" },
};

export function getWeatherCondition(code) {
  return WMO_MAP[code] || { condition: "partly-cloudy", label: "Partly Cloudy" };
}

// ─── Phase Calculation from Real Sunrise / Sunset Times ─────────────────────
/**
 * Calculates phase ('dawn' | 'day' | 'evening' | 'night') from real sunrise/sunset times.
 * - dawn: sunrise - 45min to sunrise + 45min
 * - day: after dawn until sunset - 90min
 * - evening (golden hour/dusk): sunset - 90min to sunset + 45min
 * - night: otherwise
 */
export function calculatePhase(now = new Date(), sunriseIso, sunsetIso) {
  if (!sunriseIso || !sunsetIso) {
    // Fallback if sunrise/sunset data is not yet available
    const hour = now.getHours();
    if (hour >= 5 && hour < 7) return "dawn";
    if (hour >= 7 && hour < 17) return "day";
    if (hour >= 17 && hour < 19) return "evening";
    return "night";
  }

  const sunrise = new Date(sunriseIso).getTime();
  const sunset = new Date(sunsetIso).getTime();
  const current = now.getTime();

  const MINUTE = 60 * 1000;
  const dawnStart = sunrise - 45 * MINUTE;
  const dawnEnd = sunrise + 45 * MINUTE;
  const eveningStart = sunset - 90 * MINUTE;
  const eveningEnd = sunset + 45 * MINUTE;

  if (current >= dawnStart && current < dawnEnd) {
    return "dawn";
  }
  if (current >= dawnEnd && current < eveningStart) {
    return "day";
  }
  if (current >= eveningStart && current < eveningEnd) {
    return "evening";
  }
  return "night";
}

// ─── Sun Arc Position Calculation ───────────────────────────────────────────
/**
 * Calculates sun position (x, y percentages and opacity) along an arc from sunrise to sunset.
 */
export function calculateSunPosition(now = new Date(), sunriseIso, sunsetIso, phase = "day") {
  if (phase === "night") {
    return { x: 50, y: 120, opacity: 0, scale: 0.8, color: "#ff8008" };
  }

  if (phase === "dawn") {
    return { x: 72, y: 52, opacity: 0.95, scale: 0.9, color: "#fca5a5" };
  }

  if (phase === "evening") {
    return { x: 80, y: 48, opacity: 0.9, scale: 0.95, color: "#f97316" };
  }

  // Day default
  if (!sunriseIso || !sunsetIso) {
    return { x: 78, y: 34, opacity: 1, scale: 0.9, color: "#ffc837" };
  }

  const sunrise = new Date(sunriseIso).getTime();
  const sunset = new Date(sunsetIso).getTime();
  const current = now.getTime();

  if (current < sunrise || current > sunset) {
    return { x: 78, y: 34, opacity: 1, scale: 0.9, color: "#ffc837" };
  }

  // Normalized time between sunrise and sunset (0 to 1)
  const t = Math.max(0, Math.min(1, (current - sunrise) / (sunset - sunrise)));

  // Parabolic arc in upper-right sky: x from 64% to 84%, y from 30% to 48%
  const x = 64 + t * 20;
  const y = 48 - Math.sin(t * Math.PI) * 18;

  return { x, y, opacity: 1, scale: 0.9, color: "#ffc837" };
}

// ─── Moon Phase Approximation ───────────────────────────────────────────────
export function calculateMoonPhase(date = new Date()) {
  // Known new moon: Jan 11, 2024, 11:57 UTC
  const knownNewMoon = new Date("2024-01-11T11:57:00Z").getTime();
  const synodicMonth = 29.53058867 * 86400000;
  const phaseCycle = (((date.getTime() - knownNewMoon) % synodicMonth) + synodicMonth) % synodicMonth;
  const normalized = phaseCycle / synodicMonth; // 0..1

  let name = "Full Moon";
  if (normalized < 0.03 || normalized > 0.97) name = "New Moon";
  else if (normalized < 0.22) name = "Waxing Crescent";
  else if (normalized < 0.28) name = "First Quarter";
  else if (normalized < 0.47) name = "Waxing Gibbous";
  else if (normalized < 0.53) name = "Full Moon";
  else if (normalized < 0.72) name = "Waning Gibbous";
  else if (normalized < 0.78) name = "Last Quarter";
  else name = "Waning Crescent";

  return {
    fraction: normalized,
    name,
    isCrescent: normalized < 0.35 || normalized > 0.65,
  };
}

// ─── Sky Gradients ──────────────────────────────────────────────────────────
export const SKY_GRADIENTS = {
  dawn: {
    clear: "linear-gradient(180deg, #181938 0%, #2f2552 35%, #7e3e68 65%, #c85a6a 82%, #f29c78 100%)",
    "partly-cloudy": "linear-gradient(180deg, #191c3d 0%, #302b55 35%, #6a3e5e 65%, #ab5869 82%, #d89178 100%)",
    cloudy: "linear-gradient(180deg, #1c1d2e 0%, #2a283e 40%, #463b4b 70%, #685057 100%)",
    fog: "linear-gradient(180deg, #242234 0%, #353245 40%, #524754 70%, #76656c 100%)",
    rain: "linear-gradient(180deg, #141727 0%, #20243b 40%, #383446 70%, #4b414f 100%)",
    thunderstorm: "linear-gradient(180deg, #0e101d 0%, #171728 40%, #2a2034 70%, #3b273d 100%)",
    snow: "linear-gradient(180deg, #181c2f 0%, #2a2f47 40%, #4d4c5c 70%, #7a6e7c 100%)",
  },
  day: {
    clear: "linear-gradient(180deg, #1e6ac8 0%, #3a8ee6 40%, #68b4f8 75%, #a2d6fd 100%)",
    "partly-cloudy": "linear-gradient(180deg, #2470c8 0%, #4292e6 40%, #75baf7 75%, #add8fa 100%)",
    cloudy: "linear-gradient(180deg, #37475d 0%, #526379 45%, #76869c 75%, #9cb0c6 100%)",
    fog: "linear-gradient(180deg, #445468 0%, #607287 45%, #8899ac 75%, #b2c2d2 100%)",
    rain: "linear-gradient(180deg, #1f2b3c 0%, #2e3e52 45%, #44576d 80%, #5a6e84 100%)",
    thunderstorm: "linear-gradient(180deg, #121924 0%, #1c2738 45%, #2a374c 80%, #3a475d 100%)",
    snow: "linear-gradient(180deg, #35475e 0%, #546880 45%, #8397af 75%, #b6c7db 100%)",
  },
  evening: {
    clear: "linear-gradient(180deg, #311847 0%, #5c2066 30%, #9e2a6c 60%, #e04b50 82%, #f68c46 100%)",
    "partly-cloudy": "linear-gradient(180deg, #2c1a45 0%, #512261 30%, #872b61 60%, #be464a 82%, #df7e44 100%)",
    cloudy: "linear-gradient(180deg, #241830 0%, #3b2241 35%, #582b49 65%, #77384b 85%, #94524c 100%)",
    fog: "linear-gradient(180deg, #281d33 0%, #432b49 35%, #633b53 65%, #854d58 85%, #a66a60 100%)",
    rain: "linear-gradient(180deg, #1b1429 0%, #2f1d38 35%, #46223b 65%, #5d2f3c 85%, #71413f 100%)",
    thunderstorm: "linear-gradient(180deg, #120e1f 0%, #201328 35%, #34152a 65%, #461f2a 85%, #562729 100%)",
    snow: "linear-gradient(180deg, #261f38 0%, #3f2f4e 35%, #5c3e60 65%, #7c5166 85%, #9a6f79 100%)",
  },
  night: {
    clear: "linear-gradient(180deg, #060913 0%, #0c1427 40%, #111e3b 75%, #182b52 100%)",
    "partly-cloudy": "linear-gradient(180deg, #060914 0%, #0c1529 40%, #132140 75%, #1b2e57 100%)",
    cloudy: "linear-gradient(180deg, #060911 0%, #0d1220 40%, #141c2d 75%, #1b253b 100%)",
    fog: "linear-gradient(180deg, #0a0e1a 0%, #111828 40%, #1b2539 75%, #25334a 100%)",
    rain: "linear-gradient(180deg, #040710 0%, #080d1d 45%, #0f182e 80%, #16223e 100%)",
    thunderstorm: "linear-gradient(180deg, #03040b 0%, #060913 45%, #0b1122 80%, #101931 100%)",
    snow: "linear-gradient(180deg, #090e1c 0%, #111a30 40%, #1c2a47 75%, #293a5e 100%)",
  },
};

export const SKY_GRADIENTS_LIGHT = {
  dawn: {
    clear: "linear-gradient(180deg, #d8b8d0 0%, #f6c0be 35%, #fedecb 70%, #fff7f2 100%)",
    "partly-cloudy": "linear-gradient(180deg, #d4bed2 0%, #f0c5c3 35%, #fedfcb 70%, #fff8f4 100%)",
    cloudy: "linear-gradient(180deg, #c5ced8 0%, #dde4ec 40%, #eef3f7 70%, #fafcff 100%)",
    fog: "linear-gradient(180deg, #c4cbd3 0%, #dbe2e9 40%, #edf2f6 70%, #f8fafc 100%)",
    rain: "linear-gradient(180deg, #b2c2d2 0%, #c8d6e3 40%, #dce5ef 70%, #f0f4f9 100%)",
    thunderstorm: "linear-gradient(180deg, #9aaebf 0%, #b3c4d3 40%, #cbd8e4 70%, #e4ecf4 100%)",
    snow: "linear-gradient(180deg, #bed4e6 0%, #d6e4f1 40%, #e8f0f8 70%, #f8fbfd 100%)",
  },
  day: {
    clear: "linear-gradient(180deg, #7ec2fc 0%, #aadefc 32%, #d4ebfd 68%, #f4f9fd 100%)",
    "partly-cloudy": "linear-gradient(180deg, #8dc8f8 0%, #b8defb 32%, #ddedf9 68%, #f6faff 100%)",
    cloudy: "linear-gradient(180deg, #a4b9cd 0%, #c4d4e3 35%, #e1ebf3 70%, #f4f8fb 100%)",
    fog: "linear-gradient(180deg, #b0c0ce 0%, #cbd8e4 35%, #e6eff5 70%, #f6f9fb 100%)",
    rain: "linear-gradient(180deg, #829fb8 0%, #a6bdd0 35%, #cbdae6 70%, #edf3f8 100%)",
    thunderstorm: "linear-gradient(180deg, #6c849b 0%, #8ea5b9 35%, #b6cbdb 70%, #e2ecf3 100%)",
    snow: "linear-gradient(180deg, #9ec4e6 0%, #c2dcf3 35%, #e0eef9 70%, #f7fbfe 100%)",
  },
  evening: {
    clear: "linear-gradient(180deg, #2b1842 0%, #4e2257 30%, #872a5e 60%, #cc4950 82%, #ec7b43 100%)",
    "partly-cloudy": "linear-gradient(180deg, #281a3e 0%, #462052 30%, #7b2958 60%, #ba444b 82%, #d77341 100%)",
    cloudy: "linear-gradient(180deg, #231b2f 0%, #39223c 35%, #552945 65%, #733646 85%, #8f4f47 100%)",
    fog: "linear-gradient(180deg, #261f30 0%, #3e2841 35%, #5b324a 65%, #7a414c 85%, #97585a 100%)",
    rain: "linear-gradient(180deg, #1d1828 0%, #2e1d34 35%, #432236 65%, #582c37 85%, #6c3c3a 100%)",
    thunderstorm: "linear-gradient(180deg, #14111f 0%, #201627 35%, #321727 65%, #431f25 85%, #512526 100%)",
    snow: "linear-gradient(180deg, #252034 0%, #392c45 35%, #533654 65%, #6e465a 85%, #875b68 100%)",
  },
  night: {
    clear: "linear-gradient(180deg, #1e2d4a 0%, #2e4368 35%, #465f8a 68%, #6d89b3 100%)",
    "partly-cloudy": "linear-gradient(180deg, #20304c 0%, #31466a 35%, #4a638c 68%, #728eb5 100%)",
    cloudy: "linear-gradient(180deg, #2b394f 0%, #3d4d65 35%, #566882 68%, #788aa3 100%)",
    fog: "linear-gradient(180deg, #2f3d53 0%, #425269 35%, #5b6d85 68%, #7e90a6 100%)",
    rain: "linear-gradient(180deg, #222f44 0%, #33435c 35%, #4c5e78 68%, #6e819b 100%)",
    thunderstorm: "linear-gradient(180deg, #1b2537 0%, #29374d 35%, #3d4d65 68%, #5a6c84 100%)",
    snow: "linear-gradient(180deg, #293a57 0%, #3c5275 35%, #577098 68%, #7c96be 100%)",
  },
};

export function getSkyGradient(phase = "day", condition = "clear", isLight = false) {
  const table = isLight ? SKY_GRADIENTS_LIGHT : SKY_GRADIENTS;
  const phaseGradients = table[phase] || table.day;
  return phaseGradients[condition] || phaseGradients.clear;
}
