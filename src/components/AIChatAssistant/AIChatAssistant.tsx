import { useState, useEffect, useCallback, useRef } from "react";
import { XIcon, ChatIcon } from "@heroicons/react/solid";
import { ChatWindow } from "./ChatWindow";
import { loadMarked, parseActionsFromContent, handleAction } from "./utils";
import type { Message } from "./types";
import { generateMessageId } from "./types";
import { useLocalStorage } from "../../hooks";
const INITIAL_MESSAGE: Message = { id: generateMessageId(), role: "assistant", content: "Hi! I'm Andrew's AI assistant. Ask me anything about his experience, projects, or background!", timestamp: Date.now() };
export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useLocalStorage<Message[]>("ai-chat-history", [INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showAutoLabel, setShowAutoLabel] = useState(false);
  const toggleButtonRef = useRef(null);
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
  const shortcutKey = isMac ? "⌘ + D" : "Ctrl + D";
  useEffect(() => { if (isOpen) loadMarked(); }, [isOpen]);
  useEffect(() => {
    const hasSeenLabel = sessionStorage.getItem("ai-chat-label-shown");
    if (!hasSeenLabel && !isOpen) {
      const showTimer = setTimeout(() => { setShowAutoLabel(true); sessionStorage.setItem("ai-chat-label-shown", "true"); }, 3000);
      const hideTimer = setTimeout(() => setShowAutoLabel(false), 6500);
      return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "d") { e.preventDefault(); setIsOpen((prev) => !prev); }
      if (e.key === "Escape" && isOpen) {
        const target = e.target as HTMLElement;
        const isInputOrTextarea = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
        if (!isInputOrTextarea || !input.trim()) {
          e.preventDefault(); setIsOpen(false); if (input) setInput("");
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, input]);
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("openAIChat", handleOpenChat);
    return () => window.removeEventListener("openAIChat", handleOpenChat);
  }, []);
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    const userMessage = messageText.trim();
    setInput("");
    setMessages((prev) => [...prev, { id: generateMessageId(), role: "user", content: userMessage, timestamp: Date.now() }]);
    setIsLoading(true);
    try {
      const response = await fetch("https://portfolio-ai-chat.andrew-portfolio-chat.workers.dev/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, messages }),
      });
      if (!response.ok) throw new Error("Failed to get response");
      const data = await response.json();
      const { cleanContent, actions } = parseActionsFromContent(data.response);
      const messageId = generateMessageId();
      setMessages((prev) => [...prev, { id: messageId, role: "assistant", content: cleanContent, actions, timestamp: Date.now(), isStreaming: true }]);
      setTimeout(() => { setMessages((prev) => prev.map((msg) => msg.id === messageId ? { ...msg, isStreaming: false } : msg)); }, cleanContent.split(/(\s+)/).length * 20 + 100);
    } catch (error) {
      setMessages((prev) => [...prev, { id: generateMessageId(), role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later or reach out directly via the contact form!", error: true, timestamp: Date.now() }]);
    } finally { setIsLoading(false); }
  };
  const handleSubmit = () => sendMessage(input);
  const handleSuggestedQuestion = (question: string) => sendMessage(question);
  const handleClearChat = () => { setMessages([INITIAL_MESSAGE]); setShowSuggestions(true); setInput(""); };
  const handleRetry = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user");
    if (lastUserMessage) { setMessages((prev) => prev.slice(0, -1)); sendMessage(lastUserMessage.content); }
  }, [messages]);
  const handleActionClick = useCallback((action: string) => {
    if (action === "ask_directly") {
      const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user");
      if (lastUserMessage) {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          setIsOpen(false);
          sessionStorage.setItem("preFillMessage", lastUserMessage.content);
          setTimeout(() => {
            contactSection.scrollIntoView({ behavior: "smooth" });
            window.dispatchEvent(new CustomEvent("preFillContactForm", { detail: { message: lastUserMessage.content } }));
          }, 300);
        }
      }
    } else handleAction(action, setIsOpen);
  }, [messages]);
  const toggleChat = () => setIsOpen((prev) => !prev);
  return (
    <>
      <style>{`@keyframes ai-glow-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0), 0 0 16px 4px rgba(34, 211, 238, 0.25), 0 0 32px 8px rgba(147, 51, 234, 0.15); } 50% { box-shadow: 0 0 0 6px rgba(34, 211, 238, 0.08), 0 0 24px 8px rgba(34, 211, 238, 0.35), 0 0 48px 16px rgba(147, 51, 234, 0.2); } } @keyframes ai-label-fade-in { from { opacity: 0; transform: translateX(6px); } to { opacity: 1; transform: translateX(0); } } @keyframes ai-label-fade-out { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(6px); } } .ai-chat-btn-glow { animation: ai-glow-pulse 2.8s ease-in-out infinite; } .ai-chat-btn-glow:hover { animation: none; box-shadow: 0 0 0 0 rgba(34, 211, 238, 0), 0 0 28px 10px rgba(34, 211, 238, 0.4), 0 0 56px 20px rgba(147, 51, 234, 0.25); } .ai-label-auto-show { animation: ai-label-fade-in 0.35s ease forwards; } .ai-label-auto-hide { animation: ai-label-fade-out 0.4s ease forwards; }`}</style>
      <div className={`fixed bottom-24 right-6 z-50 ${isOpen ? "md:block hidden" : "block"}`}>
        <div className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none select-none ${showAutoLabel ? "ai-label-auto-show" : "opacity-0"}`} aria-hidden="true">
          <div className="flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg shadow-black/30 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" style={{ animation: "ai-glow-pulse 2s ease-in-out infinite" }} />
            Ask me anything about Drew
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-4 border-transparent border-l-slate-700/60" />
        </div>
        <button ref={toggleButtonRef} onClick={toggleChat} className={`group relative p-4 rounded-full shadow-lg transition-all duration-300 focus-ring focus:ring-offset-2 focus:ring-offset-slate-900 ${isOpen ? "bg-slate-700 hover:bg-slate-600" : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 hover:scale-110 ai-chat-btn-glow"}`} aria-label={isOpen ? "Close chat" : "Open AI chat assistant"}>
          {isOpen ? <XIcon className="w-6 h-6 text-white" /> : <ChatIcon className="w-6 h-6 text-white" />}
          {!isOpen && (
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" role="tooltip">
              <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg shadow-black/30 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                Ask me anything about Drew
                <kbd className="ml-1 px-1.5 py-0.5 bg-slate-700 rounded font-mono text-slate-300 text-[10px]">{shortcutKey}</kbd>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-4 border-transparent border-l-slate-700/60" />
            </div>
          )}
        </button>
      </div>
      {isOpen && <ChatWindow messages={messages} input={input} isLoading={isLoading} showSuggestions={showSuggestions} toggleButtonRef={toggleButtonRef} onClose={toggleChat} onClear={handleClearChat} onInputChange={setInput} onSubmit={handleSubmit} onAction={handleActionClick} onRetry={handleRetry} onSuggestedQuestion={handleSuggestedQuestion} />}
    </>
  );
};