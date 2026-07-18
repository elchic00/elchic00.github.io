import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "@pages/HomePage";
import { ProjectsPage } from "@pages/ProjectsPage";

// Lazy-load pages to keep the initial bundle smaller
const Travel = lazy(() => import("./components/Travel").then(module => ({ default: module.Travel })));
const PlaySnake = lazy(() => import("./components/Snake").then(module => ({ default: module.PlaySnake })));

// Case-study pages, one route per project card
const caseStudies = {
  "hermes": lazy(() => import("./pages/case-studies/HermesCaseStudy")),
  "inference-engine": lazy(() => import("./pages/case-studies/InferenceCaseStudy")),
  "pi-cloud": lazy(() => import("./pages/case-studies/PiCloudCaseStudy")),
  "elchic00-chatbot": lazy(() => import("./pages/case-studies/ChatbotCaseStudy")),
  "jobfit": lazy(() => import("./pages/case-studies/JobfitCaseStudy")),
};

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950 pt-24">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      {Object.entries(caseStudies).map(([id, Page]) => (
        <Route key={id} path={`/projects/${id}`} element={
          <Suspense fallback={<LoadingFallback />}>
            <Page />
          </Suspense>
        } />
      ))}
      <Route path="/travel" element={
        <Suspense fallback={<LoadingFallback />}>
          <Travel />
        </Suspense>
      } />
      <Route path="/snake" element={
        <Suspense fallback={<LoadingFallback />}>
          <PlaySnake />
        </Suspense>
      } />
    </Routes>
  );
};
