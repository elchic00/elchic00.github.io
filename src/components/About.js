import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Projects from "./Projects";
import Skills from "./Skills";
import Contact from "./Contact";
import { HashLink as Link } from 'react-router-hash-link';

export default function About() {
  return (
    <section id="about">
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white mt-5">
            Hi, my name is Andrew Alagna.
          </h1>

          <p className="mb-7 leading-relaxed">
            A motivated student of computer science, interested in working with people
            who want to solve meaningful problems with software engineering.
            <br />
            <br/>
            I enjoy learning about technology and find pride in solving problems.
            <br />
            <br />
            Graduated from CUNY: Hunter College with a BA in Computer Science, Cum Laude.
          </p>
          <a
              href="https://www.github.com/elchic00/"
              rel="noreferrer"
              target="_blank"
              className="mb-6 flex hover:text-white flex "
          >
            <img
                className="mr-2 w-6 h-6 text-blue-500 fill-current"
                src='https://user-images.githubusercontent.com/40577932/172054648-6f29655f-f515-41a6-b468-a96c15826ddd.png'
            >
            </img>
            <ArrowLeftIcon className="w-4 h-4 ml-1 mr-2 mt-1"/>
            Visit my Github
          </a>
          <a
            href="https://www.linkedin.com/in/andrew-a-10b88215b/"
            rel="noreferrer"
            target="_blank"
            class="mb-7 flex hover:text-white flex "
          >
            <svg
              class="hover:text-white mr-2 w-6 h-6 text-blue-500 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
            </svg>
            <ArrowLeftIcon className="w-4 h-4 ml-1 mr-2 mt-1" />
            Visit my Linkedin
          </a>
          <div className="flex justify-center">
            <Link
              to="#contact"
              className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
            >
              Work With Me
            </Link>
            <Link
              to="#projects"
              className="ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg"
            >
              See My Past Work
            </Link>
          </div>
        </div>

        <div className="lg:max-w-sm lg:w-sm md:w-1/2 w-5/6">
          <img
            className="object-cover object-center rounded"
            alt="andrew"
            style={{ height: 400, marginLeft: "auto", marginRight: "auto" }}
            src="https://i.imgur.com/ddraBJx.jpg"
          />
        </div>
      </div>
  <Projects id="projects"/>

  <Skills />
  {/* <Testimonials /> */}
  <Contact/>
    </section>
  );
}
