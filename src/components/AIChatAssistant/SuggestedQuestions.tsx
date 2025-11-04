/**
 * Suggested questions component for initial chat prompts
 */

import { SUGGESTED_QUESTIONS } from "./types";

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions = ({ onQuestionClick }: SuggestedQuestionsProps) => {
  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-400 text-center">Suggested questions:</p>
      <div className="grid grid-cols-1 gap-2">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="text-left text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded transition-colors focus-ring"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};
