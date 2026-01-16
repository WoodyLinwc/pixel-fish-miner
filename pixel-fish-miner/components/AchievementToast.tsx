
import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { Achievement } from '../types';
import { TRANSLATIONS } from '../locales/translations';
import { Language } from '../types';

interface AchievementToastProps {
  achievement: Achievement;
  onComplete: () => void;
  language: Language;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onComplete, language }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // Animation duration is 4s
    return () => clearTimeout(timer);
  }, [onComplete]);

  const t = TRANSLATIONS[language];
  const desc = t.achievementDesc[achievement.category].replace('{0}', achievement.threshold.toString());

  return (
    <div className="absolute top-24 right-4 z-50 animate-slide-in-right pointer-events-none">
       {/* 'Awards' button style: Yellow background, orange text, hard shadow */}
       <div className="flex items-center gap-3 bg-[#fff176] border-2 border-[#fbc02d] px-3 py-2 rounded-lg shadow-[0_4px_0_#fbc02d] min-w-[180px] max-w-[250px]">
          <div className="flex items-center justify-center w-8 h-8 bg-[#fff9c4] rounded-full border-2 border-[#fbc02d] text-sm shrink-0">
             {achievement.icon}
          </div>
          <div className="flex flex-col">
             <h4 className="text-[#f57f17] text-[10px] uppercase tracking-wider mb-0.5">Unlocked!</h4>
             <p className="text-[10px] text-[#bf360c] leading-tight uppercase">{desc}</p>
          </div>
       </div>
    </div>
  );
};

export default AchievementToast;
