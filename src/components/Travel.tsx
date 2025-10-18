import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { GlobeAltIcon } from "@heroicons/react/solid";
import tripsData from "../data/trips.json";
import { TripCard } from "./Travel/TripCard";
import { generateTravelStructuredData } from "../utils/generateTravelStructuredData";

const Travel = () => {
  const location = useLocation();
  const isInitialMount = useRef(true);

  // Scroll to top when navigating from another route (not on page refresh/direct visit)
  useEffect(() => {
    // If this is the initial mount (page refresh/direct visit), don't scroll
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Scroll to top when navigating from another route
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Generate structured data from all trips for SEO
  const structuredData = useMemo(
    () => generateTravelStructuredData(tripsData),
    []
  );

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
