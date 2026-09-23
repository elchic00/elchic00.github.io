import { AppRoutes } from "./routes";
import {
  Navbar,
  Footer,
  ErrorBoundary,
  ScrollToHash,
  // ScrollToTopButton,
  AIChatAssistant,
  ToastContainer,
} from "@components";
import { ToastProvider } from "./contexts/ToastContext";
import { usePageTracking, usePrefetchRoutes } from "./hooks";

export const App = () => {
  // Track all page/route changes with Google Analytics
  usePageTracking();
  // Warm the cache for lazy routes (case studies, Travel, Snake) once idle,
  // so the first navigation to any of them doesn't pay a cold network fetch.
  usePrefetchRoutes();

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="text-slate-200 bg-slate-950 body-font scrollbar-hide">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:font-semibold focus:text-slate-950"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content" tabIndex={-1} className="outline-none">
            <ScrollToHash />
            <AppRoutes />
          </main>
          {/* <ScrollToTopButton /> */}
          <Footer />
          <AIChatAssistant />
          <ToastContainer />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
};