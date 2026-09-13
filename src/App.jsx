import { lazy, Suspense, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import useDesktop from "./hooks/useDesktop";

const MobileApp = lazy(() => import("./layouts/MobileApp"));
const DesktopDashboard = lazy(() => import("./layouts/DesktopDashboard"));
const Sidebar = lazy(() => import("./components/Sidebar"));

export default function App() {
  const isDesktop = useDesktop();
  const [active, setActive] = useState("home");

  return (
    <>
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