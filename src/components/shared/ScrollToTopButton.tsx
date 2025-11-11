import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/solid";
import { TIMING } from "../../constants";

/**
 * Floating button that appears when user scrolls down
 * Scrolls smoothly to top of page when clicked
 * Shows circular progress indicator of scroll position
 */
export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrollTop > TIMING.SCROLL_TO_TOP_THRESHOLD);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Calculate circle progress (SVG circle with 100 radius, circumference = 2πr)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 focus-ring focus:ring-offset-2 focus:ring-offset-slate-950 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16 pointer-events-none"
      }`}
      aria-label={`Scroll to top (${Math.round(scrollProgress)}% scrolled)`}
      title="Scroll to top"
    >
      <div className="relative w-12 h-12">
        {/* Progress circle */}
        <svg
          className="absolute inset-0 w-12 h-12 -rotate-90"
          viewBox="0 0 44 44"
        >
          {/* Background circle (darker, more visible) */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-slate-700"
            opacity="0.5"
          />
          {/* Progress circle (bright cyan) */}
          <circle
            cx="22"
            cy="22"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-cyan-400 transition-all duration-100"
            strokeLinecap="round"
          />
        </svg>
        {/* Arrow icon in center */}
        <div className="absolute inset-0 flex items-center justify-center bg-purple-600 hover:bg-purple-500 rounded-full m-1 transition-colors">
          <ArrowUpIcon className="w-5 h-5" />
        </div>
      </div>
    </button>
  );
};
