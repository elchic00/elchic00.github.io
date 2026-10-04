
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  actions?: string[];
  show?: string;
  timestamp?: number;
  isStreaming?: boolean;
}

export interface ActionButton {
  label: string;
  action: string;
  icon?: string;
}

export const ACTION_CONFIGS: Record<string, ActionButton> = {
  view_resume: { label: "View Resume", action: "view_resume" },
  view_linkedin: { label: "LinkedIn Profile", action: "view_linkedin" },
  view_github: { label: "GitHub Profile", action: "view_github" },
  contact_form: { label: "Contact Form", action: "contact_form" },
  ask_directly: { label: "Ask Andrew Directly", action: "ask_directly" },
  view_projects: { label: "View Projects", action: "view_projects" },
  view_travel: { label: "Travel Photos", action: "view_travel" },
  view_experience: { label: "View Experience", action: "view_experience" },
  send_email: { label: "Send Email", action: "send_email" },
  play_snake: { label: "Play Snake", action: "play_snake" },
};

// Homepage elements the chat can spotlight with [SHOW: id]. Each id matches a
// data-chat-target attribute; the label is the caption shown on the spotlight.
export const SHOW_TARGETS: Record<string, string> = {
  hermes: "Hermes",
  "pi-cloud": "Pi-Cloud",
  "inference-engine": "Inference Engine",
  "amex-overview": "Account Overview at American Express",
  "amex-services": "Account Services at American Express",
  "screen-reader-demo": "Screen-reader demo",
  codepath: "Teaching at CodePath",
  skills: "Skills",
  contact: "Contact form",
};

// Suggested questions for the structured-context chat assistant
export const SUGGESTED_QUESTIONS = [
  "What should I know about Andrew in 30 seconds?",
  "What has he built at American Express?",
  "Show me the most interesting thing he's built",
  "How does he mentor and work with teams?",
];

export const generateMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
