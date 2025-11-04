import { SocialLinks } from "./shared/SocialLinks";
import { Button } from "./shared/Button";
import { SOCIAL_LINKS } from "../constants";

export const About = () => {

  return (
    <section id="about" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/images/nyc-sunset.webp"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95"></div>
      </div>

      <div className="container mx-auto flex px-5 sm:px-8 md:px-10 py-20 md:flex-row flex-col items-center mt-10 relative z-10">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-5xl text-4xl mb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mt-5 animate-fade-in">
            Andrew Alagna
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6 animate-fade-in-delay-1">
            Software Engineer
          </h2>
          <p className="text-xl text-cyan-300 mb-4 animate-fade-in-delay-2">Hey there! I'm Drew 👋</p>
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
            <span className="text-cyan-400 font-semibold">NYC based. Always learning.</span>
          </p>

          <nav aria-label="Social links and actions" className="animate-fade-in-delay-4">
            <div className="flex flex-row gap-3 mb-6 mt-6">
              <SocialLinks variant="about" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  const experienceSection = document.getElementById('experience');
                  if (experienceSection) {
                    const yCoordinate = experienceSection.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                      top: yCoordinate - 60,
                      behavior: "smooth",
                    });
                  }
                }}
                ariaLabel="View Professional Experience"
                className="hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
              >
                View Experience
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const projectsSection = document.getElementById('projects');
                  if (projectsSection) {
                    const yCoordinate = projectsSection.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                      top: yCoordinate - 60,
                      behavior: "smooth",
                    });
                  }
                }}
                ariaLabel="View Personal Projects"
                className="hover:scale-105 transition-transform duration-300 bg-slate-700 hover:bg-slate-600"
              >
                View Projects
              </Button>
              <a
                href="/andrew-alagna-resume.pdf"
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex items-center h-10 px-4 text-white bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 rounded-lg font-medium shadow-md hover:shadow-lg hover:shadow-cyan-500/30 focus-ring hover:scale-105"
                aria-label="View Resume in new tab"
              >
                Resume
              </a>
              <Button
                variant="secondary"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    const yCoordinate = contactSection.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                      top: yCoordinate - 60,
                      behavior: "smooth",
                    });
                  }
                }}
                ariaLabel="Contact Me"
                className="hover:scale-105 transition-transform duration-300"
              >
                Contact Me
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
            fetchPriority="high"
          />
        </picture>
      </div>
    </section>
  );
};
