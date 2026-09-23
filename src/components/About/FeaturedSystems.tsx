import { Link } from "react-router-dom";
import projectsData from "../../data/structured/projects.json";
import { useScrollReveal } from "../../hooks";
import type { Project } from "../../types";

type FeaturedSystem = {
  id: string;
  kind: string;
  summary: string;
  alt: string;
};

const projects = projectsData as Project[];

// Title and preview image come from projects.json so these cards stay in step
// with the Projects page.
const featuredSystems: FeaturedSystem[] = [
  {
    id: "hermes",
    kind: "Self-hosted agent platform",
    summary:
      "Nightly evals plus a weekly job that proposes edits to the agent's own prompt. Every edit waits for my approval, because the eval judge scored near chance.",
    alt: "Confusion matrix: the eval judge caught 2 of 5 real failures, kappa 0.09",
  },
  {
    id: "pi-cloud",
    kind: "Private cloud",
    summary:
      "The Raspberry Pi running my self-hosted services, checked from outside the network instead of trusted from a status page. One routine audit found 15 services reachable.",
    alt: "The firewall reported 0 of 23 services exposed; an outside probe reached 15",
  },
  {
    id: "inference-engine",
    kind: "Local LLM serving",
    summary:
      "A from-source llama.cpp build serving three models on an AMD APU the project doesn't officially support. Every agent here runs on it, with every call traced.",
    alt: "Decode throughput of 33.2 tokens/sec against a 7.4 tokens/sec memory-bandwidth ceiling",
  },
];

export const FeaturedSystems = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();

  return (
    <section
      id="featured-systems"
      aria-labelledby="featured-systems-title"
      className="relative overflow-hidden bg-slate-950 py-20 sm:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_40%)]" />
      <div className="container relative z-10 mx-auto px-5 sm:px-8 md:px-10">
        <div
          ref={headerRef}
          className={`mb-12 scroll-reveal ${headerVisible ? "visible" : ""}`}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Featured systems
          </p>
          <h2
            id="featured-systems-title"
            className="mb-5 text-3xl font-black tracking-tight text-white sm:text-5xl"
          >
            Three systems I built and run at home.
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            Each one links to a full case study, including what broke along
            the way.{" "}
            <Link
              to="/projects"
              className="font-semibold text-cyan-300 underline-offset-4 hover:underline focus-ring rounded"
            >
              See all projects
            </Link>
          </p>
        </div>

        <div
          ref={gridRef}
          className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 scroll-reveal-scale ${
            gridVisible ? "visible" : ""
          }`}
        >
          {featuredSystems.map((system) => {
            const project = projects.find((p) => p.id === system.id);
            if (!project) return null;
            return (
              <Link
                key={system.id}
                to={`/projects/${system.id}`}
                data-featured-system-card
                className="focus-ring group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition-colors duration-300 hover:border-cyan-400/40"
              >
                <img
                  src={project.image}
                  alt={system.alt}
                  className="aspect-[7/4] w-full"
                  loading="lazy"
                />
                <div className="flex flex-grow flex-col p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {system.kind}
                  </p>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="mb-6 leading-relaxed text-slate-300">
                    {system.summary}
                  </p>
                  <span className="mt-auto text-sm font-semibold text-cyan-300">
                    Read the case study{" "}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
