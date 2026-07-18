import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./index.css";

// Lazy-loaded route chunks can 404 right after a new deploy replaces old
// hashed assets; recover with a single reload instead of a dead page.
window.addEventListener("vite:preloadError", () => window.location.reload());

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
