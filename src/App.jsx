import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MobileApp from "./layouts/MobileApp";
import DesktopDashboard from "./layouts/DesktopDashboard";
import useDesktop from "./hooks/useDesktop";

export default function App() {
  const isDesktop = useDesktop();
  const [active, setActive] = useState("home");

  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-canvas-mid bg-canvas-glow text-text-primary">
        <MobileApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-mid bg-canvas-glow text-text-primary">
      <div className="mx-auto flex min-h-screen max-w-shell gap-space-5">
        <Sidebar active={active} onNavigate={setActive} />
        <div className="min-w-0 flex-1">
          <DesktopDashboard />
        </div>
      </div>
    </div>
  );
}
