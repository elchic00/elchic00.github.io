/**
 * Main chat window component containing messages, input, and header
 */

import { useRef, useEffect, RefObject } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { Message } from "./types";

interface ChatWindowProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  showSuggestions: boolean;
  toggleButtonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onClear: () => void;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onAction: (action: string) => void;
  onRetry: () => void;
  onSuggestedQuestion: (question: string) => void;
}

export const ChatWindow = ({
  messages,
  input,
  isLoading,
  showSuggestions,
  toggleButtonRef,
  onClose,
  onClear,
  onInputChange,
  onSubmit,
  onAction,
  onRetry,
  onSuggestedQuestion,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Click outside to close (only if no unsaved input and not clicking toggle button)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(target) &&
        !toggleButtonRef.current?.contains(target) &&
        !input.trim()
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [input, onClose, toggleButtonRef]);

  return (
    <div
      ref={chatWindowRef}
      className="fixed bottom-44 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] sm:h-[500px] h-[calc(100vh-12rem)] bg-slate-800 rounded-lg shadow-2xl flex flex-col border border-slate-700 animate-slide-up"
    >
      <ChatHeader onClose={onClose} onClear={onClear} />

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onAction={onAction}
            onRetry={message.error ? onRetry : undefined}
          />
        ))}

        {isLoading && <LoadingIndicator />}

        {showSuggestions && messages.length === 1 && !isLoading && (
          <SuggestedQuestions onQuestionClick={onSuggestedQuestion} />
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        ref={inputRef}
        value={input}
        onChange={onInputChange}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
