import { CodeIcon, ExternalLinkIcon } from "@heroicons/react/solid";
import { projects } from "../content";

// Bento Grid Layout Component
const BentoGridProject = ({ project, index, featured = false }) => {
  const hasMultipleVideos = project.videos && project.videos.length > 1;
  const isVideo =
    project.image?.endsWith(".mp4") || project.image?.endsWith(".webm");

  return (
    <article
      className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        className="block h-full"
      >
        <div className="relative h-full flex flex-col bg-gray-900">
          {/* Media Section */}
          <div
            className={`px-4 pt-10 pb-2 flex items-center justify-center gap-2 ${
              featured ? "h-96" : "h-64"
            }`}
          >
            {hasMultipleVideos ? (
              // Multiple videos side by side
              project.videos.map((videoSrc, idx) => (
                <video
                  key={idx}
                  className={`object-contain rounded-lg max-w-[84%] ${
                    featured ? "h-full" : "h-56"
                  }`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload={index < 2 ? "auto" : "metadata"}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
              ))
            ) : isVideo ? (
              <video
                className="w-full h-full object-contain rounded-lg"
                autoPlay
                loop
                muted
                playsInline
                preload={index < 2 ? "auto" : "metadata"}
              >
                <source src={project.image} type="video/mp4" />
              </video>
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
            className={`bg-gray-800 ${featured ? "px-6 py-8" : "px-4 py-3"}`}
          >
            <div className={featured ? "max-w-2xl" : ""}>
              <p className="text-green-400 text-xs font-medium tracking-wide mb-1">
                {project.subtitle}
              </p>
              <h3
                className={`font-bold text-white ${
                  featured ? "text-xl mb-3" : "text-lg mb-2"
                }`}
              >
                {project.title}
              </h3>
              {featured && (
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
                  {project.description}
                </p>
              )}
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

export const Projects = () => {
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
          {projects.map((project, index) => (
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
