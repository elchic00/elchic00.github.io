import { AppRoutes } from "./routes";
import { Navbar } from "@components/Navbar";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { ScrollToHash } from "@components/ScrollToHash";
import { ScrollToTopButton } from "@components/shared/ScrollToTopButton";
import { AIChatAssistant } from "@components/AIChatAssistant";
import { ToastProvider } from "./contexts/ToastContext";
import { ToastContainer } from "@components/shared/ToastContainer";
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
