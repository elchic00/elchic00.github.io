import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CodeIcon, ExternalLinkIcon, PlayIcon } from "@heroicons/react/solid";
import projectsData from "../data/structured/projects.json";
import { Project } from "../types";
import { VideoPlayer } from "../components/shared/VideoPlayer";
import { useScrollReveal } from "../hooks";
import { PiCloudModal } from "@components/Projects/PiCloudModal";
import { Modal } from "@components/shared/Modal";

interface BentoGridProjectProps {
  project: Project;
  index: number;
  onOpenModal?: () => void;
}

// Poster frames for project preview videos, keyed by video src. Without a
// poster, the video's literal first recorded frame shows before autoplay
// kicks in (or if autoplay is blocked).
const VIDEO_POSTERS: Record<string, string> = {};

const TechPill: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
    {label}
  </span>
);

const BentoGridProject: React.FC<BentoGridProjectProps> = ({
  project,
  index,
  onOpenModal,
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const hasMultipleVideos = project.videos && project.videos.length > 1;
  const isVideo = project.image?.endsWith(".mp4") || project.image?.endsWith(".webm");
  const isPiCloud = project.id === "pi-cloud";
  const techTags = project.subtitle?.split(" + ").filter(Boolean) ?? [];

  const sharedClasses = [
    "group flex flex-col w-full rounded-xl overflow-hidden",
    "bg-slate-900 border border-slate-700/50",
    "transition-all duration-500 ease-out",
    "hover:border-cyan-500/40 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.2)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
    "min-h-[455px] h-full",
  ].join(" ");

  const mediaHeight = "h-48 flex-shrink-0";

  const handleMediaClick = (e: React.MouseEvent) => {
    if (hasMultipleVideos) {
      e.preventDefault();
      e.stopPropagation();
      setIsVideoModalOpen(true);
    }
  };

  const inner = (
    <>
      <div 
        className={`relative overflow-hidden bg-slate-950 ${mediaHeight} ${hasMultipleVideos ? "cursor-zoom-in" : ""}`}
        onClick={handleMediaClick}
      >
        {hasMultipleVideos ? (
          <div className="grid grid-cols-2 h-full bg-black">
            {project.videos?.map((videoSrc, idx) => (
              <div key={idx} className="relative h-full w-full border-r border-slate-800 last:border-r-0">
                <VideoPlayer
                  src={videoSrc}
                  videoId={`preview-${index}-${idx}`}
                  projectIndex={index}
                  containerClassName={`w-full h-full object-cover ${idx === 1 ? "object-top-left" : "object-center"}`}
                  poster={VIDEO_POSTERS[videoSrc]}
                />
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-cyan-500 text-slate-950 p-3 rounded-full shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <PlayIcon className="w-8 h-8" />
                </div>
                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-md">
                  Watch Preview
                </span>
              </div>
            </div>
          </div>
        ) : isVideo ? (
          <VideoPlayer
            src={project.image!}
            videoId={`video-${index}-0`}
            projectIndex={index}
            containerClassName="w-full h-full"
            poster={VIDEO_POSTERS[project.image!]}
          />
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
            loading={index < 2 ? "eager" : "lazy"}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-slate-900 z-10" />
      </div>

      <div className="bg-slate-900 flex flex-col flex-grow p-5 justify-between">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {techTags.map((tag) => <TechPill key={tag} label={tag} />)}
          </div>

          <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 leading-tight mb-2 text-lg">
            {project.title}
          </h3>

          <div className="grid grid-rows-[1fr] transition-all duration-500 ease-in-out">
              <div className="overflow-hidden">
                  <p className="text-slate-200 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
              </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors duration-200 border-t border-slate-800/50 group-hover:border-cyan-500/20 pt-4 mt-4">
          <span className="tracking-widest uppercase text-[10px]">{isPiCloud ? "View Details" : "View Project"}</span>
          {!isPiCloud && (
            <ExternalLinkIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          )}
        </div>
      </div>

      <Modal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        maxWidth="xl" 
        ariaLabel={`Demo videos for ${project.title}`}
      >
        <div className="bg-slate-950 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {project.videos?.map((videoSrc, idx) => (
              <div key={idx} className="bg-black rounded-lg overflow-hidden border border-slate-800 shadow-2xl aspect-video md:aspect-auto md:min-h-[400px]">
                 <VideoPlayer
                  src={videoSrc}
                  videoId={`modal-${index}-${idx}`}
                  projectIndex={index}
                  containerClassName="w-full h-full object-contain"
                  poster={VIDEO_POSTERS[videoSrc]}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 px-2">
            <div>
              <h4 className="text-white text-xl font-bold">{project.title}</h4>
              <p className="text-slate-400 text-sm">Cross-platform integration showcase</p>
            </div>
            <a 
              href={project.link} 
              target="_blank" 
              rel="noreferrer" 
              className="px-6 py-2 bg-cyan-500 text-slate-950 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-cyan-400 transition-colors flex items-center gap-2"
            >
              View Repository <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Modal>
    </>
  );

  const Tag = isPiCloud ? 'article' : 'a';
  const articleProps = {
    className: sharedClasses,
    ...(isPiCloud 
      ? { onClick: (e: any) => { e.preventDefault(); onOpenModal?.(); }, role: "button", tabIndex: 0 }
      : { href: project.link, target: "_blank", rel: "noreferrer" }
    )
  };

  return (
    <Tag {...(articleProps as any)} aria-label={`View ${project.title}`}>
      {inner}
    </Tag>
  );
};

export const ProjectsPage = () => {
  const location = useLocation();
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Projects | Andrew Alagna";
  }, []);

  // Deep link from FeaturedSystems' "Inspect Pi-Cloud" CTA (/projects?open=pi-cloud)
  useEffect(() => {
    if (new URLSearchParams(location.search).get("open") === "pi-cloud") {
      setIsModalOpen(true);
    }
  }, [location.search]);

  return (
    <section id="projects" className="relative min-h-screen bg-slate-950 pt-24 pb-20">
      <div className="container px-6 mx-auto relative z-10">
        <header ref={headerRef} className={`text-center mb-20 transition-all duration-1000 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CodeIcon className="mx-auto w-12 h-12 mb-4 text-cyan-500/80" />
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Projects
          </h1>
          <div className="h-1.5 w-24 bg-cyan-500 mx-auto mb-6 rounded-full" />
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Production-grade experiments in accessibility, automation, and full-stack engineering.
          </p>
        </header>

        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 ${gridVisible ? 'opacity-100' : 'opacity-0'}`}>
          {(projectsData as Project[]).map((project, index) => (
            <BentoGridProject
              key={project.id}
              project={project}
              index={index}
              onOpenModal={project.id === "pi-cloud" ? () => setIsModalOpen(true) : undefined}
            />
          ))}
        </div>
      </div>
      <PiCloudModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};