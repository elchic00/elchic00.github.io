import { useNavigate } from "react-router-dom";
import { SocialLinks } from "../shared/SocialLinks";
import { Button } from "../shared/Button";
import { SOCIAL_LINKS } from "../../constants";
import { trackResumeView } from "../../utils/analytics";

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
              "linear-gradient(45deg, rgba(6, 182, 212, 0.3), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))",
            backgroundSize: "400% 400%",
          }}
        ></div>
      </div>

      <div className="container mx-auto flex px-5 sm:px-8 md:px-10 py-20 md:flex-row flex-col items-center mt-10 relative z-10">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <p className="text-xl text-cyan-300 mb-4 animate-fade-in-delay-2">
            Hey there! I'm Drew 👋
          </p>
          <p className="mb-7 leading-relaxed text-slate-300 text-lg animate-fade-in-delay-3">
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
            <span className="text-cyan-400 font-semibold">
              NYC based. Always learning.
            </span>
          </p>

          <nav
            aria-label="Social links and actions"
            className="animate-fade-in-delay-4"
          >
            <div className="flex flex-row gap-4 mb-6 mt-6 justify-center md:justify-start">
              <SocialLinks variant="about" />
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Button
                onClick={() => {
                  trackResumeView();
                  window.open(
                    "/andrew-alagna-resume.pdf",
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white shadow-lg shadow-cyan-900/20"
                aria-label="View Resume in new tab"
              >
                Resume
              </Button>
              
              <Button
                onClick={() => navigate("/#accessibility-expertise")}
                ariaLabel="View Travel Adventures"
                className="bg-slate-800/40 border border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50 text-slate-200"
                variant="ghost"
              >
                View Accessibility Work
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
                ariaLabel="View Professional Experience"
                className="border border-slate-400/60 bg-transparent text-slate-100 hover:bg-white/5"
                variant="neutral"
              >
                View Experience
              </Button>
            </div>
          </nav>
        </div>

        <picture className="animate-fade-in-delay-5">
          <source srcSet={SOCIAL_LINKS.PROFILE_IMAGE} type="image/webp" />
          <img
            className="object-cover object-center rounded-2xl mx-auto sm:h-80 h-80 border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all duration-500 hover:scale-105 hover:rotate-2"
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

      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 z-20 pointer-events-none"></div>
    </section>
  );
};
