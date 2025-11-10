import { useEffect } from "react";
import { GlobeAltIcon } from "@heroicons/react/solid";
import tripsData from "../data/structured/trips.json";
import { TripCard } from "./Travel/TripCard";
import { TripNavigation } from "./Travel/TripNavigation";
import { generateTravelStructuredData } from "../utils/generateTravelStructuredData";
import { useActiveTrip, useScrollReveal } from "../hooks";
import { TIMING } from "../constants";

// Compute these once outside the component since tripsData is static
const structuredData = generateTravelStructuredData(tripsData);
const tripIds = tripsData.map((trip) => trip.id);

export const Travel = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();

  useEffect(() => {
    document.title = "Travel Adventures - Andrew Alagna";

    const fullHash = window.location.hash;
    const hashParts = fullHash.split('#');
    const tripHash = hashParts[hashParts.length - 1];

    if (tripHash && tripHash !== '/travel' && !tripHash.startsWith('/')) {
      const scrollToHash = () => {
        try {
          const element = document.getElementById(tripHash);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }, TIMING.INITIAL_SCROLL_DELAY);
          }
        } catch (error) {
          console.warn('Invalid trip hash:', tripHash);
        }
      };

      scrollToHash();
      setTimeout(scrollToHash, TIMING.LAYOUT_DELAY);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const activeId = useActiveTrip(tripIds);

  return (
    <section id="travel" className="body-font mt-16 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container px-5 py-10 mx-auto lg:px-40">
        <header
          ref={headerRef}
          className={`flex flex-col w-full mb-12 text-center scroll-reveal-scale ${headerVisible ? 'visible' : ''}`}
        >
          <GlobeAltIcon
            className="mx-auto inline-block w-10 mb-4 text-cyan-400"
            aria-hidden="true"
          />
          <h2 className="sm:text-4xl text-3xl font-bold title-font text-white underline-offset-4 underline decoration-cyan-500 mb-4">
            Travel Adventures
          </h2>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-slate-300">
            Exploring the world one trip at a time. Here are some of my favorite
            moments and places I've been lucky enough to visit.
          </p>
        </header>

        <TripNavigation trips={tripsData} activeId={activeId} />

        <div className="mt-12">
          {tripsData.map((trip, index) => (
            <TripCard key={trip.id} trip={trip} isFirst={index === 0} />
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

