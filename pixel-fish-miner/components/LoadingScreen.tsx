import React, { useEffect, useState, useRef } from "react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Store callback in a ref so the effect never re-triggers from parent re-renders
  const onLoadCompleteRef = useRef(onLoadComplete);
  onLoadCompleteRef.current = onLoadComplete;

  useEffect(() => {
    console.log("🔵 LoadingScreen: Starting 2 second delay...");

    const startTime = Date.now();
    const LOADING_TIME = 2000; // 2 seconds to give audio time to load

    // Animate progress
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(
        100,
        Math.round((elapsed / LOADING_TIME) * 100),
      );
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);

    // Show "Tap to Start" after loading completes
    const timeout = setTimeout(() => {
      console.log("🔵 LoadingScreen: Ready — waiting for user tap");
      setReady(true);
    }, LOADING_TIME);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, []); // No dependencies — runs once on mount, never re-triggers

  const handleTapToStart = () => {
    // This tap IS a user gesture — it will trigger audioManager's
    // unlock listener (click/touchstart) which resumes AudioContext.
    // This is critical for mobile browsers that block autoplay.
    console.log("🔵 LoadingScreen: User tapped — completing");
    onLoadCompleteRef.current();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#4a3728]"
      onClick={ready ? handleTapToStart : undefined}
    >
      {/* Fish Icon */}
      <div className="flex flex-col items-center gap-6">
        {/* Animated Fish */}
        <div className="relative w-32 h-32 animate-bounce">
          <svg viewBox="0 0 32 32" className="w-full h-full">
            {/* Ocean blue background */}
            <rect width="32" height="32" fill="#4dd0e1" rx="4" />

            {/* Fish body (orange) */}
            <rect x="8" y="12" width="16" height="8" fill="#ff6b35" />

            {/* Fish tail (darker orange) */}
            <rect x="4" y="14" width="4" height="4" fill="#e63946" />

            {/* Fish eye (black) */}
            <rect x="20" y="14" width="2" height="2" fill="#212121" />

            {/* Fish fins (darker orange) */}
            <rect x="12" y="10" width="2" height="2" fill="#e63946" />
            <rect x="12" y="20" width="2" height="2" fill="#e63946" />

            {/* Bubbles (white) */}
            <rect
              x="26"
              y="6"
              width="2"
              height="2"
              fill="#ffffff"
              opacity="0.8"
            />
            <rect
              x="28"
              y="10"
              width="2"
              height="2"
              fill="#ffffff"
              opacity="0.6"
            />
            <rect
              x="24"
              y="8"
              width="2"
              height="2"
              fill="#ffffff"
              opacity="0.7"
            />
          </svg>
        </div>

        {/* Loading Bar */}
        <div className="w-64">
          <div className="bg-[#3e2723] rounded-full h-4 border-2 border-[#5d4037] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4dd0e1] to-[#00acc1] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress Text */}
          <div className="text-center mt-2 text-[#e0e0e0] text-sm font-mono">
            {progress}%
          </div>
        </div>

        {/* Status Text */}
        <div className="text-[#e0e0e0] text-xs font-mono animate-pulse">
          {ready ? "🎣 Tap to Start!" : "Loading game..."}
        </div>

        {/* Pixel Fish Miner Title */}
        <div className="text-[#4dd0e1] text-2xl font-bold font-mono mt-4 drop-shadow-lg">
          PIXEL FISH MINER
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
