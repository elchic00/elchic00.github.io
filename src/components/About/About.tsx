import { useNavigate } from "react-router-dom";
import { SocialLinks } from "../shared/SocialLinks";
import { Button } from "../shared/Button";
import { SOCIAL_LINKS } from "../../constants";

export const About = () => {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-10 sm:pb-32"
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

      <div className="container relative z-10 mx-auto flex flex-col items-center px-5 py-16 sm:px-8 md:px-10 lg:flex-row lg:py-20">
        <div className="mb-12 mt-12 flex flex-col items-center text-center lg:mb-0 lg:w-3/5 lg:flex-grow lg:items-start lg:pr-16 lg:text-left">
          {/*
            Using inline style for background to bypass any Tailwind JIT issues with /95.
            No backdrop-blur — it can interfere with bg-color rendering in Chrome.
          */}
          <div
            className="max-w-3xl rounded-2xl p-6 shadow-2xl ring-1 ring-white/10 sm:p-8 lg:p-10"
            style={{ backgroundColor: "rgba(2, 6, 23, 0.96)" }}
          >
            <p className="animate-fade-in-delay-2 mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 sm:text-sm sm:tracking-[0.32em]">
              Drew Alagna · NYC · Accessible web + self-hosted AI
            </p>

            <h1 className="animate-fade-in-delay-3 mb-6 text-balance text-4xl font-black leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Accessible web interfaces used by millions. Self&#8209;hosted AI,
              built at home.
            </h1>

            <p className="animate-fade-in-delay-3 mb-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
              At American Express I build account, profile, and overview
              interfaces for millions of cardholders, plus the agent workflows
              my team codes with — instruction sets for how agents delegate,
              verify their own work, and ask before assuming, and shared skills
              pushed org-wide. At home I run self-hosted AI infrastructure I
              depend on day to day. I've mentored engineers at CodePath since
              2021.
            </p>

            <div className="animate-fade-in-delay-3 mb-7 grid gap-3 text-left sm:grid-cols-3">
              {[
                "100% WCAG AA compliance",
                "Agent workflows, shared team-wide",
                "Self-hosted AI in production",
              ].map((proof) => (
                <p
                  key={proof}
                  className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-sm font-semibold text-cyan-50"
                >
                  {proof}
                </p>
              ))}
            </div>

            <nav
              aria-label="Professional links and actions"
              className="animate-fade-in-delay-4 w-full flex flex-col items-center lg:items-start"
            >
              <div className="flex w-full max-w-sm flex-col items-stretch gap-4 xl:w-auto xl:max-w-none xl:flex-row xl:items-center">
                <Button
                  onClick={() => navigate("/#homepage-proof")}
                  aria-label="See what I've built"
                  className="w-full px-10 py-4 xl:w-auto xl:min-w-[190px] xl:px-8 xl:py-3"
                  variant="primary"
                >
                  See what I've built
                </Button>
              </div>

              <div className="mt-7 flex flex-row justify-center gap-6 lg:justify-start">
                <SocialLinks variant="about" />
              </div>
            </nav>
          </div>
        </div>

        {/* Responsive profile image with srcset for optimal LCP */}
        <div className="animate-fade-in-delay-5 relative h-80 w-80 max-w-[80vw] overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full opacity-50"></div>
          <picture className="relative block h-full w-full">
            <source
              srcSet="/images/profile-320.webp 320w, /images/profile-460.webp 460w, /images/profile-640.webp 640w, /images/profile-920.webp 920w"
              sizes="(max-width: 400px) 80vw, 320px"
              type="image/webp"
            />
            <img
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
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
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 z-20 pointer-events-none"></div>
    </section>
  );
};
