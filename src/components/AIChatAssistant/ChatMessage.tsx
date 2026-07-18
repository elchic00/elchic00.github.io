/**
 * Individual chat message component with markdown rendering and action buttons
 */

import { memo, useState } from "react";
import { ClipboardCopyIcon, CheckIcon } from "@heroicons/react/outline";
import { formatRelativeTime } from "./utils";
import { renderMarkdown } from "./markdownRenderer";
import { Message, ACTION_CONFIGS } from "./types";
import { useStreamingText } from "./useStreamingText";

interface ChatMessageProps {
  message: Message;
  onAction: (action: string) => void;
  onRetry?: () => void;
}

export const ChatMessage = memo(({ message, onAction, onRetry }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const displayedContent = useStreamingText(message.content, message.isStreaming || false);
  const isStreaming = message.isStreaming || false;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div
      className={`flex animate-fade-in-up ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative group max-w-[80%] p-3 rounded-lg ${
          message.role === "user"
            ? "bg-cyan-700 text-white"
            : message.error
            ? "bg-red-900/50 text-slate-100 border border-red-700"
            : "bg-slate-700 text-slate-100"
        }`}
        title={message.timestamp ? formatRelativeTime(message.timestamp) : undefined}
      >
        {/* Copy button for assistant messages */}
        {message.role === "assistant" && !message.error && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity bg-slate-600 hover:bg-slate-500 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label={copied ? "Copied!" : "Copy message"}
            title={copied ? "Copied!" : "Copy message"}
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-400" />
            ) : (
              <ClipboardCopyIcon className="w-4 h-4 text-slate-300" />
            )}
          </button>
        )}

        {message.role === "assistant" ? (
          <>
            {isStreaming ? (
              // During streaming, render plain text to preserve whitespace
              <p className="text-sm whitespace-pre-wrap">{displayedContent}</p>
            ) : (
              // After streaming completes, render markdown
              <div
                className="text-sm assistant-message-content"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(displayedContent),
                }}
              />
            )}
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

        {/* Timestamp - visible on hover */}
        {message.timestamp && (
          <div className="mt-1 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatRelativeTime(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
});
