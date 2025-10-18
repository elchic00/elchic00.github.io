import { useEffect, useState } from "react";

/**
 * Hook to detect which trip is currently in the viewport
 * Uses Intersection Observer to track visible trips
 */
export const useActiveTrip = (tripIds: string[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // Check for hash in URL on mount
    // Format: #/travel#tripId -> extract tripId
    const fullHash = window.location.hash;
    const hashParts = fullHash.split('#');
    const tripHash = hashParts[hashParts.length - 1]; // Get last part after #

    if (tripHash && tripIds.includes(tripHash)) {
      setActiveId(tripHash);
    }

    // Track which trips are currently intersecting
    const intersectingTrips = new Map<string, number>();

    // Create a single observer for all trips
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;

          if (entry.isIntersecting) {
            // Store intersection ratio for this trip
            intersectingTrips.set(id, entry.intersectionRatio);
          } else {
            // Remove from tracking when not intersecting
            intersectingTrips.delete(id);
          }
        });

        // Find the trip with the highest intersection ratio
        let maxRatio = 0;
        let mostVisibleTrip: string | null = null;

        intersectingTrips.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleTrip = id;
          }
        });

        // Update active trip if we found one
        if (mostVisibleTrip) {
          setActiveId(mostVisibleTrip);
          // Update URL hash while preserving route (for HashRouter)
          // Format: /#/travel#tripId
          window.history.replaceState(null, "", `#/travel#${mostVisibleTrip}`);
        }
      },
      {
        // Use multiple thresholds for more precise detection
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        // Account for navbar (64px) + trip nav (60px) = 124px
        // Top margin accounts for sticky header, bottom margin focuses on upper portion
        rootMargin: "-150px 0px -40% 0px",
      }
    );

    // Observe all trip elements
    tripIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Handle hash changes from back/forward navigation
    const handleHashChange = () => {
      const fullHash = window.location.hash;
      const hashParts = fullHash.split('#');
      const tripHash = hashParts[hashParts.length - 1];

      if (tripHash && tripIds.includes(tripHash)) {
        setActiveId(tripHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [tripIds]);

  return activeId;
};
