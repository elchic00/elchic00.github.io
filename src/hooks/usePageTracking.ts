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
    // Construct full page path including hash
    const pagePath = location.pathname + location.search + location.hash;
    const pageLocation = window.location.href;
    const pageTitle = document.title;

    // Only track in production environment
    const isProduction =
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1';

    // Log for debugging in development (always runs on localhost)
    if (!isProduction) {
      console.log('GA4 Page View (dev mode - not sent):', {
        page_path: pagePath,
        page_location: pageLocation,
        page_title: pageTitle,
      });
      return;
    }

    // Ensure gtag is available
    if (typeof window.gtag !== 'function') {
      console.warn('Google Analytics gtag not available');
      return;
    }

    // Send pageview event to GA4 (production only)
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: pageLocation,
      page_title: pageTitle,
    });

    console.log('GA4 Page View sent:', {
      page_path: pagePath,
      page_location: pageLocation,
      page_title: pageTitle,
    });
  }, [location]);
};
