import { CodeIcon } from "@heroicons/react/solid";
import { projects } from "../data";

const ProjectCard = ({ project, index }) => {
  return (
    <article className="sm:w-1/2 w-100 p-4 z-0">
      <a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        className="block group"
        aria-label={`View ${project.title} project on GitHub`}
      >
        <div className="flex relative">
          <img
            alt={`Screenshot of ${project.title} project`}
            className="absolute inset-0 w-full h-full object-contain object-center group-hover:bg-gray-800 transition-colors"
            src={project.image}
            loading={index < 2 ? "eager" : "lazy"}
          />
          
          {/* Hover overlay for desktop */}
          <div className="sm:px-8 sm:py-10 relative z-10 sm:w-full sm:border-4 sm:border-gray-800 bg-gray-900 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="tracking-widest text-sm title-font font-medium text-green-400 mb-1">
              {project.subtitle}
            </h3>
            <h2 className="title-font text-lg font-medium text-white mb-3">
              {project.title}
            </h2>
            <p className="leading-relaxed">{project.description}</p>
          </div>
        </div>
      </a>

      {/* Mobile description - always visible on small screens */}
      <div className="sm:hidden mt-2">
        <h3 className="tracking-widest text-sm title-font font-medium text-green-400 mb-1">
          {project.subtitle}
        </h3>
        <h2 className="title-font text-lg font-medium text-white mb-3">
          {project.title}
        </h2>
        <p className="leading-relaxed">{project.description}</p>
      </div>
    </article>
  );
};

export const Projects = () => {
  return (
    <section id="projects" className="body-font mt-16">
      <div className="container px-5 py-10 mx-auto text-center lg:px-40">
        <header className="flex flex-col w-full sm:mb-16">
          <CodeIcon className="mx-auto inline-block w-10 mb-1" aria-hidden="true" />
          <h1 className="sm:text-4xl text-3xl font-medium title-font text-white underline-offset-4 underline mb-4">
            Recent Apps
          </h1>
        </header>

        <div className="flex flex-wrap -m-4">
          {projects.map((project, index) => (
            <ProjectCard 
              key={`${project.title}-${index}`} 
              project={project} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
