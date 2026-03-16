import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

interface FocusRingProps {
  totalSeconds: number;
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  remainingSeconds: number;
}

export default function FocusRing({ totalSeconds, isRunning, remainingSeconds, onToggle, onReset }: FocusRingProps) {
  const progress = 1 - remainingSeconds / totalSeconds;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const circumference = 2 * Math.PI * 120;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="relative flex flex-col items-center justify-center"
    >
      <svg className="h-64 w-64 -rotate-90" viewBox="0 0 256 256">
        <circle
          cx="128" cy="128" r="120"
          stroke="hsl(var(--muted))"
          strokeWidth="3"
          fill="none"
          strokeOpacity="0.3"
        />
        <motion.circle
          cx="128" cy="128" r="120"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          transition={{ duration: 0.5, ease: "linear" }}
        />
        {/* Glow */}
        {isRunning && (
          <circle
            cx="128" cy="128" r="120"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeOpacity="0.15"
            className="animate-pulse-glow"
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-5xl font-semibold tracking-tighter text-foreground tabular-nums">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          {isRunning ? "FOCUSING" : "PAUSED"}
        </span>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={onToggle}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground aether-transition hover:bg-primary/90"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={onReset}
          className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground aether-transition hover:text-foreground"
        >
          Reset
        </button>
      </div>
    </motion.div>
  );
}

export function useFocusTimer(initialMinutes = 25) {
  const totalSeconds = initialMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const interval = setInterval(() => setRemaining(r => r - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const toggle = useCallback(() => setIsRunning(r => !r), []);
  const reset = useCallback(() => { setIsRunning(false); setRemaining(totalSeconds); }, [totalSeconds]);

  return { totalSeconds, remaining, isRunning, toggle, reset };
}
