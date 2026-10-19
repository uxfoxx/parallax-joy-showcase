import { createRoot } from "react-dom/client";
// Self-hosted variable fonts (one file per font covers every weight), bundled
// into /assets/ with the rest of the build: no third-party request in the way
// of the first paint, and cached for a year like any other asset.
import "@fontsource-variable/sora";
import "@fontsource-variable/inter";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "@/lib/analytics";

initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
