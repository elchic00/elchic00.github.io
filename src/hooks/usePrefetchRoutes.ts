/**
 * Prefetches the JS chunks for lazy-loaded routes once the browser is idle
 * after initial load, so the first click into any of them is served from
 * cache instead of paying a fresh network fetch.
 *
 * Deliberately not gated by any interaction (hover, nav visibility) - the
 * chunks are small and this site's own routes are the only place a visitor
 * can navigate to, so warming all of them is simpler than tracking which
 * links are on screen for a marginal difference in bytes fetched.
 */

import { useEffect } from "react";

const prefetchLazyRoutes = () => {
  import("../pages/case-studies/HermesCaseStudy");
  import("../pages/case-studies/InferenceCaseStudy");
  import("../pages/case-studies/PiCloudCaseStudy");
  import("../pages/case-studies/ChatbotCaseStudy");
  import("../pages/case-studies/JobfitCaseStudy");
  import("../components/Travel");
  import("../components/Snake");
};

export const usePrefetchRoutes = (): void => {
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(prefetchLazyRoutes, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    // Safari has no requestIdleCallback - a short delay still keeps this
    // off the critical initial-render path.
    const id = setTimeout(prefetchLazyRoutes, 2000);
    return () => clearTimeout(id);
  }, []);
};
