/**
 * Loading indicator for chat responses with progressive messages
 */

import { useState, useEffect } from "react";

const LOADING_STAGES = [
  { emoji: "🔍", message: "Reading your question..." },
  { emoji: "💭", message: "Thinking..." },
  { emoji: "✍️", message: "Crafting response..." },
];

export const LoadingIndicator = () => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % LOADING_STAGES.length);
    }, 1500); // Change message every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  const currentStage = LOADING_STAGES[stageIndex];

  return (
    <div className="flex justify-start" role="status" aria-label={currentStage.message}>
      <div className="bg-slate-700 text-slate-100 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">{currentStage.emoji}</span>
          <span className="text-sm text-slate-300">{currentStage.message}</span>
          <div className="flex gap-1" aria-hidden="true">
            <div
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
