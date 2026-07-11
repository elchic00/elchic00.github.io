interface Photo {
  url: string;
  alt: string;
  caption: string;
}

interface Trip {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  photos: Photo[];
}

/**
 * Generates Schema.org ImageGallery structured data for all travel photos
 * @param trips - Array of trip data from trips.json
 * @returns Structured data object for SEO/rich snippets
 */
export const generateTravelStructuredData = (trips: Trip[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Andrew Alagna Travel Photos",
    description:
      "Andrew Alagna's travel photos from Ecuador, the Galapagos Islands, Thailand, Laos, Costa Rica, and Puerto Rico. Showcasing wildlife, landscapes, temples, hikes, and cultural experiences.",
    author: {
      "@type": "Person",
      name: "Andrew Alagna",
      url: "https://elchic00.github.io",
    },
    image: trips.flatMap((trip) =>
      trip.photos.map((photo) => ({
        "@type": "ImageObject",
        contentUrl: `https://elchic00.github.io${photo.url.replace('.webp', '.jpeg')}`,
        description: photo.alt,
        name: `${photo.caption} - ${trip.location}`,
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
        locationCreated: trip.location,
      }))
    ),
  };
};
