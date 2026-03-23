/**
 * Custom hook for streaming text word-by-word effect
 */

import { useState, useEffect, useRef } from "react";

export const useStreamingText = (fullText: string, isStreaming: boolean) => {
  const [displayedText, setDisplayedText] = useState("");
  const isRunningRef = useRef(false);
  const textRef = useRef(fullText);

  useEffect(() => {
    // Always keep text ref up to date
    textRef.current = fullText;

    if (!isStreaming) {
      setDisplayedText(fullText);
      isRunningRef.current = false;
      return;
    }

    // If already running with same text, don't restart
    if (isRunningRef.current) {
      return;
    }

    // Mark as running
    isRunningRef.current = true;

    // Split text into tokens (words and whitespace)
    const tokens = fullText.split(/(\s+)/);
    let currentIndex = 0;

    // Start from empty
    setDisplayedText("");

    const interval = setInterval(() => {
      if (currentIndex < tokens.length) {
        setDisplayedText((prev) => prev + tokens[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        isRunningRef.current = false;
      }
    }, 20); // 20ms per token (~50 words/sec) - ChatGPT-like speed

    return () => clearInterval(interval);
  }, [fullText, isStreaming]);

  return displayedText;
};
