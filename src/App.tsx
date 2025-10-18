import {AppRoutes} from "./routes";
import {Navbar} from "./components/Navbar";
import {ErrorBoundary} from "./components/ErrorBoundary";
import {ScrollToHash} from "./components/ScrollToHash";

export const App = () => {
  return (
    <ErrorBoundary>
      <main className="text-slate-200 bg-slate-950 body-font scrollbar-hide">
          <Navbar/>
          <ScrollToHash/>
          <AppRoutes/>
      </main>
    </ErrorBoundary>
  );
}
