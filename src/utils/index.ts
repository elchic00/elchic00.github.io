/**
 * Utils Barrel Export
 *
 * Provides centralized exports for all utility functions.
 * Use this to import utilities from a single location.
 *
 * Example:
 *   import { trackEvent, generateTravelStructuredData } from '@utils';
 */

// Analytics utilities
export { trackEvent, trackResumeView } from './analytics';

// Travel structured data utilities
export { generateTravelStructuredData } from './generateTravelStructuredData';
