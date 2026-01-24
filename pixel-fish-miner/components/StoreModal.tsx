import React, { useState } from "react";
import { UPGRADES, POWERUPS, COSTUMES, PETS } from "../constants";
import { GameState, Language } from "../types";
import { TRANSLATIONS } from "../locales/translations";
import {
  ShoppingCart,
  Zap,
  TrendingUp,
  X,
  Anchor,
  Fish,
  Gem,
  Grid,
  Shirt,
  Heart,
  CloudLightning,
  Magnet,
  Minus,
  Sun,
} from "lucide-react";
import { audioManager } from "../utils/audioManager";

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onBuy: (upgradeId: string) => void;
  onDowngrade: (upgradeId: string) => void;
  onBuyPowerup: (powerupId: string) => void;
  onBuyCostume: (costumeId: string) => void;
  onEquipCostume: (costumeId: string) => void;
  onBuyPet: (petId: string) => void;
  onEquipPet: (petId: string) => void;
  onApplyPromoCode: (code: string) => { success: boolean; message: string };
  language: Language;
}

const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onBuy,
  onDowngrade,
  onBuyPowerup,
  onBuyCostume,
  onEquipCostume,
  onBuyPet,
  onEquipPet,
  onApplyPromoCode,
  language,
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  const getCost = (upgradeId: string, currentLevel: number) => {
    const upg = UPGRADES[upgradeId];
    return Math.floor(
      upg.baseCost * Math.pow(upg.costMultiplier, currentLevel - 1),
    );
  };

  const handleClose = () => {
    audioManager.playButtonSound();
    onClose();
  };

  const handlePromoSubmit = () => {
    if (!promoCode.trim()) return;
    audioManager.playButtonSound();
    const result = onApplyPromoCode(promoCode);
    setPromoFeedback(result);

    if (result.success) {
      setPromoCode("");
    }

    // Clear feedback after 3s
    setTimeout(() => {
      setPromoFeedback(null);
    }, 3000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePromoSubmit();
    }
  };

  const handleEquipCostumeClick = (costumeId: string) => {
    audioManager.playButtonSound();
    onEquipCostume(costumeId);
  };

  const handleEquipPetClick = (petId: string) => {
    audioManager.playButtonSound();
    onEquipPet(petId);
  };

  const getCostumeIcon = (id: string) => {
    switch (id) {
      case "pirate":
        return "🏴‍☠️";
      case "captain":
        return "👨🏻‍✈️";
      case "sailor":
        return "🌊";
      case "diver":
        return "🤿";
      case "lifeguard":
        return "🛟";
      case "sushi_master":
        return "🍣";
      case "default":
        return "🎣";
      default:
        return "👕";
    }
  };

  const getPetIcon = (id: string) => {
    switch (id) {
      case "parrot":
        return "🦜";
      case "dog":
        return "🐕";
      case "cat":
        return "🐈";
      case "goldfish":
        return "🐠";
      case "penguin":
        return "🐧";
      case "ghost_crab":
        return "🦀";
      case "pelican":
        return "🦢";
      default:
        return "🐾";
    }
  };

  const getPowerupIcon = (id: string) => {
    switch (id) {
      case "multiClaw":
        return <Anchor size={24} />;
      case "superBait":
        return <Fish size={24} />;
      case "diamondHook":
        return <Gem size={24} />;
      case "superNet":
        return <Grid size={24} />;
      case "magicConch":
        return <CloudLightning size={24} />;
      case "rainbowBulb":
        return <Sun size={24} />;
      default:
        return <Zap size={24} />;
    }
  };

  const POWERUP_THEMES: Record<string, any> = {
    multiClaw: {
      bg: "bg-[#e3f2fd]",
      border: "border-[#90caf9]",
      iconBg: "bg-[#2196f3]",
      iconBorder: "border-[#1565c0]",
      textTitle: "text-[#0d47a1]",
      textDesc: "text-[#1565c0]",
      btnBg: "bg-[#2196f3]",
      btnBorder: "border-[#1565c0]",
      btnHover: "hover:bg-[#1e88e5]",
      btnText: "text-[#e3f2fd]",
    },
    superBait: {
      bg: "bg-[#e0f7fa]",
      border: "border-[#80deea]",
      iconBg: "bg-[#00acc1]",
      iconBorder: "border-[#00838f]",
      textTitle: "text-[#006064]",
      textDesc: "text-[#00838f]",
      btnBg: "bg-[#00acc1]",
      btnBorder: "border-[#00838f]",
      btnHover: "hover:bg-[#0097a7]",
      btnText: "text-[#e0f7fa]",
    },
    diamondHook: {
      bg: "bg-[#f3e5f5]",
      border: "border-[#ce93d8]",
      iconBg: "bg-[#ab47bc]",
      iconBorder: "border-[#7b1fa2]",
      textTitle: "text-[#6a1b9a]",
      textDesc: "text-[#7b1fa2]",
      btnBg: "bg-[#ab47bc]",
      btnBorder: "border-[#7b1fa2]",
      btnHover: "hover:bg-[#9c27b0]",
      btnText: "text-[#f3e5f5]",
    },
    superNet: {
      bg: "bg-[#e8f5e9]",
      border: "border-[#a5d6a7]",
      iconBg: "bg-[#4caf50]",
      iconBorder: "border-[#2e7d32]",
      textTitle: "text-[#2e7d32]",
      textDesc: "text-[#388e3c]",
      btnBg: "bg-[#4caf50]",
      btnBorder: "border-[#2e7d32]",
      btnHover: "hover:bg-[#388e3c]",
      btnText: "text-[#e8f5e9]",
    },
    magicConch: {
      bg: "bg-[#fce4ec]",
      border: "border-[#f48fb1]",
      iconBg: "bg-[#ec407a]",
      iconBorder: "border-[#880e4f]",
      textTitle: "text-[#880e4f]",
      textDesc: "text-[#ad1457]",
      btnBg: "bg-[#ec407a]",
      btnBorder: "border-[#880e4f]",
      btnHover: "hover:bg-[#d81b60]",
      btnText: "text-[#fce4ec]",
    },
    rainbowBulb: {
      bg: "bg-[#fff8e1]",
      border: "border-[#ffecb3]",
      iconBg: "bg-[#ffca28]",
      iconBorder: "border-[#ff6f00]",
      textTitle: "text-[#f57f17]",
      textDesc: "text-[#ff6f00]",
      btnBg: "bg-[#ffca28]",
      btnBorder: "border-[#ff6f00]",
      btnHover: "hover:bg-[#ffb300]",
      btnText: "text-[#3e2723]",
    },
  };

  const powerupKeys = [
    "multiClaw",
    "superBait",
    "diamondHook",
    "superNet",
    "magicConch",
    "rainbowBulb",
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-2 md:p-4">
      {/* Wood Frame */}
      <div className="bg-[#e6c288] border-[6px] border-[#8d5524] rounded-lg w-full max-w-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative animate-fade-in p-1 max-h-[75vh] md:max-h-[90vh] flex flex-col">
        {/* Inner Border */}
        <div className="border-2 border-[#c68c53] p-2 md:p-4 rounded h-full bg-[#e6c288] flex flex-col overflow-hidden">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 bg-[#d32f2f] text-white hover:bg-[#b71c1c] border-2 border-[#801313] rounded p-1 shadow-md active:translate-y-1 z-10"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl text-[#5d4037] mb-4 text-center uppercase tracking-widest flex items-center justify-center gap-3 drop-shadow-sm font-bold shrink-0">
            <ShoppingCart size={28} />
            {t.shopTitle}
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* --- UPGRADES --- */}
              {/* Speed Upgrade */}
              <div className="bg-[#fff3e0] p-3 rounded border-2 border-[#a1887f] shadow-inner relative group">
                <div className="absolute top-2 right-2 text-[#ff9800]">
                  <Zap size={20} />
                </div>
                <h3 className="text-sm text-[#3e2723] font-bold mb-1">
                  {t.upgrades.clawSpeed.name}
                </h3>
                <p className="text-[#6d4c41] text-[10px] mb-2 min-h-[30px] leading-tight">
                  {t.upgrades.clawSpeed.description}
                </p>

                <div className="flex justify-between items-end mt-2">
                  <div className="text-xs font-bold text-[#8d6e63]">
                    {t.lvl} {gameState.clawSpeedLevel}{" "}
                    <span className="text-[#bdbdbd]">/</span>{" "}
                    {UPGRADES.clawSpeed.maxLevel}
                  </div>

                  <div className="flex items-center gap-1">
                    {gameState.clawSpeedLevel > 1 && (
                      <button
                        onClick={() => onDowngrade("clawSpeed")}
                        className="w-6 h-full flex items-center justify-center bg-[#d7ccc8] hover:bg-[#bcaaa4] text-[#5d4037] border-2 border-[#8d6e63] rounded shadow-[0_2px_0_#8d6e63] active:shadow-none active:translate-y-1"
                        title={t.decrease}
                      >
                        <Minus size={12} strokeWidth={4} />
                      </button>
                    )}

                    {gameState.clawSpeedLevel < UPGRADES.clawSpeed.maxLevel ? (
                      <button
                        onClick={() => onBuy("clawSpeed")}
                        disabled={
                          gameState.money <
                          getCost("clawSpeed", gameState.clawSpeedLevel)
                        }
                        className={`px-3 py-1 text-xs font-bold rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center min-w-[80px] ${
                          gameState.money >=
                          getCost("clawSpeed", gameState.clawSpeedLevel)
                            ? "bg-[#66bb6a] border-[#2e7d32] text-white hover:bg-[#4caf50]"
                            : "bg-[#cfd8dc] border-[#90a4ae] text-[#90a4ae] cursor-not-allowed"
                        }`}
                      >
                        <span>{t.increase}</span>
                        <span className="text-[#fffde7] drop-shadow-md">
                          ${getCost("clawSpeed", gameState.clawSpeedLevel)}
                        </span>
                      </button>
                    ) : (
                      <span className="text-[#388e3c] font-bold px-4 py-2 text-xs border-2 border-[#388e3c] rounded bg-[#e8f5e9]">
                        {t.soldOut}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Strength Upgrade */}
              <div className="bg-[#fff3e0] p-3 rounded border-2 border-[#a1887f] shadow-inner relative">
                <div className="absolute top-2 right-2 text-[#ef5350]">
                  <TrendingUp size={20} />
                </div>
                <h3 className="text-sm text-[#3e2723] font-bold mb-1">
                  {t.upgrades.clawStrength.name}
                </h3>
                <p className="text-[#6d4c41] text-[10px] mb-2 min-h-[30px] leading-tight">
                  {t.upgrades.clawStrength.description}
                </p>

                <div className="flex justify-between items-end mt-2">
                  <div className="text-xs font-bold text-[#8d6e63]">
                    {t.lvl} {gameState.clawStrengthLevel}{" "}
                    <span className="text-[#bdbdbd]">/</span>{" "}
                    {UPGRADES.clawStrength.maxLevel}
                  </div>

                  <div className="flex items-center gap-1">
                    {gameState.clawStrengthLevel > 1 && (
                      <button
                        onClick={() => onDowngrade("clawStrength")}
                        className="w-6 h-full flex items-center justify-center bg-[#d7ccc8] hover:bg-[#bcaaa4] text-[#5d4037] border-2 border-[#8d6e63] rounded shadow-[0_2px_0_#8d6e63] active:shadow-none active:translate-y-1"
                        title={t.decrease}
                      >
                        <Minus size={12} strokeWidth={4} />
                      </button>
                    )}

                    {gameState.clawStrengthLevel <
                    UPGRADES.clawStrength.maxLevel ? (
                      <button
                        onClick={() => onBuy("clawStrength")}
                        disabled={
                          gameState.money <
                          getCost("clawStrength", gameState.clawStrengthLevel)
                        }
                        className={`px-3 py-1 text-xs font-bold rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center min-w-[80px] ${
                          gameState.money >=
                          getCost("clawStrength", gameState.clawStrengthLevel)
                            ? "bg-[#66bb6a] border-[#2e7d32] text-white hover:bg-[#4caf50]"
                            : "bg-[#cfd8dc] border-[#90a4ae] text-[#90a4ae] cursor-not-allowed"
                        }`}
                      >
                        <span>{t.increase}</span>
                        <span className="text-[#fffde7] drop-shadow-md">
                          $
                          {getCost("clawStrength", gameState.clawStrengthLevel)}
                        </span>
                      </button>
                    ) : (
                      <span className="text-[#388e3c] font-bold px-4 py-2 text-xs border-2 border-[#388e3c] rounded bg-[#e8f5e9]">
                        {t.soldOut}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fish Density Upgrade */}
              <div className="bg-[#fff3e0] p-3 rounded border-2 border-[#a1887f] shadow-inner relative col-span-1 md:col-span-2">
                <div className="absolute top-2 right-2 text-[#29b6f6]">
                  <Magnet size={20} />
                </div>
                <h3 className="text-sm text-[#3e2723] font-bold mb-1">
                  {t.upgrades.fishDensity.name}
                </h3>
                <p className="text-[#6d4c41] text-[10px] mb-2 min-h-[30px] leading-tight">
                  {t.upgrades.fishDensity.description}
                </p>

                <div className="flex justify-between items-end mt-2">
                  <div className="text-xs font-bold text-[#8d6e63]">
                    {t.lvl} {gameState.fishDensityLevel || 1}{" "}
                    <span className="text-[#bdbdbd]">/</span>{" "}
                    {UPGRADES.fishDensity.maxLevel}
                  </div>

                  <div className="flex items-center gap-1">
                    {(gameState.fishDensityLevel || 1) > 1 && (
                      <button
                        onClick={() => onDowngrade("fishDensity")}
                        className="w-6 h-full flex items-center justify-center bg-[#d7ccc8] hover:bg-[#bcaaa4] text-[#5d4037] border-2 border-[#8d6e63] rounded shadow-[0_2px_0_#8d6e63] active:shadow-none active:translate-y-1"
                        title={t.decrease}
                      >
                        <Minus size={12} strokeWidth={4} />
                      </button>
                    )}

                    {(gameState.fishDensityLevel || 1) <
                    UPGRADES.fishDensity.maxLevel ? (
                      <button
                        onClick={() => onBuy("fishDensity")}
                        disabled={
                          gameState.money <
                          getCost(
                            "fishDensity",
                            gameState.fishDensityLevel || 1,
                          )
                        }
                        className={`px-3 py-1 text-xs font-bold rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center min-w-[80px] ${
                          gameState.money >=
                          getCost(
                            "fishDensity",
                            gameState.fishDensityLevel || 1,
                          )
                            ? "bg-[#66bb6a] border-[#2e7d32] text-white hover:bg-[#4caf50]"
                            : "bg-[#cfd8dc] border-[#90a4ae] text-[#90a4ae] cursor-not-allowed"
                        }`}
                      >
                        <span>{t.increase}</span>
                        <span className="text-[#fffde7] drop-shadow-md">
                          $
                          {getCost(
                            "fishDensity",
                            gameState.fishDensityLevel || 1,
                          )}
                        </span>
                      </button>
                    ) : (
                      <span className="text-[#388e3c] font-bold px-4 py-2 text-xs border-2 border-[#388e3c] rounded bg-[#e8f5e9]">
                        {t.soldOut}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* --- POWERUPS --- */}
              {powerupKeys.map((key) => {
                // Only show Rainbow Jar if unlocked via promo code
                if (
                  key === "rainbowBulb" &&
                  (!gameState.usedPromoCodes ||
                    !gameState.usedPromoCodes.includes("rainbow"))
                ) {
                  return null;
                }

                const style = POWERUP_THEMES[key];
                const powerupConfig = POWERUPS[key];
                const powerupId = POWERUPS[key]?.id;
                if (!powerupId) return null;

                const ownedCount = gameState.inventory[powerupId] || 0;
                const hasBoughtBefore =
                  gameState.purchasedPowerups.includes(powerupId);
                const displayCost = hasBoughtBefore ? POWERUPS[key].cost : 0;
                const isFree = displayCost === 0;

                return (
                  <div
                    key={key}
                    className={`${style.bg} p-3 rounded border-2 ${style.border} shadow-inner relative col-span-1 md:col-span-2 flex items-center gap-4`}
                  >
                    <div
                      className={`${style.iconBg} p-2 rounded-full border-2 ${style.iconBorder} text-white shrink-0`}
                    >
                      {getPowerupIcon(key)}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-sm ${style.textTitle} font-bold mb-1`}
                      >
                        {t.powerups[key].name}
                      </h3>
                      <p
                        className={`${style.textDesc} text-[10px] leading-tight`}
                      >
                        {t.powerups[key].description}
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`text-[10px] font-bold ${style.textDesc} mb-1`}
                      >
                        {t.owned}: {ownedCount}
                      </div>
                      <button
                        onClick={() => onBuyPowerup(powerupId)}
                        disabled={gameState.money < displayCost}
                        className={`px-4 py-2 text-xs font-bold rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center min-w-[80px] ${
                          gameState.money >= displayCost
                            ? `${style.btnBg} ${style.btnBorder} ${style.btnText} ${style.btnHover}`
                            : "bg-[#cfd8dc] border-[#90a4ae] text-[#90a4ae] cursor-not-allowed"
                        }`}
                      >
                        <span>{t.buy}</span>
                        {isFree ? (
                          <span className="text-[#fffde7] drop-shadow-md animate-pulse font-extrabold">
                            FREE!
                          </span>
                        ) : (
                          <span className={`text-[#fffde7] drop-shadow-md`}>
                            ${displayCost}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* --- PETS SECTION --- */}
              <div className="col-span-1 md:col-span-2 mt-4 mb-2 border-t-2 border-[#a1887f] pt-4">
                <h3 className="text-[#5d4037] text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Heart size={18} /> {t.petsTitle}
                </h3>
              </div>

              {PETS.map((pet) => {
                const isUnlocked = gameState.unlockedPets.includes(pet.id);
                const isEquipped = gameState.equippedPet === pet.id;

                return (
                  <div
                    key={pet.id}
                    className="bg-[#fff9c4] p-3 rounded border-2 border-[#fbc02d] shadow-inner relative flex items-center gap-4"
                  >
                    <div
                      className={`w-12 h-12 rounded border-2 flex items-center justify-center text-2xl ${
                        isEquipped
                          ? "bg-[#fff176] border-[#f57f17]"
                          : "bg-[#fff9c4] border-[#fbc02d]"
                      }`}
                    >
                      {getPetIcon(pet.id)}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm text-[#f57f17] font-bold mb-1">
                        {t.pets[pet.id]?.name || pet.name}
                      </h3>
                      <p className="text-[#ef6c00] text-[10px] leading-tight">
                        {t.pets[pet.id]?.description || pet.description}
                      </p>
                    </div>

                    <div>
                      {isUnlocked ? (
                        <button
                          onClick={() => handleEquipPetClick(pet.id)}
                          className={`px-3 py-1 text-xs font-bold rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all min-w-[80px] ${
                            isEquipped
                              ? "bg-[#fbc02d] border-[#f57f17] text-[#3e2723] hover:bg-[#fdd835]" // Toggle off look
                              : "bg-[#ffee58] border-[#fbc02d] text-[#f57f17] hover:bg-[#fff59d]"
                          }`}
                        >
                          {isEquipped ? t.equipped : t.equip}
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyPet(pet.id)}
                          disabled={gameState.money < pet.cost}
                          className={`px-3 py-1 text-xs font-bold rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center min-w-[80px] ${
                            gameState.money >= pet.cost
                              ? "bg-[#66bb6a] border-[#2e7d32] text-white hover:bg-[#4caf50]"
                              : "bg-[#cfd8dc] border-[#90a4ae] text-[#90a4ae] cursor-not-allowed"
                          }`}
                        >
                          <span>{t.buy}</span>
                          <span className="text-[#fffde7] drop-shadow-md">
                            ${pet.cost}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* --- COSTUMES SECTION --- */}
              <div className="col-span-1 md:col-span-2 mt-4 mb-2 border-t-2 border-[#a1887f] pt-4">
                <h3 className="text-[#5d4037] text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-2">
                  <Shirt size={18} /> {t.costumesTitle}
                </h3>
              </div>

              {COSTUMES.map((costume) => {
                const isUnlocked = gameState.unlockedCostumes.includes(
                  costume.id,
                );
                const isEquipped = gameState.equippedCostume === costume.id;

                return (
                  <div
                    key={costume.id}
                    className="bg-[#f3e5f5] p-3 rounded border-2 border-[#ce93d8] shadow-inner relative flex items-center gap-4"
                  >
                    <div
                      className={`w-12 h-12 rounded border-2 flex items-center justify-center text-2xl ${
                        isEquipped
                          ? "bg-[#e1bee7] border-[#8e24aa]"
                          : "bg-[#f3e5f5] border-[#ce93d8]"
                      }`}
                    >
                      {getCostumeIcon(costume.id)}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm text-[#4a148c] font-bold mb-1">
                        {t.costumes[costume.id]?.name || costume.name}
                      </h3>
                      <p className="text-[#6a1b9a] text-[10px] leading-tight">
                        {t.costumes[costume.id]?.description ||
                          costume.description}
                      </p>
                    </div>

                    <div>
                      {isUnlocked ? (
                        <button
                          onClick={() => handleEquipCostumeClick(costume.id)}
                          disabled={isEquipped}
                          className={`px-3 py-1 text-xs font-bold rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all min-w-[80px] ${
                            isEquipped
                              ? "bg-[#8e24aa] border-[#4a148c] text-white cursor-default"
                              : "bg-[#ba68c8] border-[#8e24aa] text-white hover:bg-[#ab47bc]"
                          }`}
                        >
                          {isEquipped ? t.equipped : t.equip}
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyCostume(costume.id)}
                          disabled={gameState.money < costume.cost}
                          className={`px-3 py-1 text-xs font-bold rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center min-w-[80px] ${
                            gameState.money >= costume.cost
                              ? "bg-[#66bb6a] border-[#2e7d32] text-white hover:bg-[#4caf50]"
                              : "bg-[#cfd8dc] border-[#90a4ae] text-[#90a4ae] cursor-not-allowed"
                          }`}
                        >
                          <span>{t.buy}</span>
                          <span className="text-[#fffde7] drop-shadow-md">
                            ${costume.cost}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="text-center text-[#5d4037] text-xs font-bold bg-[#ffe0b2] p-2 rounded border border-[#e0e0e0] w-full">
                {t.wallet}:{" "}
                <span className="text-[#f57f17] text-sm">
                  ${gameState.money}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 w-full">
                {/* Wrapper for the input/button group to allow absolute positioning relative to it */}
                <div className="relative flex items-center justify-center gap-2">
                  {/* Feedback message positioned absolutely to the left */}
                  {promoFeedback && (
                    <span
                      className={`absolute right-full mr-4 whitespace-nowrap text-xs font-bold animate-pulse ${
                        promoFeedback.success
                          ? "text-[#2e7d32]"
                          : "text-[#c62828]"
                      }`}
                    >
                      {promoFeedback.message}
                    </span>
                  )}

                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.promoCode}
                    className="bg-[#fff3e0] border-2 border-[#8d6e63] text-[#5d4037] text-xs p-2 rounded w-40 focus:outline-none focus:border-[#3e2723] placeholder-[#bcaaa4]"
                  />
                  <button
                    onClick={handlePromoSubmit}
                    className="bg-[#ffcc80] hover:bg-[#ffb74d] text-[#3e2723] border-2 border-[#bf360c] text-xs font-bold px-3 py-2 rounded shadow-[0_2px_0_#bf360c] active:shadow-none active:translate-y-1"
                  >
                    {t.apply}
                  </button>
                </div>
                {/* Hint Text */}
                {(!gameState.usedPromoCodes ||
                  !gameState.usedPromoCodes.includes("rainbow")) && (
                  <p className="text-[10px] text-[#8d6e63] mt-1 italic text-center w-full">
                    {t.storeHint}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreModal;
