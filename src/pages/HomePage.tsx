import { useEffect } from "react";
import {
  About,
  AccessibilityExpertise,
  Contact,
  Experience,
  FeaturedSystems,
  NightShift,
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
      <NightShift />
      <Experience />
      <AccessibilityExpertise />
      <Skills />
      <Contact />
    </>
  );
};
