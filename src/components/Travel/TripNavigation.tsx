import { useEffect, useState } from "react";
import { Trip } from "../../types";

interface TripNavigationProps {
  trips: Trip[];
  activeId: string | null;
}

export const TripNavigation: React.FC<TripNavigationProps> = ({
  trips,
  activeId,
}) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Make sticky after scrolling past the header (200px)
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTrip = (tripId: string) => {
    const element = document.getElementById(tripId);
    if (element) {
      // Account for navbar (64px) + trip nav (60px) = 124px offset
      const offset = 124;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL hash while preserving the route (for HashRouter)
      // Format: /#/travel#tripId
      window.history.replaceState(null, "", `#/travel#${tripId}`);
    }
  };

  return (
    <nav
      className={`${
        isSticky
          ? "fixed top-16 left-0 right-0 z-40"
          : "relative"
      } bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 transition-all duration-300 ${
        isSticky ? "" : "border-t border-slate-700/50"
      }`}
      aria-label="Trip navigation"
    >
      <div className="container mx-auto px-5 lg:px-40">
        <div
          className={`flex items-center gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent ${
            isSticky ? "py-2" : "py-3"
          }`}
        >
          <span className="text-slate-400 text-sm font-medium whitespace-nowrap mr-2 hidden sm:block">
            Jump to:
          </span>
          {trips.map((trip) => {
            const isActive = activeId === trip.id;
            return (
              <button
                key={trip.id}
                onClick={() => scrollToTrip(trip.id)}
                className={`
                  ${isSticky ? "px-3 py-1.5" : "px-4 py-2"} rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-300 flex items-center gap-2
                  ${
                    isActive
                      ? "bg-cyan-600 text-white shadow-lg scale-105"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:scale-105"
                  }
                  focus:outline-none focus:ring-2 focus:ring-cyan-400
                `}
                aria-label={`Scroll to ${trip.title}`}
                aria-current={isActive ? "location" : undefined}
              >
                <span className="text-lg" aria-hidden="true">
                  {getCountryFlag(trip.location)}
                </span>
                <span>{trip.location}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

// Helper function to get country flags
function getCountryFlag(location: string): string {
  const flags: Record<string, string> = {
    Ecuador: "🇪🇨",
    Thailand: "🇹🇭",
    Laos: "🇱🇦",
    "Costa Rica": "🇨🇷",
    "Puerto Rico": "🇵🇷",
    Vietnam: "🇻🇳",
    Cambodia: "🇰🇭",
    Peru: "🇵🇪",
    Colombia: "🇨🇴",
    Brazil: "🇧🇷",
    Argentina: "🇦🇷",
    Chile: "🇨🇱",
    Mexico: "🇲🇽",
    Japan: "🇯🇵",
    "South Korea": "🇰🇷",
  };
  return flags[location] || "🌍";
}
