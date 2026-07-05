import {
  BriefcaseIcon,
  HeartIcon,
  ExternalLinkIcon,
} from "@heroicons/react/solid";
import { useScrollReveal } from "../../hooks";

export const AccessibilityExpertise = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: card1Ref, isVisible: card1Visible } = useScrollReveal();
  const { ref: card2Ref, isVisible: card2Visible } = useScrollReveal();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal();

  return (
    <section id="accessibility-expertise" className="relative py-20 bg-slate-900">
      <div className="container mx-auto px-5 sm:px-8 md:px-10">
        <div 
          ref={headerRef}
          className={`text-center mb-12 scroll-reveal-scale ${headerVisible ? 'visible' : ''}`}
        >
          <span className="inline-block px-4 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold mb-4">
            Perfect Lighthouse Score: 100/100
          </span>
          <h2 className="sm:text-4xl text-3xl font-bold title-font text-white mb-4">
            Accessibility is a <span className="text-cyan-400">Feature</span>, Not Compliance
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            From enterprise-scale compliance to assistive tech innovation — WCAG AA expertise applied across professional and personal work.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 md:items-start">
          {/* Professional Card: AmEx */}
          <article
            ref={card1Ref}
            className={`md:col-span-3 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-[1.02] scroll-reveal-left ${card1Visible ? 'visible' : ''}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-600/20 p-3 rounded-lg">
                <BriefcaseIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise Scale</h3>
                <p className="text-cyan-400 text-sm">American Express</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500/50 pl-4">
                <span className="text-red-400 font-semibold text-sm uppercase tracking-wide"> Problem </span>
                <p className="text-slate-300 mt-1">
                  AmEx's profile and identity-update flows (name, email, address, phone) had accessibility gaps that risked compliance for millions of US cardholders.
                </p>
              </div>
              <div className="border-l-4 border-cyan-500/50 pl-4">
                <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wide"> Solution </span>
                <p className="text-slate-300 mt-1">
                  Spearheaded WCAG AA compliance while engineering <strong>secure profile update flows</strong> (React.js/Kotlin BFF) supporting ~5M annual profile updates.
                </p>
              </div>
              <div className="border-l-4 border-green-500/50 pl-4">
                <span className="text-green-400 font-semibold text-sm uppercase tracking-wide"> Impact </span>
                <p className="text-slate-300 mt-1">
                  <strong className="text-white text-base">100% WCAG AA compliance</strong>
                  . Supported <strong className="text-white">~5M annual profile updates</strong> with a <strong className="text-white">18% completion lift</strong> and <strong className="text-white">16% start-rate lift</strong> on supplementary-profile flows — later extended to 8-10 international markets.
                </p>
              </div>
            </div>
          </article>

          {/* Personal Card: myPal */}
          <article
            ref={card2Ref}
            className={`md:col-span-2 md:mt-12 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/30 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-[1.02] scroll-reveal-right ${card2Visible ? 'visible' : ''}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <HeartIcon className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Assistive Tech</h3>
                <p className="text-purple-400 text-sm">myPal / AAC App · 2021 prototype</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500/50 pl-4">
                <span className="text-red-400 font-semibold text-sm uppercase tracking-wide"> Problem </span>
                <p className="text-slate-300 mt-1">
                  Non-verbal children with motor impairments need communication tools that work offline and load instantly — existing solutions were expensive and connectivity-dependent.
                </p>
              </div>
              <div className="border-l-4 border-purple-500/50 pl-4">
                <span className="text-purple-400 font-semibold text-sm uppercase tracking-wide"> Solution </span>
                <p className="text-slate-300 mt-1">
                  Mobile app with offline-first SQLite storage, large touch targets, and high-contrast PECS visuals. Built with React Native for cross-device parity.
                </p>
              </div>
              <div className="border-l-4 border-green-500/50 pl-4">
                <span className="text-green-400 font-semibold text-sm uppercase tracking-wide"> Impact </span>
                <p className="text-slate-300 mt-1">
                  Functional AAC tool at 0% cost to families —{" "}
                  <strong className="text-white">held to the same 100/100 accessibility bar as everything else here</strong>, because a broken toggle isn't a minor bug for a kid who can't work around it. Open-sourced for the special-needs community to build on.
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Bottom CTA */}
        <div 
          ref={ctaRef}
          className={`mt-12 text-center scroll-reveal ${ctaVisible ? 'visible' : ''}`}
        >
          <p className="text-slate-400 mb-4">
            View the Lighthouse report and technical implementation details
          </p>
          <a
            href="https://pagespeed.web.dev/analysis?url=https://elchic00.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
          >
            <span>View Live PageSpeed Report</span>
            <ExternalLinkIcon className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};
