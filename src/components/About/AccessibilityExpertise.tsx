import {
  BriefcaseIcon,
  HeartIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid";
import { useScrollReveal } from "../../hooks";

const MyPalScreen = () => (
  <img
    src="/images/projects/mypal-home.webp"
    alt="myPal's home screen: large picture tiles for Greetings, People, Places, and Actions"
    width="270"
    height="572"
    loading="lazy"
    className="mx-auto h-60 w-auto rounded-2xl border-4 border-slate-700 shadow-2xl"
  />
);

const cases = [
  {
    title: "Enterprise scale",
    context: "American Express",
    Icon: BriefcaseIcon,
    Visual: null,
    problem: (
      <>
        AmEx's profile and identity-update flows (name, email, address, phone)
        had accessibility gaps that risked compliance for millions of US
        cardholders.
      </>
    ),
    solution: (
      <>
        Led WCAG AA compliance work while building the secure profile update
        flows (React.js/Kotlin BFF).
      </>
    ),
    impact: (
      <>
        <strong className="text-white">100% WCAG AA compliance</strong> across
        flows handling{" "}
        <strong className="text-white">~5M updates a year</strong>, with an{" "}
        <strong className="text-white">18% completion lift</strong> and{" "}
        <strong className="text-white">16% start-rate lift</strong> on
        supplementary-profile flows — later extended to 10 international
        markets.
      </>
    ),
  },
  {
    title: "Assistive tech",
    context: "myPal / AAC app · 2021 prototype",
    Icon: HeartIcon,
    Visual: MyPalScreen,
    problem: (
      <>
        Non-verbal children with motor impairments need communication tools that
        work offline and load instantly — existing solutions were expensive and
        connectivity-dependent.
      </>
    ),
    solution: (
      <>
        Mobile app with offline-first SQLite storage, large touch targets, and
        high-contrast PECS visuals. Built with React Native for cross-device
        parity.
      </>
    ),
    impact: (
      <>
        Functional AAC tool at 0% cost to families,{" "}
        <strong className="text-white">
          held to the same 100/100 accessibility bar as everything else here
        </strong>
        , because a broken toggle isn't a minor bug for a kid who can't work
        around it. Open-sourced for the special-needs community to build on.
      </>
    ),
  },
];

export const AccessibilityExpertise = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();

  return (
    <section
      id="accessibility-expertise"
      className="relative py-20 sm:py-24 bg-slate-900"
    >
      <div className="container mx-auto px-5 sm:px-8 md:px-10">
        <div
          ref={headerRef}
          className={`mb-12 scroll-reveal ${headerVisible ? "visible" : ""}`}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Accessibility
          </p>
          <h2 className="mb-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Accessibility is a <span className="text-cyan-300">feature</span>,
            not compliance.
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            The same WCAG AA bar at enterprise scale and in a side project for
            kids who can't work around a broken control.
          </p>
        </div>

        <div
          ref={gridRef}
          className={`grid gap-6 lg:grid-cols-2 scroll-reveal ${gridVisible ? "visible" : ""}`}
        >
          {cases.map(
            ({ title, context, Icon, Visual, problem, solution, impact }) => (
              <article
                key={title}
                className="gap-8 rounded-2xl border border-white/10 bg-slate-950/50 p-6 sm:flex md:p-8"
              >
                <div className="flex-1">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-cyan-500/10 p-3">
                      <Icon
                        className="h-6 w-6 text-cyan-300"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{title}</h3>
                      <p className="text-sm text-slate-400">{context}</p>
                    </div>
                  </div>
                  <dl className="space-y-5">
                    {[
                      ["Problem", problem],
                      ["Solution", solution],
                      ["Impact", impact],
                    ].map(([label, body]) => (
                      <div key={label as string}>
                        <dt className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          {label}
                        </dt>
                        <dd className="leading-relaxed text-slate-300">
                          {body}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                {Visual && (
                  <div className="mt-8 flex-shrink-0 sm:mt-0">
                    <Visual />
                  </div>
                )}
              </article>
            ),
          )}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-slate-400">
            This site is held to the same bar. Check the live Lighthouse scores.
          </p>
          <a
            href="https://pagespeed.web.dev/analysis?url=https://elchic00.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center rounded-lg border border-white/15 bg-white/[0.04] px-6 py-3 font-semibold text-slate-100 transition-colors duration-300 hover:border-cyan-400/50 hover:bg-white/[0.08]"
          >
            <span>View live PageSpeed report</span>
            <ExternalLinkIcon className="ml-2 h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
