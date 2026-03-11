/**
 * Main chat window component containing messages, input, and header
 */

import { useRef, useEffect, RefObject } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { QuickActions } from "./QuickActions";
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
      className="fixed md:bottom-44 md:right-6 md:w-96 md:max-w-[calc(100vw-3rem)] md:h-[600px] md:rounded-lg inset-0 md:inset-auto z-50 bg-slate-800 shadow-2xl flex flex-col border border-slate-700 animate-slide-up"
    >
      <ChatHeader onClose={onClose} onClear={onClear} />

<div
  className="flex-1 overflow-y-auto p-3 space-y-3"
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

        {showSuggestions && messages.length <= 1 && !isLoading && (
          <div className="space-y-6">
            <QuickActions onActionClick={onAction} />
            <SuggestedQuestions onQuestionClick={onSuggestedQuestion} />
          </div>
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
