import React from "react";
import { GameState, Language } from "../types";
import { TRANSLATIONS } from "../locales/translations";
import { Coins, ShoppingBag, Backpack, Trophy, Settings } from "lucide-react";
import { audioManager } from "../utils/audioManager";

interface StatsPanelProps {
  gameState: GameState;
  onOpenStore: () => void;
  onOpenBag: () => void;
  onOpenSlotMachine: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  language: Language;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  gameState,
  onOpenStore,
  onOpenBag,
  onOpenSlotMachine,
  onOpenAchievements,
  onOpenSettings,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full bg-[#d2a679] border-8 border-[#5d4037] border-b-0 p-2 md:p-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 select-none shadow-inner relative">
      {/* Left: Money Display */}
      <div className="flex items-center gap-2 bg-[#ffecb3] text-[#5d4037] px-3 py-1 rounded-lg border-2 border-[#8d6e63] shadow-inner min-w-[100px]">
        <Coins size={18} className="text-[#fbc02d]" />
        <span className="text-base md:text-lg font-bold tracking-tight">
          ${gameState.money}
        </span>
      </div>

      {/* Center: Action Buttons - wrap on mobile */}
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
        {/* Shop Button */}
        <button
          onClick={() => {
            audioManager.playButtonSound();
            onOpenStore();
          }}
          className="group relative bg-[#ff8a65] hover:bg-[#ff7043] text-[#3e2723] px-2 md:px-3 py-1.5 md:py-2 rounded-lg border-2 border-[#bf360c] shadow-[0_4px_0_#bf360c] active:shadow-none active:translate-y-1 transition-all text-[10px] md:text-xs font-bold uppercase flex items-center gap-1 md:gap-2"
        >
          <ShoppingBag size={14} className="md:w-4 md:h-4" />
          <span>{t.shopBtn}</span>
        </button>

        {/* Bag Button */}
        <button
          onClick={() => {
            audioManager.playButtonSound();
            onOpenBag();
          }}
          className="group relative bg-[#81c784] hover:bg-[#66bb6a] text-[#1b5e20] px-2 md:px-3 py-1.5 md:py-2 rounded-lg border-2 border-[#2e7d32] shadow-[0_4px_0_#2e7d32] active:shadow-none active:translate-y-1 transition-all text-[10px] md:text-xs font-bold uppercase flex items-center gap-1 md:gap-2"
        >
          <Backpack size={14} className="md:w-4 md:h-4" />
          <span>{t.bagBtn}</span>
        </button>

        {/* Slot Machine Button */}
        <button
          onClick={() => {
            audioManager.playButtonSound();
            onOpenSlotMachine();
          }}
          className="group relative bg-[#ffd54f] hover:bg-[#ffca28] text-[#3e2723] px-2 md:px-3 py-1.5 md:py-2 rounded-lg border-2 border-[#f57f17] shadow-[0_4px_0_#f57f17] active:shadow-none active:translate-y-1 transition-all text-[10px] md:text-xs font-bold uppercase flex items-center gap-1 md:gap-2"
        >
          <Coins size={14} className="md:w-4 md:h-4" />
          <span>{t.slotMachineBtn}</span>
        </button>
      </div>

      {/* Right: Achievement and Settings */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Achievements Button */}
        <button
          onClick={() => {
            audioManager.playButtonSound();
            onOpenAchievements();
          }}
          className="group relative p-1.5 md:p-2 rounded-lg border-2 active:translate-y-1 transition-all shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none bg-[#ffca28] border-[#f57f17] text-[#3e2723] hover:bg-[#ffb300]"
          title="Achievements"
        >
          <Trophy size={14} className="md:w-4 md:h-4" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            audioManager.playButtonSound();
            onOpenSettings();
          }}
          className="p-1.5 md:p-2 rounded-lg border-2 active:translate-y-1 transition-all shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none bg-[#e0e0e0] border-[#bdbdbd] text-[#5d4037] hover:bg-[#d6d6d6]"
          title="Settings"
        >
          <Settings size={14} className="md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
};

export default StatsPanel;
