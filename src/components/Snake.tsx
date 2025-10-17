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
  percentageWidth = 50,
  startSnakeSize = 4,
  appleColor = "red",
  snakeColor = "green",
  gridSize = 20,
  speed = 67,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);

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
    <section id="snake" ref={containerRef} className="min-h-screen landscape:min-h-0 flex flex-col pt-20">
      {!mounted && <div>Snake game loading…</div>}
      <div className="flex-1 flex flex-col items-center justify-center landscape:justify-start">
        <div className="text-center mb-2 landscape:mb-1">
          <h2 className="text-white text-2xl md:text-3xl font-medium landscape:text-xl">
            Snake Game
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-1 landscape:text-xs">
            Arrow keys / WASD to move • Space to pause • Touch/swipe on mobile
          </p>
        </div>

        <div className="w-full max-w-[min(95vw,calc(100vh-200px))] md:max-w-[calc(100vh-160px)] lg:max-w-[calc(100vh-140px)] xl:max-w-[calc(100vh-130px)] landscape:max-w-[calc(100vh-100px)] mx-auto">
          <div className="flex justify-between items-center mb-1 px-2 text-sm md:text-base">
            <div className="text-white font-semibold">Score: {score}</div>
            <div className="text-emerald-400 font-semibold">High: {highScore}</div>
          </div>
          <div
            style={{ width: "100%" }}
            className="relative"
          >
            <canvas
              ref={canvasRef}
              className="block w-full h-auto aspect-square landscape:max-h-[50vh] landscape:object-contain border-4 border-white rounded-md shadow-lg bg-[#0f172a]"
            />
          </div>
          <div className="flex justify-center gap-2 mt-2 landscape:mt-1">
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
