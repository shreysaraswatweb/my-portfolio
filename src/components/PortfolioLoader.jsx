import { useState, useEffect, useRef } from "react";
import "./PortfolioLoader.css";

const STEPS = [
  [0, "Booting up…"],
  [25, "Compiling components…"],
  [50, "Wiring up APIs…"],
  [75, "Polishing the UI…"],
  [95, "Almost there…"],
  [100, "Ready"],
];

export default function PortfolioLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(STEPS[0][1]);
  const [isDone, setIsDone] = useState(false);
  const [isRendered, setIsRendered] = useState(true);
  const timerRef = useRef(null);
  const finishTimeoutRef = useRef(null);
  const cleanupTimeoutRef = useRef(null);

  useEffect(() => {
    // Lock scrolling while the intro loader runs
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let currentProgress = 0;

    timerRef.current = setInterval(() => {
      // Natural organic progress easing
      currentProgress = Math.min(
        100,
        currentProgress +
          Math.max(0.6, (100 - currentProgress) * 0.038) +
          Math.random() * 1.4
      );

      const rounded = Math.floor(currentProgress);
      setProgress(rounded);

      for (let i = STEPS.length - 1; i >= 0; i--) {
        if (rounded >= STEPS[i][0]) {
          setMessage(STEPS[i][1]);
          break;
        }
      }

      if (currentProgress >= 100) {
        clearInterval(timerRef.current);
        timerRef.current = null;

        // Brief hold at 100% "Ready" so it registers clearly
        finishTimeoutRef.current = setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = previousOverflow;

          // Remove from DOM after fade-out transition completes
          cleanupTimeoutRef.current = setTimeout(() => {
            setIsRendered(false);
            if (onComplete) onComplete();
          }, 650);
        }, 420);
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
      if (cleanupTimeoutRef.current) clearTimeout(cleanupTimeoutRef.current);
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);

  if (!isRendered) return null;

  return (
    <div
      className={`portfolio-loader-overlay ${isDone ? "is-done" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="portfolio-loader-wrap">
        {/* Monogram Box with Rotating Gradient & Zero Black Border */}
        <div className="portfolio-loader-logo">
          <span>SS</span>
        </div>

        {/* Identity Headings */}
        <div style={{ textAlign: "center" }}>
          <div className="portfolio-loader-name">
            Shrey <b>Saraswat</b>
          </div>
          <div className="portfolio-loader-role">
            Frontend Developer — React &amp; Angular
          </div>
        </div>

        {/* 3D Orbit Track & Planet Dot */}
        <div className="loader-orbit portfolio-loader-orbit" aria-hidden="true">
          <span className="portfolio-loader-orbit-ring" />
          <span className="portfolio-loader-orbit-dot" />
        </div>

        {/* Gradient Progress Bar */}
        <div className="portfolio-loader-bar">
          <div
            className="portfolio-loader-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Meta Status & Numeric Percentage */}
        <div className="portfolio-loader-meta">
          <span className="portfolio-loader-status">
            <i className="portfolio-loader-dot" />
            <span>{message}</span>
          </span>
          <span className="portfolio-loader-pct">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
