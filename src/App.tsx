import { AppRoutes } from "./routes";
import { Navbar } from "@components/Navbar";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { ScrollToHash } from "@components/ScrollToHash";
import { ScrollToTopButton } from "@components/shared/ScrollToTopButton";
import { AIChatAssistant } from "@components/AIChatAssistant";

export const App = () => {
  return (
    <ErrorBoundary>
      <main className="text-slate-200 bg-slate-950 body-font scrollbar-hide">
        <Navbar />
        <ScrollToHash />
        <AppRoutes />
        <ScrollToTopButton />
        <AIChatAssistant />
      </main>
    </ErrorBoundary>
  );
};
