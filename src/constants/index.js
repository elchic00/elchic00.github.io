// App Configuration
export const APP_CONFIG = {
  EMAIL_SERVICE_ID: "default_service",
  EMAIL_TEMPLATE_ID: "template_z9zlm01",
  EMAIL_PUBLIC_KEY: "user_FhEWKM5IXCkmUoOqe2yTB",
  RESUME_FILENAME: "andrew_alagna_resume_2025.pdf",
};

// Social Links
export const SOCIAL_LINKS = {
  LINKEDIN: "https://www.linkedin.com/in/andrew-a-10b88215b/",
  GITHUB: "https://www.github.com/elchic00/",
  PROFILE_IMAGE: "/images/profile.webp",
  PROFILE_IMAGE_FALLBACK: "/images/profile.jpg",
};

// Navigation Links
export const NAV_LINKS = [
  { name: "Resume", link: "/resume" },
  { name: "Projects", link: "/#projects" },
  { name: "Skills", link: "/#skills" },
  { name: "Travel", link: "/travel" },
];

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
};

// Animation & Timing
export const TIMING = {
  TRANSITION_DURATION: 500,
  DEBOUNCE_DELAY: 300,
};

// Breakpoints (for reference, matches Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
};
