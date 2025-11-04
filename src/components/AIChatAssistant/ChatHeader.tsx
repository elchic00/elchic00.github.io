/**
 * Chat window header with title and action buttons
 */

import { ChatIcon, XIcon, RefreshIcon } from "@heroicons/react/solid";

interface ChatHeaderProps {
  onClose: () => void;
  onClear: () => void;
}

export const ChatHeader = ({ onClose, onClear }: ChatHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 rounded-t-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ChatIcon className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold">Ask About Andrew</h3>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="text-white hover:bg-white/20 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Clear conversation"
          title="Clear conversation"
        >
          <RefreshIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close chat"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
