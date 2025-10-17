import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import ResumePage from "./components/Resume";

// Lazy-load pages to keep the initial bundle smaller
const Travel = lazy(() => import("./components/Travel"));
const PlaySnake = lazy(() => import("./components/Snake"));

const LoadingFallback = () => <div className="text-center p-8">Loading...</div>;

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/resume" element={<ResumePage />} />
      <Route
        path="/travel"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Travel />
          </Suspense>
        }
      />
      <Route
        path="/snake"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PlaySnake />
          </Suspense>
        }
      />
    </Routes>
  );
};
