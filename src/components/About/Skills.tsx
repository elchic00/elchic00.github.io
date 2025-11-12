import { ChipIcon, LightningBoltIcon, DatabaseIcon, CogIcon, ChartBarIcon } from "@heroicons/react/solid";
import skillsData from "../../data/structured/skills.json";
import { skillTooltips } from "../../data/structured/skillTooltips";
import { useScrollReveal } from "../../hooks";

const categoryColors: Record<string, string> = {
  "Languages & Frameworks": "bg-cyan-600/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-600/30 hover:border-cyan-400/50 hover:shadow-cyan-500/20",
  "Databases & Backend": "bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30 hover:border-emerald-400/50 hover:shadow-emerald-500/20",
  "DevOps, Tools & Testing": "bg-purple-600/20 text-purple-400 border-purple-500/30 hover:bg-purple-600/30 hover:border-purple-400/50 hover:shadow-purple-500/20",
  "Practices & Methodologies": "bg-orange-600/20 text-orange-400 border-orange-500/30 hover:bg-orange-600/30 hover:border-orange-400/50 hover:shadow-orange-500/20",
};

const categoryBorderColors: Record<string, string> = {
  "Languages & Frameworks": "border-cyan-500",
  "Databases & Backend": "border-emerald-500",
  "DevOps, Tools & Testing": "border-purple-500",
  "Practices & Methodologies": "border-orange-500",
};

const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  "Languages & Frameworks": LightningBoltIcon,
  "Databases & Backend": DatabaseIcon,
  "DevOps, Tools & Testing": CogIcon,
  "Practices & Methodologies": ChartBarIcon,
};

export const Skills = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: category1Ref, isVisible: category1Visible } = useScrollReveal();
  const { ref: category2Ref, isVisible: category2Visible } = useScrollReveal();
  const { ref: category3Ref, isVisible: category3Visible } = useScrollReveal();
  const { ref: category4Ref, isVisible: category4Visible } = useScrollReveal();

  const categoryRefs = [category1Ref, category2Ref, category3Ref, category4Ref];
  const categoryVisibility = [category1Visible, category2Visible, category3Visible, category4Visible];

  return (
    <section id="skills" className="relative bg-slate-950">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/98 to-slate-950 pointer-events-none z-0"></div>

      <div className="container px-5 py-10 mx-auto relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-20 scroll-reveal-scale ${headerVisible ? 'visible' : ''}`}
        >
          <ChipIcon className="w-10 inline-block mb-2 text-cyan-400" />
          <h2 className="sm:text-4xl text-3xl font-bold title-font text-white mb-4 mx-auto underline-offset-4 underline decoration-cyan-500">
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
          {Object.entries(skillsData).map(([category, skills], idx) => (
            <div
              key={category}
              ref={categoryRefs[idx]}
              className={`mb-12 scroll-reveal ${categoryVisibility[idx] ? 'visible' : ''}`}
            >
              <div className={`flex items-center gap-3 mb-5 border-l-4 ${categoryBorderColors[category]} pl-4`}>
                {(() => {
                  const IconComponent = categoryIcons[category];
                  return IconComponent ? (
                    <IconComponent className="w-6 h-6 text-current" aria-hidden="true" />
                  ) : null;
                })()}
                <h3 className="text-xl font-bold text-white">
                  {category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, skillIdx) => (
                  <span
                    key={skill}
                    className={`group relative px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-110 hover:shadow-xl scroll-reveal-delay-${Math.min(skillIdx % 4 + 1, 4)} ${
                      categoryColors[category] ||
                      "bg-slate-700/20 text-slate-300 border-slate-600/30"
                    }`}
                    title={skillTooltips[skill] || skill}
                  >
                    {skill}
                    {skillTooltips[skill] && (
                      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-xl border border-slate-700 z-50">
                        {skillTooltips[skill]}
                        <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></span>
                      </span>
                    )}
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
