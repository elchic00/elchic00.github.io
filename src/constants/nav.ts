/**
 * Navigation Configuration
 * Contains navigation links, social links, and scroll behavior
 */
import {
  BriefcaseIcon,
  CodeIcon,
  ChipIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  PuzzleIcon,
  UserGroupIcon,
  MailIcon,
} from "@heroicons/react/solid";
import type { ComponentType } from "react";

export const SOCIAL_LINKS = {
  LINKEDIN: "https://www.linkedin.com/in/andrew-a-10b88215b/",
  GITHUB: "https://www.github.com/elchic00/",
  PROFILE_IMAGE: "/images/profile.webp",
  PROFILE_IMAGE_FALLBACK: "/images/profile.webp",
} as const;

// Icon type for Heroicons
export type IconComponent = ComponentType<{ className?: string }>;

// Nav item behavior types
export type NavItemType = "scroll" | "route" | "external" | "action";

// Unified nav item configuration
export interface NavItem {
  name: string;
  link: string;
  icon: IconComponent;
  iconBg: string;
  type: NavItemType;
}

// Single source of truth for all navigation items
export const NAV_ITEMS: NavItem[] = [
  {
    name: "Accessibility",
    link: "/#accessibility-expertise",
    icon: UserGroupIcon,
    iconBg: "bg-cyan-500/20 text-cyan-400",
    type: "scroll",
  },
  {
    name: "Experience",
    link: "/#experience",
    icon: BriefcaseIcon,
    iconBg: "bg-blue-500/20 text-blue-400",
    type: "scroll",
  },
  {
    name: "Skills",
    link: "/#skills",
    icon: ChipIcon,
    iconBg: "bg-yellow-500/20 text-yellow-400",
    type: "scroll",
  },
  {
    name: "Projects",
    link: "/projects",
    icon: CodeIcon,
    iconBg: "bg-red-500/20 text-red-400",
    type: "route",
  },
  {
    name: "Resume",
    link: "#resume",
    icon: DocumentTextIcon,
    iconBg: "bg-purple-500/20 text-purple-400",
    type: "external",
  },
  {
    name: "Travel",
    link: "/travel",
    icon: GlobeAltIcon,
    iconBg: "bg-orange-500/20 text-orange-400",
    type: "route",
  },
  {
    name: "Snake",
    link: "/snake",
    icon: PuzzleIcon,
    iconBg: "bg-green-500/20 text-green-400",
    type: "route",
  },
] as const;

// CTA button configuration (separate from main nav)
export const CONTACT_CTA = {
  name: "Contact",
  link: "/#contact",
  icon: MailIcon,
} as const;

// Legacy export for backward compatibility (deprecated)
export const NAV_LINKS = NAV_ITEMS.map(({ name, link }) => ({ name, link }));

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

// Helper to extract hash from link
export const getLinkHash = (link: string): string => {
  if (!link.includes("#")) return "";
  return `#${link.split("#")[1]}`;
};

// Helper to check if link is a scroll target (starts with /#)
export const isScrollLink = (link: string): boolean =>
  link.startsWith("/#") && link.includes("#");
