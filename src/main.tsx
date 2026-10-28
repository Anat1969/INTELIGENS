import { ThemeProvider } from "next-themes";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initPwa } from "./lib/pwa";
import { goToCanonical, isMirror } from "./lib/canonical";
import { pendingCount, subscribePending } from "./lib/pending-images";

// Old addresses move to the main one. Images still waiting in this browser are
// uploaded first (AppNav flushes them); the move happens once the queue is empty.
if (isMirror()) {
  if (pendingCount() === 0) goToCanonical();
  else
    subscribePending(() => {
      if (pendingCount() === 0) goToCanonical();
    });
}

initPwa();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" forcedTheme="light" defaultTheme="light" enableSystem={false}>
    <App />
  </ThemeProvider>,
);
