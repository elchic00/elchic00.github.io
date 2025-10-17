// 1. Create a new HomePage.jsx component
// src/pages/HomePage.jsx
import { Projects } from "../components/Projects";
import { Skills } from "../components/Skills";
import { Contact } from "../components/Contact";
import { About } from "../components/About";

export const HomePage = () => {
  return (
    <>
      <About />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
};