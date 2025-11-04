/**
 * Chat input form component with send button
 */

import { PaperAirplaneIcon } from "@heroicons/react/solid";
import { ForwardedRef, forwardRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ value, onChange, onSubmit, isLoading }, ref: ForwardedRef<HTMLInputElement>) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit();
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus-ring placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="bg-cyan-700 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors focus-ring"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
          </button>
        </div>
      </form>
    );
  }
);

ChatInput.displayName = "ChatInput";
