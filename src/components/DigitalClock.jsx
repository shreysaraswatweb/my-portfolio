import { useEffect, useMemo, useRef, useState } from "react";
import { Clock } from "lucide-react";
import Tooltip from "./ui/Tooltip";

/**
 * Calculates current time in Indian Standard Time (IST, UTC+5:30).
 * Guaranteed to return exact IST (HH:MM:SS) for any visitor globally (USA, Europe, etc.).
 */
export function getISTTime() {
  const now = new Date();

  // Primary: Intl.DateTimeFormat with Asia/Kolkata timezone
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23", // Guarantees 00-23 24-hour format
    });
    const parts = formatter.formatToParts(now);
    const hh = parts.find((p) => p.type === "hour")?.value.padStart(2, "0") ?? "00";
    const mm = parts.find((p) => p.type === "minute")?.value.padStart(2, "0") ?? "00";
    const ss = parts.find((p) => p.type === "second")?.value.padStart(2, "0") ?? "00";
    return { hh, mm, ss, formatted: `${hh}:${mm}:${ss}` };
  } catch {
    // Mathematical UTC fallback (+5h 30m) - completely immune to visitor's local system timezone
    const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
    const istDate = new Date(now.getTime() + IST_OFFSET_MS);
    const pad = (n) => String(n).padStart(2, "0");
    const hh = pad(istDate.getUTCHours());
    const mm = pad(istDate.getUTCMinutes());
    const ss = pad(istDate.getUTCSeconds());
    return { hh, mm, ss, formatted: `${hh}:${mm}:${ss}` };
  }
}

/**
 * CounterDigit:
 * Implements vertical rolling digit animation referencing the counter specification.
 * - Single-step forward roll for clock ticks.
 * - Loopback index for roll-overs (e.g. 9 -> 0 or 5 -> 0).
 * - Smooth entrance cascade on initial mount (0 -> current value).
 * - Zero layout shift with tabular-nums monospace glyphs.
 */
function CounterDigit({
  value,
  max = 9,
  isAccent = false,
  entranceDelay = 0,
}) {
  const targetDigit = parseInt(value, 10) || 0;
  // Start at 0 for initial entrance animation
  const [index, setIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const prevDigitRef = useRef(0);

  // Digits array: [0, 1, ..., max, 0]
  // Extra 0 at index (max + 1) provides seamless forward roll-through
  const digits = useMemo(() => {
    return Array.from({ length: max + 1 }, (_, i) => i).concat([0]);
  }, [max]);

  useEffect(() => {
    if (isInitialMount) {
      // Entrance roll: animate from 0 to current target digit
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
        setIndex(targetDigit);
        prevDigitRef.current = targetDigit;
      }, 50 + entranceDelay);

      const mountCompleteTimer = setTimeout(() => {
        setIsInitialMount(false);
      }, 50 + entranceDelay + 950);

      return () => {
        clearTimeout(timer);
        clearTimeout(mountCompleteTimer);
      };
    }

    const prev = prevDigitRef.current;
    if (prev === targetDigit) return;

    if (targetDigit > prev) {
      // Normal forward roll
      setTransitionEnabled(true);
      setIndex(targetDigit);
      prevDigitRef.current = targetDigit;
    } else if (targetDigit < prev) {
      if ((prev === max && targetDigit === 0) || (max === 9 && targetDigit === 0 && prev === 3)) {
        // Natural clock roll-through: roll forward 1 step to index (max + 1)
        setTransitionEnabled(true);
        setIndex(max + 1);
        prevDigitRef.current = 0;

        // After the transition ends, snap instantly to index 0 with no transition
        const resetTimer = setTimeout(() => {
          setTransitionEnabled(false);
          setIndex(0);
        }, 440);
        return () => clearTimeout(resetTimer);
      } else {
        // Tab switch or jump: snap directly
        setTransitionEnabled(false);
        setIndex(targetDigit);
        prevDigitRef.current = targetDigit;
      }
    }
  }, [targetDigit, max, entranceDelay, isInitialMount]);

  return (
    <span
      data-value={targetDigit}
      className="inline-flex flex-col select-none"
      style={{
        height: "22px",
        lineHeight: 1,
        width: "1.15ch",
        transform: `translateY(-${index * 100}%)`,
        transition: transitionEnabled
          ? isInitialMount
            ? "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)"
            : "transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)"
          : "none",
        willChange: "transform",
      }}
    >
      {digits.map((digit, i) => (
        <span
          key={i}
          className={`flex h-[22px] shrink-0 items-center justify-center font-mono text-[13px] sm:text-[14px] font-bold tabular-nums leading-none ${
            isAccent ? "text-accent-primary" : "text-text-primary"
          }`}
        >
          {digit}
        </span>
      ))}
    </span>
  );
}

