import projectsData from "../../data/structured/projects.json";
import { useScrollReveal } from "../../hooks";
import type { Project } from "../../types";

type FeaturedSystem = {
  title: string;
  eyebrow: string;
  value: string;
  metric: string;
  metricLabel: string;
  proof: string[];
  stack: string[];
  status: string;
  href: string;
  linkLabel: string;
  accent: "cyan" | "purple" | "emerald" | "amber";
};

const projects = projectsData as Project[];
const findProject = (id: string) =>
  projects.find((project) => project.id === id);

const piCloud = findProject("pi-cloud");

const accentClasses: Record<
  FeaturedSystem["accent"],
  {
    eyebrow: string;
    metric: string;
    line: string;
    glow: string;
    cta: string;
  }
> = {
  cyan: {
    eyebrow: "border-cyan-400/30 bg-cyan-400/[0.06] text-cyan-100",
    metric: "text-cyan-200",
    line: "bg-cyan-300/40",
    glow: "from-cyan-400/20",
    cta: "text-cyan-100 group-hover:text-cyan-50",
  },
  purple: {
    eyebrow: "border-purple-400/30 bg-purple-400/[0.07] text-purple-100",
    metric: "text-purple-200",
    line: "bg-purple-300/40",
    glow: "from-purple-400/20",
    cta: "text-purple-100 group-hover:text-purple-50",
  },
  emerald: {
    eyebrow: "border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-100",
    metric: "text-emerald-200",
    line: "bg-emerald-300/40",
    glow: "from-emerald-400/20",
    cta: "text-emerald-100 group-hover:text-emerald-50",
  },
  amber: {
    eyebrow: "border-amber-300/30 bg-amber-300/[0.08] text-amber-100",
    metric: "text-amber-200",
    line: "bg-amber-200/40",
    glow: "from-amber-300/20",
    cta: "text-amber-100 group-hover:text-amber-50",
  },
};

const featuredSystems: FeaturedSystem[] = [
  {
    title: "Hermes",
    eyebrow: "Self-hosted agent platform",
    value:
      "Trustworthy local LLM automation with production-style traces, evals, and approval gates.",
    metric: "3 nodes",
    metricLabel: "homelab agent ops",
    proof: ["Langfuse traces + evals", "HITL side-effect gates", "Self-hosted search + notes RAG (SearXNG, sqlite-vec)"],
    stack: ["Local inference", "Hermes", "Langfuse"],
    status: "dry-run protected",
    // Hermes is a real case-study modal now (see Pi-Cloud's identical pattern) —
    // route to it instead of straight to the contact form.
    href: "/projects/hermes",
    linkLabel: "Inspect Hermes",
    accent: "amber",
  },
  {
    title: piCloud?.title ?? "Pi-Cloud",
    eyebrow: "Private cloud / edge gateway",
    value:
      "A private edge gateway that replaces default cloud habits with observable, zero-trust infrastructure.",
    metric: "13",
    metricLabel: "self-hosted services",
    proof: ["DNS + identity", "Telemetry dashboard", "Recovery playbooks"],
    stack: ["Pi-hole", "Tailscale", "Prometheus"],
    status: piCloud?.subtitle ?? "High-performance edge gateway",
    // Pi-Cloud is a private headless server, not a public repo — route to its
    // case-study page instead of a GitHub URL.
    href: "/projects/pi-cloud",
    linkLabel: "Inspect Pi-Cloud",
    accent: "cyan",
  },
  {
    title: "Inference Engine",
    eyebrow: "Local LLM serving / GPU systems",
    value:
      "A hand-patched llama.cpp build serving four models on GPU hardware the project doesn't officially support — every call traced and nightly graded.",
    metric: "47.8 t/s",
    metricLabel: "35B generation, full GPU offload",
    proof: ["Allocator bug fixed at the source", "Speculative decoding (87% draft acceptance)", "Nightly LLM-as-judge evals"],
    stack: ["llama.cpp", "ROCm", "Langfuse"],
    status: "serving every agent workflow here",
    href: "/projects/inference-engine",
    linkLabel: "Inspect the engine",
    accent: "purple",
  },
  {
    title: "American Express Account Services",
    eyebrow: "Enterprise fintech / account platform",
    value:
      "Profile, identity, and account-overview flows for millions of cardholders — accessible by default, not bolted on.",
    metric: "100%",
    metricLabel: "WCAG AA compliance",
    proof: ["~5M annual updates", "18% completion lift", "Overview BFF aggregation"],
    stack: ["React", "Kotlin BFF", "A/B tests"],
    status: "enterprise rollout path",
    href: "#accessibility-expertise",
    linkLabel: "View accessibility proof",
    accent: "emerald",
  },
];

const isExternalHref = (href: string) => href.startsWith("http");

export const FeaturedSystems = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();

  return (
    <section
      id="featured-systems"
      aria-labelledby="featured-systems-title"
      className="relative overflow-hidden bg-slate-950 py-20 sm:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_32%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:48px_48px]" />
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
            Four systems, all running in production.
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            Four shipped surfaces that show the same operating pattern:
            clarify the constraint, instrument the system, ship the useful
            path, and keep humans safe when trust matters.
          </p>
        </div>

        <div
          ref={gridRef}
          className={`grid gap-5 lg:grid-cols-2 scroll-reveal-scale ${
            gridVisible ? "visible" : ""
          }`}
        >
          {featuredSystems.map((system) => (
            <article key={system.title} className="relative h-full">
              <a
                data-featured-system-card
                href={system.href}
                target={isExternalHref(system.href) ? "_blank" : undefined}
                rel={isExternalHref(system.href) ? "noopener noreferrer" : undefined}
                aria-label={`${system.linkLabel}: ${system.title}`}
                className="focus-ring group relative flex h-full min-h-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/50 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-slate-900 focus:ring-offset-4 focus:ring-offset-slate-950"
              >
                <span
                  className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${
                    accentClasses[system.accent].glow
                  } to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                  aria-hidden="true"
                />
                <span
                  className="absolute right-4 top-4 h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]"
                  aria-hidden="true"
                />

                <div className="relative z-10 mb-5 flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                      accentClasses[system.accent].eyebrow
                    }`}
                  >
                    {system.eyebrow}
                  </span>
                </div>

                <div className="relative z-10 mb-5">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                    {system.status}
                  </p>
                  <h3 className="text-2xl font-black tracking-tight text-white">
                    {system.title}
                  </h3>
                </div>

                <div className="relative z-10 mb-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p
                    className={`text-4xl font-black tracking-tight ${
                      accentClasses[system.accent].metric
                    }`}
                  >
                    {system.metric}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {system.metricLabel}
                  </p>
                </div>

                <p className="relative z-10 mb-5 text-base font-semibold leading-snug text-slate-100">
                  {system.value}
                </p>

                <ul className="relative z-10 mb-5 grid gap-2 text-sm text-slate-200">
                  {system.proof.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          accentClasses[system.accent].line
                        }`}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <span
                  data-featured-system-cta
                  className={`relative z-10 mt-auto inline-flex min-h-[44px] items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold transition-colors duration-300 group-hover:border-white/25 group-hover:bg-white/[0.08] ${
                    accentClasses[system.accent].cta
                  }`}
                >
                  <span>{system.linkLabel}</span>
                  <span
                    className="translate-x-0 text-lg transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
