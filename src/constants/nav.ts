/**
 * Navigation Configuration
 * Contains navigation links, social links, and scroll behavior
 */
export const SOCIAL_LINKS = {
  LINKEDIN: "https://www.linkedin.com/in/andrew-a-10b88215b/",
  GITHUB: "https://www.github.com/elchic00/",
  PROFILE_IMAGE: "/images/profile.webp",
  PROFILE_IMAGE_FALLBACK: "/images/profile.webp",
} as const;

export const NAV_LINKS = [
  { name: "Experience", link: "/#experience" },
  { name: "Projects", link: "/projects" },
  { name: "Skills", link: "/#skills" },
  { name: "Resume", link: "#resume" },
  { name: "Travel", link: "/travel" },
] as const;

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
