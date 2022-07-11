import { CodeIcon } from "@heroicons/react/solid";
import React from "react";
import { projects } from "../data";

export default function Projects() {
  return (
    <section id="projects" className="body-font mt-16">
      <div className="container px-5 py-10 mx-auto text-center lg:px-40 ">
        <div className="flex flex-col w-full sm:mb-16">
          <CodeIcon className="mx-auto inline-block w-10 mb-1" />
          <h1 className="sm:text-4xl text-3xl font-medium title-font text-white underline-offset-4 underline mb-4">
            Recent Apps
          </h1>
        </div>
        <div className="flex flex-wrap -m-4">
          {projects.map((project) => (
            <>
              <a
                target="_blank"
                rel="noreferrer"
                href={project.link}
                key={project.image}
                className="sm:w-1/2 w-100 p-4 z-0"
              >
                <div className="flex relative">
                  <img
                    alt="gallery"
                    className="absolute last:w-0 inset-0 w-full h-full object-contain object-center hover:bg-gray-800"
                    key={project.image}
                    src={project.image}
                  />
                  <div className=" sm:px-8 sm:py-10 relative z-10 sm:w-full sm:border-4 sm:border-gray-800 bg-gray-900 opacity-0 sm:hover:opacity-100 ">
                    <h2 className="tracking-widest text-sm title-font font-medium text-green-400 mb-1">
                      {project.subtitle}
                    </h2>
                    <h1 className="title-font text-lg font-medium text-white mb-3">
                      {project.title}
                    </h1>
                    <p className="leading-relaxed">{project.description}</p>
                  </div>
                </div>
              </a>
              <div id="project-desc" className="sm:hidden mt-2">
                <h2 className="tracking-widest text-sm title-font font-medium text-green-400 mb-1">
                  {project.subtitle}
                </h2>
                <h1 className="title-font text-lg font-medium text-white mb-3">
                  {project.title}
                </h1>
                <p className="leading-relaxed">{project.description}</p>
              </div>
            </>
          ))}
        </div>
      </div>
    </section>
  );
}