import { useEffect, useState, useRef } from "react";
import { Trip } from "../../types";
import { TIMING } from "../../constants";

interface TripNavigationProps {
  trips: Trip[];
  activeId: string | null;
}

export const TripNavigation: React.FC<TripNavigationProps> = ({
  trips,
  activeId,
}) => {
  const [isSticky, setIsSticky] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > TIMING.STICKY_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (activeId && navContainerRef.current) {
      const activeButton = buttonRefs.current.get(activeId);
      if (activeButton) {
        const container = navContainerRef.current;
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollPosition =
          buttonLeft - containerWidth / 2 + buttonWidth / 2;

        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [activeId]);

  const scrollToTrip = (tripId: string) => {
    const element = document.getElementById(tripId);
    if (!element) return;

    // Force the nav into its fixed layout before measuring/scrolling. Otherwise
    // scrollIntoView computes the target against the current (possibly
    // non-sticky/relative) layout, the nav then flips to fixed mid-scroll once
    // scrollY crosses STICKY_THRESHOLD, and the final resting position lands
    // short by the nav's height — heading ends up hidden underneath it.
    setIsSticky(true);
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Update URL hash for the trip section (BrowserRouter compatible)
    window.history.replaceState(null, "", `/travel#${tripId}`);
  };

  return (
    <nav
      className={`${
        isSticky
          ? "fixed top-[var(--travel-global-nav-height)] left-0 right-0 z-40 shadow-lg"
          : "relative z-40 border-t border-slate-700/50"
      } min-h-[var(--travel-destination-nav-height)] bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 transition-all duration-300`}
      aria-label="Destination navigation"
    >
      <div className="container relative mx-auto px-5 lg:px-40">
        {/* Fade hint: the chip row overflows on mobile/tablet with no visual
            affordance that there's more to scroll — the last chip gets cut
            off mid-word. lg:hidden since the row is centered/non-overflowing
            at desktop widths (lg:justify-center below). */}
        <div
          className="pointer-events-none absolute bottom-0 right-5 top-0 z-10 w-8 bg-gradient-to-l from-slate-900/95 to-transparent lg:hidden"
          aria-hidden="true"
        />
        <div
          ref={navContainerRef}
          className={`flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent lg:justify-center ${
            isSticky ? "py-2 lg:py-1.5" : "py-3"
          }`}
        >
          <span
            className={`text-slate-400 font-medium whitespace-nowrap mr-2 hidden sm:inline ${
              isSticky ? "text-xs lg:text-sm" : "text-sm"
            }`}
          >
            Jump to:
          </span>
          {trips.map((trip) => {
            const isActive = activeId === trip.id;
            return (
              <button
                key={trip.id}
                ref={(el) => {
                  if (el) {
                    buttonRefs.current.set(trip.id, el);
                  } else {
                    buttonRefs.current.delete(trip.id);
                  }
                }}
                onClick={() => scrollToTrip(trip.id)}
                className={`
                  ${
                    isSticky
                      ? "px-2.5 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm"
                      : "px-4 py-2 text-sm"
                  }
                  rounded-full font-medium whitespace-nowrap
                  transition-all duration-300 flex items-center gap-1.5
                  ${
                    isActive
                      ? "bg-cyan-600 text-white shadow-lg scale-105"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:scale-105"
                  }
                  focus-ring
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
