import { useEffect, useRef, useState } from "react";

/**
 * Local Snake component
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

  // refs to hold mutable game state
  const gameStateRef = useRef({
    snake: [],
    dir: { x: 1, y: 0 },
    lastDir: { x: 1, y: 0 },
    apple: { x: 0, y: 0 },
    currentScore: 0,
    stepInterval: Math.max(25, speed || 50),
    running: true,
    gameOver: false,
  });

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  // mark mounted
  useEffect(() => setMounted(true), []);

  // load high score
  useEffect(() => {
    const stored = localStorage.getItem("snakeHighScore");
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  // save high score whenever it updates
  useEffect(() => {
    localStorage.setItem("snakeHighScore", String(highScore));
  }, [highScore]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let size = gridSize;
    let scale = 10;

    const computeSize = () => {
      const containerWidth = containerRef.current.clientWidth || 600;
      const pct = typeof percentageWidth === "string" ? parseFloat(percentageWidth) : percentageWidth;
      const canvasPx = Math.max(200, Math.floor((containerWidth * pct) / 100));
      scale = Math.floor(canvasPx / size) || 10;
      canvas.width = scale * size;
      canvas.height = scale * size;
    };

    computeSize();
    if (ctx.imageSmoothingEnabled !== undefined) ctx.imageSmoothingEnabled = false;

    const resetState = () => {
      const startX = Math.floor(size / 2);
      const startY = Math.floor(size / 2);
      const snake = [];
      for (let i = 0; i < startSnakeSize; i++) {
        snake.push({ x: startX - i, y: startY });
      }
      gameStateRef.current = {
        snake,
        dir: { x: 1, y: 0 },
        lastDir: { x: 1, y: 0 },
        apple: { x: 0, y: 0 },
        currentScore: 0,
        stepInterval: Math.max(25, speed || 50),
        running: true,
        gameOver: false,
      };
      placeApple();
      setScore(0);
      setNewHighScore(false);
    };

    const placeApple = () => {
      const { snake } = gameStateRef.current;
      let spot = null;
      while (true) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (!snake.some((s) => s.x === x && s.y === y)) {
          spot = { x, y };
          break;
        }
      }
      gameStateRef.current.apple = spot;
    };

    const draw = () => {
      const { snake, apple } = gameStateRef.current;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // apple
      ctx.fillStyle = appleColor;
      ctx.fillRect(apple.x * scale, apple.y * scale, scale, scale);

      // snake
      ctx.fillStyle = snakeColor;
      snake.forEach((s) => ctx.fillRect(s.x * scale, s.y * scale, scale - 1, scale - 1));
    };

    const step = () => {
      const state = gameStateRef.current;
      if (!state.running || state.gameOver) return;

      const head = {
        x: (state.snake[0].x + state.dir.x + size) % size,
        y: (state.snake[0].y + state.dir.y + size) % size,
      };

      if (state.snake.some((s) => s.x === head.x && s.y === head.y)) {
        state.running = false;
        state.gameOver = true;
        setScore(state.currentScore);
        setHighScore((h) => Math.max(h, state.currentScore));
        return;
      }

      state.snake.unshift(head);

      if (head.x === state.apple.x && head.y === state.apple.y) {
        state.currentScore += 1;
        setScore(state.currentScore);

        if (state.currentScore > highScore) {
          setHighScore(state.currentScore);
          setNewHighScore(true);
        }

        state.stepInterval = Math.max(25, state.stepInterval - 0.5);
        placeApple();
      } else {
        state.snake.pop();
      }

      state.lastDir = state.dir;
    };

    const keyHandler = (e) => {
      const state = gameStateRef.current;
      const k = e.key.toLowerCase();
      let next = null;
      if (k === "arrowup" || k === "w") next = { x: 0, y: -1 };
      if (k === "arrowdown" || k === "s") next = { x: 0, y: 1 };
      if (k === "arrowleft" || k === "a") next = { x: -1, y: 0 };
      if (k === "arrowright" || k === "d") next = { x: 1, y: 0 };
      if (k === " ") {
        state.running = !state.running;
      }
      if (next && !(next.x === -state.lastDir.x && next.y === -state.lastDir.y)) {
        state.dir = next;
      }
    };

    let touchStart = null;
    const touchStartHandler = (e) => {
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    };
    const touchEndHandler = (e) => {
      if (!touchStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      const state = gameStateRef.current;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && state.lastDir.x !== 1) state.dir = { x: 1, y: 0 };
        if (dx < -20 && state.lastDir.x !== -1) state.dir = { x: -1, y: 0 };
      } else {
        if (dy > 20 && state.lastDir.y !== 1) state.dir = { x: 0, y: 1 };
        if (dy < -20 && state.lastDir.y !== -1) state.dir = { x: 0, y: -1 };
      }
      touchStart = null;
    };

    resetState();
    draw();

    window.addEventListener("keydown", keyHandler);
    canvas.addEventListener("touchstart", touchStartHandler, { passive: true });
    canvas.addEventListener("touchend", touchEndHandler, { passive: true });

    let rafId = null;
    let lastTime = 0;
    let acc = 0;

    const loop = (time) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      acc += delta;
      const { stepInterval, running } = gameStateRef.current;
      const interval = Math.max(25, stepInterval);
      while (acc >= interval && running) {
        step();
        acc -= interval;
      }
      draw();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      computeSize();
      draw();
    });
    ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", keyHandler);
      canvas.removeEventListener("touchstart", touchStartHandler);
      canvas.removeEventListener("touchend", touchEndHandler);
      ro.disconnect();
    };
  }, [tick, percentageWidth, startSnakeSize, appleColor, snakeColor, gridSize, speed, highScore]);

  const toggleRunning = () => {
    const state = gameStateRef.current;
    if (state.gameOver) setTick((t) => t + 1);
    else state.running = !state.running;
  };

  const restart = () => setTick((t) => t + 1);

  if (!mounted) return <section id="snake"><div>Snake game loading…</div></section>;

  return (
    <section id="snake" ref={containerRef}>
      <div className="overflow-hidden text-center h-full h-screen">
        <h2 className="text-white text-3xl mb-1 font-medium pt-10 mt-12">Use arrows or W/A/S/D keys to play:</h2>

        <div className="flex justify-center pt-5">
          <div style={{ width: `${percentageWidth}%` }} className="relative max-w-[640px] pb-16 mx-auto">
            <div className="flex justify-between items-center mb-2">
              <div className="text-white">Score: {score}</div>
              <div className="text-white">High: {highScore}</div>
            </div>
            <canvas ref={canvasRef} className="block w-full h-auto border-4 border-white rounded-md shadow-lg bg-[#0f172a]" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
              <button onClick={toggleRunning} className="px-3 py-1 rounded bg-slate-700 text-white">
                {gameStateRef.current.running ? "Pause" : gameStateRef.current.gameOver ? "Start" : "Resume"}
              </button>
              <button onClick={restart} className="px-3 py-1 rounded bg-slate-700 text-white">Restart</button>
            </div>
            {gameStateRef.current.gameOver && (
              <div style={{ color: "#f87171", marginTop: 8 }}>
                Game Over — final score: {score}
                <div>{newHighScore ? "New local high score!" : ""}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaySnake;
