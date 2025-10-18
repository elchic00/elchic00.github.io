import { ChipIcon } from "@heroicons/react/solid";
import skillsData from "../data/skills.json";

// Color schemes for different categories
const categoryColors: Record<string, string> = {
  "Languages & Frameworks": "bg-cyan-600/20 text-cyan-400 border-cyan-500/30",
  Databases: "bg-teal-600/20 text-teal-400 border-teal-500/30",
  "DevOps & Tools": "bg-purple-600/20 text-purple-400 border-purple-500/30",
  "Practices & Methodologies":
    "bg-slate-600/20 text-slate-300 border-slate-500/30",
};

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
            <div key={category} className="mb-12">
              <h3 className="text-lg font-bold text-white mb-5">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      categoryColors[category] ||
                      "bg-slate-700/20 text-slate-300 border-slate-600/30"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
