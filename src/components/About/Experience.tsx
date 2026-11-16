import { useId, useState } from "react";
import { BriefcaseIcon, AcademicCapIcon } from "@heroicons/react/solid";
import { useScrollReveal } from "../../hooks";

interface Role {
  company: string;
  role: string;
  period: string;
  summary?: string;
  highlights: string[];
  stats?: string[];
  // Lets the chat spotlight this entry ([SHOW: ...])
  chatTarget?: string;
}

const Stats: React.FC<{ stats?: string[] }> = ({ stats }) =>
  stats && stats.length > 0 ? (
    <ul className="mb-5 flex flex-wrap gap-2" aria-label="Highlights">
      {stats.map((stat) => (
        <li
          key={stat}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-medium text-slate-200"
        >
          {stat}
        </li>
      ))}
    </ul>
  ) : null;

// With a limit, the rest of the list sits behind a "Show N more" toggle so
// the homepage stays skimmable without dropping any of the detail.
const Highlights: React.FC<{ items: string[]; limit?: number }> = ({ items, limit }) => {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();
  const hiddenCount = limit === undefined ? 0 : Math.max(items.length - limit, 0);
  const visible = hiddenCount > 0 && !expanded ? items.slice(0, limit) : items;

  return (
    <>
      <ul id={listId} className="space-y-3">
        {visible.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400/70"
              aria-hidden="true"
            />
            <span className="leading-relaxed text-slate-300">{item}</span>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="focus-ring mt-4 rounded text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          {expanded ? "Show fewer" : `Show ${hiddenCount} more`}
        </button>
      )}
    </>
  );
};

