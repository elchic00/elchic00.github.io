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
  type: "work" | "mentorship";
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  company,
  role,
  period,
  logo,
  icon,
  highlights,
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

  const workExperience: Omit<ExperienceItemProps, "icon"> = {
    company: "American Express",
    role: "Software Engineer — Overview Page Team",
    period: "August 2022 - Present",
    type: "work",
    highlights: [
      "Currently embedded on the Overview Page team, the highest-traffic surface in the consumer app serving 10M+ users, collaborating with senior and staff engineers on frontend architecture",
      "Spearheaded Web Content Accessibility Guidelines (WCAG) AAA compliance implementation across Account Services modules using HTML5 and React.js with axe DevTools and screen reader testing, improving accessibility audit scores from 72% to 100%, mitigating legal risk and expanding market reach for 10M+ global users",
      "Engineered secure user account management flows serving 5M+ users annually, building React.js forms with real-time validation and Kotlin-based BFF API layer for sensitive data updates while maintaining regulatory compliance",
      "Designed and executed 16+ A/B experiments using JavaScript, analytics APIs, and statistical significance testing to identify revenue-driving UX patterns, increasing form completion rates by 12% and customer satisfaction scores by 17%",
      "Built automated CI/CD pipelines using GitHub Actions and implemented feature flagging systems for safer releases, reducing deployment friction and enabling real-time toggles",
      "Established comprehensive testing strategy using Jest/React Testing Library in Agile environment, achieving high test coverage and near-zero production bugs across enterprise-scale applications",
    ],
  };

  const mentorshipExperience: Omit<ExperienceItemProps, "icon">[] = [
    {
      company: "CodePath",
      role: "Technical Mentor & Teaching Assistant",
      period: "June 2021 - Present",
      type: "mentorship",
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
          className={`text-center mb-16 scroll-reveal ${
            headerVisible ? "visible" : ""
          }`}
        >
          <BriefcaseIcon className="w-10 inline-block mb-2 text-cyan-400" />
          <h2 className="sm:text-4xl text-3xl font-bold title-font text-white mb-2 underline-offset-4 underline decoration-cyan-500">
            Professional Experience
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Building impactful software at scale and empowering the next
            generation of engineers
          </p>
        </div>

        {/* Work Experience */}
        <div
          ref={workRef}
          className={`mb-12 md:mb-16 scroll-reveal ${
            workVisible ? "visible" : ""
          }`}
        >
          <ExperienceItem
            {...workExperience}
            icon={<BriefcaseIcon className="w-full h-full" />}
          />
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
