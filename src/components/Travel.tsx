import { useEffect, useMemo } from "react";
import { GlobeAltIcon } from "@heroicons/react/solid";
import tripsData from "../data/trips.json";
import { TripCard } from "./Travel/TripCard";
import { TripNavigation } from "./Travel/TripNavigation";
import { generateTravelStructuredData } from "../utils/generateTravelStructuredData";
import { useActiveTrip } from "../hooks";

const Travel = () => {
  // Handle initial scroll on mount
  useEffect(() => {
    const fullHash = window.location.hash;
    // Format: #/travel#tripId -> extract tripId
    const hashParts = fullHash.split('#');
    const tripHash = hashParts[hashParts.length - 1];

    // Check if there's a trip hash (not just the route)
    if (tripHash && tripHash !== '/travel' && !tripHash.startsWith('/')) {
      // If there's a trip hash, scroll to that trip after content loads
      const scrollToHash = () => {
        try {
          const element = document.getElementById(tripHash);
          if (element) {
            // Use setTimeout to ensure DOM is fully rendered
            setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }
        } catch (error) {
          // Invalid selector, ignore
          console.warn('Invalid trip hash:', tripHash);
        }
      };

      // Try immediately and also after a short delay for images
      scrollToHash();
      setTimeout(scrollToHash, 300);
    } else {
      // No trip hash, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // Generate structured data from all trips for SEO
  const structuredData = useMemo(
    () => generateTravelStructuredData(tripsData),
    []
  );

  // Track which trip is currently visible
  const tripIds = useMemo(() => tripsData.map((trip) => trip.id), []);
  const activeId = useActiveTrip(tripIds);

  return (
    <section id="travel" className="body-font mt-16 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container px-5 py-10 mx-auto lg:px-40">
        <header className="flex flex-col w-full mb-12 text-center">
          <GlobeAltIcon
            className="mx-auto inline-block w-10 mb-4"
            aria-hidden="true"
          />
          <h2 className="sm:text-4xl text-3xl font-medium title-font text-white underline-offset-4 underline mb-4">
            Travel Adventures
          </h2>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-slate-400">
            Exploring the world one trip at a time. Here are some of my favorite
            moments and places I've been lucky enough to visit.
          </p>
        </header>

        {/* Sticky trip navigation */}
        <TripNavigation trips={tripsData} activeId={activeId} />

        <div className="mt-12">
          {tripsData.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {tripsData.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            <p>More travel adventures coming soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Travel;
