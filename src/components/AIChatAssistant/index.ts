// Only export what's actually consumed outside this folder. A re-export
// here is a static import edge - adding ChatWindow/ChatMessage/etc back
// would defeat AIChatAssistant.tsx's lazy-loading of ChatWindow even if
// nothing outside this folder ever imports them.
export { AIChatAssistant } from "./AIChatAssistant";
