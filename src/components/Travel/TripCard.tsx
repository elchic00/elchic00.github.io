import { GlobeIcon } from "@heroicons/react/solid";
import { PhotoGallery } from "./PhotoGallery";
import { Trip } from "../../types";
import { useScrollReveal, useWindowSize } from "../../hooks";
import { useState, useEffect } from "react";
import { ImageWithLoader } from "../shared/ImageWithLoader";

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

  const [heroPhoto, ...galleryPhotos] = trip.photos;

  return (
    <article
      ref={ref}
      id={trip.id}
      className={`mb-16 pb-16 border-b border-gray-700 last:border-b-0 [scroll-margin-top:var(--travel-section-offset)] scroll-reveal ${isShown ? 'visible' : ''}`}
    >
      {heroPhoto ? (
        <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-lg overflow-hidden mb-6">
          <ImageWithLoader
            src={heroPhoto.url}
            alt={heroPhoto.alt}
            loading={isFirst ? "eager" : "lazy"}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"
            aria-hidden="true"
          />
          <header className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 drop-shadow-md">
              {trip.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-slate-100 text-sm drop-shadow-md">
              <span className="flex items-center">
                <GlobeIcon className="w-4 h-4 mr-1" aria-hidden="true" />
                {trip.location}
              </span>
              <span>{trip.date}</span>
            </div>
          </header>
        </div>
      ) : (
        <header className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">{trip.title}</h2>
          <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-3">
            <span className="flex items-center">
              <GlobeIcon className="w-4 h-4 mr-1" aria-hidden="true" />
              {trip.location}
            </span>
            <span>{trip.date}</span>
          </div>
        </header>
      )}

      <p className="text-slate-200 leading-relaxed mb-6">{trip.description}</p>

      <PhotoGallery photos={galleryPhotos} tripId={trip.id} />
    </article>
  );
};
