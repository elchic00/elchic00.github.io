import { useEffect, useState, useRef } from "react";

const HASH_NAVIGATION_OBSERVER_PAUSE_MS = 700;

const extractTripIdFromHash = (hash: string, tripIds: string[]): string => {
  const hashParts = hash.split('#');

  for (let i = hashParts.length - 1; i >= 0; i--) {
    const part = hashParts[i];
    if (part && part !== "/travel" && !part.startsWith("/") && tripIds.includes(part)) {
      return part;
    }
  }

  return "";
};

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
  const activeIdRef = useRef<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const intersectingTripsRef = useRef<Map<string, number>>(new Map());
  const isUpdatingRef = useRef(false);
  const observerPausedUntilRef = useRef(0);

  const setActiveTrip = (tripId: string | null) => {
    activeIdRef.current = tripId;
    setActiveId(tripId);
  };

  useEffect(() => {
    // Skip if no trip IDs provided
    if (!tripIds.length) return;

    // Set initial active ID from hash (handle both #trip-id and #/travel#trip-id formats)
    const tripHash = extractTripIdFromHash(window.location.hash, tripIds);

    if (tripHash) {
      setActiveTrip(tripHash);
    }

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (Date.now() < observerPausedUntilRef.current) {
          return;
        }

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

        if (mostVisibleTrip && mostVisibleTrip !== activeIdRef.current) {
          setActiveTrip(mostVisibleTrip);
          
          // Update URL without triggering navigation (BrowserRouter compatible)
          if (!isUpdatingRef.current) {
            isUpdatingRef.current = true;
            try {
              window.history.replaceState(
                { ...window.history.state, tripId: mostVisibleTrip },
                "",
                `/travel#${mostVisibleTrip}`
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
        rootMargin: "-180px 0px -45% 0px",
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
      const tripHash = extractTripIdFromHash(window.location.hash, tripIds);

      if (tripHash) {
        // Same-page hash navigation scrolls asynchronously. During that short
        // window, IntersectionObserver can report ratios from the old scroll
        // position and overwrite the new URL hash with a stale trip id.
        observerPausedUntilRef.current = Date.now() + HASH_NAVIGATION_OBSERVER_PAUSE_MS;
        intersectingTripsRef.current.clear();
        observerRef.current?.takeRecords();
        setActiveTrip(tripHash);
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
