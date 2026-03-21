/**
 * Constants Barrel Export
 *
 * Provides centralized exports for all constants.
 * Use this to import constants from a single location.
 *
 * Example:
 *   import { APP_CONFIG, SOCIAL_LINKS, TIMING } from '@constants';
 */

// Application configuration
export { APP_CONFIG } from './app';

// Navigation and social links
export {
  SOCIAL_LINKS,
  NAV_LINKS,
  NAV_ITEMS,
  CONTACT_CTA,
  SCROLL_CONFIG,
  scrollWithOffset,
  getLinkHash,
  isScrollLink,
} from './nav';
export type { NavItem, NavItemType, IconComponent } from './nav';

// Timing configuration
export { TIMING } from './timing';

// Responsive breakpoints
export { BREAKPOINTS } from './breakpoints';

// Game configuration
export { SNAKE_CONFIG } from './game';
