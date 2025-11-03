import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/solid";
import { TIMING } from "../../constants";

/**
 * Floating button that appears when user scrolls down
 * Scrolls smoothly to top of page when clicked
 */
export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > TIMING.SCROLL_TO_TOP_THRESHOLD) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 focus-ring focus:ring-offset-2 focus:ring-offset-slate-950 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"
      }`}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <ArrowUpIcon className="w-6 h-6" />
    </button>
  );
};
