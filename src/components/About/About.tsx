import { useNavigate } from "react-router-dom";
import { SocialLinks } from "../shared/SocialLinks";
import { Button } from "../shared/Button";
import { SOCIAL_LINKS } from "../../constants";

export const About = () => {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      className="relative flex items-center overflow-hidden pb-16 pt-10 lg:min-h-[92vh] lg:pb-24"
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
        {/* Dark on the text side, photo shows through on the right */}
        <div className="absolute inset-0 bg-slate-950/80 lg:bg-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-slate-950/85 lg:to-slate-950/20" />
      </div>

      <div className="container relative z-10 mx-auto flex flex-col items-center gap-10 px-5 py-24 sm:px-8 md:px-10 lg:flex-row lg:justify-between lg:gap-16 lg:py-20">
        {/* Responsive profile image with srcset for optimal LCP */}
        <div className="animate-fade-in-delay-2 relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white/15 lg:order-last lg:h-80 lg:w-80 lg:rounded-2xl">
          <picture className="block h-full w-full">
            <source
              srcSet="/images/profile-320.webp 320w, /images/profile-460.webp 460w, /images/profile-640.webp 640w, /images/profile-920.webp 920w"
              sizes="(max-width: 1023px) 112px, 320px"
              type="image/webp"
            />
            <img
              className="h-full w-full object-cover"
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

        <div className="flex max-w-2xl flex-col items-center text-center lg:flex-grow lg:items-start lg:text-left">
          <p className="animate-fade-in-delay-2 mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200 sm:text-sm">
            Drew Alagna<span className="hidden sm:inline"> · Software engineer</span> · NYC
          </p>

          <h1 className="animate-fade-in-delay-3 mb-6 text-balance text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Accessible web interfaces used by millions. Self&#8209;hosted AI,
            built at home.
          </h1>

          <p className="animate-fade-in-delay-3 mb-9 max-w-xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            At American Express I build the account, profile, and overview
            pages cardholders use, plus the agent workflows my team codes
            with. At home I run the AI infrastructure I depend on every day,
            and I've taught at CodePath since 2021.
          </p>

          <nav
            aria-label="Professional links and actions"
            className="animate-fade-in-delay-4 flex flex-col items-center gap-6 sm:flex-row lg:items-center"
          >
            <Button
              onClick={() => navigate("/#featured-systems")}
              aria-label="See what I've built"
              className="px-8"
              variant="primary"
            >
              See what I've built
            </Button>
            <div className="flex flex-row gap-4">
              <SocialLinks variant="about" />
            </div>
          </nav>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-950 z-20 pointer-events-none"></div>
    </section>
  );
};
