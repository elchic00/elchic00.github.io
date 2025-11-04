/**
 * Loading indicator for chat responses
 */

export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start" role="status" aria-label="Loading response">
      <div className="bg-slate-700 text-slate-100 p-3 rounded-lg">
        <div className="flex gap-1" aria-hidden="true">
          <div
            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
