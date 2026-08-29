import {
  BriefcaseIcon,
  AcademicCapIcon,
  CheckCircleIcon,
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
  type: "work" | "mentorship";
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  company,
  role,
  period,
  logo,
  icon,
  highlights,
  stats,
  type,
}) => {
  const isWork = type === "work";

  return (
    <article
      className={`bg-gradient-to-br ${
        isWork
          ? "from-slate-800 to-slate-900 border-cyan-500/30"
          : "from-slate-800/80 to-slate-900/80 border-purple-500/30"
      } border-2 rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-[1.02]`}
    >
      <div className="flex items-start gap-4 mb-6">
        <div
          className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl ${
            isWork ? "bg-cyan-600/20" : "bg-purple-600/20"
          } flex items-center justify-center`}
        >
          {logo ? (
            <img
              src={logo}
              alt={`${company} logo`}
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          ) : (
            <div
              className={`${
                isWork ? "text-cyan-400" : "text-purple-400"
              } w-8 h-8 md:w-10 md:h-10`}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="flex-grow">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {role}
          </h3>
          <p
            className={`text-lg md:text-xl font-semibold mb-1 ${
              isWork ? "text-cyan-400" : "text-purple-400"
            }`}
          >
            {company}
          </p>
          <p className="text-slate-400 text-sm md:text-base">{period}</p>
        </div>
      </div>

      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {stats.map((stat) => (
            <span
              key={stat}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                isWork
                  ? "bg-cyan-600/20 text-cyan-400 border-cyan-500/30"
                  : "bg-purple-600/20 text-purple-400 border-purple-500/30"
              }`}
            >
              {stat}
            </span>
          ))}
        </div>
      )}

      <ul className="space-y-3">
        {highlights.map((highlight, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircleIcon
              className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5 ${
                isWork ? "text-cyan-500" : "text-purple-500"
              }`}
            />
            <span className="text-slate-300 text-base md:text-lg leading-relaxed">
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
      type: "work",
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
      type: "work",
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
      type: "mentorship",
      stats: ["350+ students mentored", "4+ years"],
      highlights: [
        "Leading weekly mentorship sessions for 5 students in open source contribution, teaching GitHub workflows and utilizing AI to understand codebases",
        "Mentored 350+ students across multiple cohorts in Data Structures & Algorithms and cybersecurity fundamentals",
        "Guided students through technical interview preparation, securing free certifications for 300+ students",
      ],
    },
    {
      company: "CUNY: Hunter College",
      role: "Alumni Mentor",
      period: "2025 - Present",
      type: "mentorship",
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
      className="relative min-h-screen pt-20 pb-12 bg-slate-950"
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
            mentoring engineers outside it. Both followed a winding path — years
            in construction, a couple of false-start semesters in business and
            chemistry, then a CS degree from Hunter College before American
            Express.
          </p>
        </div>

        {/* Work Experience */}
        <div
          ref={workRef}
          className={`mb-12 md:mb-16 grid gap-6 md:gap-8 scroll-reveal ${
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
          <div className="flex items-center gap-3 mb-8">
            <AcademicCapIcon className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
            <h3 className="text-3xl md:text-4xl font-bold text-white">
              Mentorship & Teaching
            </h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
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
