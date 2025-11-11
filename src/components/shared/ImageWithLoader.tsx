/**
 * Image component with loading skeleton
 * Shows animated skeleton while image loads, then fades in the image
 */

import { useState } from "react";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({
  src,
  alt,
  className = "",
  loading = "lazy",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton loader - shows while loading */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse ${className}`}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
      />

      {/* Error state */}
      {hasError && (
        <div className={`absolute inset-0 bg-slate-800 flex items-center justify-center ${className}`}>
          <p className="text-slate-400 text-sm">Failed to load image</p>
        </div>
      )}
    </div>
  );
};
