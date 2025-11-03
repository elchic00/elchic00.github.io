import { CodeIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import projectsData from "../data/projects.json";
import { Project } from "../types";
import { VideoPlayer } from "./shared/VideoPlayer";

interface BentoGridProjectProps {
  project: Project;
  index: number;
  featured?: boolean;
}

const BentoGridProject: React.FC<BentoGridProjectProps> = ({
  project,
  index,
  featured = false,
}) => {
  const hasMultipleVideos = project.videos && project.videos.length > 1;
  const isVideo =
    project.image?.endsWith(".mp4") || project.image?.endsWith(".webm");

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
                className="w-full h-full object-contain rounded-lg"
                loading={index < 2 ? "eager" : "lazy"}
              />
            )}
          </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(projectsData as Project[]).map((project, index) => (
            <BentoGridProject
              key={`${project.title}-${index}`}
              project={project}
              index={index}
              featured={index === 0 || index === 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
