import { useNavigate } from "react-router-dom";
import { SocialLinks } from "./shared/SocialLinks";
import { SOCIAL_LINKS } from "../constants";

export const About = () => {
  const navigate = useNavigate();

  return (
    <section id="about">
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col items-center mt-10">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white mt-5">
            Andrew Alagna - Software Engineer
          </h1>
          <p className="text-xl text-gray-400 mb-4">Hey there! I'm Drew 👋</p>
          <p className="mb-7 leading-relaxed">
            I build accessible, performant web applications at American Express,
            serving millions of users across the globe.
            <br />
            <br />
            My passion lies in creating inclusive digital experiences and
            optimizing performance—whether that's improving accessibility across
            international markets, or cutting load times through smart
            architecture.
            <br />
            <br />
            When I'm not coding, I'm teaching, bouldering, or travelling. I
            mentor students through CodePath and students from my alma mater,
            helping the next generation of engineers level up their skills.
            <br />
            <br />
            Hunter College grad. NYC based. Always learning.
          </p>

          <nav aria-label="Social links and actions">
            <div className="flex flex-row gap-4 mb-5 mt-5">
              <SocialLinks variant="about" /> {/* Returns two links directly */}
              <a
                href="/#/resume"
                rel="noreferrer"
                target="_blank"
                className="mb-6 inline-flex items-center h-10 p-3 text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors duration-500 rounded focus:shadow-outline hover:text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                aria-label="View Resume"
              >
                Resume
              </a>
              <button
                className="inline-flex items-center text-center text-white bg-green-800 hover:bg-green-700 duration-500 border-0 h-10 px-3 rounded focus:outline-none mb-6 focus:ring-2 focus:ring-lime-500"
                onClick={() => navigate("/snake")}
                aria-label="Play Snake Game"
              >
                Snake
              </button>
              <button
                className="inline-flex items-center text-center text-white bg-indigo-600 hover:bg-indigo-500 duration-500 border-0 h-10 px-3 rounded focus:outline-none mb-6 focus:ring-2 focus:ring-lime-500"
                onClick={() => navigate("/travel")}
                aria-label="View Travel Photography"
              >
                Travel
              </button>
            </div>
          </nav>
        </div>

        <picture>
          <source srcSet={SOCIAL_LINKS.PROFILE_IMAGE} type="image/webp" />
          <img
            className="object-cover object-center rounded mx-auto sm:h-80 h-80 border-2 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            alt="Andrew Alagna - Software Engineer"
            src={SOCIAL_LINKS.PROFILE_IMAGE_FALLBACK}
            loading="eager"
            width="460"
            height="460"
            decoding="async"
            fetchpriority="high"
          />
        </picture>
      </div>
    </section>
  );
};
