import { useEffect, useMemo } from "react";
import { GlobeAltIcon } from "@heroicons/react/solid";
import tripsData from "../data/structured/trips.json";
import { TripCard } from "./Travel/TripCard";
import { TripNavigation } from "./Travel/TripNavigation";
import { generateTravelStructuredData } from "../utils/generateTravelStructuredData";
import { useActiveTrip, useScrollReveal } from "../hooks";
import { TIMING } from "../constants";

export const Travel = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  
  // Compute these inside component to avoid issues with hot reload
  const tripIds = useMemo(() => tripsData.map((trip) => trip.id), []);
  const structuredData = useMemo(() => generateTravelStructuredData(tripsData), []);

  useEffect(() => {
    document.title = "Travel Adventures - Andrew Alagna";

    // Add structured data script to head
    const scriptId = "travel-structured-data";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    // Handle hash scrolling for BrowserRouter
    const handleHashScroll = () => {
      const hash = window.location.hash;
      
      // Extract trip ID from hash (format: #trip-id or #/travel#trip-id from old URLs)
      let tripId = "";
      if (hash.includes("#")) {
        const parts = hash.split("#");
        // Get the last part that's not empty and not "/travel"
        for (let i = parts.length - 1; i >= 0; i--) {
          const part = parts[i];
          if (part && part !== "/travel" && !part.startsWith("/")) {
            tripId = part;
            break;
          }
        }
      }

      if (tripId && tripId !== "travel") {
        const scrollToHash = () => {
          try {
            const element = document.getElementById(tripId);
            if (element) {
              setTimeout(() => {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }, TIMING.INITIAL_SCROLL_DELAY);
            }
          } catch (error) {
            console.warn('Invalid trip hash:', tripId);
          }
        };

        scrollToHash();
        setTimeout(scrollToHash, TIMING.LAYOUT_DELAY);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    handleHashScroll();

    return () => {
      // Clean up script on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [structuredData]);

  const activeId = useActiveTrip(tripIds);

  return (
    <section id="travel" className="body-font mt-16 min-h-screen">
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
