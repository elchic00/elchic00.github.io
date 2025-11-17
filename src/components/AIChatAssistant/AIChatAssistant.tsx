/**
 * AI Chat Assistant - Main component
 * Refactored for better maintainability and readability
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { XIcon, ChatIcon } from "@heroicons/react/solid";
import { ChatWindow } from "./ChatWindow";
import { loadMarked, parseActionsFromContent, handleAction } from "./utils";
import { Message, generateMessageId } from "./types";
import { useLocalStorage } from "../../hooks";

const INITIAL_MESSAGE: Message = {
  id: generateMessageId(),
  role: "assistant",
  content: "Hi! I'm Andrew's AI assistant. Ask me anything about Andrew!",
  timestamp: Date.now(),
};

export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useLocalStorage<Message[]>(
    "ai-chat-history",
    [INITIAL_MESSAGE]
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Detect platform for keyboard shortcut display
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
  const shortcutKey = isMac ? "⌘K" : "Ctrl+K";

  useEffect(() => {
    if (isOpen) {
      loadMarked();
    }
  }, [isOpen]);

  // Keyboard shortcuts: Cmd/Ctrl+K to toggle, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K to toggle chat
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Esc to close chat
      if (e.key === "Escape" && isOpen) {
        const target = e.target as HTMLElement;
        const isInputOrTextarea =
          target.tagName === "INPUT" || target.tagName === "TEXTAREA";

        // Close if: not in input, OR in input but it's empty
        if (!isInputOrTextarea || !input.trim()) {
          e.preventDefault();
          setIsOpen(false);
          // Clear input if closing
          if (input) setInput("");
          // Blur the current element to prevent scroll jump
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, input]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        id: generateMessageId(),
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      },
    ]);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://portfolio-ai-chat.andrew-portfolio-chat.workers.dev/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage, messages }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const { cleanContent, actions } = parseActionsFromContent(data.response);
      const messageId = generateMessageId();

      // Add message with streaming enabled
      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          role: "assistant",
          content: cleanContent,
          actions,
          timestamp: Date.now(),
          isStreaming: true,
        },
      ]);

      // After streaming completes, mark as done
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isStreaming: false } : msg
          )
        );
      }, cleanContent.split(/(\s+)/).length * 20 + 100); // Calculate duration based on word count
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: generateMessageId(),
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again later or reach out directly via the contact form!",
          error: true,
          timestamp: Date.now(),
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

  const handleActionClick = useCallback(
    (action: string) => {
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
              window.dispatchEvent(
                new CustomEvent("preFillContactForm", {
                  detail: { message: lastUserMessage.content },
                })
              );
            }, 300);
          }
        }
      } else {
        handleAction(action, setIsOpen);
      }
    },
    [messages]
  );

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div
        className={`fixed bottom-24 right-6 z-50 ${
          isOpen ? "md:block hidden" : "block"
        }`}
      >
        <button
          ref={toggleButtonRef}
          onClick={toggleChat}
          className={`group relative p-4 rounded-full shadow-lg transition-all duration-300 focus-ring focus:ring-offset-2 focus:ring-offset-slate-900 ${
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

          {/* Keyboard shortcut hint */}
          {!isOpen && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-700 rounded font-mono">
                  {shortcutKey}
                </kbd>
              </div>
            </div>
          )}
        </button>
      </div>

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
