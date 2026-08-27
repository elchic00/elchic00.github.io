import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useId,
  TouchEvent,
  MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { ZoomInIcon, ZoomOutIcon, PlayIcon } from "@heroicons/react/solid";
import { Photo } from "../../types";
import { ImageWithLoader } from "../shared/ImageWithLoader";
import { getGalleryItemLayout, getTripPatternOffset } from "./galleryLayout";

interface PhotoGalleryProps {
  photos: Photo[];
  tripId?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, tripId = "" }) => {
  const patternOffset = getTripPatternOffset(tripId);
  const galleryId = useId();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<0 | 1 | 2>(0); // 0=fit (100%), 1=125%, 2=175%
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  const ZOOM_LEVELS = {
    0: { scale: 1, label: "Fit to screen" },
    1: { scale: 1.25, label: "125% zoom" },
    2: { scale: 1.75, label: "175% zoom" },
  };

  const closePhoto = useCallback(() => {
    setSelectedPhoto(null);
    setSelectedIndex(null);
    setZoomLevel(0);
    setZoomOrigin({ x: 50, y: 50 });
    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
      triggerButtonRef.current = null;
    }
  }, []);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    const nextIndex = (selectedIndex + 1) % photos.length;
    setSelectedIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
    setZoomLevel(0);
    setZoomOrigin({ x: 50, y: 50 });
  }, [selectedIndex, photos]);

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return;
    const prevIndex = (selectedIndex - 1 + photos.length) % photos.length;
    setSelectedIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
    setZoomLevel(0);
    setZoomOrigin({ x: 50, y: 50 });
  }, [selectedIndex, photos]);

  useEffect(() => {
    if (selectedPhoto && lightboxRef.current) {
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
        e.preventDefault();
        closePhoto();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => !element.hasAttribute("disabled"));

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!dialogRef.current.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        } else if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, closePhoto, goToNext, goToPrevious]);

  useEffect(() => {
    if (!selectedPhoto) return;

    const timeoutId = window.setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [selectedPhoto]);

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

  const toggleZoom = (e?: MouseEvent<HTMLImageElement>) => {
    // Cycle through zoom levels: 0 → 1 → 2 → 0
    const nextLevel = ((zoomLevel + 1) % 3) as 0 | 1 | 2;

    // If zooming in and click event provided
    if (nextLevel > 0 && e && imageRef.current && imageContainerRef.current) {
      const img = imageRef.current;
      const rect = img.getBoundingClientRect();

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const x = (clickX / rect.width) * 100;
      const y = (clickY / rect.height) * 100;
      setZoomOrigin({ x, y });

      setZoomLevel(nextLevel);

      setTimeout(() => {
        if (imageContainerRef.current && imageRef.current) {
          const container = imageContainerRef.current;
          const zoomedImg = imageRef.current;
          const zoomedRect = zoomedImg.getBoundingClientRect();

          const clickXInZoomed = (clickX / rect.width) * zoomedRect.width;
          const clickYInZoomed = (clickY / rect.height) * zoomedRect.height;

          const scrollX = clickXInZoomed - container.clientWidth / 2;
          const scrollY = clickYInZoomed - container.clientHeight / 2;

          container.scrollTo({
            left: Math.max(0, scrollX),
            top: Math.max(0, scrollY),
            behavior: "smooth",
          });
        }
      }, 100);
    } else {
      // Either zooming out to fit, or zooming without click position
      setZoomOrigin({ x: 50, y: 50 });
      setZoomLevel(nextLevel);
    }
  };

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {photos.map((photo, index) => {
          const layout = getGalleryItemLayout(index, photos.length, patternOffset);
          const captionId = `${galleryId}-caption-${index}`;

          return (
            <button
              key={index}
              onClick={(e) => openPhoto(photo, index, e.currentTarget)}
              className={`
                group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-[1.25rem]
                bg-slate-900 text-left transition-transform duration-300
                hover:scale-[1.01] focus-ring
                ${layout.itemClass}
              `}
              aria-label={`View ${photo.alt}`}
              aria-describedby={captionId}
            >
              <figure className="relative w-full">
                <div className={`relative w-full overflow-hidden ${layout.imageClass}`}>
                  <ImageWithLoader
                    src={photo.url}
                    alt={photo.alt}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035] group-focus:scale-[1.035]"
                  />
                  {photo.video && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="rounded-full bg-black/50 p-3">
                        <PlayIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100"
                  aria-hidden="true"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4" id={captionId}>
                  <span className="block max-w-2xl rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2 text-xs font-medium leading-relaxed text-white shadow-lg backdrop-blur-sm sm:text-sm">
                    {photo.caption}
                  </span>
                </figcaption>
              </figure>
            </button>
          );
        })}
      </div>

      {selectedPhoto &&
        createPortal(
          <div
            ref={dialogRef}
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
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
              zoomLevel > 0 ? "overflow-auto max-h-[90vh] max-w-full" : "max-w-4xl"
            }`}
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            {/* Control buttons positioned relative to photo */}
            <div className="absolute top-2 right-2 flex gap-2 z-20">
              {!selectedPhoto.video && (
                <button
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    toggleZoom();
                  }}
                  className="text-white p-2 bg-black/50 hover:bg-black/70 rounded-full focus-ring transition-colors"
                  aria-label={zoomLevel > 0 ? ZOOM_LEVELS[zoomLevel].label : "Zoom in"}
                  title={
                    zoomLevel === 0
                      ? "Click to zoom (125%)"
                      : zoomLevel === 1
                      ? "Click to zoom (175%)"
                      : "Click to reset zoom"
                  }
                >
                  {zoomLevel > 0 ? (
                    <ZoomOutIcon className="w-6 h-6" />
                  ) : (
                    <ZoomInIcon className="w-6 h-6" />
                  )}
                </button>
              )}
              <button
                ref={closeButtonRef}
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
              className={zoomLevel > 0 ? "overflow-auto max-h-[85vh]" : ""}
              onTouchStart={(e: TouchEvent<HTMLDivElement>) => {
                if (zoomLevel > 0) return;
                const touch = e.touches[0];
                e.currentTarget.dataset.touchStartX = String(touch.clientX);
                e.currentTarget.dataset.touchStartY = String(touch.clientY);
              }}
              onTouchEnd={(e: TouchEvent<HTMLDivElement>) => {
                if (zoomLevel > 0) return;
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
              {selectedPhoto.video ? (
                <video
                  src={selectedPhoto.video}
                  poster={selectedPhoto.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                  onClick={(e: MouseEvent<HTMLVideoElement>) => e.stopPropagation()}
                />
              ) : (
                <img
                  ref={imageRef}
                  src={selectedPhoto.url}
                  alt={selectedPhoto.alt}
                  className={`transition-all duration-300 ${
                    zoomLevel > 0
                      ? "cursor-zoom-out w-auto h-auto"
                      : "w-full h-auto max-h-[85vh] object-contain cursor-zoom-in rounded-lg"
                  }`}
                  style={
                    zoomLevel > 0
                      ? {
                          minWidth: `${ZOOM_LEVELS[zoomLevel].scale * 100}%`,
                          minHeight: `${ZOOM_LEVELS[zoomLevel].scale * 100}%`,
                          transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                        }
                      : {}
                  }
                  onClick={(e: MouseEvent<HTMLImageElement>) => {
                    e.stopPropagation();
                    toggleZoom(e);
                  }}
                />
              )}
            </div>
            {zoomLevel === 0 && (
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
        </div>,
        document.body
      )}
    </>
  );
};
