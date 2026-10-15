import { lazy, Suspense, useState, useEffect } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import useDesktop from "./hooks/useDesktop";
import PortfolioLoader from "./components/PortfolioLoader";

import MobileApp from "./layouts/MobileApp";
const DesktopDashboard = lazy(() => import("./layouts/DesktopDashboard"));
const Sidebar = lazy(() => import("./components/Sidebar"));

export default function App() {
  const isDesktop = useDesktop();
  const [active, setActive] = useState("home");
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Provide a global helper to replay loader on demand
    window.__replayPortfolioLoader = () => setShowLoader(true);
    const onReplay = () => setShowLoader(true);
    window.addEventListener("replay-loader", onReplay);
    return () => {
      window.removeEventListener("replay-loader", onReplay);
      delete window.__replayPortfolioLoader;
    };
  }, []);

  return (
    <>
      {showLoader && (
        <PortfolioLoader onComplete={() => setShowLoader(false)} />
      )}

      <main id="main-content">
        <Suspense fallback={null}>
          {!isDesktop ? (
            <div className="min-h-screen bg-canvas-mid bg-canvas-glow text-text-primary">
              <MobileApp />
            </div>
          ) : (
            <div className="min-h-screen bg-canvas-mid bg-canvas-glow text-text-primary">
              <div className="mx-auto flex min-h-screen max-w-shell gap-space-5">
                <Sidebar active={active} onNavigate={setActive} />

                <div className="min-w-0 flex-1">
                  <DesktopDashboard />
                </div>
              </div>
            </div>
          )}
        </Suspense>
      </main>

      <SpeedInsights />
      <Analytics />
    </>
  );
}