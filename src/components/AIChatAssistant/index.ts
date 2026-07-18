// Only AIChatAssistant itself is consumed outside this folder (by
// src/components/index.ts -> App.tsx). Everything else here used to be
// re-exported "for advanced usage" but had no actual external consumer -
// and each re-export was a static edge that dragged ChatWindow (and its
// marked/dompurify dependency) into the eager bundle graph even though
// AIChatAssistant.tsx itself lazy-loads ChatWindow.
export { AIChatAssistant } from "./AIChatAssistant";
