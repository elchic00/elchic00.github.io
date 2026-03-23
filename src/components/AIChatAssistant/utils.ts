/**
 * Utility functions for AI Chat Assistant
 */

import DOMPurify from "dompurify";
import type { MarkedOptions } from "marked";

let markedInstance: typeof import("marked").marked | null = null;
let markedLoading: Promise<typeof import("marked")> | null = null;

/**
 * Lazy loads the marked library for markdown rendering
 */
export const loadMarked = async () => {
  if (markedInstance) return markedInstance;
  if (!markedLoading) {
    markedLoading = import("marked");
  }
  const { marked } = await markedLoading;
  marked.setOptions({
    breaks: true,
    gfm: true,
  } as MarkedOptions);
  markedInstance = marked;
  return marked;
};

/**
 * Renders markdown content to sanitized HTML
 */
export const renderMarkdown = (content: string): string => {
  if (markedInstance) {
    return DOMPurify.sanitize(markedInstance(content) as string);
  }
  return DOMPurify.sanitize(content.replace(/\n/g, "<br/>"));
};

/**
 * Parses action buttons from assistant response content
 */
export const parseActionsFromContent = (
  content: string
): { cleanContent: string; actions: string[] } => {
  const actionMatch = content.match(/\[ACTIONS:\s*([^\]]+)\]/);
  if (actionMatch) {
    const actions = actionMatch[1].split(",").map((a) => a.trim());
    const cleanContent = content.replace(/\[ACTIONS:\s*[^\]]+\]/, "").trim();
    return { cleanContent, actions };
  }
  return { cleanContent: content, actions: [] };
};

/**
 * Formats timestamp as relative time (e.g., "Just now", "2 min ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

/**
 * Handles action button clicks (navigation, scrolling, external links)
 * @param action - The action identifier
 * @param onClose - Callback to close the chat window
 */
export const handleAction = (action: string, onClose?: () => void) => {
  switch (action) {
    case "view_resume":
      window.open("/andrew-alagna-resume.pdf", "_blank");
      break;
    case "view_linkedin":
      window.open("https://www.linkedin.com/in/andrew-a-10b88215b/", "_blank");
      break;
    case "view_github":
      window.open("https://github.com/elchic00", "_blank");
      break;
    case "contact_form":
      onClose?.();
      navigateToSection("contact");
      break;
    case "ask_directly":
      onClose?.();
      navigateToSection("contact");
      break;
    case "view_projects":
      window.location.href = "/projects";
      onClose?.();
      break;
    case "view_travel":
      window.location.href = "/travel";
      onClose?.();
      break;
    case "view_experience":
      onClose?.();
      navigateToSection("accessibility-expertise");
      break;
    case "play_snake":
      window.location.href = "/snake";
      onClose?.();
      break;
    case "send_email":
      window.location.href = "mailto:aalagna04@gmail.com";
      break;
  }
};

/**
 * Navigate to a section, handling both same-page and cross-page navigation
 */
const navigateToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    // Section exists on current page - scroll to it
    setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth" });
    }, 300);
  } else {
    // Section doesn't exist - navigate to home page with hash
    // Use /#section format for BrowserRouter compatibility
    window.location.href = `/#${sectionId}`;
  }
};
