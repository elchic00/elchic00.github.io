import { useState, useRef, useEffect } from "react";
import { XIcon, ChatIcon, PaperAirplaneIcon, RefreshIcon } from "@heroicons/react/solid";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Message {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "What are Andrew's main technical skills?",
  "Tell me about his teaching experience",
  "What projects has he built?",
  "Where has Andrew traveled?",
];

export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Andrew's AI assistant. Ask me about his experience, projects, skills, or travel adventures!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Configure marked to open links in same window (for internal navigation)
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput("");
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again later or reach out directly via the contact form!",
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");
    if (lastUserMessage) {
      // Remove last error message
      setMessages((prev) => prev.slice(0, -1));
      sendMessage(lastUserMessage.content);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hi! I'm Andrew's AI assistant. Ask me about his experience, projects, skills, or travel adventures!",
      },
    ]);
    setShowSuggestions(true);
    setInput("");
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-24 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
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

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] sm:h-[500px] h-[calc(100vh-12rem)] bg-slate-800 rounded-lg shadow-2xl flex flex-col border border-slate-700 animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChatIcon className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">
                Ask About Andrew
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="text-white hover:bg-white/20 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <RefreshIcon className="w-5 h-5" />
              </button>
              <button
                onClick={toggleChat}
                className="text-white hover:bg-white/20 rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close chat"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
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
                    <div
                      className="text-sm assistant-message-content"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(marked(message.content) as string),
                      }}
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  {message.error && (
                    <button
                      onClick={handleRetry}
                      className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 underline focus:outline-none"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Questions */}
            {showSuggestions && messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 text-center">Suggested questions:</p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-left text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-slate-700"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-cyan-700 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="w-5 h-5 rotate-90" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
