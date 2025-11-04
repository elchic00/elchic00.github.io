/**
 * Individual chat message component with markdown rendering and action buttons
 */

import { renderMarkdown } from "./utils";
import { Message, ACTION_CONFIGS } from "./types";

interface ChatMessageProps {
  message: Message;
  onAction: (action: string) => void;
  onRetry?: () => void;
}

export const ChatMessage = ({ message, onAction, onRetry }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          message.role === "user"
            ? "bg-cyan-700 text-white"
            : message.error
            ? "bg-red-900/50 text-slate-100 border border-red-700"
            : "bg-slate-700 text-slate-100"
        }`}
      >
        {message.role === "assistant" ? (
          <>
            <div
              className="text-sm assistant-message-content"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(message.content),
              }}
            />
            {message.actions && message.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.actions.map((action, idx) => {
                  const config = ACTION_CONFIGS[action];
                  if (!config) return null;
                  return (
                    <button
                      key={idx}
                      onClick={() => onAction(action)}
                      className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
        {message.error && onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 underline focus:outline-none"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};
