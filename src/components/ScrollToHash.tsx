import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollWithOffset, TIMING } from "../constants";

/**
 * Component that automatically scrolls to hash anchors on page load
 * Handles URLs like /#projects when opened directly in browser
 */
export const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;

    if (hash && !hash.includes('/')) {
      let attempts = 0;
      const maxAttempts = 20;

      const scrollToElement = () => {
        try {
          const element = document.querySelector(hash);
          if (element) {
            scrollWithOffset(element as HTMLElement);
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(scrollToElement, TIMING.INITIAL_SCROLL_DELAY);
          }
        } catch (error) {
          console.warn('Invalid hash selector:', hash);
        }
      };

      setTimeout(scrollToElement, TIMING.INITIAL_SCROLL_DELAY);
    }
  }, [location]);

  return null;
};
