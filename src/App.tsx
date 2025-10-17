import {AppRoutes} from "./routes";
import {Navbar} from "./components/Navbar";
import {ErrorBoundary} from "./components/ErrorBoundary";

export const App = () => {
  return (
    <ErrorBoundary>
      <main className="text-slate-200 bg-slate-950 body-font scrollbar-hide">
          <Navbar/>
          <AppRoutes/>
      </main>
    </ErrorBoundary>
  );
}
