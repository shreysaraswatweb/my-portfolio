import { useState, useEffect, useRef } from "react";
import "./PortfolioLoader.css";

const STEPS = [
  [0, "Booting up…"],
  [22, "Compiling components…"],
  [48, "Wiring up APIs…"],
  [72, "Polishing the UI…"],
  [92, "Almost there…"],
  [100, "Ready"],
];

export default function PortfolioLoader({ onComplete }) {
  const [isDone, setIsDone] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  const fillRef = useRef(null);
  const pctRef = useRef(null);
  const msgRef = useRef(null);

  const rAFRef = useRef(null);
  const finishTimeoutRef = useRef(null);
  const cleanupTimeoutRef = useRef(null);

  useEffect(() => {
    // Lock background scrolling while the intro loader runs
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let current = 0;
    let velocity = 0;
    let lastTime = performance.now();
    const startTime = performance.now();
    const DURATION = 3500; // Slower, calm, silky smooth inertial travel (~3.5s)
    let hasCompleted = false;

    const frame = (now) => {
      // Clamped delta-time to ensure seamless playback across 60Hz - 120Hz+ displays
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / DURATION);

      // Smooth progression curve: accelerates out of the gate, cruises steadily with inertia, glides gracefully into 100%
      const target = 100 * (1 - Math.pow(1 - t, 2.3));

      // Inertial spring physics:
      // Spring force pulls smoothly towards target; exponential velocity damping creates physical mass & momentum
      const springForce = (target - current) * 11;
      velocity += springForce * dt;
      velocity *= Math.pow(0.06, dt); // Inertial friction / air damping
      current += velocity * dt;

      if (t >= 1 && 100 - current < 0.15) {
        current = 100;
      }

      const clamped = Math.max(0, Math.min(100, current));
      const rounded = Math.floor(clamped);

      // Direct DOM mutation for 120fps hardware-composited rendering
      if (fillRef.current) {
        fillRef.current.style.width = `${clamped.toFixed(2)}%`;
      }
      if (pctRef.current) {
        pctRef.current.textContent = `${rounded}%`;
      }
      if (msgRef.current) {
        for (let i = STEPS.length - 1; i >= 0; i--) {
          if (rounded >= STEPS[i][0]) {
            msgRef.current.textContent = STEPS[i][1];
            break;
          }
        }
      }

      if (current < 99.98 && !hasCompleted) {
        rAFRef.current = requestAnimationFrame(frame);
      } else if (!hasCompleted) {
        hasCompleted = true;
        if (fillRef.current) fillRef.current.style.width = "100%";
        if (pctRef.current) pctRef.current.textContent = "100%";
        if (msgRef.current) msgRef.current.textContent = "Ready";

        // Calm pause on 100% "Ready" before initiating the slow cinematic fade
        finishTimeoutRef.current = setTimeout(() => {
          setIsDone(true);
          document.body.style.overflow = previousOverflow;

          // Remove from DOM after the 1.15s slow fade-out transition completes
          cleanupTimeoutRef.current = setTimeout(() => {
            setIsRendered(false);
            if (onComplete) onComplete();
          }, 1200);
        }, 520);
      }
    };

    rAFRef.current = requestAnimationFrame(frame);

    return () => {
      if (rAFRef.current) cancelAnimationFrame(rAFRef.current);
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
        <div className="portfolio-loader-orbit" aria-hidden="true">
          <span className="portfolio-loader-orbit-ring" />
          <span className="portfolio-loader-orbit-dot" />
        </div>

        {/* Gradient Progress Bar */}
        <div className="portfolio-loader-bar">
          <div ref={fillRef} className="portfolio-loader-fill" />
        </div>

        {/* Meta Status & Numeric Percentage */}
        <div className="portfolio-loader-meta">
          <span className="portfolio-loader-status">
            <i className="portfolio-loader-dot" />
            <span ref={msgRef}>Booting up…</span>
          </span>
          <span ref={pctRef} className="portfolio-loader-pct">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
