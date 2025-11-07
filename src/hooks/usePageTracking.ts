/**
 * Custom hook to track page views with Google Analytics 4
 * Automatically sends pageview events when route changes occur
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Tracks page views in Google Analytics 4 whenever the route changes
 * Only tracks in production (excludes localhost and 127.0.0.1)
 */
export const usePageTracking = (): void => {
  const location = useLocation();

  useEffect(() => {
    // Only track in production environment
    const isProduction =
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1';

    if (!isProduction) {
      return;
    }

    // Ensure gtag is available
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics gtag not available');
      return;
    }

    // Construct full page path including hash
    const pagePath = location.pathname + location.search + location.hash;
    const pageLocation = window.location.href;
    const pageTitle = document.title;

    // Send pageview event to GA4
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: pageLocation,
      page_title: pageTitle,
    });

    // Optional: Log for debugging (remove in production if needed)
    if (process.env.NODE_ENV === 'development') {
      console.log('GA4 Page View:', {
        page_path: pagePath,
        page_location: pageLocation,
        page_title: pageTitle,
      });
    }
  }, [location]);
};
