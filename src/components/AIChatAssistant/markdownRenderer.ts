/**
 * Markdown rendering for chat messages.
 *
 * Deliberately kept out of utils.ts: DOMPurify is only needed once a
 * message actually needs to render, which only happens inside ChatWindow
 * (lazy-loaded). utils.ts is imported eagerly by AIChatAssistant.tsx for
 * unrelated helpers, so a static DOMPurify import there would ship on
 * every page load regardless of whether the chat is ever opened.
 */

import DOMPurify from "dompurify";
import { markedInstance } from "./utils";

/**
 * Renders markdown content to sanitized HTML
 */
export const renderMarkdown = (content: string): string => {
  if (markedInstance) {
    return DOMPurify.sanitize(markedInstance(content) as string);
  }
  return DOMPurify.sanitize(content.replace(/\n/g, "<br/>"));
};
