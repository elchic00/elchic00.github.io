import { GlobeIcon } from "@heroicons/react/solid";
import { PhotoGallery } from "./PhotoGallery";
import { Trip } from "../../types";
import { useScrollReveal, useWindowSize } from "../../hooks";
import { useState, useEffect } from "react";

interface TripCardProps {
  trip: Trip;
  isFirst?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, isFirst = false }) => {
  const { width } = useWindowSize();
  const isMobile = width < 1024; // lg breakpoint
  const [shouldAutoReveal, setShouldAutoReveal] = useState(false);
  const { ref, isVisible } = useScrollReveal();

  useEffect(() => {
    // Auto-reveal first trip on mobile after a short delay
    if (isFirst && isMobile) {
      const timer = setTimeout(() => {
        setShouldAutoReveal(true);
      }, 500); // Delay to allow header animation to complete first
      return () => clearTimeout(timer);
    }
  }, [isFirst, isMobile]);

  // Show if either: naturally scrolled into view OR auto-reveal on mobile for first trip
  const isShown = isVisible || shouldAutoReveal;

  return (
    <article
      ref={ref}
      id={trip.id}
      className={`mb-16 pb-16 border-b border-gray-700 last:border-b-0 scroll-mt-32 scroll-reveal ${isShown ? 'visible' : ''}`}
    >
      <header className="mb-6">
        <h3 className="text-3xl font-bold text-white mb-2">{trip.title}</h3>
        <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-3">
          <span className="flex items-center">
            <GlobeIcon className="w-4 h-4 mr-1" aria-hidden="true" />
            {trip.location}
          </span>
          <span>{trip.date}</span>
        </div>
        <p className="text-slate-200 leading-relaxed">{trip.description}</p>
      </header>

      <PhotoGallery photos={trip.photos} />
    </article>
  );
};
