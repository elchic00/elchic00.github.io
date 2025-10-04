import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";

// Lazy-load the Snake page to keep the initial bundle smaller.
const PlaySnake = lazy(() => import("./components/Snake"));

const LoadingFallback = () => (
    <div className="text-center p-8">Loading...</div>
);

export const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/snake" element={<PlaySnake />} />
            </Routes>
        </Suspense>
    );
};