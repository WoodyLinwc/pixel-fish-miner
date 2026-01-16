import React from "react";
import { ACHIEVEMENTS, FISH_TYPES } from "../constants";
import { AchievementCategory, GameState, Language } from "../types";
import { TRANSLATIONS } from "../locales/translations";
import { X, Trophy, CheckCircle, Lock } from "lucide-react";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  language: Language;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  gameState,
  language,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  // Calculate stats for display
  const totalMoney = gameState.lifetimeEarnings;
  const maxCombo = gameState.maxCombo;
  let totalFish = 0;
  let totalTrash = 0;
  let totalMystery = 0;
  let totalWeatherFish = 0;

  FISH_TYPES.forEach((fish) => {
    const count = gameState.fishCaught[fish.id] || 0;
    if (fish.id === "mystery_bag") {
      totalMystery += count;
    } else if (fish.isTrash) {
      totalTrash += count;
    } else {
      totalFish += count;
    }

    // Count special weather fish for display if needed
    if (fish.requiredWeather && fish.requiredWeather.length > 0) {
      totalWeatherFish += count;
    }
  });

  const getProgress = (category: AchievementCategory) => {
    switch (category) {
      case AchievementCategory.MONEY:
        return totalMoney;
      case AchievementCategory.FISH:
        return totalFish;
      case AchievementCategory.TRASH:
        return totalTrash;
      case AchievementCategory.MYSTERY:
        return totalMystery;
      case AchievementCategory.COMBO:
        return maxCombo;
      case AchievementCategory.WEATHER:
        return totalWeatherFish;
      case AchievementCategory.NARWHAL:
        return gameState.fishCaught["narwhal"] || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-2 md:p-4">
      {/* Wood Frame */}
      <div className="bg-[#e6c288] border-[6px] border-[#8d5524] rounded-lg w-full max-w-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative animate-fade-in p-1 max-h-[95vh] md:max-h-[80vh] flex flex-col">
        {/* Inner Border */}
        <div className="border-2 border-[#c68c53] p-3 md:p-4 rounded h-full bg-[#e6c288] flex flex-col overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-[#d32f2f] text-white hover:bg-[#b71c1c] border-2 border-[#801313] rounded p-1 shadow-md active:translate-y-1 z-10"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl text-[#5d4037] mb-6 text-center uppercase tracking-widest flex items-center justify-center gap-3 drop-shadow-sm font-bold">
            <Trophy size={28} />
            {t.achievementsTitle}
          </h2>

          <div className="overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = gameState.achievements.includes(ach.id);
              let currentProgress = getProgress(ach.category);

              // Visual Fix: If unlocked (via cheat/code), ensure display shows completed state (e.g. 1/1)
              if (isUnlocked && currentProgress < ach.threshold) {
                currentProgress = ach.threshold;
              }

              const percent = Math.min(
                100,
                Math.floor((currentProgress / ach.threshold) * 100)
              );

              // Format description
              let desc = t.achievementDesc[ach.category].replace(
                "{0}",
                ach.threshold.toString()
              );

              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded border-2 shadow-sm flex items-center gap-4 relative transition-all ${
                    isUnlocked
                      ? "bg-[#fff9c4] border-[#fbc02d] opacity-100"
                      : "bg-[#d7ccc8] border-[#a1887f] opacity-80"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded border flex items-center justify-center text-2xl ${
                      isUnlocked
                        ? "bg-[#fff59d] border-[#fbc02d]"
                        : "bg-[#bcaaa4] border-[#8d6e63] grayscale"
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4
                        className={`font-bold text-xs sm:text-sm ${
                          isUnlocked ? "text-[#f57f17]" : "text-[#5d4037]"
                        }`}
                      >
                        {desc}
                      </h4>
                      {isUnlocked ? (
                        <CheckCircle size={16} className="text-[#43a047]" />
                      ) : (
                        <Lock size={16} className="text-[#8d6e63]" />
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-[#efebe9] rounded-full border border-[#d7ccc8] overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isUnlocked ? "bg-[#fbc02d]" : "bg-[#8d6e63]"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#3e2723]">
                        {currentProgress} / {ach.threshold}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
