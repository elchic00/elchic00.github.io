import { useRef, useEffect, RefObject } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { LoadingIndicator } from "./LoadingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { QuickActions } from "./QuickActions";
import { Message } from "./types";
import { useWindowSize } from "@hooks";
import { SUGGESTED_QUESTIONS } from "./types";
import { loadMarked } from "./utils";

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
  onSuggestedQuestion: (question: string, index: number, total: number) => void;
  onQuickAction: (action: string) => void;
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
  onQuickAction,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { width } = useWindowSize(200);

  // Warm up the markdown parser as soon as the window mounts, so the first
  // AI response doesn't flash unformatted text while marked loads. Must
  // stay in this component (not AIChatAssistant, which is eager) - calling
  // it from eager code gets the dynamic import preloaded on every page.
  useEffect(() => {
    loadMarked();
  }, []);

  useEffect(() => {
    if (inputRef.current && width >= 768) {
      inputRef.current.focus();
    }
  }, []);

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

  const hasSuggestions = showSuggestions && messages.length <= 1 && !isLoading;

  const handleSuggestedQuestionClick = (question: string, index: number) => {
    onSuggestedQuestion(question, index, SUGGESTED_QUESTIONS.length);
  };

  return (
    <div
      ref={chatWindowRef}
      className="fixed inset-0 z-50 flex flex-col border border-slate-700 bg-slate-800 shadow-2xl animate-slide-up md:inset-auto md:bottom-44 md:right-6 md:h-[min(85vh,680px)] md:w-96 md:max-w-[calc(100vw-3rem)] md:rounded-lg"
    >
      <ChatHeader onClose={onClose} onClear={onClear} />

      <div
        ref={scrollContainerRef}
        className="flex-1 space-y-3 overflow-y-auto p-3"
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

        {hasSuggestions && (
          <div className="space-y-4">
            <QuickActions onActionClick={onQuickAction} />
            <SuggestedQuestions onQuestionClick={handleSuggestedQuestionClick} />
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