export const Experience = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: workRef, isVisible: workVisible } = useScrollReveal();
  const { ref: mentorshipRef, isVisible: mentorshipVisible } =
    useScrollReveal();

  const workExperience: Role[] = [
    {
      company: "American Express",
      role: "Software Engineer — Account Overview",
      chatTarget: "amex-overview",
      period: "Early 2026 - Present",
      summary:
        "The page cardholders land on after logging in: their accounts, rewards, offers, and spending insights in one place. I work across its frontend modules and the shared libraries behind them.",
      stats: [
        "127 of 176 PRs AI-co-authored",
        "10 test suites migrated",
        "16 repos on modern CI",
      ],
      highlights: [
        "Built the Web side of account reordering, launched in October, which lets cardholders drag their accounts into any order or move them with the keyboard. I took it from the first prototype through the build plan, core logic, tests and release handoff, on top of the Personal and Business grouping I built earlier",
        "Built the personalized product recommendations that appear next to a cardholder's existing accounts, and the tracking that records each view and click on them",
        "Used AI code review as the first check on 58 of my 60 pull requests from August to late September, with a person still approving each one. The team adopted it too, going from none of teammates' PRs before May to about a third by September, and I run a biweekly AI forum for my team and a sister team",
        "With a teammate, investigated a week-long slowdown on the cardholder dashboard. We traced the most likely cause to a request the page waited on with no time limit, and I downgraded our conclusion to a lead rather than the answer, because the delay we measured explained seconds, not the minute that was reported",
        "Built the offer flow that shows which of a cardholder's cards qualify for an offer, then takes them straight to enrollment on the card they pick",
        "Caught a fix aimed at the wrong layer: our test data named one product type differently from the real backend, and two frontend patches, one of them mine, would have changed the UI to match the test data. I checked the real backend response, closed mine, challenged the other, approved a fix to the test data instead, and added a test that fails if the mock IDs drift again",
        "Published AI agent skills to the org-wide skills library and improved other engineers' skills. Mine make an agent find a bug's root cause before proposing a fix, edit Confluence and Jira pages through a tested script and re-check each change, and help QA retest a reported bug on the live site",
        "Moved 10 automated test suites from Selenium to Playwright with Devin and Copilot, and wrote the playbook that cut a module's migration from about 5 days to 2. I also made our analytics tests fail when tracking breaks instead of just logging it, which surfaced a real tracking bug that I then fixed",
      ],
    },
    {
      company: "American Express",
      role: "Software Engineer — Account Services",
      chatTarget: "amex-services",
      period: "August 2022 - Early 2026",
      summary:
        "The flows cardholders use to update their name, email, address, and phone: about 5M updates a year.",
      stats: [
        "100% WCAG AA",
        "~5M updates/yr",
        "+18% completion",
        "~650K fewer calls/yr",
      ],
      highlights: [
        "Led the accessibility audit that brought the profile flows to 100% WCAG AA for screen reader and keyboard users, most of them to AAA, later rolled out to 10 international markets",
        "Rebuilt the profile flows for supplementary cards (extra cards on someone's account) so the card a cardholder picks stays selected through every update. Completion rose 18%, starts rose 16%, and support calls fell by about 650K a year",
        "Built my team's first production backend-for-frontend service, in Kotlin, which lets cardholders update the phone and email they use for two-factor sign-in, with routing and eligibility patterns designed for reuse",
        "Built 'View All' screens that show every card and bank account tied to a name, address, phone, or email, and gave Profile its own tab so cardholders with several products can find it",
      ],
    },
  ];

  const mentorshipExperience: Role[] = [
    {
      company: "CodePath",
      chatTarget: "codepath",
      role: "Technical Mentor & Teaching Assistant",
      period: "June 2021 - Early 2026",
      stats: ["300+ students taught", "~4.5 years"],
      highlights: [
        "Led weekly sessions for 5 students making their first open-source contributions: GitHub workflows, and using AI to find their way around unfamiliar codebases",
        "Taught 300+ students as a cybersecurity-fundamentals instructor, a Data Structures & Algorithms TA, and a technical interview-prep coach",
        "Secured free industry certifications for roughly 100 students through the cybersecurity track",
      ],
    },
    {
      company: "CUNY: Hunter College",
      role: "Alumni Mentor",
      period: "2025 - 2026",
      highlights: [
        "Mentored Hunter students 1-on-1 on choosing side projects, sharpening resumes, and preparing for technical interviews",
      ],
    },
  ];

  return (
    <section id="experience" className="relative bg-slate-950 py-20">
      <div className="container relative z-10 mx-auto px-5 sm:px-8 md:px-10">
        <div
          ref={headerRef}
          className={`mb-14 scroll-reveal ${headerVisible ? "visible" : ""}`}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-amber-300">
            Experience
          </p>
          <h2 className="mb-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Shipping at American Express, teaching along the way.
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            Four years building cardholder-facing features at American Express,
            and 300+ students taught at CodePath from 2021 to early 2026. The route here wasn't straight:
            years in construction and false starts in business and chemistry
            came before a CS degree from CUNY: Hunter College.
          </p>
        </div>

        {/* The AmEx roles are one career in sequence, so they share a timeline */}
        <div
          ref={workRef}
          className={`mb-20 lg:grid lg:grid-cols-[15rem_minmax(0,48rem)] lg:gap-12 scroll-reveal ${workVisible ? "visible" : ""}`}
        >
          <div className="mb-8 flex items-center gap-4 lg:sticky lg:top-28 lg:mb-0 lg:flex-col lg:items-start lg:self-start">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
              <BriefcaseIcon className="h-6 w-6 text-cyan-300" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">American Express</h3>
              <p className="text-sm text-slate-400">
                Software Engineer
                <span className="lg:hidden"> · </span>
                <span className="lg:block">August 2022 - Present</span>
              </p>
            </div>
          </div>

          <ol className="ml-1.5 space-y-12 border-l border-white/10 lg:ml-0">
            {workExperience.map((exp, idx) => (
              <li key={exp.role} data-chat-target={exp.chatTarget} className="relative pl-6 md:pl-10">
                <span
                  className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-slate-950 ${
                    idx === 0 ? "bg-cyan-400" : "border-2 border-cyan-400/60 bg-slate-950"
                  }`}
                  aria-hidden="true"
                />
                <p className="mb-1 text-sm font-medium text-slate-400">
                  {exp.period}
                  {idx === 0 && (
                    <span className="ml-2 rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs font-semibold text-cyan-200">
                      Current
                    </span>
                  )}
                </p>
                <h4 className="mb-2 text-xl font-bold text-white md:text-2xl">
                  {exp.role.replace(/^Software Engineer — /, "")}
                </h4>
                {exp.summary && (
                  <p className="mb-4 max-w-2xl leading-relaxed text-slate-400">{exp.summary}</p>
                )}
                <Stats stats={exp.stats} />
                <Highlights items={exp.highlights} limit={4} />
              </li>
            ))}
          </ol>
        </div>

        <div
          ref={mentorshipRef}
          className={`lg:grid lg:grid-cols-[15rem_minmax(0,48rem)] lg:gap-12 scroll-reveal ${mentorshipVisible ? "visible" : ""}`}
        >
          <div className="mb-8 flex items-center gap-4 lg:sticky lg:top-28 lg:mb-0 lg:flex-col lg:items-start lg:self-start">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10">
              <AcademicCapIcon className="h-6 w-6 text-cyan-300" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-white">Mentorship & teaching</h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:items-start">
            {mentorshipExperience.map((exp) => (
              <article
                key={exp.company}
                data-chat-target={exp.chatTarget}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-6"
              >
                <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                <p className="font-semibold text-cyan-300">{exp.company}</p>
                <p className="mb-5 text-sm text-slate-400">{exp.period}</p>
                <Stats stats={exp.stats} />
                <Highlights items={exp.highlights} />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
