import { useEffect, useState } from "react";

export const useActiveTrip = (tripIds: string[]): string | null => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const fullHash = window.location.hash;
    const hashParts = fullHash.split('#');
    const tripHash = hashParts[hashParts.length - 1];

    if (tripHash && tripIds.includes(tripHash)) {
      setActiveId(tripHash);
    }

    const intersectingTrips = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;

          if (entry.isIntersecting) {
            intersectingTrips.set(id, entry.intersectionRatio);
          } else {
            intersectingTrips.delete(id);
          }
        });

        let maxRatio = 0;
        let mostVisibleTrip: string | null = null;

        intersectingTrips.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleTrip = id;
          }
        });

        if (mostVisibleTrip) {
          setActiveId(mostVisibleTrip);
          window.history.replaceState(null, "", `#/travel#${mostVisibleTrip}`);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-150px 0px -40% 0px",
      }
    );

    tripIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

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
