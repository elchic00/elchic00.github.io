import { AppRoutes } from "./routes";
import {
  Navbar,
  ErrorBoundary,
  ScrollToHash,
  ScrollToTopButton,
  AIChatAssistant,
  ToastContainer,
} from "@components";
import { ToastProvider } from "./contexts/ToastContext";
import { usePageTracking } from "./hooks";

export const App = () => {
  // Track all page/route changes with Google Analytics
  usePageTracking();

  return (
    <ErrorBoundary>
      <ToastProvider>
        <main className="text-slate-200 bg-slate-950 body-font scrollbar-hide">
          <Navbar />
          <ScrollToHash />
          <AppRoutes />
          <ScrollToTopButton />
          <AIChatAssistant />
          <ToastContainer />
        </main>
      </ToastProvider>
    </ErrorBoundary>
  );
};
