import { useScrollReveal } from "../../hooks";

const proofMetrics = [
  {
    value: "300+",
    label: "students coached",
    note: "Cybersecurity, DS&A, and technical interview-prep classes at CodePath",
  },
  {
    value: "100%",
    label: "WCAG AA compliance",
    note: "WCAG AA patterns, tested with real assistive tech",
  },
  {
    value: "~5M",
    label: "profile updates/year",
    note: "Profile and 2FA flows built for sensitive account data",
  },
  {
    value: "10",
    label: "private-cloud services",
    note: "Pi-Cloud telemetry, identity, DNS, and recovery stack",
  },
] as const;

export const HomeProofBand = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: metricsRef, isVisible: metricsVisible } = useScrollReveal();

  return (
    <section
      id="homepage-proof"
      aria-labelledby="homepage-proof-title"
      className="relative bg-slate-950 py-12 sm:py-16"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="container mx-auto px-5 sm:px-8 md:px-10">
        <div
          ref={headerRef}
          className={`mb-8 max-w-3xl scroll-reveal ${
            headerVisible ? "visible" : ""
          }`}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Proof before promises
          </p>
          <h2
            id="homepage-proof-title"
            className="text-2xl font-bold text-white sm:text-3xl"
          >
            Real numbers from systems I've shipped and still run.
          </h2>
        </div>

        <div
          ref={metricsRef}
          className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 scroll-reveal-scale ${
            metricsVisible ? "visible" : ""
          }`}
        >
          {proofMetrics.map((metric) => (
            <article
              key={metric.label}
              data-proof-metric
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-slate-950/40 transition-colors duration-300 hover:border-cyan-300/40 hover:bg-cyan-400/[0.04]"
            >
              <p className="mb-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
                {metric.value}
              </p>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
                {metric.label}
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {metric.note}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