export default function DigitalClock({ embedded = false, className = "" }) {
  const [time, setTime] = useState(() => getISTTime());

  useEffect(() => {
    let timeoutId;
    let intervalId;

    const tick = () => {
      setTime(getISTTime());
    };

    // Synchronize precisely to the millisecond boundary of the next second
    const syncToNextSecond = () => {
      const now = new Date();
      const msUntilNextSecond = 1000 - now.getMilliseconds();

      timeoutId = setTimeout(() => {
        tick();
        intervalId = setInterval(tick, 1000);
      }, msUntilNextSecond);
    };

    tick();
    syncToNextSecond();

    // Re-sync immediately when browser tab regains focus or visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tick();
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        syncToNextSecond();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, []);

  const clockContent = (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 select-none ${className}`}
      aria-label={`Current IST Time: ${time.formatted}`}
    >
      {/* Accent Clock Icon */}
      <Clock
        className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-accent-primary shrink-0 transition-transform duration-300 group-hover:scale-110"
        strokeWidth={2}
      />

      {/* IST Badge */}
      <span className="inline-flex items-center rounded border border-border-hairline/80 bg-surface-secondary px-1 sm:px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-accent-primary">
        IST
      </span>

      {/* Hairline Divider */}
      <span className="h-3 sm:h-3.5 w-[1px] bg-border-hairline shrink-0" aria-hidden="true" />

      {/* Rolling Counter Clock in HH : MM : SS */}
      <div
        className="counter flex items-center font-mono text-[12px] sm:text-[14px] font-bold tracking-wider tabular-nums leading-none overflow-hidden select-none"
        style={{
          height: "22px",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      >
        {/* Hours (00 - 23) */}
        <CounterDigit value={time.hh[0]} max={2} entranceDelay={0} />
        <CounterDigit value={time.hh[1]} max={9} entranceDelay={40} />

        {/* Pulsing Colon */}
        <span className="inline-flex h-[22px] items-center justify-center px-0.5 text-accent-primary/80 font-bold select-none animate-pulse">
          :
        </span>

        {/* Minutes (00 - 59) */}
        <CounterDigit value={time.mm[0]} max={5} entranceDelay={80} />
        <CounterDigit value={time.mm[1]} max={9} entranceDelay={120} />

        {/* Pulsing Colon */}
        <span className="inline-flex h-[22px] items-center justify-center px-0.5 text-accent-primary/80 font-bold select-none animate-pulse">
          :
        </span>

        {/* Seconds (00 - 59) in accent highlight */}
        <CounterDigit value={time.ss[0]} max={5} isAccent entranceDelay={160} />
        <CounterDigit value={time.ss[1]} max={9} isAccent entranceDelay={200} />
      </div>

      {/* UTC Offset Label on wider screens (only in standalone mode) */}
      {!embedded && (
        <span className="hidden xl:inline font-mono text-micro font-normal text-text-tertiary">
          (UTC+5:30)
        </span>
      )}
    </div>
  );

  if (embedded) {
    return (
      <Tooltip content="Indian Standard Time (UTC+5:30) • Live Clock" side="bottom">
        <div className="cursor-default flex items-center">{clockContent}</div>
      </Tooltip>
    );
  }

  return (
    <Tooltip content="Indian Standard Time (UTC+5:30) • Live Clock" side="bottom">
      <div
        className={`group inline-flex h-8 sm:h-9 items-center gap-1.5 sm:gap-2.5 rounded-lg border border-border-hairline bg-surface-pill/80 px-2.5 sm:px-3.5 backdrop-blur-md shadow-card cursor-default select-none transition-all duration-200 hover:border-border-glass hover:bg-surface-elevated/90 ${className}`}
      >
        {clockContent}
      </div>
    </Tooltip>
  );
}
