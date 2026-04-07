import { useState, useEffect, useRef, useCallback } from "react";

const CHARS = "!@#$%^&*()-=+[]{}|;:<>?/~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface UseTextScrambleOptions {
  speed?: number;       // ms per character resolve (default 30)
  scrambleDuration?: number; // ms of scrambling before resolving starts (default 300)
}

export const useTextScramble = (
  text: string,
  trigger: boolean,
  options: UseTextScrambleOptions = {}
) => {
  const { speed = 30, scrambleDuration = 300 } = options;
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const getRandomChar = useCallback(() => {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }, []);

  useEffect(() => {
    if (!trigger) {
      setDisplayText("");
      setIsComplete(false);
      return;
    }

    startTimeRef.current = performance.now();
    setIsComplete(false);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const resolveStart = scrambleDuration;
      const totalDuration = resolveStart + text.length * speed;

      if (elapsed >= totalDuration) {
        setDisplayText(text);
        setIsComplete(true);
        return;
      }

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
          continue;
        }

        const charResolveTime = resolveStart + i * speed;
        if (elapsed >= charResolveTime) {
          result += text[i];
        } else if (elapsed >= resolveStart * 0.3) {
          result += getRandomChar();
        } else {
          result += getRandomChar();
        }
      }

      setDisplayText(result);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [trigger, text, speed, scrambleDuration, getRandomChar]);

  return { displayText, isComplete };
};
