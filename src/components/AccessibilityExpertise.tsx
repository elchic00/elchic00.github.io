import {
  BriefcaseIcon,
  HeartIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid";

export const AccessibilityExpertise = () => {
  return (
    <section id="accessibility-expertise" className="relative py-20 bg-slate-900">
      <div className="container mx-auto px-5 sm:px-8 md:px-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold mb-4">
            {" "}
            Perfect Lighthouse Score: 100/100{" "}
          </span>
          <h2 className="sm:text-4xl text-3xl font-bold title-font text-white mb-4">
            {" "}
            Accessibility is a <span className="text-cyan-400">Feature</span>, Not Compliance{" "}
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            {" "}
            From enterprise-scale compliance to assistive tech innovation — WCAG AAA expertise applied across professional and personal work.{" "}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Professional Card: AmEx */}
          <article className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-600/20 p-3 rounded-lg">
                <BriefcaseIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise Scale</h3>
                <p className="text-cyan-400 text-sm"> American Express / 10M+ Users </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500/50 pl-4">
                <span className="text-red-400 font-semibold text-sm uppercase tracking-wide"> Problem </span>
                <p className="text-slate-300 mt-1">
                  {" "}
                  AmEx's Account Services modules scored 72% on accessibility audits, exposing legal risk and blocking expansion into 10+ international markets with strict compliance requirements.{" "}
                </p>
              </div>
              <div className="border-l-4 border-cyan-500/50 pl-4">
                <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wide"> Solution </span>
                <p className="text-slate-300 mt-1">
                  {" "}
                  Spearheaded WCAG AAA compliance implementation using semantic HTML5, React.js ARIA patterns, and axe DevTools with screen reader validation. Built automated testing into CI/CD for regression prevention.{" "}
                </p>
              </div>
              <div className="border-l-4 border-green-500/50 pl-4">
                <span className="text-green-400 font-semibold text-sm uppercase tracking-wide"> Impact </span>
                <p className="text-slate-300 mt-1">
                  <strong className="text-white"> Audit score: 72% <span className="text-slate-500">→</span>{" "} 100% </strong>
                  . Zero legal exposure. Market expansion unblocked for 10M+ global users. Pattern adopted by 3+ other product teams.
                </p>
              </div>
            </div>
          </article>

          {/* Personal Card: myPal */}
          <article className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <HeartIcon className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Assistive Tech</h3>
                <p className="text-purple-400 text-sm">myPal / AAC App</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500/50 pl-4">
                <span className="text-red-400 font-semibold text-sm uppercase tracking-wide"> Problem </span>
                <p className="text-slate-300 mt-1">
                  {" "}
                  Children with autism and speech delays need communication tools that work offline, load instantly, and remain usable for non-verbal users with motor impairments—existing solutions were expensive and connectivity-dependent.{" "}
                </p>
              </div>
              <div className="border-l-4 border-purple-500/50 pl-4">
                <span className="text-purple-400 font-semibold text-sm uppercase tracking-wide"> Solution </span>
                <p className="text-slate-300 mt-1">
                  {" "}
                  Applied engineering patterns achieving 100/100 Lighthouse accessibility on this portfolio—semantic HTML5, ARIA patterns, axe DevTools validation—to mobile with offline-first SQLite storage, large touch targets for motor difficulties, and high-contrast PECS visuals. React Native for cross-device parity.{" "}
                </p>
              </div>
              <div className="border-l-4 border-green-500/50 pl-4">
                <span className="text-green-400 font-semibold text-sm uppercase tracking-wide"> Impact </span>
                <p className="text-slate-300 mt-1">
                  Functional AAC tool at 0% cost to families.{" "}
                  <strong className="text-white"> Architectural parity with portfolio's 100/100 patterns</strong>
                  . Open-sourced for special needs community adoption.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            {" "}
            View the PageSpeed report and technical implementation details{" "}
          </p>
          <a
            href="https://pagespeed.web.dev/analysis?url=https://elchic00.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
          >
            <span>View Live Lighthouse Report</span>
            <ExternalLinkIcon className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};
