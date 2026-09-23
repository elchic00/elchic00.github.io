import {
  BriefcaseIcon,
  AcademicCapIcon,
} from "@heroicons/react/solid";
import { useScrollReveal } from "../../hooks";

interface ExperienceItemProps {
  company: string;
  role: string;
  period: string;
  logo?: string;
  icon?: React.ReactNode;
  highlights: string[];
  stats?: string[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  company,
  role,
  period,
  logo,
  icon,
  highlights,
  stats,
}) => {

  return (
    <article
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 md:p-8"
    >
      <div className="flex items-start gap-4 mb-6">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center"
        >
          {logo ? (
            <img
              src={logo}
              alt={`${company} logo`}
              className="w-7 h-7 object-contain"
            />
          ) : (
            <div className="text-cyan-300 w-6 h-6">
              {icon}
            </div>
          )}
        </div>

        <div className="flex-grow">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
            {role}
          </h3>
          <p className="text-base md:text-lg font-semibold text-cyan-300 mb-1">
            {company}
          </p>
          <p className="text-slate-400 text-sm">{period}</p>
        </div>
      </div>

      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {stats.map((stat) => (
            <span
              key={stat}
              className="px-3 py-1 rounded-full text-sm font-medium border border-white/10 bg-white/[0.04] text-slate-200"
            >
              {stat}
            </span>
          ))}
        </div>
      )}

      <ul className="space-y-3">
        {highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className="mt-[0.6rem] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400/70"
              aria-hidden="true"
            />
            <span className="text-slate-300 leading-relaxed">
              {highlight}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
};

export const Experience = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: workRef, isVisible: workVisible } = useScrollReveal();
  const { ref: mentorshipHeaderRef, isVisible: mentorshipHeaderVisible } =
    useScrollReveal();

  const workExperience: Omit<ExperienceItemProps, "icon">[] = [
    {
      company: "American Express",
      role: "Software Engineer — Overview Team",
      period: "Early 2026 - Present",
      highlights: [
        "Owns frontend architecture for the Overview page — an aggregate view of everything a logged-in American Express cardholder has, surfacing account summaries, reward balances, personalized offers, and spend-habit insights as tiles",
        "Built Ghost Accounts end-to-end: a feature surfacing products a cardholder doesn't yet have but is likely to want, visually distinct from real account tiles",
        "Built the deep-link offers flow — clicking an offer surfaces which of a cardholder's eligible cards apply, then routes to that offer's enrollment page for the selected card",
        "Built the logic for splitting business and personal accounts into separate views on the overview page",
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
        "Led a WCAG accessibility audit across profile/identity flows (name, email, address, phone), reaching 100% WCAG AA compliance — many flows AAA — later extended to 10 international markets",
        "Engineered secure profile-management flows (React.js + Kotlin BFF) supporting ~5M annual updates, with analytics-backed iteration lifting supplementary-profile completion 18% and start rate 16%",
        "Built the Profile section's aggregate 'View All' screens for names, addresses, phone numbers, and email addresses — each showing every card and banking product tied to that piece of info in one place — and added Profile as its own tab in Overview's navigation, making it far more discoverable for multi-product cardholders",
        "Built the first production BFF for updating the phone/email used for two-factor authentication on the profile landing page, establishing reusable routing and eligibility patterns for the team",
        "Standardized CI/CD across 15+ shared library modules",
      ],
    },
  ];

  const mentorshipExperience: Omit<ExperienceItemProps, "icon">[] = [
    {
      company: "CodePath",
      role: "Technical Mentor & Teaching Assistant",
      period: "June 2021 - Present",
      stats: ["300+ students taught", "5+ years"],
      highlights: [
        "Leading weekly mentorship sessions for 5 students in open source contribution, teaching GitHub workflows and utilizing AI to understand codebases",
        "Taught 300+ students total — as a cybersecurity-fundamentals instructor, a Data Structures & Algorithms TA, and a technical interview-prep coach",
        "Secured free industry certifications for roughly 100 students through the cybersecurity track",
      ],
    },
    {
      company: "CUNY: Hunter College",
      role: "Alumni Mentor",
      period: "2025 - Present",
      highlights: [
        "Providing 1-on-1 career mentorship to current students on side project ideation and resume optimization",
        "Guiding students through technical interviews and navigating the tech job market",
        "Supporting students via video sessions and async LinkedIn messaging",
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="relative pt-20 pb-20 bg-slate-950"
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/98 to-slate-950 pointer-events-none z-0"></div>
      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-950 pointer-events-none z-0"></div>

      <div className="container mx-auto px-5 sm:px-8 md:px-10 relative z-10">
        <div
          ref={headerRef}
          className={`mb-16 scroll-reveal ${headerVisible ? "visible" : ""}`}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Experience
          </p>
          <h2 className="mb-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Professional experience
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            Four years shipping inside a Fortune-500 web app, five-plus
            teaching and mentoring students outside it. Both followed a winding
            path — years in construction, a couple of false-start semesters in
            business and chemistry, then a CS degree from Hunter College before
            American Express.
          </p>
        </div>

        {/* Work Experience */}
        <div
          ref={workRef}
          className={`mb-12 md:mb-16 grid max-w-4xl gap-6 scroll-reveal ${
            workVisible ? "visible" : ""
          }`}
        >
          {workExperience.map((exp, idx) => (
            <ExperienceItem
              key={idx}
              {...exp}
              icon={<BriefcaseIcon className="w-full h-full" />}
            />
          ))}
        </div>

        {/* Mentorship Section */}
        <div
          ref={mentorshipHeaderRef}
          className={`mb-8 scroll-reveal ${
            mentorshipHeaderVisible ? "visible" : ""
          }`}
        >
          <h3 className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
            Mentorship & teaching
          </h3>
        </div>

        <div className="grid max-w-4xl gap-6 md:grid-cols-2 md:items-start">
          {mentorshipExperience.map((exp, idx) => (
            <ExperienceItem
              key={idx}
              {...exp}
              icon={<AcademicCapIcon className="w-full h-full" />}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
