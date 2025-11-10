/**
 * AI Chat Assistant - Main component
 * Refactored for better maintainability and readability
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { XIcon, ChatIcon } from "@heroicons/react/solid";
import { ChatWindow } from "./ChatWindow";
import { loadMarked, parseActionsFromContent, handleAction } from "./utils";
import { Message, generateMessageId } from "./types";

const INITIAL_MESSAGE: Message = {
  id: generateMessageId(),
  role: "assistant",
  content: "Hi! I'm Andrew's AI assistant. Ask me about his experience, projects, skills, or travel adventures!",
};

export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadMarked();
    }
  }, [isOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput("");
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { id: generateMessageId(), role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://portfolio-ai-chat.andrew-portfolio-chat.workers.dev/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, messages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const { cleanContent, actions } = parseActionsFromContent(data.response);
      setMessages((prev) => [
        ...prev,
        { id: generateMessageId(), role: "assistant", content: cleanContent, actions },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again later or reach out directly via the contact form!",
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    sendMessage(input);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setShowSuggestions(true);
    setInput("");
  };

  // Only memoize callbacks passed to memoized ChatMessage component
  const handleRetry = useCallback(() => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");
    if (lastUserMessage) {
      setMessages((prev) => prev.slice(0, -1));
      sendMessage(lastUserMessage.content);
    }
  }, [messages]);

  const handleActionClick = useCallback((action: string) => {
    if (action === "ask_directly") {
      const lastUserMessage = [...messages]
        .reverse()
        .find((msg) => msg.role === "user");
      if (lastUserMessage) {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          setIsOpen(false);
          sessionStorage.setItem("preFillMessage", lastUserMessage.content);
          setTimeout(() => {
            contactSection.scrollIntoView({ behavior: "smooth" });
            window.dispatchEvent(new CustomEvent("preFillContactForm", {
              detail: { message: lastUserMessage.content }
            }));
          }, 300);
        }
      }
    } else {
      handleAction(action, setIsOpen);
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        ref={toggleButtonRef}
        onClick={toggleChat}
        className={`fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 focus-ring focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isOpen
            ? "bg-slate-700 hover:bg-slate-600"
            : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 hover:scale-110"
        }`}
        aria-label={isOpen ? "Close chat" : "Open AI chat assistant"}
      >
        {isOpen ? (
          <XIcon className="w-6 h-6 text-white" />
        ) : (
          <ChatIcon className="w-6 h-6 text-white" />
        )}
      </button>

      {isOpen && (
        <ChatWindow
          messages={messages}
          input={input}
          isLoading={isLoading}
          showSuggestions={showSuggestions}
          toggleButtonRef={toggleButtonRef}
          onClose={toggleChat}
          onClear={handleClearChat}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onAction={handleActionClick}
          onRetry={handleRetry}
          onSuggestedQuestion={handleSuggestedQuestion}
        />
      )}
    </>
  );
};
