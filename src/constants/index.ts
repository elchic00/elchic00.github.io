// App Configuration
export const APP_CONFIG = {
  EMAIL_SERVICE_ID: import.meta.env.VITE_EMAIL_SERVICE_ID || "",
  EMAIL_TEMPLATE_ID: import.meta.env.VITE_EMAIL_TEMPLATE_ID || "",
  EMAIL_PUBLIC_KEY: import.meta.env.VITE_EMAIL_PUBLIC_KEY || "",
  RESUME_FILENAME: "andrew-alagna-resume.pdf",
} as const;

// Social Links
export const SOCIAL_LINKS = {
  LINKEDIN: "https://www.linkedin.com/in/andrew-a-10b88215b/",
  GITHUB: "https://www.github.com/elchic00/",
  PROFILE_IMAGE: "/images/profile.webp",
  PROFILE_IMAGE_FALLBACK: "/images/profile.webp", // Updated to use WebP for Google indexing
} as const;

// Navigation Links
export const NAV_LINKS = [
  { name: "Resume", link: "/resume" },
  { name: "Projects", link: "/#projects" },
  { name: "Skills", link: "/#skills" },
  { name: "Travel", link: "/travel" },
] as const;

// Snake Game Configuration
export const SNAKE_CONFIG = {
  PERCENTAGE_WIDTH: 50,
  START_SNAKE_SIZE: 4,
  APPLE_COLOR: "red",
  SNAKE_COLOR: "green",
  GRID_SIZE: 20,
  INITIAL_SPEED: 67,
  MIN_SPEED: 25,
  SPEED_DECREASE: 0.5,
  HIGH_SCORE_KEY: "snakeHighScore",
} as const;

// Animation & Timing
export const TIMING = {
  TRANSITION_DURATION: 500,
  DEBOUNCE_DELAY: 300,
} as const;

// Breakpoints (for reference, matches Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

// Scroll Configuration
export const SCROLL_CONFIG = {
  NAVBAR_OFFSET: -60, // Offset for fixed navbar when scrolling to hash anchors
} as const;

// Scroll helper function for hash navigation
export const scrollWithOffset = (el: HTMLElement) => {
  const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: yCoordinate + SCROLL_CONFIG.NAVBAR_OFFSET,
    behavior: "smooth",
  });
};
