import { useNavigate } from "react-router-dom";
import { SocialLinks } from "../shared/SocialLinks";
import { Button } from "../shared/Button";
import { SOCIAL_LINKS } from "../../constants";

export const About = () => {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden pb-32"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/images/nyc-sunset.webp"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          {...({ fetchpriority: "high" } as any)}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95"></div>
        {/* Animated gradient mesh overlay */}
        <div
          className="absolute inset-0 opacity-60 animate-gradient-shift"
          style={{
            background:
              "linear-gradient(45deg, rgba(6, 182, 212, 0.2), rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))",
            backgroundSize: "400% 400%",
          }}
        ></div>
      </div>

      <div className="container mx-auto flex px-5 sm:px-8 md:px-10 py-20 lg:flex-row flex-col items-center mt-10 relative z-10">
        <div className="lg:flex-grow lg:w-1/2 lg:pr-24 flex flex-col lg:items-start lg:text-left mb-16 lg:mb-0 items-center text-center">
          <p className="text-xl text-cyan-300 mb-4 animate-fade-in-delay-2 font-medium tracking-wide">
            Hey there! I'm Drew 👋
          </p>
          <p className="mb-7 leading-relaxed text-slate-300 text-lg animate-fade-in-delay-3 max-w-2xl">
            Software engineer at American Express building web applications for
            millions of users. I care deeply about accessibility and performance
            — if your screen reader works and your page loads fast, I'm happy.
            <br />
            <br />
            I mentor students through CodePath and Hunter College (my alma
            mater) because teaching keeps me sharp. When I'm not coding, I'm
            bouldering, traveling, or building side projects.
            <br />
            <br />
            <span className="text-cyan-400 font-semibold tracking-tight">
              NYC based. Always learning.
            </span>
          </p>

          <nav
            aria-label="Professional links and actions"
            className="animate-fade-in-delay-4 w-full flex flex-col items-center lg:items-start"
          >
            {/* Increased gap for tap targets (A11y) */}
            <div className="flex flex-row gap-6 mb-8 mt-4 justify-center lg:justify-start">
              <SocialLinks variant="about" />
            </div>
            
            <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center w-full xl:w-auto max-w-sm xl:max-w-none">
              {/* <Button
                onClick={() => {
                  trackResumeView();
                  window.open(
                    "/andrew-alagna-resume.pdf",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                className="w-full xl:w-auto xl:min-w-[170px] px-10 xl:px-8 py-4 xl:py-3"
                aria-label="View Andrew Alagna's Resume (opens in new tab)"
                variant="primary"
              >
                Resume
              </Button> */}
              
              <Button
                onClick={() => navigate("/#accessibility-expertise")}
                aria-label="View Accessibility Work section"
                className="w-full xl:w-auto xl:min-w-[170px] px-10 xl:px-8 py-4 xl:py-3"
                variant="ghost"
              >
                Accessibility Work
              </Button>
              
              <Button
                onClick={() => {
                  const experienceSection =
                    document.getElementById("experience");
                  if (experienceSection) {
                    const yCoordinate =
                      experienceSection.getBoundingClientRect().top +
                      window.pageYOffset;
                    window.scrollTo({
                      top: yCoordinate - 60,
                      behavior: "smooth",
                    });
                  }
                }}
                aria-label="View Professional Experience section"
                className="w-full xl:w-auto xl:min-w-[170px] px-10 xl:px-8 py-4 xl:py-3"
                variant="neutral"
              >
                Experience
              </Button>
            </div>
          </nav>
        </div>

        <picture className="animate-fade-in-delay-5 relative">
          {/* Decorative glow for depth */}
          <div className="absolute -inset-4 bg-cyan-500/20 blur-3xl rounded-full opacity-50"></div>
          <source srcSet={SOCIAL_LINKS.PROFILE_IMAGE} type="image/webp" />
          <img
            className="relative object-cover object-center rounded-2xl mx-auto sm:h-80 h-80 border-2 border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-500"
            alt="Andrew Alagna - Software Engineer"
            src={SOCIAL_LINKS.PROFILE_IMAGE_FALLBACK}
            loading="eager"
            width="460"
            height="460"
            decoding="async"
            {...({ fetchpriority: "high" } as any)}
          />
        </picture>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 z-20 pointer-events-none"></div>
    </section>
  );
};
