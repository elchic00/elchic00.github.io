import { useEffect, useState } from "react";
import { CodeIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import projectsData from "../data/structured/projects.json";
import { Project } from "../types";
import { VideoPlayer } from "../components/shared/VideoPlayer";
import { useScrollReveal } from "../hooks";
import { PiCloudModal } from "@components/shared/PiCloudModal";

interface BentoGridProjectProps {
  project: Project;
  index: number;
  featured?: boolean;
  onOpenModal?: () => void;
}

const BentoGridProject: React.FC<BentoGridProjectProps> = ({
  project,
  index,
  featured = false,
  onOpenModal,
}) => {
  const hasMultipleVideos = project.videos && project.videos.length > 1;
  const isVideo = project.image?.endsWith(".mp4") || project.image?.endsWith(".webm");
  const isPiCloud = project.id === "pi-cloud";

  // Pi-Cloud uses modal instead of external link
  const handleClick = (e: React.MouseEvent) => {
    if (isPiCloud && onOpenModal) {
      e.preventDefault();
      onOpenModal();
    }
  };

  const CardWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isPiCloud) {
      return (
        <article
          className={`group bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 md:hover:scale-[1.03] md:hover:-translate-y-2 border border-slate-700 hover:border-cyan-500/50 cursor-pointer ${
            featured ? "md:col-span-2 md:row-span-2" : ""
          }`}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenModal?.();
            }
          }}
          aria-label={`View details for ${project.title}`}
        >
          {children}
        </article>
      );
    }

    return (
      <article
        className={`group bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 md:hover:scale-[1.03] md:hover:-translate-y-2 border border-slate-700 hover:border-cyan-500/50 ${
          featured ? "md:col-span-2 md:row-span-2" : ""
        }`}
      >
        <a href={project.link} target="_blank" rel="noreferrer" className="block h-full">
          {children}
        </a>
      </article>
    );
  };

  return (
    <CardWrapper>
      <div className="relative flex flex-col bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none z-10"></div>
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
            project.videos?.map((videoSrc, idx) => (
              <VideoPlayer
                key={idx}
                src={videoSrc}
                videoId={`video-${index}-${idx}`}
                projectIndex={index}
                containerClassName={
                  featured
                    ? "md:h-full h-full md:max-w-[48%] max-w-[48%]"
                    : "h-56 max-w-[48%]"
                }
              />
            ))
          ) : isVideo ? (
            <VideoPlayer
              src={project.image!}
              videoId={`video-${index}-0`}
              projectIndex={index}
              containerClassName="w-full h-full"
            />
          ) : (
            <img
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
              loading={index < 2 ? "eager" : "lazy"}
            />
          )}
        </div>
        <div
          className={`bg-slate-800 relative z-20 ${
            featured ? "md:px-6 md:py-5 px-4 py-3" : "px-4 py-3"
          }`}
        >
          <div className={featured ? "max-w-2xl" : ""}>
            <p className="text-emerald-400 text-xs font-medium tracking-wide mb-1 group-hover:text-emerald-300 transition-colors duration-300">
              {project.subtitle}
            </p>
            <h3
              className={`font-bold text-white group-hover:text-cyan-400 transition-colors duration-300 ${
                featured ? "md:text-xl text-lg md:mb-3 mb-2" : "text-lg mb-2"
              }`}
            >
              {project.title}
            </h3>
            <p
              className={`text-slate-200 text-sm leading-relaxed line-clamp-3 mb-4 ${
                featured ? "block" : "md:hidden"
              }`}
            >
              {project.description}
            </p>
            <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 text-sm font-medium transition-all duration-300">
              <span className="group-hover:underline">
                {isPiCloud ? "View Details" : "View Project"}
              </span>
              <ExternalLinkIcon className={`w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 ${isPiCloud ? "hidden" : ""}`} />
            </div>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

export const ProjectsPage = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Projects - Andrew Alagna";
    // Scroll to top when navigating to projects page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <section id="projects" className="relative min-h-screen body-font bg-slate-950 pt-20">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/98 to-slate-950 pointer-events-none z-0"></div>
      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-0"></div>
      <div className="container px-5 py-10 mx-auto lg:px-40 relative z-10">
        <header
          ref={headerRef}
          className={`flex flex-col w-full sm:mb-16 text-center scroll-reveal-scale ${
            headerVisible ? "visible" : ""
          }`}
        >
          <CodeIcon
            className="mx-auto inline-block w-10 mb-1 text-cyan-400"
            aria-hidden="true"
          />
          <h2 className="sm:text-4xl text-3xl font-bold title-font text-white underline-offset-4 underline decoration-cyan-500 mb-4">
            Personal Projects
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-5 sm:mb-0">
            Side projects built in my free time to explore new technologies and solve real-world problems
          </p>
        </header>
        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 scroll-reveal ${
            gridVisible ? "visible" : ""
          }`}
        >
          {(projectsData as Project[]).map((project, index) => (
            <BentoGridProject
              key={`${project.title}-${index}`}
              project={project}
              index={index}
              featured={index === 0 || index === 3}
              onOpenModal={project.id === "pi-cloud" ? () => setIsModalOpen(true) : undefined}
            />
          ))}
        </div>
      </div>

      {/* Pi-Cloud Project Modal */}
      <PiCloudModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
