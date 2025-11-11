/**
 * Loading indicator for chat responses
 */

export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start" role="status" aria-label="Andrew's AI is crafting a response">
      <div className="bg-slate-700 text-slate-100 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-300">✨ Andrew's AI is crafting a response</span>
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
