import { BriefcaseIcon, AcademicCapIcon } from "@heroicons/react/solid";
import { useScrollReveal } from "../../hooks";

interface Role {
  company: string;
  role: string;
  period: string;
  highlights: string[];
  stats?: string[];
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

const Highlights: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="space-y-3">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-3">
        <span
          className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400/70"
          aria-hidden="true"
        />
        <span className="leading-relaxed text-slate-300">{item}</span>
      </li>
    ))}
  </ul>
);

export const Experience = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: workRef, isVisible: workVisible } = useScrollReveal();
  const { ref: mentorshipRef, isVisible: mentorshipVisible } =
    useScrollReveal();

  const workExperience: Role[] = [
    {
      company: "American Express",
      role: "Software Engineer — Account Overview",
      period: "Early 2026 - Present",
      highlights: [
        "Own the frontend architecture of the account overview page: the one screen that brings a cardholder's accounts, rewards, offers, and spending insights together",
        "Built personalized product suggestions end-to-end: cards a cardholder doesn't have yet but is likely to want, shown clearly apart from their real accounts",
        "Built the offer flow that shows which of a cardholder's cards qualify for an offer, then takes them straight to enrollment on the card they pick",
        "Split business and personal accounts into separate views on the overview page",
        "Led the Selenium-to-Playwright test migration and monorepo onboarding, writing reusable playbooks for the team",
      ],
    },
    {
      company: "American Express",
      role: "Software Engineer — Account Services",
      period: "August 2022 - Early 2026",
      stats: [
        "100% WCAG AA",
        "~5M annual updates",
        "~650K calls avoided/yr",
        "+18% completion",
      ],
      highlights: [
        "Led the accessibility audit of the profile flows (name, email, address, phone) to 100% WCAG AA, many of them AAA, later rolled out to 10 international markets",
        "Built the secure profile-update flows (React + Kotlin BFF) behind ~5M updates a year; analytics-driven iteration lifted supplementary-profile completion 18% and starts 16%",
        "Built the profile 'View All' screens, which show every card and bank account tied to a name, address, phone, or email in one place, and gave Profile its own tab so multi-product cardholders can actually find it",
        "Built the team's first production BFF, for updating the phone and email used for two-factor authentication, with routing and eligibility patterns built to be reused",
        "Standardized CI/CD across 15+ shared library modules",
      ],
    },
  ];

  const mentorshipExperience: Role[] = [
    {
      company: "CodePath",
      role: "Technical Mentor & Teaching Assistant",
      period: "June 2021 - Present",
      stats: ["300+ students taught", "5+ years"],
      highlights: [
        "Lead weekly sessions for 5 students making their first open-source contributions: GitHub workflows, and using AI to find their way around unfamiliar codebases",
        "Taught 300+ students total — as a cybersecurity-fundamentals instructor, a Data Structures & Algorithms TA, and a technical interview-prep coach",
        "Secured free industry certifications for roughly 100 students through the cybersecurity track",
      ],
    },
    {
      company: "CUNY: Hunter College",
      role: "Alumni Mentor",
      period: "2025 - Present",
      highlights: [
        "1-on-1 career mentoring for current students: choosing side projects and sharpening resumes",
        "Prep for technical interviews and the job search, over video calls and LinkedIn messages",
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
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Experience
          </p>
          <h2 className="mb-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Shipping at American Express, teaching on the side.
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            Four years building cardholder-facing features at American Express,
            and five-plus teaching at CodePath. The route here wasn't straight:
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
                Software Engineer · August 2022 - Present
              </p>
            </div>
          </div>

          <ol className="ml-6 space-y-12 border-l border-white/10 lg:ml-0">
            {workExperience.map((exp, idx) => (
              <li key={exp.role} className="relative pl-8 md:pl-10">
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
                <h4 className="mb-4 text-xl font-bold text-white md:text-2xl">
                  {exp.role.replace(/^Software Engineer — /, "")}
                </h4>
                <Stats stats={exp.stats} />
                <Highlights items={exp.highlights} />
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
