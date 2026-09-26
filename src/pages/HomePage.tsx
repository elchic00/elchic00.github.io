import { useEffect } from "react";
import {
  About,
  AccessibilityExpertise,
  Contact,
  Experience,
  FeaturedSystems,
  Skills,
} from "@components";

export const HomePage = () => {
  useEffect(() => {
    document.title = "Andrew Alagna - Software Engineer";
  }, []);

  return (
    <>
      <About />
      <FeaturedSystems />
      <Experience />
      <AccessibilityExpertise />
      <Skills />
      <Contact />
    </>
  );
};
