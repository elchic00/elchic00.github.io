import { BadgeCheckIcon, ChipIcon } from "@heroicons/react/solid";
import skillsData from "../data/skills.json";

export const Skills = () => {
  return (
    <section id="skills">
      <div className="container px-5 py-10 mx-auto">
        <div className="text-center mb-20">
          <ChipIcon className="w-10 inline-block mb-4 -mt-2" />
          <h2 className="sm:text-4xl text-3xl font-medium title-font text-white mb-4 mx-auto underline-offset-4 underline ">
            Technical Skills
          </h2>
          <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
            Specialized in building high-performance, WCAG AAA-compliant web
            applications with React.js and Node.js. Skilled in accessibility,
            performance optimization, and delivering measurable impact for
            millions of users.
          </p>
        </div>
        <div className="lg:w-4/5 mx-auto">
          {Object.entries(skillsData).map(([category, skills]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-medium text-emerald-400 mb-4 pl-2">
                {category}
              </h3>
              <div className="flex flex-wrap sm:mb-2 -mx-2">
                {skills.map((skill) => (
                  <div key={skill} className="p-2 sm:w-1/2 w-full">
                    <div className="bg-slate-800 rounded flex p-4 h-full items-center">
                      <BadgeCheckIcon className="text-emerald-400 w-6 h-6 flex-shrink-0 mr-4" />
                      <span className="title-font font-medium text-white">
                        {skill}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
