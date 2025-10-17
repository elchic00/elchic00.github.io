import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { GlobeIcon } from "@heroicons/react/solid";
import tripsData from "../data/trips.json";
import { TripCard } from "./Travel/TripCard";

const Travel = () => {
  const location = useLocation();
  const isInitialMount = useRef(true);

  // Scroll to top only when navigating from another route, not on page refresh
  useEffect(() => {
    // If this is the initial mount (page refresh/direct visit), don't scroll
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only scroll to top when navigating from another route
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Memoize structured data to prevent recreation on every render
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Andrew Alagna's Galapagos Travel Photography",
    description:
      "Andrew Alagna's travel photography from Ecuador and the Galapagos Islands",
    author: {
      "@type": "Person",
      name: "Andrew Alagna",
      url: "https://elchic00.github.io",
    },
    image: [
      {
        "@type": "ImageObject",
        contentUrl:
          "https://elchic00.github.io/images/travel/andrew-alagna-turtle-friend.jpeg",
        description:
          "Andrew Alagna snorkeling with sea turtles in Galapagos Islands, Ecuador",
        name: "Andrew Alagna - Turtle Snorkeling",
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
      },
      {
        "@type": "ImageObject",
        contentUrl:
          "https://elchic00.github.io/images/travel/andrew-alagna-turtle-snorkle.jpeg",
        description:
          "Andrew Alagna swimming alongside sea turtles underwater in Galapagos",
        name: "Andrew Alagna - Underwater Turtle Photography",
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
      },
      {
        "@type": "ImageObject",
        contentUrl:
          "https://elchic00.github.io/images/travel/andrew-alagna-blue-foot-boobie.jpeg",
        description:
          "Andrew Alagna photographing blue-footed boobies in Galapagos Islands",
        name: "Andrew Alagna - Blue-Footed Booby Galapagos",
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
      },
      {
        "@type": "ImageObject",
        contentUrl:
          "https://elchic00.github.io/images/travel/andrew-alagna-sea-lions.jpeg",
        description:
          "Andrew Alagna's photograph of sea lions colony in Galapagos, Ecuador",
        name: "Andrew Alagna - Sea Lions Galapagos Beach",
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
      },
      {
        "@type": "ImageObject",
        contentUrl:
          "https://elchic00.github.io/images/travel/andrew-alagna-isabella-island.jpeg",
        description:
          "Andrew Alagna at Isabela Island welcome sign in Galapagos, Ecuador",
        name: "Andrew Alagna - Isabela Island Galapagos",
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
      },
      {
        "@type": "ImageObject",
        contentUrl:
          "https://elchic00.github.io/images/travel/andrew-alagna-equator.jpeg",
        description:
          "Andrew Alagna standing at the equator monument in Ecuador",
        name: "Andrew Alagna - Equator Line Ecuador",
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
      },
      {
        "@type": "ImageObject",
        contentUrl:
          "https://elchic00.github.io/images/travel/andrew-alagna-sunset-boats.jpeg",
        description:
          "Andrew Alagna's sunset photography over boats in Galapagos Islands",
        name: "Andrew Alagna - Galapagos Sunset",
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
      },
      {
        "@type": "ImageObject",
        contentUrl:
          "https://elchic00.github.io/images/travel/andrew-alagna-sea-horse.jpeg",
        description:
          "Andrew Alagna's underwater photograph of seahorse in Galapagos",
        name: "Andrew Alagna - Seahorse Underwater Photography",
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
      },
      {
        "@type": "ImageObject",
        contentUrl:
          "https://elchic00.github.io/images/travel/andrew-alagna-inactive-volcano.jpeg",
        description:
          "Andrew Alagna hiking the inactive volcano rim in Galapagos Islands",
        name: "Andrew Alagna - Volcano Hiking Galapagos",
        author: { "@type": "Person", name: "Andrew Alagna" },
        copyrightHolder: { "@type": "Person", name: "Andrew Alagna" },
        creator: { "@type": "Person", name: "Andrew Alagna" },
      },
    ],
  }), []);

  return (
    <section id="travel" className="body-font mt-16 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container px-5 py-10 mx-auto lg:px-40">
        <header className="flex flex-col w-full mb-12 text-center">
          <GlobeIcon
            className="mx-auto inline-block w-10 mb-4"
            aria-hidden="true"
          />
          <h2 className="sm:text-4xl text-3xl font-medium title-font text-white underline-offset-4 underline mb-4">
            Travel Adventures
          </h2>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-gray-400">
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
          <div className="text-center text-gray-400 py-20">
            <p>More travel adventures coming soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Travel;
