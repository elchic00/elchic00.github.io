import { useEffect, useState, useRef } from "react";

/**
 * Tracks which trip section is currently active based on scroll position and URL hash.
 * Automatically updates the URL hash as users scroll through different trip sections
 * and highlights the most visible trip in the viewport.
 *
 * @param tripIds - Array of trip IDs to track (should correspond to element IDs in the DOM)
 * @returns The ID of the currently active/most visible trip, or null if none are visible
 */
export const useActiveTrip = (tripIds: string[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const intersectingTripsRef = useRef<Map<string, number>>(new Map());
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    // Skip if no trip IDs provided
    if (!tripIds.length) return;

    // Set initial active ID from hash
    const fullHash = window.location.hash;
    const hashParts = fullHash.split('#');
    const tripHash = hashParts[hashParts.length - 1];

    if (tripHash && tripIds.includes(tripHash)) {
      setActiveId(tripHash);
    }

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;

          if (entry.isIntersecting) {
            intersectingTripsRef.current.set(id, entry.intersectionRatio);
          } else {
            intersectingTripsRef.current.delete(id);
          }
        });

        // Find most visible trip
        let maxRatio = 0;
        let mostVisibleTrip: string | null = null;

        intersectingTripsRef.current.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleTrip = id;
          }
        });

        if (mostVisibleTrip && mostVisibleTrip !== activeId) {
          setActiveId(mostVisibleTrip);
          
          // Update URL without triggering navigation
          if (!isUpdatingRef.current) {
            isUpdatingRef.current = true;
            try {
              window.history.replaceState(
                { ...window.history.state, tripId: mostVisibleTrip },
                "",
                `#/travel#${mostVisibleTrip}`
              );
            } catch (e) {
              console.warn('Failed to update URL:', e);
            }
            setTimeout(() => {
              isUpdatingRef.current = false;
            }, 100);
          }
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-150px 0px -40% 0px",
      }
    );

    // Observe all trip elements
    const observeElements = () => {
      tripIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(observeElements, 100);

    // Handle hash changes from manual navigation
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
      clearTimeout(timeoutId);
      observerRef.current?.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
      intersectingTripsRef.current.clear();
    };
  }, [tripIds]);

  return activeId;
};