
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  actions?: string[];
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
};

// RAG-enhanced suggested questions
export const SUGGESTED_QUESTIONS = [
  "What technologies does he specialize in?",
  "How has he mentored 350+ students?",
  "What does Andrew do at American Express?",
  "Tell me about his accessibility work",
  "Tell me about the myPal project",
  "What projects has he built with React Native?",
];

export const generateMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
