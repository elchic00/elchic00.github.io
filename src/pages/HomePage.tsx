import { useEffect } from "react";
import { About, Experience, Projects, Skills, Contact } from "@components";

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