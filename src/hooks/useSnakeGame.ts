import { useState, useRef, useLayoutEffect, RefObject } from "react";
import { useLocalStorage } from "./index";

interface Position {
  x: number;
  y: number;
}

interface SnakeGameConfig {
  gridSize: number;
  startSnakeSize: number;
  speed: number;
  percentageWidth: number | string;
  appleColor: string;
  snakeColor: string;
  canvasRef: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLDivElement>;
}

interface SnakeGameReturn {
  score: number;
  highScore: number;
  newHighScore: boolean;
  gameOver: boolean;
  running: boolean;
  mounted: boolean;
  toggleRunning: () => void;
  restart: () => void;
}

/**
 * Custom hook for Snake game logic
 */
export const useSnakeGame = ({
  gridSize,
  startSnakeSize,
  speed,
  percentageWidth,
  appleColor,
  snakeColor,
  canvasRef,
  containerRef,
}: SnakeGameConfig): SnakeGameReturn => {
  const runningRef = useRef<boolean>(true);
  const gameOverRef = useRef<boolean>(false);

  const [running, setRunning] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useLocalStorage<number>("snakeHighScore", 0);
  const [newHighScore, setNewHighScore] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  // Client-only mount
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Main game loop
  useLayoutEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let size = gridSize;

    const computeSize = (): { scale: number; size: number } => {
      const containerWidth = containerRef.current?.clientWidth || 600;
      const pct =
        typeof percentageWidth === "string"
          ? parseFloat(percentageWidth)
          : percentageWidth;
      const canvasPx = Math.max(200, Math.floor((containerWidth * pct) / 100));
      const scale = Math.floor(canvasPx / size) || 10;
      canvas.width = scale * size;
      canvas.height = scale * size;
      return { scale, size };
    };

    let { scale } = computeSize();
    if (ctx.imageSmoothingEnabled !== undefined)
      ctx.imageSmoothingEnabled = false;

    // Game state
    let snake: Position[] = [];
    let dir: Position = { x: 1, y: 0 };
    let lastDir: Position = { x: 1, y: 0 };
    let apple: Position = { x: 0, y: 0 };
    let currentScore = 0;
    let stepInterval = Math.max(25, speed || 50);

    const resetState = (): void => {
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

    const placeApple = (): void => {
      let spot: Position | null = null;
      while (true) {
        const x = Math.floor(Math.random() * size);
        const y = Math.floor(Math.random() * size);
        if (!snake.some((s) => s.x === x && s.y === y)) {
          spot = { x, y };
          break;
        }
      }
      apple = spot;
    };

    const draw = (): void => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = appleColor;
      ctx.fillRect(apple.x * scale, apple.y * scale, scale, scale);

      ctx.fillStyle = snakeColor;
      snake.forEach((s) =>
        ctx.fillRect(s.x * scale, s.y * scale, scale - 1, scale - 1)
      );
    };

    const step = (): void => {
      if (!runningRef.current) return;

      const head: Position = {
        x: (snake[0].x + dir.x + size) % size,
        y: (snake[0].y + dir.y + size) % size,
      };

      if (snake.some((s) => s.x === head.x && s.y === head.y)) {
        runningRef.current = false;
        setRunning(false);
        setGameOver(true);
        gameOverRef.current = true;

        if (currentScore > highScore) {
          setHighScore(currentScore);
          setNewHighScore(true);
        }
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

    // Keyboard handler
    const keyHandler = (e: KeyboardEvent): void => {
      const k = e.key.toLowerCase();
      let next: Position | null = null;
      e.preventDefault();
      if (k === "arrowup" || k === "w") next = { x: 0, y: -1 };
      if (k === "arrowdown" || k === "s") next = { x: 0, y: 1 };
      if (k === "arrowleft" || k === "a") next = { x: -1, y: 0 };
      if (k === "arrowright" || k === "d") next = { x: 1, y: 0 };
      if (k === " ") {
        if (gameOverRef.current) {
          // If game is over, space starts a new game
          resetState();
          draw();
        } else {
          // If game is running or paused, space toggles pause
          runningRef.current = !runningRef.current;
          setRunning(runningRef.current);
        }
      }
      if (next && !(next.x === -lastDir.x && next.y === -lastDir.y)) {
        dir = next;
      }
    };

    // Touch/swipe handlers
    let touchStart: Position | null = null;
    const touchStartHandler = (e: TouchEvent): void => {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const touchEndHandler = (e: TouchEvent): void => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      let next: Position | null = null;
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 20) next = { x: 1, y: 0 }; // Swipe right
        if (dx < -20) next = { x: -1, y: 0 }; // Swipe left
      } else {
        // Vertical swipe
        if (dy > 20) next = { x: 0, y: 1 }; // Swipe down
        if (dy < -20) next = { x: 0, y: -1 }; // Swipe up
      }
      // Only apply direction if it's not opposite to current direction
      if (next && !(next.x === -lastDir.x && next.y === -lastDir.y)) {
        dir = next;
      }
      touchStart = null;
    };

    resetState();
    draw();

    window.addEventListener("keydown", keyHandler);
    canvas.addEventListener("touchstart", touchStartHandler, { passive: true });
    canvas.addEventListener("touchend", touchEndHandler, { passive: true });

    let rafId: number | null = null;
    let lastTime = 0;
    let acc = 0;

    const loop = (time: number): void => {
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

    // Resize observer
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tick,
    percentageWidth,
    startSnakeSize,
    appleColor,
    snakeColor,
    gridSize,
    speed,
    mounted,
    setHighScore,
  ]);

  const toggleRunning = (): void => {
    if (gameOver) {
      runningRef.current = true;
      setRunning(true);
      setGameOver(false);
      gameOverRef.current = false;
      setScore(0);
      setNewHighScore(false);
      setTick((t) => t + 1);
    } else {
      runningRef.current = !runningRef.current;
      setRunning(runningRef.current);
    }
  };

  const restart = (): void => {
    runningRef.current = true;
    setRunning(true);
    setGameOver(false);
    gameOverRef.current = false;
    setScore(0);
    setNewHighScore(false);
    setTick((t) => t + 1);
  };

  return {
    score,
    highScore,
    newHighScore,
    gameOver,
    running,
    mounted,
    toggleRunning,
    restart,
  };
};
