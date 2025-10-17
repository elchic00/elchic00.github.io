import {AppRoutes} from "./routes";
import {Navbar} from "./components/Navbar";
import {ErrorBoundary} from "./components/ErrorBoundary";

export const App = () => {
  return (
    <ErrorBoundary>
      <main className="text-gray-300 bg-gray-900 body-font scrollbar-hide">
          <Navbar/>
          <AppRoutes/>
      </main>
    </ErrorBoundary>
  );
}
