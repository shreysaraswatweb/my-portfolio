import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </ThemeProvider>
  </StrictMode>,
);
