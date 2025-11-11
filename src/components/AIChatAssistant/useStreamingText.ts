/**
 * Custom hook for streaming text word-by-word effect
 */

import { useState, useEffect } from "react";

export const useStreamingText = (fullText: string, isStreaming: boolean) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(fullText);
      return;
    }

    // Split text into words and punctuation
    const words = fullText.split(/(\s+)/);
    let currentIndex = 0;

    setDisplayedText("");

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText((prev) => prev + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 20); // 20ms per word (~50 words/sec) - ChatGPT-like speed

    return () => clearInterval(interval);
  }, [fullText, isStreaming]);

  return displayedText;
};
