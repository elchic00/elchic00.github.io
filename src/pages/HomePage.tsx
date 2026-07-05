import { useEffect } from "react";
import {
  About,
  AccessibilityExpertise,
  Contact,
  Experience,
  FeaturedSystems,
  HomeProofBand,
  Skills,
} from "@components";

export const HomePage = () => {
  useEffect(() => {
    document.title = "Andrew Alagna - Software Engineer";
  }, []);

  return (
    <>
      <About />
      <HomeProofBand />
      <FeaturedSystems />
      <AccessibilityExpertise />
      <Experience />
      <Skills />
      <Contact />
    </>
  );
};
