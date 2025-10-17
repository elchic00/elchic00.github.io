import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { ZoomInIcon, ZoomOutIcon } from "@heroicons/react/solid";

export const PhotoGallery = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToNext = () => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex + 1) % photos.length;
    setSelectedIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  };

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    const prevIndex = (selectedIndex - 1 + photos.length) % photos.length;
    setSelectedIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
        setSelectedIndex(null);
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, photos]);

  const openPhoto = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
    setSelectedIndex(null);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => openPhoto(photo, index)}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-lime-500"
            aria-label={`View ${photo.alt}`}
          >
            <img
              src={photo.url}
              alt={photo.alt}
              loading={index < 3 ? "eager" : "lazy"}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-medium">
                  {photo.caption}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closePhoto}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {/* Zoom Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleZoom();
              }}
              className="text-white p-2 bg-black/50 hover:bg-black/70 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-500 transition-colors"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? (
                <ZoomOutIcon className="w-6 h-6" />
              ) : (
                <ZoomInIcon className="w-6 h-6" />
              )}
            </button>
            {/* Close Button */}
            <button
              onClick={closePhoto}
              className="text-white text-4xl hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded"
              aria-label="Close lightbox"
            >
              ×
            </button>
          </div>

          {/* Previous/Next Navigation Buttons */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-6xl hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded px-4 py-2 z-10"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-6xl hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-500 rounded px-4 py-2 z-10"
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}

          <div
            className={`w-full relative ${
              isZoomed ? "overflow-auto max-h-[90vh] max-w-full" : "max-w-4xl"
            }`}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              if (isZoomed) return; // Don't handle swipe when zoomed
              const touch = e.touches[0];
              e.currentTarget.dataset.touchStartX = touch.clientX;
              e.currentTarget.dataset.touchStartY = touch.clientY;
            }}
            onTouchEnd={(e) => {
              if (isZoomed) return; // Don't handle swipe when zoomed
              const touchStartX = parseFloat(
                e.currentTarget.dataset.touchStartX
              );
              const touchStartY = parseFloat(
                e.currentTarget.dataset.touchStartY
              );
              const touchEndX = e.changedTouches[0].clientX;
              const touchEndY = e.changedTouches[0].clientY;

              const dx = touchEndX - touchStartX;
              const dy = touchEndY - touchStartY;

              // Only trigger swipe if horizontal movement is greater than vertical
              if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                if (dx > 0) {
                  // Swipe right - go to previous
                  goToPrevious();
                } else {
                  // Swipe left - go to next
                  goToNext();
                }
              }
            }}
          >
            <div className={isZoomed ? "overflow-auto" : ""}>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.alt}
                className={`rounded-lg transition-all duration-300 ${
                  isZoomed
                    ? "cursor-zoom-out w-auto h-auto"
                    : "w-full h-auto max-h-[85vh] object-contain cursor-zoom-in"
                }`}
                style={isZoomed ? { minWidth: "200%", minHeight: "200%" } : {}}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <p className="text-white text-center text-lg font-medium">
                {selectedPhoto.caption}
              </p>
              {photos.length > 1 && (
                <p className="text-gray-400 text-center text-sm mt-2">
                  {selectedIndex + 1} / {photos.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

PhotoGallery.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
    })
  ).isRequired,
};
