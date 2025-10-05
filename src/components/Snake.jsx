import { useState, useRef, useLayoutEffect } from "react";

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
  const runningRef = useRef(true);
  const gameOverRef = useRef(false);

  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [tick, setTick] = useState(0); // force restart
  const [mounted, setMounted] = useState(false);

  // client-only mount
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // load high score from localStorage
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("snakeHighScore");
      if (stored) setHighScore(parseInt(stored, 10));
    }
  }, []);

  // persist high score
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("snakeHighScore", String(highScore));
    }
  }, [highScore]);

  // main game loop
  useLayoutEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let size = gridSize;

    const computeSize = () => {
      const containerWidth = containerRef.current?.clientWidth || 600;
      const pct = typeof percentageWidth === "string" ? parseFloat(percentageWidth) : percentageWidth;
      const canvasPx = Math.max(200, Math.floor((containerWidth * pct) / 100));
      const scale = Math.floor(canvasPx / size) || 10;
      canvas.width = scale * size;
      canvas.height = scale * size;
      return { scale, size };
    };

    let { scale } = computeSize();
    if (ctx.imageSmoothingEnabled !== undefined) ctx.imageSmoothingEnabled = false;

    // game state
    let snake = [];
    let dir = { x: 1, y: 0 };
    let lastDir = { x: 1, y: 0 };
    let apple = { x: 0, y: 0 };
    let currentScore = 0;
    let stepInterval = Math.max(25, speed || 50);

    const resetState = () => {
      snake = [];
      const startX = Math.floor(size / 2);
      const startY = Math.floor(size / 2);
      for (let i = 0; i < startSnakeSize; i++) {
        snake.push({ x: startX - i, y: startY });
      }
      dir = { x: 1, y: 0 };
      lastDir = { x: 1, y: 0 };
      currentScore = 0;
      runningRef.current = true;
      stepInterval = Math.max(25, speed || 50);
      setNewHighScore(false);
      setGameOver(false);
      gameOverRef.current = false;
      setScore(0);
      placeApple();
    };

    const placeApple = () => {
      let spot = null;
      while (true) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (!snake.some(s => s.x === x && s.y === y)) {
          spot = { x, y };
          break;
        }
      }
      apple = spot;
    };

    const draw = () => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = appleColor;
      ctx.fillRect(apple.x * scale, apple.y * scale, scale, scale);

      ctx.fillStyle = snakeColor;
      snake.forEach(s => ctx.fillRect(s.x * scale, s.y * scale, scale - 1, scale - 1));
    };

    const step = () => {
      if (!runningRef.current) return;

      const head = { x: (snake[0].x + dir.x + size) % size, y: (snake[0].y + dir.y + size) % size };

      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        runningRef.current = false;
        setRunning(false);
        setGameOver(true);
        gameOverRef.current = true;
        setHighScore(h => Math.max(h, currentScore));
        return;
      }

      snake.unshift(head);

      if (head.x === apple.x && head.y === apple.y) {
        currentScore += 1;
        setScore(currentScore);
        if (currentScore > highScore) {
          setHighScore(currentScore);
          setNewHighScore(true);
        }
        if (stepInterval > 25) stepInterval = Math.max(25, stepInterval - 0.5);
        placeApple();
      } else {
        snake.pop();
      }

      lastDir = dir;
    };

    // keyboard
    const keyHandler = (e) => {
      const k = e.key.toLowerCase();
      let next = null;
      if (k === "arrowup" || k === "w") next = { x: 0, y: -1 };
      if (k === "arrowdown" || k === "s") next = { x: 0, y: 1 };
      if (k === "arrowleft" || k === "a") next = { x: -1, y: 0 };
      if (k === "arrowright" || k === "d") next = { x: 1, y: 0 };
      if (k === " ") {
        if (!gameOverRef.current) {
          runningRef.current = !runningRef.current;
          setRunning(runningRef.current);
        }
      }
      if (next && !(next.x === -lastDir.x && next.y === -lastDir.y)) {
        dir = next;
      }
    };

    // touch/swipe
    let touchStart = null;
    const touchStartHandler = e => { touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const touchEndHandler = e => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 20 && !(lastDir.x === 1 && lastDir.y === 0)) dir = { x: 1, y: 0 };
        if (dx < -20 && !(lastDir.x === -1 && lastDir.y === 0)) dir = { x: -1, y: 0 };
      } else {
        if (dy > 20 && !(lastDir.x === 0 && lastDir.y === 1)) dir = { x: 0, y: 1 };
        if (dy < -20 && !(lastDir.x === 0 && lastDir.y === -1)) dir = { x: 0, y: -1 };
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

    const loop = time => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;
      lastTime = time;
      acc += delta;

      const effectiveInterval = Math.max(25, stepInterval);
      while (acc >= effectiveInterval) {
        if (runningRef.current) step();
        acc -= effectiveInterval;
      }

      draw();
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    // resize
    const ro = new ResizeObserver(() => {
      scale = computeSize().scale;
      draw();
    });
    const observedNode = containerRef.current;
    if (observedNode) ro.observe(observedNode);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", keyHandler);
      canvas.removeEventListener("touchstart", touchStartHandler);
      canvas.removeEventListener("touchend", touchEndHandler);
      if (observedNode) ro.disconnect();
    };
    // eslint-disable-next-line -- dont want to reset when breaking high score
  }, [tick, percentageWidth, startSnakeSize, appleColor, snakeColor, gridSize, speed, mounted]);

  const toggleRunning = () => {
    if (gameOver) {
      runningRef.current = true;
      setRunning(true);
      setGameOver(false);
      gameOverRef.current = false;
      setScore(0);
      setNewHighScore(false);
      setTick(t => t + 1);
    } else {
      runningRef.current = !runningRef.current;
      setRunning(runningRef.current);
    }
  };

  const restart = () => {
    runningRef.current = true;
    setRunning(true);
    setGameOver(false);
    gameOverRef.current = false;
    setScore(0);
    setTick(t => t + 1);
  };

  return (
    <section 
    id="snake" 
    ref={containerRef}
    className="pt-5"
    >
      {!mounted && <div>Snake game loading…</div>}
      <div className="overflow-hidden text-center h-full h-screen">
        <h2 className="text-white text-3xl mb-1 font-medium pt-10 mt-12">
          Use arrows, W/A/S/D keys, or touchscreen to play:
        </h2>

        <div className="flex justify-center pt-5">
          <div style={{ width: `${percentageWidth}%` }} className="relative max-w-[640px] pb-16 mx-auto">
            <div className="flex justify-between items-center mb-2">
              <div className="text-white">Score: {score}</div>
              <div className="text-white">High: {highScore}</div>
            </div>
            <canvas ref={canvasRef} className="block w-full h-auto border-4 border-white rounded-md shadow-lg bg-[#0f172a]" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
              <button onClick={toggleRunning} className="px-3 py-1 rounded bg-slate-700 text-white">
                {running ? "Pause" : gameOver ? "Start" : "Resume"}
              </button>
              <button onClick={restart} className="px-3 py-1 rounded bg-slate-700 text-white">Restart</button>
            </div>
            {gameOver && (
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
