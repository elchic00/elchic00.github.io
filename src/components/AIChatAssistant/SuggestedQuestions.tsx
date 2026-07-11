/**
 * Suggested questions component for initial chat prompts
 */

import { SUGGESTED_QUESTIONS } from "./types";

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string, index: number) => void;
}

export const SuggestedQuestions = ({ onQuestionClick }: SuggestedQuestionsProps) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Or Ask Me</p>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question, index)}
            className="rounded-lg border border-slate-600/50 bg-slate-700/50 px-3 py-2 text-left text-sm text-slate-200 transition-all hover:scale-[1.01] hover:border-slate-500 hover:bg-slate-700 active:scale-[0.99] focus-ring"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};
