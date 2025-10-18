import { useRef } from "react";
import { useSnakeGame } from "../hooks/useSnakeGame";
import { Button } from "./shared/Button";

interface PlaySnakeProps {
  percentageWidth?: number | string;
  startSnakeSize?: number;
  appleColor?: string;
  snakeColor?: string;
  gridSize?: number;
  speed?: number;
}

const PlaySnake: React.FC<PlaySnakeProps> = ({
  percentageWidth = 100,
  startSnakeSize = 4,
  appleColor = "red",
  snakeColor = "green",
  gridSize = 20,
  speed = 67,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    score,
    highScore,
    newHighScore,
    gameOver,
    running,
    mounted,
    toggleRunning,
    restart,
  } = useSnakeGame({
    gridSize,
    startSnakeSize,
    speed,
    percentageWidth,
    appleColor,
    snakeColor,
    canvasRef,
    containerRef,
  } as any);

  return (
    <section
      id="snake"
      className="min-h-screen landscape:min-h-0 flex flex-col pt-16"
    >
      {!mounted && <div>Snake game loading…</div>}
      <div className="flex-1 flex flex-col items-center justify-center landscape:justify-start py-2">
        <h2 className="text-white text-xl md:text-2xl font-medium landscape:text-lg mb-1 text-center">
          Snake Game
        </h2>

        <div className="w-full max-w-[min(95vw,calc(100vh-320px))] md:max-w-[min(90vw,calc(100vh-300px))] lg:max-w-[min(85vw,calc(100vh-290px))] xl:max-w-[min(80vw,calc(100vh-280px))] landscape:max-w-[calc(100vh-200px)] mx-auto">
          <div className="flex justify-between items-center mb-1 px-2 text-sm md:text-base">
            <div className="text-white font-semibold">Score: {score}</div>
            <div className="text-teal-400 font-semibold">High: {highScore}</div>
          </div>
          <div className="aspect-square w-full">
            <div ref={containerRef} className="w-full h-full">
              <canvas
                ref={canvasRef}
                className="block w-full h-full border-4 border-white rounded-md shadow-lg bg-[#0f172a]"
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-slate-200 text-xs mt-1 mb-1">
            <div className="inline-flex gap-0.5">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-900 bg-slate-200 border border-slate-300 rounded shadow-sm min-w-[22px] text-center">
                ↑→↓←
              </kbd>
            </div>
            <span className="text-slate-400 text-xs">or</span>
            <div className="inline-flex gap-0.5">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-slate-900 bg-slate-200 border border-slate-300 rounded shadow-sm">
                WASD
              </kbd>
            </div>
            <span className="text-slate-500">•</span>
            <kbd className="px-2 py-0.5 text-xs font-semibold text-slate-900 bg-slate-200 border border-slate-300 rounded shadow-sm">
              Space
            </kbd>
            <span className="text-slate-400 text-xs">to pause</span>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleRunning}
              ariaLabel={
                running
                  ? "Pause game"
                  : gameOver
                  ? "Start new game"
                  : "Resume game"
              }
            >
              {running ? "Pause" : gameOver ? "Start" : "Resume"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={restart}
              ariaLabel="Restart game"
            >
              Restart
            </Button>
          </div>
          {gameOver && (
            <div className="text-red-400 mt-1 text-center text-sm">
              Game Over — final score: {score}
              {newHighScore && (
                <div className="text-emerald-400 font-bold">
                  🎉 New local high score!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PlaySnake;
