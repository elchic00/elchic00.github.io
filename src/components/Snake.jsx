import { useRef } from "react";
import { useSnakeGame } from "../hooks/useSnakeGame";

/**
 * Local Snake component (replacement for react-simple-snake)
 * Props:
 * - percentageWidth: number|string (percent of parent width, e.g. 50 or "50")
 * - startSnakeSize: number (initial snake length)
 * - appleColor: string
 * - snakeColor: string
 * - gridSize: number (number of cells per side)
 * - speed: number (ms per step)
 */
const PlaySnake = ({
  percentageWidth = 50,
  startSnakeSize = 4,
  appleColor = "red",
  snakeColor = "green",
  gridSize = 20,
  speed = 67,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

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
  });

  return (
    <section id="snake" ref={containerRef} className="pt-5">
      {!mounted && <div>Snake game loading…</div>}
      <div className="overflow-hidden text-center h-full h-screen">
        <h2 className="text-white text-3xl mb-1 font-medium pt-10 mt-12">
          Use arrows, W/A/S/D keys, or touchscreen to play:
        </h2>

        <div className="flex justify-center pt-5">
          <div
            style={{ width: `${percentageWidth}%` }}
            className="relative max-w-[640px] pb-16 mx-auto"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="text-white">Score: {score}</div>
              <div className="text-white">High: {highScore}</div>
            </div>
            <canvas
              ref={canvasRef}
              className="block w-full h-auto border-4 border-white rounded-md shadow-lg bg-[#0f172a]"
            />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
              <button
                onClick={toggleRunning}
                className="px-3 py-1 rounded bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                aria-label={
                  running
                    ? "Pause game"
                    : gameOver
                    ? "Start new game"
                    : "Resume game"
                }
              >
                {running ? "Pause" : gameOver ? "Start" : "Resume"}
              </button>
              <button
                onClick={restart}
                className="px-3 py-1 rounded bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                aria-label="Restart game"
              >
                Restart
              </button>
            </div>
            {gameOver && (
              <div className="text-red-400 mt-2">
                Game Over — final score: {score}
                {newHighScore && (
                  <div className="text-green-400 font-bold">
                    🎉 New local high score!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaySnake;
