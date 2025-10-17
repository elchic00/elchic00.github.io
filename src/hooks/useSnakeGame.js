import { useState, useRef, useLayoutEffect } from "react";
import { useLocalStorage } from "./index";

/**
 * Custom hook for Snake game logic
 * @param {Object} config - Game configuration
 * @param {number} config.gridSize - Grid size (cells per side)
 * @param {number} config.startSnakeSize - Initial snake length
 * @param {number} config.speed - Game speed in milliseconds
 * @param {number|string} config.percentageWidth - Canvas width as percentage
 * @param {string} config.appleColor - Apple color
 * @param {string} config.snakeColor - Snake color
 * @param {HTMLCanvasElement} canvasRef - Canvas element reference
 * @param {HTMLElement} containerRef - Container element reference
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
}) => {
  const runningRef = useRef(true);
  const gameOverRef = useRef(false);

  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage("snakeHighScore", 0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Client-only mount
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  // Main game loop
  useLayoutEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let size = gridSize;

    const computeSize = () => {
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
        if (!snake.some((s) => s.x === x && s.y === y)) {
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
      snake.forEach((s) =>
        ctx.fillRect(s.x * scale, s.y * scale, scale - 1, scale - 1)
      );
    };

    const step = () => {
      if (!runningRef.current) return;

      const head = {
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
    const keyHandler = (e) => {
      const k = e.key.toLowerCase();
      let next = null;
      e.preventDefault();
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

    // Touch/swipe handlers
    let touchStart = null;
    const touchStartHandler = (e) => {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const touchEndHandler = (e) => {
      if (!touchStart) return;
      const dx = e.changedTouches[0].clientX - touchStart.x;
      const dy = e.changedTouches[0].clientY - touchStart.y;
      let next = null;
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

    let rafId = null;
    let lastTime = 0;
    let acc = 0;

    const loop = (time) => {
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

  const toggleRunning = () => {
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

  const restart = () => {
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
