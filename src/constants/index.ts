// Validate environment variables
const validateEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    console.warn(`Warning: Environment variable ${name} is not set. Email functionality may not work.`);
    return "";
  }
  return value;
};

export const APP_CONFIG = {
  EMAIL_SERVICE_ID: validateEnvVar("VITE_EMAIL_SERVICE_ID", import.meta.env.VITE_EMAIL_SERVICE_ID),
  EMAIL_TEMPLATE_ID: validateEnvVar("VITE_EMAIL_TEMPLATE_ID", import.meta.env.VITE_EMAIL_TEMPLATE_ID),
  EMAIL_PUBLIC_KEY: validateEnvVar("VITE_EMAIL_PUBLIC_KEY", import.meta.env.VITE_EMAIL_PUBLIC_KEY),
  CONTACT_EMAIL: "aalagna04@gmail.com",
  RESUME_FILENAME: "andrew-alagna-resume.pdf",
} as const;

export const SOCIAL_LINKS = {
  LINKEDIN: "https://www.linkedin.com/in/andrew-a-10b88215b/",
  GITHUB: "https://www.github.com/elchic00/",
  PROFILE_IMAGE: "/images/profile.webp",
  PROFILE_IMAGE_FALLBACK: "/images/profile.webp",
} as const;

export const NAV_LINKS = [
  { name: "Experience", link: "/#experience" },
  { name: "Projects", link: "/#projects" },
  { name: "Skills", link: "/#skills" },
  { name: "Resume", link: "/resume" },
  { name: "Travel", link: "/travel" },
] as const;

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

export const TIMING = {
  NAVBAR_DEBOUNCE: 150,
  TRANSITION_DURATION: 500,
  DEBOUNCE_DELAY: 300,
  SCROLL_TO_TOP_THRESHOLD: 300,
  STICKY_THRESHOLD: 200,
  INITIAL_SCROLL_DELAY: 100,
  LAYOUT_DELAY: 300,
  ALERT_FADE_OUT: 200,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

export const SCROLL_CONFIG = {
  NAVBAR_OFFSET: -60,
} as const;

export const scrollWithOffset = (el: HTMLElement) => {
  const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({
    top: yCoordinate + SCROLL_CONFIG.NAVBAR_OFFSET,
    behavior: "smooth",
  });
};
