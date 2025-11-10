import {
  useState,
  useEffect,
  useRef,
  useCallback,
  TouchEvent,
  MouseEvent,
} from "react";
import { ZoomInIcon, ZoomOutIcon } from "@heroicons/react/solid";
import { Photo } from "../../types";

interface PhotoGalleryProps {
  photos: Photo[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 }); // percentage
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex + 1) % photos.length;
    setSelectedIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  }, [selectedIndex, photos]);

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return;
    const prevIndex = (selectedIndex - 1 + photos.length) % photos.length;
    setSelectedIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  }, [selectedIndex, photos]);

  // Scroll lightbox content into view when photo changes (fixes mobile centering)
  useEffect(() => {
    if (selectedPhoto && lightboxRef.current) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        lightboxRef.current?.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedPhoto, selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
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

  const openPhoto = (
    photo: Photo,
    index: number,
    buttonRef?: HTMLButtonElement
  ) => {
    if (buttonRef) {
      triggerButtonRef.current = buttonRef;
    }
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
    setSelectedIndex(null);
    setIsZoomed(false);
    setZoomOrigin({ x: 50, y: 50 }); // Reset zoom origin
    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
      triggerButtonRef.current = null;
    }
  };

  const toggleZoom = (e?: MouseEvent<HTMLImageElement>) => {
    if (!isZoomed && e && imageRef.current && imageContainerRef.current) {
      // Calculate click position relative to image
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomOrigin({ x, y });

      // Zoom in, then scroll to the clicked position
      setIsZoomed(true);

      setTimeout(() => {
        if (imageContainerRef.current && imageRef.current) {
          const container = imageContainerRef.current;
          const img = imageRef.current;

          // Calculate the zoomed image dimensions (200% of original)
          const zoomedWidth = img.naturalWidth * 2;
          const zoomedHeight = img.naturalHeight * 2;

          // Calculate where the click point is in the zoomed image
          const clickX = zoomedWidth * (x / 100);
          const clickY = zoomedHeight * (y / 100);

          // Scroll to center the clicked point in the viewport
          const scrollX = clickX - container.clientWidth / 2;
          const scrollY = clickY - container.clientHeight / 2;

          container.scrollTo({
            left: Math.max(0, scrollX),
            top: Math.max(0, scrollY),
            behavior: "smooth",
          });
        }
      }, 100);
    } else if (!isZoomed) {
      // If no event (e.g., zoom button clicked), zoom to center
      setZoomOrigin({ x: 50, y: 50 });
      setIsZoomed(true);
    } else {
      // Zoom out
      setIsZoomed(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={(e) => openPhoto(photo, index, e.currentTarget)}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus-ring"
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

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closePhoto}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo viewer: ${
            selectedPhoto.caption || selectedPhoto.alt
          }`}
        >

          {photos.length > 1 && (
            <>
              <button
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-6xl hover:text-slate-200 focus-ring rounded px-4 py-2 z-10"
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-6xl hover:text-slate-200 focus-ring rounded px-4 py-2 z-10"
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}

          <div
            ref={lightboxRef}
            className={`w-full relative ${
              isZoomed ? "overflow-auto max-h-[90vh] max-w-full" : "max-w-4xl"
            }`}
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            {/* Control buttons positioned relative to photo */}
            <div className="absolute top-2 right-2 flex gap-2 z-20">
              <button
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  toggleZoom();
                }}
                className="text-white p-2 bg-black/50 hover:bg-black/70 rounded-full focus-ring transition-colors"
                aria-label={isZoomed ? "Zoom out" : "Zoom in"}
              >
                {isZoomed ? (
                  <ZoomOutIcon className="w-6 h-6" />
                ) : (
                  <ZoomInIcon className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={(e: MouseEvent) => {
                  e.stopPropagation();
                  closePhoto();
                }}
                className="text-white text-4xl leading-none hover:text-slate-200 focus-ring rounded px-2"
                aria-label="Close lightbox"
              >
                ×
              </button>
            </div>

            <div
              ref={imageContainerRef}
              className={isZoomed ? "overflow-auto max-h-[85vh]" : ""}
              onTouchStart={(e: TouchEvent<HTMLDivElement>) => {
                if (isZoomed) return; // Don't handle swipe when zoomed
                const touch = e.touches[0];
                e.currentTarget.dataset.touchStartX = String(touch.clientX);
                e.currentTarget.dataset.touchStartY = String(touch.clientY);
              }}
              onTouchEnd={(e: TouchEvent<HTMLDivElement>) => {
                if (isZoomed) return;
                const touchStartX = parseFloat(
                  e.currentTarget.dataset.touchStartX || "0"
                );
                const touchStartY = parseFloat(
                  e.currentTarget.dataset.touchStartY || "0"
                );
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;

                const dx = touchEndX - touchStartX;
                const dy = touchEndY - touchStartY;

                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
                  if (dx > 0) {
                    goToPrevious();
                  } else {
                    goToNext();
                  }
                }
              }}
            >
              <img
                ref={imageRef}
                src={selectedPhoto.url}
                alt={selectedPhoto.alt}
                className={`transition-all duration-300 ${
                  isZoomed
                    ? "cursor-zoom-out w-auto h-auto"
                    : "w-full h-auto max-h-[85vh] object-contain cursor-zoom-in rounded-lg"
                }`}
                style={
                  isZoomed
                    ? {
                        minWidth: "200%",
                        minHeight: "200%",
                        transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                      }
                    : {}
                }
                onClick={(e: MouseEvent<HTMLImageElement>) => {
                  e.stopPropagation();
                  toggleZoom(e);
                }}
              />
            </div>
            {!isZoomed && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <p className="text-white text-center text-lg font-medium">
                  {selectedPhoto.caption}
                </p>
                {photos.length > 1 && selectedIndex !== null && (
                  <p className="text-slate-400 text-center text-sm mt-2">
                    {selectedIndex + 1} / {photos.length}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
