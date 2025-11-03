import { useEffect, useRef, useState, MouseEvent } from "react";
import { PlayIcon } from "@heroicons/react/solid";

interface VideoPlayerProps {
  src: string;
  videoId: string;
  projectIndex: number;
  className?: string;
  containerClassName?: string;
}

interface VideoPlayState {
  showButton: boolean;
  playing: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  videoId,
  projectIndex,
  className = "",
  containerClassName = "",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playState, setPlayState] = useState<VideoPlayState>({
    showButton: false,
    playing: false,
  });

  const checkAutoplayBlocked = (videoElement: HTMLVideoElement) => {
    const playPromise = videoElement.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlayState({ showButton: false, playing: true });
        })
        .catch(() => {
          setPlayState({ showButton: true, playing: false });
        });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            checkAutoplayBlocked(video);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    video.dataset.videoId = videoId;
    observer.observe(video);
    checkAutoplayBlocked(video);

    return () => {
      observer.unobserve(video);
    };
  }, [videoId]);

  const handleVideoClick = (e: MouseEvent<HTMLVideoElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setPlayState({ showButton: false, playing: true });
        })
        .catch(() => {
          // Play prevented - silently handle autoplay restrictions
        });
    } else {
      video.pause();
      setPlayState({ showButton: true, playing: false });
    }
  };

  const handlePlayButtonClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Play prevented - silently handle autoplay restrictions
      });
    }
  };

  return (
    <div className={`relative ${containerClassName}`}>
      <video
        ref={videoRef}
        className={`w-full h-full object-contain rounded-lg cursor-pointer ${className}`}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload={projectIndex < 2 ? "auto" : "metadata"}
        onCanPlay={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
        onClick={handleVideoClick}
      >
        <source src={src} type="video/mp4" />
      </video>
      {playState.showButton && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          onClick={handlePlayButtonClick}
        >
          <div className="bg-black/60 rounded-full p-4 pointer-events-auto cursor-pointer hover:bg-black/80 transition-colors">
            <PlayIcon className="w-12 h-12 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};
