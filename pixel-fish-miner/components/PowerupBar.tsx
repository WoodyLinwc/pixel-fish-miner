
import React from 'react';
import { POWERUPS } from '../constants';
import { GameState } from '../types';
import { Anchor, Fish, Gem, Grid, CloudLightning, Sun } from 'lucide-react';

interface PowerupBarProps {
  gameState: GameState;
  onActivate: (id: string) => void;
}

const PowerupBar: React.FC<PowerupBarProps> = ({ gameState, onActivate }) => {
  const currentTime = Date.now();

  const getIcon = (id: string) => {
      switch(id) {
          case 'multiClaw': return <Anchor size={24} />;
          case 'superBait': return <Fish size={24} />;
          case 'diamondHook': return <Gem size={24} />;
          case 'superNet': return <Grid size={24} />;
          case 'magicConch': return <CloudLightning size={24} />;
          case 'rainbowBulb': return <Sun size={24} />;
          default: return null;
      }
  };

  const activePowerups = Object.keys(POWERUPS).filter(key => {
     const id = POWERUPS[key].id;
     const count = gameState.inventory[id] || 0;
     const isActive = (gameState.activePowerups[id] || 0) > currentTime;
     return count > 0 || isActive;
  });

  if (activePowerups.length === 0) return null;

  return (
    <div className="absolute bottom-4 right-4 flex gap-2 z-10">
      {activePowerups.map(key => {
         const id = POWERUPS[key].id;
         const count = gameState.inventory[id] || 0;
         const expiration = gameState.activePowerups[id] || 0;
         const isActive = expiration > currentTime;
         const remaining = Math.ceil((expiration - currentTime) / 1000);

         return (
            <button
                key={id}
                onClick={() => !isActive && count > 0 && onActivate(id)}
                disabled={isActive || count === 0}
                className={`
                    relative w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all shadow-md
                    ${isActive 
                        ? 'bg-[#bbdefb] border-[#1565c0] text-[#0d47a1]' 
                        : count > 0 
                            ? 'bg-[#e3f2fd] border-[#2196f3] text-[#1565c0] hover:translate-y-[-2px] hover:shadow-lg active:translate-y-[1px]' 
                            : 'bg-[#cfd8dc] border-[#90a4ae] text-[#b0bec5] cursor-default'
                    }
                `}
            >
                {/* Progress Overlay for Active State */}
                {isActive && (
                    <div className="absolute inset-0 bg-[#2196f3] opacity-20 rounded animate-pulse" />
                )}

                {/* Icon */}
                <div className="relative z-10">
                    {getIcon(id)}
                </div>

                {/* Count Badge (if not active) */}
                {!isActive && count > 0 && (
                    <div className="absolute -top-2 -right-2 bg-[#d32f2f] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-[#b71c1c] shadow-sm font-bold z-20">
                        {count}
                    </div>
                )}

                {/* Active Timer Overlay */}
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xs bg-black/30 rounded text-white backdrop-blur-[1px] z-20">
                        {remaining}s
                    </div>
                )}
            </button>
         );
      })}
    </div>
  );
};

export default PowerupBar;
