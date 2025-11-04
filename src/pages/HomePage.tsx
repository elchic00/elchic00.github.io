import { useEffect } from "react";
import { About } from "@components/About";
import { Experience } from "@components/Experience";
import { Projects } from "@components/Projects";
import { Skills } from "@components/Skills";
import { Contact } from "@components/Contact";

export const HomePage = () => {
  useEffect(() => {
    document.title = "Andrew Alagna - Software Engineer";
  }, []);

  return (
    <>
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
};