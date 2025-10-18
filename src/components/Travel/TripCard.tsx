import { GlobeIcon } from "@heroicons/react/solid";
import { PhotoGallery } from "./PhotoGallery";
import { Trip } from "../../types";

interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  return (
    <article
      id={trip.id}
      className="mb-16 pb-16 border-b border-gray-700 last:border-b-0 scroll-mt-32"
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
