import React, { useRef, useEffect } from "react";
import { FISH_TYPES } from "../constants";
import { GameState, Language, FishType, EntityFish } from "../types";
import { TRANSLATIONS } from "../locales/translations";
import { X, ShoppingBag } from "lucide-react";
import { drawEntity } from "../utils/drawing";

interface BagModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  language: Language;
}

const FishIcon: React.FC<{ type: FishType }> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Padding to ensure no cut-off
    const padding = 20;
    const availableWidth = canvas.width - padding;
    const availableHeight = canvas.height - padding;

    // Calculate scale to fit nicely
    const maxDim = Math.max(type.width, type.height);
    const scale = Math.min(
      availableWidth / type.width,
      availableHeight / type.height
    );

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(scale, scale);

    // Disable smoothing for pixel art look
    ctx.imageSmoothingEnabled = false;

    // Construct a dummy entity for the drawing function
    const dummyEntity: EntityFish = {
      x: 0,
      y: 0,
      vx: 0,
      type: type,
      facingRight: true,
    };

    drawEntity(ctx, dummyEntity);
    ctx.restore();
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={100}
      className="w-full h-full object-contain"
    />
  );
};

const BagModal: React.FC<BagModalProps> = ({
  isOpen,
  onClose,
  gameState,
  language,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  // Calculate totals
  let totalFish = 0;
  let totalTrash = 0;

  FISH_TYPES.forEach((fish) => {
    const count = gameState.fishCaught[fish.id] || 0;
    if (fish.isTrash) {
      totalTrash += count;
    } else if (fish.id !== "mystery_bag") {
      totalFish += count;
    }
  });

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-2 md:p-4">
      {/* Wood Frame */}
      <div className="bg-[#e6c288] border-[6px] border-[#8d5524] rounded-lg w-full max-w-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative animate-fade-in p-1 max-h-[75vh] md:max-h-[80vh] flex flex-col">
        {/* Inner Border */}
        <div className="border-2 border-[#c68c53] p-2 md:p-4 rounded h-full bg-[#e6c288] flex flex-col overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-[#d32f2f] text-white hover:bg-[#b71c1c] border-2 border-[#801313] rounded p-1 shadow-md active:translate-y-1 z-10"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl text-[#5d4037] mb-2 text-center uppercase tracking-widest flex items-center justify-center gap-3 drop-shadow-sm font-bold">
            <ShoppingBag size={28} />
            {t.bagTitle}
          </h2>

          {/* Total Stats Summary */}
          <div className="flex justify-center gap-6 mb-4 text-sm font-bold text-[#5d4037]">
            <div className="flex items-center gap-2 bg-[#fff3e0] px-3 py-1 rounded border border-[#ffe0b2]">
              <span>🐟</span>
              <span>{t.totalFish}:</span>
              <span className="text-[#1565c0] text-lg">{totalFish}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#fff3e0] px-3 py-1 rounded border border-[#ffe0b2]">
              <span>👞</span>
              <span>{t.totalTrash}:</span>
              <span className="text-[#bf360c] text-lg">{totalTrash}</span>
            </div>
          </div>

          <div className="overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            {FISH_TYPES.map((fish) => {
              const count = gameState.fishCaught[fish.id] || 0;
              const isUnlocked = gameState.unlockedFish.includes(fish.id);
              const fishName = t.fish[fish.id] || fish.name;

              if (!isUnlocked && count === 0) {
                // Render locked state
                return (
                  <div
                    key={fish.id}
                    className="bg-[#d7ccc8] opacity-50 p-3 rounded border-2 border-[#a1887f] flex items-center gap-4 select-none"
                  >
                    <div className="w-12 h-12 bg-[#bcaaa4] rounded flex items-center justify-center text-[#8d6e63] font-bold text-xl">
                      ?
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#8d6e63]">???</h4>
                      <p className="text-xs text-[#8d6e63]">{t.caught}: 0</p>
                    </div>
                  </div>
                );
              }

              // Render Unlocked State
              return (
                <div
                  key={fish.id}
                  className="bg-[#fff3e0] p-3 rounded border-2 border-[#a1887f] shadow-sm flex items-center gap-4 relative"
                >
                  <div className="w-12 h-12 flex items-center justify-center relative overflow-hidden shrink-0">
                    {/* Actual sprite rendering */}
                    <FishIcon type={fish} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-bold text-sm truncate ${
                        fish.isTrash ? "text-[#795548]" : "text-[#3e2723]"
                      }`}
                    >
                      {fishName}
                    </h4>
                    <div className="flex justify-between items-end mt-1">
                      <span className="text-xs text-[#5d4037] bg-[#ffe0b2] px-2 py-0.5 rounded border border-[#ffcc80] whitespace-nowrap">
                        {t.caught}: <span className="font-bold">{count}</span>
                      </span>
                      <span className="text-xs text-[#388e3c] font-bold ml-2">
                        ${fish.value}
                      </span>
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

export default BagModal;
