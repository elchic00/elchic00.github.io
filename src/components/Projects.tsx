import { useEffect, useRef, useState, MouseEvent } from "react";
import { CodeIcon, ExternalLinkIcon, PlayIcon } from "@heroicons/react/solid";
import projectsData from "../data/projects.json";
import { Project } from "../types";

interface VideoPlayState {
  showButton: boolean;
  playing: boolean;
}

interface BentoGridProjectProps {
  project: Project;
  index: number;
  featured?: boolean;
}

const BentoGridProject: React.FC<BentoGridProjectProps> = ({ project, index, featured = false }) => {
  const hasMultipleVideos = project.videos && project.videos.length > 1;
  const isVideo =
    project.image?.endsWith(".mp4") || project.image?.endsWith(".webm");
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [videoPlayStates, setVideoPlayStates] = useState<Record<string, VideoPlayState>>({});

  // Track which videos need play buttons
  const checkAutoplayBlocked = (videoElement: HTMLVideoElement, videoId: string) => {
    // Try to play and see if it's blocked
    const playPromise = videoElement.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay succeeded, hide play button
          setVideoPlayStates((prev) => ({
            ...prev,
            [videoId]: { showButton: false, playing: true },
          }));
        })
        .catch(() => {
          // Autoplay was blocked, show play button
          setVideoPlayStates((prev) => ({
            ...prev,
            [videoId]: { showButton: true, playing: false },
          }));
        });
    }
  };

  // Use Intersection Observer to play videos when visible (better for mobile)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const videoId = video.dataset.videoId;

          if (entry.isIntersecting && videoId) {
            // Video is visible, try to play and check if autoplay works
            checkAutoplayBlocked(video, videoId);
          } else {
            // Video is not visible, pause it
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Play when 50% of video is visible
    );

    videoRefs.current.forEach((video, idx) => {
      if (video) {
        const videoId = `video-${index}-${idx}`;
        video.dataset.videoId = videoId;
        observer.observe(video);
        // Also try to play immediately and check autoplay
        checkAutoplayBlocked(video, videoId);
      }
    });

    // Capture videoRefs.current in cleanup to avoid stale reference
    const currentVideos = videoRefs.current;
    return () => {
      currentVideos.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [index]);

  const handleVideoClick = (e: MouseEvent, video: HTMLVideoElement) => {
    e.preventDefault();
    e.stopPropagation();

    const videoId = video.dataset.videoId;
    if (!videoId) return;

    // If video is paused, play it. If playing, pause it.
    if (video.paused) {
      video
        .play()
        .then(() => {
          setVideoPlayStates((prev) => ({
            ...prev,
            [videoId]: { showButton: false, playing: true },
          }));
        })
        .catch(() => {
          console.log("Play prevented");
        });
    } else {
      video.pause();
      setVideoPlayStates((prev) => ({
        ...prev,
        [videoId]: { showButton: true, playing: false },
      }));
    }
  };

  return (
    <article
      className={`bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        className="block h-full"
      >
        <div className="relative h-full flex flex-col bg-slate-950">
          {/* Media Section */}
          <div
            className={`px-4 pt-4 pb-2 flex items-center justify-center gap-2 ${
              featured
                ? "md:h-96 h-64"
                : hasMultipleVideos || project.title === "myPal"
                  ? "h-72"
                  : "flex-grow min-h-72"
            }`}
          >
            {hasMultipleVideos ? (
              // Multiple videos side by side
              project.videos?.map((videoSrc, idx) => {
                const videoId = `video-${index}-${idx}`;
                const showButton = videoPlayStates[videoId]?.showButton;

                return (
                  <div key={idx} className={`relative ${
                    featured
                      ? "md:h-full h-full md:max-w-[48%] max-w-[48%]"
                      : "h-56 max-w-[48%]"
                  }`}>
                    <video
                      ref={(el) => { videoRefs.current[idx] = el; }}
                      className="w-full h-full object-contain rounded-lg cursor-pointer"
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      preload={index < 2 ? "auto" : "metadata"}
                      onCanPlay={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                      onClick={(e) => handleVideoClick(e as unknown as MouseEvent, e.target as HTMLVideoElement)}
                    >
                      <source src={videoSrc} type="video/mp4" />
                    </video>
                    {showButton && (
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const video = videoRefs.current[idx];
                          if (video) handleVideoClick(e as unknown as MouseEvent, video);
                        }}
                      >
                        <div className="bg-black/60 rounded-full p-4 pointer-events-auto cursor-pointer hover:bg-black/80 transition-colors">
                          <PlayIcon className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : isVideo ? (
              (() => {
                const videoId = `video-${index}-0`;
                const showButton = videoPlayStates[videoId]?.showButton;

                return (
                  <div className="relative w-full h-full">
                    <video
                      ref={(el) => { videoRefs.current[0] = el; }}
                      className="w-full h-full object-contain rounded-lg cursor-pointer"
                      autoPlay
                      loop
                      muted
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                      preload={index < 2 ? "auto" : "metadata"}
                      onCanPlay={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                      onClick={(e) => handleVideoClick(e as unknown as MouseEvent, e.target as HTMLVideoElement)}
                    >
                      <source src={project.image} type="video/mp4" />
                    </video>
                    {showButton && (
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const video = videoRefs.current[0];
                          if (video) handleVideoClick(e as unknown as MouseEvent, video);
                        }}
                      >
                        <div className="bg-black/60 rounded-full p-4 pointer-events-auto cursor-pointer hover:bg-black/80 transition-colors">
                          <PlayIcon className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <img
                src={project.image}
                alt={`Screenshot of ${project.title}`}
                className="w-full h-full object-contain rounded-lg"
                loading={index < 2 ? "eager" : "lazy"}
              />
            )}
          </div>

          {/* Content Section */}
          <div
            className={`bg-slate-800 ${
              featured ? "md:px-6 md:py-5 px-4 py-3" : "px-4 py-3"
            }`}
          >
            <div className={featured ? "max-w-2xl" : ""}>
              <p className="text-emerald-400 text-xs font-medium tracking-wide mb-1">
                {project.subtitle}
              </p>
              <h3
                className={`font-bold text-white ${
                  featured ? "md:text-xl text-lg md:mb-3 mb-2" : "text-lg mb-2"
                }`}
              >
                {project.title}
              </h3>
              {/* Show description on mobile for all, on desktop only for featured */}
              <p
                className={`text-slate-200 text-sm leading-relaxed line-clamp-3 mb-4 ${
                  featured ? "block" : "md:hidden"
                }`}
              >
                {project.description}
              </p>
              <div className="flex items-center gap-2 text-indigo-400 text-sm">
                <span>View Project</span>
                <ExternalLinkIcon className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
};

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="body-font mt-16">
      <div className="container px-5 py-10 mx-auto lg:px-40">
        <header className="flex flex-col w-full sm:mb-16 text-center">
          <CodeIcon
            className="mx-auto inline-block w-10 mb-1"
            aria-hidden="true"
          />
          <h2 className="sm:text-4xl text-3xl font-medium title-font text-white underline-offset-4 underline mb-4">
            Things I've Built
          </h2>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(projectsData as Project[]).map((project, index) => (
            <BentoGridProject
              key={`${project.title}-${index}`}
              project={project}
              index={index}
              featured={index === 0 || index === 3} // Feature first and fourth projects
            />
          ))}
        </div>
      </div>
    </section>
  );
};
