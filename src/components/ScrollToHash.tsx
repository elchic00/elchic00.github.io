import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollWithOffset } from "../constants";

/**
 * Component that automatically scrolls to hash anchors on page load
 * Handles URLs like /#/#projects when opened directly in browser
 */
export const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    // Get the hash from the URL (e.g., "#projects" from "/#/#projects")
    const hash = location.hash;

    // Only process hash if it doesn't contain a slash (not a route like #/travel)
    if (hash && !hash.includes('/')) {
      // Retry mechanism to handle async component loading
      let attempts = 0;
      const maxAttempts = 20; // Try for up to 2 seconds (20 * 100ms)

      const scrollToElement = () => {
        try {
          const element = document.querySelector(hash);
          if (element) {
            scrollWithOffset(element as HTMLElement);
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(scrollToElement, 100);
          }
        } catch (error) {
          // Invalid selector, ignore
          console.warn('Invalid hash selector:', hash);
        }
      };

      // Start trying to scroll after initial render
      setTimeout(scrollToElement, 100);
    }
  }, [location]);

  return null; // This component doesn't render anything
};
