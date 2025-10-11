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
            Hi, my name is Andrew Alagna.
          </h1>

          <p className="mb-7 leading-relaxed">
            A motivated software engineer interested in working with people who
            want to solve meaningful problems.
            <br />
            <br />
            I enjoy learning about technology and solving complex problems.
            <br />
            <br />
            Graduated from CUNY: Hunter College with a BA in Computer Science,
            Cum Laude.
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
            </div>
          </nav>
        </div>

        <img
          className="object-cover object-center rounded mx-auto sm:h-80 h-80"
          alt="Andrew Alagna - Software Engineer"
          src={SOCIAL_LINKS.PROFILE_IMAGE}
          loading="lazy"
          width="320"
          height="320"
        />
      </div>
    </section>
  );
};
