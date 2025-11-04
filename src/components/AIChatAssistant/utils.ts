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
  return DOMPurify.sanitize(content.replace(/\n/g, '<br/>'));
};

/**
 * Parses action buttons from assistant response content
 */
export const parseActionsFromContent = (content: string): { cleanContent: string; actions: string[] } => {
  const actionMatch = content.match(/\[ACTIONS:\s*([^\]]+)\]/);
  if (actionMatch) {
    const actions = actionMatch[1].split(",").map((a) => a.trim());
    const cleanContent = content.replace(/\[ACTIONS:\s*[^\]]+\]/, "").trim();
    return { cleanContent, actions };
  }
  return { cleanContent: content, actions: [] };
};

/**
 * Handles action button clicks (navigation, scrolling, external links)
 */
export const handleAction = (action: string, setIsOpen: (open: boolean) => void) => {
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
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        setIsOpen(false);
        setTimeout(() => {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      break;
    case "ask_directly":
      // Note: This requires access to messages state from parent
      const contactSectionDirect = document.getElementById("contact");
      if (contactSectionDirect) {
        setIsOpen(false);
        setTimeout(() => {
          contactSectionDirect.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      break;
    case "view_projects":
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        setIsOpen(false);
        setTimeout(() => {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      break;
    case "view_travel":
      window.location.href = "/#/travel";
      break;
    case "view_experience":
      const experienceSection = document.getElementById("experience");
      if (experienceSection) {
        setIsOpen(false);
        setTimeout(() => {
          experienceSection.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
      break;
    case "send_email":
      window.location.href = "mailto:aalagna04@gmail.com";
      break;
  }
};
