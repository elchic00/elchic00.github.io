import skillsData from "../../data/structured/skills.json";
import { useScrollReveal } from "../../hooks";

export const Skills = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: listRef, isVisible: listVisible } = useScrollReveal();

  return (
    <section id="skills" className="relative py-20 sm:py-24 bg-slate-950">
      <div className="container mx-auto px-5 sm:px-8 md:px-10">
        <div
          ref={headerRef}
          className={`mb-10 scroll-reveal ${headerVisible ? "visible" : ""}`}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Skills
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Technical skills
          </h2>
        </div>

        <div
          ref={listRef}
          className={`scroll-reveal ${listVisible ? "visible" : ""}`}
        >
          <dl className="max-w-5xl divide-y divide-white/10 border-y border-white/10">
            {Object.entries(skillsData).map(([category, skills]) => (
              <div
                key={category}
                className="grid gap-2 py-5 md:grid-cols-[16rem_1fr] md:gap-8"
              >
                <dt className="font-semibold text-white">{category}</dt>
                <dd className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-sm text-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
