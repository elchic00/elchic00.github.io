import { useEffect } from "react";
import { About, AccessibilityExpertise, Experience, Skills, Contact } from "@components";

export const HomePage = () => {
  useEffect(() => {
    document.title = "Andrew Alagna - Software Engineer";
  }, []);

  return (
    <>
      <About />
      <AccessibilityExpertise />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
};
