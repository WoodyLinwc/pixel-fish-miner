
import React from 'react';
import { GameState, Language } from '../types';
import { TRANSLATIONS } from '../locales/translations';
import { Coins, ShoppingBag, Backpack, Trophy, Volume2, VolumeX, Globe } from 'lucide-react';

interface StatsPanelProps {
  gameState: GameState;
  onOpenStore: () => void;
  onOpenBag: () => void;
  onOpenAchievements: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isMusicOn: boolean;
  toggleMusic: () => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ 
  gameState, 
  onOpenStore, 
  onOpenBag, 
  onOpenAchievements, 
  language, 
  setLanguage,
  isMusicOn,
  toggleMusic
}) => {
  const t = TRANSLATIONS[language];

  const handleLanguageToggle = () => {
      if (language === 'en') setLanguage('es');
      else if (language === 'es') setLanguage('zh');
      else setLanguage('en');
  };
  
  return (
    <div className="w-full bg-[#d2a679] border-8 border-[#5d4037] border-b-0 p-3 flex flex-col md:flex-row items-center justify-between gap-4 select-none shadow-inner relative">
      
      {/* Left: Money & Button */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#ffecb3] text-[#5d4037] px-3 py-1 rounded-lg border-2 border-[#8d6e63] shadow-inner min-w-[100px]">
            <Coins size={20} className="text-[#fbc02d]" />
            <span className="text-lg font-bold tracking-tight">${gameState.money}</span>
        </div>
        <button 
            onClick={onOpenStore}
            className="group relative bg-[#ff8a65] hover:bg-[#ff7043] text-[#3e2723] px-3 py-1 rounded-lg border-2 border-[#bf360c] shadow-[0_4px_0_#bf360c] active:shadow-none active:translate-y-1 transition-all text-xs font-bold uppercase flex items-center gap-2"
        >
            <ShoppingBag size={16} />
            <span>{t.shopBtn}</span>
        </button>
      </div>

      {/* Right: Stats & Language */}
      <div className="flex items-center gap-3 text-xs text-[#4e342e] font-bold">
        {/* Achievements Button */}
        <button 
          onClick={onOpenAchievements}
          className="group relative bg-[#fff176] hover:bg-[#ffee58] text-[#f57f17] px-3 py-2 rounded-lg border-2 border-[#fbc02d] shadow-[0_4px_0_#fbc02d] active:shadow-none active:translate-y-1 transition-all text-xs font-bold uppercase flex items-center gap-2"
        >
           <Trophy size={16} />
           <span className="hidden sm:inline">{t.achievementsBtn}</span>
        </button>

        {/* Bag Button */}
        <button 
          onClick={onOpenBag}
          className="group relative bg-[#81c784] hover:bg-[#66bb6a] text-[#1b5e20] px-3 py-2 rounded-lg border-2 border-[#2e7d32] shadow-[0_4px_0_#2e7d32] active:shadow-none active:translate-y-1 transition-all text-xs font-bold uppercase flex items-center gap-2"
        >
           <Backpack size={16} />
           <span>{t.bagBtn}</span>
        </button>

        {/* Music Toggle */}
        <button 
          onClick={toggleMusic}
          className={`p-2 rounded-lg border-2 active:translate-y-1 transition-all shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none ${
            isMusicOn 
              ? 'bg-[#81c784] border-[#2e7d32] text-[#1b5e20]' 
              : 'bg-[#cfd8dc] border-[#90a4ae] text-[#607d8b]'
          }`}
          title="Music Toggle"
        >
          {isMusicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Language Toggle */}
        <button 
          onClick={handleLanguageToggle}
          className="p-2 rounded-lg border-2 active:translate-y-1 transition-all shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none bg-[#e0e0e0] border-[#bdbdbd] text-[#5d4037] hover:bg-[#d6d6d6]"
          title="Change Language"
        >
           <div className="flex items-center gap-1 min-w-[36px] justify-center">
               <Globe size={16} />
               <span>{language === 'zh' ? 'CN' : language.toUpperCase()}</span>
           </div>
        </button>
      </div>
    </div>
  );
};

export default StatsPanel;
