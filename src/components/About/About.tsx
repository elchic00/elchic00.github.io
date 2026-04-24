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
      {/* Background image layer - responsive srcset for LCP optimization */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/nyc-sunset-1280.webp"
          srcSet="/images/nyc-sunset-640.webp 640w, /images/nyc-sunset-960.webp 960w, /images/nyc-sunset-1280.webp 1280w, /images/nyc-sunset-1920.webp 1920w"
          sizes="100vw"
          alt=""
          className="w-full h-full object-cover object-[center_38%]"
          loading="eager"
          {...({ fetchpriority: "high" } as any)}
        />
        {/* Single light overlay — just enough to ground the photo, card does the rest */}
        <div className="absolute inset-0 bg-slate-950/45" />
      </div>

      <div className="container mx-auto flex px-5 sm:px-8 md:px-10 py-20 lg:flex-row flex-col items-center relative z-10">
        <div className="lg:flex-grow lg:w-1/2 lg:pr-16 flex flex-col lg:items-start lg:text-left mb-16 lg:mb-0 items-center text-center mt-16">
          {/* 
            Using inline style for background to bypass any Tailwind JIT issues with /95.
            No backdrop-blur — it can interfere with bg-color rendering in Chrome.
          */}
          <div
            className="rounded-2xl p-6 sm:p-8 lg:p-10 ring-1 ring-white/10 shadow-2xl"
            style={{ backgroundColor: "rgba(2, 6, 23, 0.96)" }}
          >
            <p className="text-xl text-white mb-4 animate-fade-in-delay-2 font-medium tracking-wide">
              Hey there! I'm Drew 👋
            </p>

            <p className="mb-7 leading-relaxed text-white/90 text-lg animate-fade-in-delay-3 max-w-xl">
              Software engineer building web applications for
              millions of users. I care deeply about accessibility and performance
              — if your screen reader works and your page loads fast, I'm happy.
              <br />
              <br />
              I mentor students through CodePath and Hunter College (my alma
              mater) because teaching keeps me sharp. When I'm not coding, I'm
              bouldering, traveling, or building side projects.
              <br />
              <br />
              {/* 
                Switched from text-cyan-300 to text-white with a cyan text-shadow.
                Preserves the cyan feel without the blue-on-orange contrast problem.
              */}
              <span
                className="font-semibold tracking-tight text-white"
                style={{ textShadow: "0 0 12px rgba(103, 232, 249, 0.8)" }}
              >
                NYC based. Always learning.
              </span>
            </p>

            <nav
              aria-label="Professional links and actions"
              className="animate-fade-in-delay-4 w-full flex flex-col items-center lg:items-start"
            >
              <div className="flex flex-row gap-6 mb-8 mt-4 justify-center lg:justify-start">
                <SocialLinks variant="about" />
              </div>

              <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center w-full xl:w-auto max-w-sm xl:max-w-none">
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
        </div>

        {/* Responsive profile image with srcset for optimal LCP */}
        <picture className="animate-fade-in-delay-5 relative">
          <div className="absolute -inset-4 bg-cyan-500/20 blur-3xl rounded-full opacity-50"></div>
          <source
            srcSet="/images/profile-320.webp 320w, /images/profile-460.webp 460w, /images/profile-640.webp 640w, /images/profile-920.webp 920w"
            sizes="(max-width: 640px) 80vw, 460px"
            type="image/webp"
          />
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
