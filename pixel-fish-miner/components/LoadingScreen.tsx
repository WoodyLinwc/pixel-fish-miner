import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Loading audio...");

  useEffect(() => {
    const loadAudio = async () => {
      const startTime = Date.now();
      const MIN_DISPLAY_TIME = 2000; // Show loading screen for at least 2 seconds

      const audioFiles = [
        "/sounds/background.mp3",
        "/sounds/claw.mp3",
        "/sounds/catchnothing.mp3",
        "/sounds/money.mp3",
        "/sounds/powerup.mp3",
        "/sounds/button.mp3",
      ];

      let loaded = 0;
      const total = audioFiles.length;

      for (const audioFile of audioFiles) {
        try {
          await new Promise<void>((resolve, reject) => {
            const audio = new Audio(audioFile);

            audio.addEventListener(
              "canplaythrough",
              () => {
                loaded++;
                setProgress(Math.round((loaded / total) * 100));
                setStatus(`Loading ${audioFile.split("/").pop()}...`);
                resolve();
              },
              { once: true },
            );

            audio.addEventListener(
              "error",
              (e) => {
                console.warn(`Failed to load ${audioFile}:`, e);
                loaded++;
                setProgress(Math.round((loaded / total) * 100));
                resolve(); // Continue even if one file fails
              },
              { once: true },
            );

            audio.load();
          });
        } catch (error) {
          console.error(`Error loading ${audioFile}:`, error);
          loaded++;
          setProgress(Math.round((loaded / total) * 100));
        }
      }

      setStatus("Ready to play!");

      // Ensure loading screen shows for at least MIN_DISPLAY_TIME
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);

      console.log(
        `Loading completed in ${elapsedTime}ms, waiting ${remainingTime}ms more`,
      );

      setTimeout(() => {
        onLoadComplete();
      }, remainingTime);
    };

    loadAudio();
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#4a3728]">
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
          {status}
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
