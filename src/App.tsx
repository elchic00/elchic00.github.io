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
        <main className="text-slate-200 bg-slate-950 body-font scrollbar-hide">
          <Navbar />
          <ScrollToHash />
          <AppRoutes />
          {/* <ScrollToTopButton /> */}
          <Footer />
          <AIChatAssistant />
          <ToastContainer />
        </main>
      </ToastProvider>
    </ErrorBoundary>
  );
};