import PropTypes from 'prop-types';
import { GlobeIcon } from "@heroicons/react/solid";
import { PhotoGallery } from "./PhotoGallery";

export const TripCard = ({ trip }) => {
  return (
    <article className="mb-16 pb-16 border-b border-gray-700 last:border-b-0">
      <header className="mb-6">
        <h3 className="text-3xl font-bold text-white mb-2">{trip.title}</h3>
        <div className="flex flex-wrap gap-4 text-gray-400 text-sm mb-3">
          <span className="flex items-center">
            <GlobeIcon className="w-4 h-4 mr-1" aria-hidden="true" />
            {trip.location}
          </span>
          <span>{trip.date}</span>
        </div>
        <p className="text-gray-300 leading-relaxed">{trip.description}</p>
      </header>

      <PhotoGallery photos={trip.photos} />
    </article>
  );
};

TripCard.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    photos: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        alt: PropTypes.string.isRequired,
        caption: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
