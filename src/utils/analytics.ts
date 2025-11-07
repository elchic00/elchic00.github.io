/**
 * Utility functions for Google Analytics 4 tracking
 */

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

interface GAEventParams {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
}

/**
 * Track a custom event in Google Analytics 4
 * Automatically handles dev vs production environment
 * Logs to console in development, sends to GA4 in production
 */
export const trackEvent = (
  eventName: string,
  params?: GAEventParams
): void => {
  const isProduction =
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  if (isProduction) {
    // Production: Send to GA4
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } else {
    // Development: Log to console
    console.log(`GA4 Event (dev mode - not sent): ${eventName}`, params);
  }
};

/**
 * Track Resume PDF view event
 */
export const trackResumeView = (): void => {
  trackEvent('resume_view', {
    event_category: 'engagement',
    event_label: 'Resume PDF View',
    value: 1
  });
};
