import { BriefcaseIcon, AcademicCapIcon } from "@heroicons/react/solid";
import { useScrollReveal } from "../../hooks";

interface Role {
  company: string;
  role: string;
  period: string;
  summary?: string;
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
      summary:
        "The page cardholders land on after logging in: their accounts, rewards, offers, and spending insights in one place. I own its frontend architecture.",
      stats: [
        "127 of 176 PRs AI-co-authored",
        "10 test suites migrated",
        "16 repos on modern CI",
      ],
      highlights: [
        "Built personalized product recommendations shown beside a cardholder's existing accounts, plus the impression and click analytics that measure them",
        "Built the offer flow that shows which of a cardholder's cards qualify for an offer, then takes them straight to enrollment on the card they pick",
        "Grouped accounts into Personal and Business views, and led keyboard-accessible drag-and-drop account reordering from proof of concept to the five-PR build plan",
        "Lead AI-assisted delivery: 127 of the 176 PRs I merged from March to September 2026 were co-authored with Devin or Copilot, scoped and reviewed by me",
        "Made AI review the team's first pass on pull requests, and ran AI enablement sessions for two teams",
        "Moved 10 test suites from Selenium to Playwright and wrote the playbook, cutting a module migration from about 5 days to 2. Also modernized CI across the team's 16 repos",
      ],
    },
    {
      company: "American Express",
      role: "Software Engineer — Account Services",
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
        "Led the accessibility audit of the profile flows to 100% WCAG AA, most of them to AAA, later rolled out to 10 international markets",
        "Rebuilt the supplementary-card profile flows so a cardholder's chosen card carries through every update. Completion rose 18%, starts rose 16%, and support calls fell by about 650K a year",
        "Built the team's first production backend-for-frontend (Kotlin), for updating the phone and email used for two-factor authentication, with routing and eligibility patterns built for reuse",
        "Built 'View All' screens that show every card and bank account tied to a name, address, phone, or email, and gave Profile its own tab so cardholders with several products can find it",
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
        "1-on-1 mentoring for current students: choosing side projects, sharpening resumes, and preparing for technical interviews",
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
                Software Engineer
                <span className="lg:hidden"> · </span>
                <span className="lg:block">August 2022 - Present</span>
              </p>
            </div>
          </div>

          <ol className="ml-1.5 space-y-12 border-l border-white/10 lg:ml-0">
            {workExperience.map((exp, idx) => (
              <li key={exp.role} className="relative pl-6 md:pl-10">
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
