import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import ResumePage from "./components/Resume";

// Lazy-load the Snake page to keep the initial bundle smaller.
const PlaySnake = lazy(() => import("./components/Snake"));

const LoadingFallback = () => (
    <div className="text-center p-8">Loading...</div>
);

export const AppRoutes = () => {
    return (
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/snake" element={
            <Suspense fallback={<LoadingFallback />}>
                <PlaySnake />
            </Suspense>
            } />
        </Routes>
);
};