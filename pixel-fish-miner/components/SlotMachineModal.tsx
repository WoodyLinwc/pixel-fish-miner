import React, { useState } from "react";
import { Language } from "../types";
import { TRANSLATIONS } from "../locales/translations";
import { X } from "lucide-react";
import { audioManager } from "../utils/audioManager";

interface SlotMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  money: number;
  onBet: (betAmount: number) => void;
  onWin: (winAmount: number) => void;
  language: Language;
}

const SYMBOLS = ["🐟", "🐠", "🦈", "🐡", "🦞", "🦑", "🐙"];

// New win rate: Lose 75%, 3-row 20%, 4-row 4%, 5-row 1%
const PAYOUTS = {
  fifty: 50, // 1% chance - 5 consecutive
  ten: 10, // 4% chance - 4 consecutive
  two: 2, // 20% chance - 3 consecutive
  none: 0, // 75% chance
};

const SlotMachineModal: React.FC<SlotMachineModalProps> = ({
  isOpen,
  onClose,
  money,
  onBet,
  onWin,
  language,
}) => {
  const [reels, setReels] = useState<string[]>(["🐟", "🐟", "🐟", "🐟", "🐟"]);
  const [stoppedReels, setStoppedReels] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [spinning, setSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(50);
  const [message, setMessage] = useState<string>("");
  const [leverPulled, setLeverPulled] = useState(false);

  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleClose = () => {
    if (!spinning) {
      audioManager.playButtonSound();
      onClose();
    }
  };

  // Check for consecutive matching symbols from left to right
  const checkConsecutiveWin = (reelResults: string[]): number => {
    let consecutiveCount = 1;
    const firstSymbol = reelResults[0];

    for (let i = 1; i < reelResults.length; i++) {
      if (reelResults[i] === firstSymbol) {
        consecutiveCount++;
      } else {
        break; // Stop at first non-match
      }
    }

    if (consecutiveCount >= 5) return PAYOUTS.fifty;
    if (consecutiveCount >= 4) return PAYOUTS.ten;
    if (consecutiveCount >= 3) return PAYOUTS.two;
    return PAYOUTS.none;
  };

  const generateResult = (): string[] => {
    const random = Math.random();

    // 1% chance for 50x (5 consecutive matching)
    if (random < 0.01) {
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      return [symbol, symbol, symbol, symbol, symbol];
    }

    // 4% chance for 10x (4 consecutive matching)
    if (random < 0.05) {
      // 0.01 + 0.04 = 0.05
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const different = SYMBOLS.filter((s) => s !== symbol)[
        Math.floor(Math.random() * (SYMBOLS.length - 1))
      ];
      return [symbol, symbol, symbol, symbol, different];
    }

    // 20% chance for 2x (3 consecutive matching)
    if (random < 0.25) {
      // 0.05 + 0.20 = 0.25
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const result = [symbol, symbol, symbol];

      // Add 2 different symbols
      while (result.length < 5) {
        const newSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        result.push(newSymbol);
      }

      return result;
    }

    // 75% chance for no consecutive match (lose)
    const result: string[] = [];
    for (let i = 0; i < 5; i++) {
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      result.push(symbol);
    }

    // Make sure first 3 aren't all the same (to avoid accidental wins)
    if (result[0] === result[1] && result[1] === result[2]) {
      result[2] = SYMBOLS.filter((s) => s !== result[0])[
        Math.floor(Math.random() * (SYMBOLS.length - 1))
      ];
    }

    return result;
  };

  const handleLeverPull = () => {
    if (spinning) return;

    if (money < betAmount) {
      setMessage(t.notEnoughMoney || "Not enough money!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    onBet(betAmount);

    setSpinning(true);
    setMessage("");
    setLeverPulled(true);
    setStoppedReels([false, false, false, false, false]);
    audioManager.playButtonSound();

    setTimeout(() => setLeverPulled(false), 300);

    // Generate final result
    const finalResult = generateResult();

    // Start spinning all reels
    const spinIntervals: NodeJS.Timeout[] = [];
    reels.forEach((_, index) => {
      const interval = setInterval(() => {
        setReels((prev) => {
          const newReels = [...prev];
          newReels[index] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          return newReels;
        });
      }, 100);
      spinIntervals.push(interval);
    });

    // Stop reels one by one with 400ms delay
    const stopReel = (index: number) => {
      setTimeout(
        () => {
          clearInterval(spinIntervals[index]);
          setReels((prev) => {
            const newReels = [...prev];
            newReels[index] = finalResult[index];
            return newReels;
          });
          setStoppedReels((prev) => {
            const newStopped = [...prev];
            newStopped[index] = true;
            return newStopped;
          });

          // After last reel stops, check for win
          if (index === 4) {
            setTimeout(() => {
              const multiplier = checkConsecutiveWin(finalResult);
              const winnings = betAmount * multiplier;

              if (winnings > 0) {
                onWin(winnings);
                audioManager.playPowerupSound();

                if (multiplier === PAYOUTS.fifty) {
                  setMessage(`💎💎 MEGA JACKPOT! +$${winnings} 💎💎`);
                } else if (multiplier === PAYOUTS.ten) {
                  setMessage(`💎 JACKPOT! +$${winnings}`);
                } else {
                  setMessage(`✨ WIN! +$${winnings}`);
                }
              } else {
                audioManager.playCatchNothing();
                setMessage("😔 Try Again!");
              }

              setSpinning(false);
              // Show message for 5 seconds
              setTimeout(() => setMessage(""), 5000);
            }, 500);
          }
        },
        800 + index * 400,
      ); // Each reel stops 400ms after the previous
    };

    // Stop each reel sequentially
    for (let i = 0; i < 5; i++) {
      stopReel(i);
    }
  };

  const betOptions = [25, 50, 100, 250, 500];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-2 md:p-4">
      <div className="bg-[#e6c288] border-[6px] border-[#8d5524] rounded-lg w-full max-w-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative animate-fade-in p-1 max-h-[75vh] md:max-h-[80vh] flex flex-col">
        <div className="border-2 border-[#c68c53] p-2 md:p-4 rounded h-full bg-[#e6c288] flex flex-col overflow-hidden">
          <button
            onClick={handleClose}
            disabled={spinning}
            className={`absolute top-2 right-2 bg-[#d32f2f] text-white hover:bg-[#b71c1c] border-2 border-[#801313] rounded p-1 shadow-md active:translate-y-1 z-10 ${
              spinning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl text-[#5d4037] mb-2 md:mb-4 text-center uppercase tracking-widest drop-shadow-sm font-bold shrink-0">
            🎰 {t.slotMachine || "Slot Machine"}
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 gap-3">
              {/* 5-Reel Slot Machine Display */}
              <div className="bg-[#8d5524] border-4 border-[#5d4037] rounded-lg p-3 md:p-4 shadow-inner">
                <div className="flex items-center justify-between gap-3">
                  {/* Left: 5 Reels */}
                  <div className="flex-1">
                    <div className="flex justify-center gap-1 md:gap-2 mb-3">
                      {reels.map((symbol, index) => (
                        <div
                          key={index}
                          className={`bg-[#fff3e0] border-3 border-[#8d6e63] rounded-lg w-14 h-14 md:w-20 md:h-20 flex items-center justify-center text-2xl md:text-4xl shadow-lg transition-all ${
                            spinning && !stoppedReels[index]
                              ? "animate-pulse"
                              : ""
                          } ${
                            stoppedReels[index] ? "ring-2 ring-[#fbc02d]" : ""
                          }`}
                        >
                          {symbol}
                        </div>
                      ))}
                    </div>

                    {/* Message Display - Fixed Height, longer duration */}
                    <div className="text-center h-8 flex items-center justify-center mb-3">
                      {message && (
                        <div className="bg-[#fff3e0] border-2 border-[#8d6e63] rounded px-3 py-1 inline-block animate-fade-in">
                          <p className="text-xs md:text-sm font-bold text-[#5d4037]">
                            {message}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payout Info */}
                    <div className="bg-[#e6c288] border-2 border-[#c68c53] rounded p-2 text-[10px] md:text-xs">
                      <div className="flex justify-between text-[#5d4037] font-bold mb-1">
                        <span>💎 5 in a row:</span>
                        <span className="text-[#e91e63]">50x Bet</span>
                      </div>
                      <div className="flex justify-between text-[#5d4037] font-bold mb-1">
                        <span>💲 4 in a row:</span>
                        <span className="text-[#9c27b0]">10x Bet</span>
                      </div>
                      <div className="flex justify-between text-[#5d4037] font-bold">
                        <span>🎰 3 in a row:</span>
                        <span className="text-[#f57c00]">2x Bet</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Lever */}
                  <div className="flex flex-col items-center shrink-0">
                    <button
                      onClick={handleLeverPull}
                      disabled={spinning || money < betAmount}
                      className={`w-10 md:w-12 h-28 md:h-32 relative ${
                        spinning || money < betAmount
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:brightness-110"
                      }`}
                    >
                      {/* Lever Handle (Red Ball) */}
                      <div
                        className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#d32f2f] border-2 md:border-3 border-[#801313] shadow-lg transition-transform duration-300 ${
                          leverPulled ? "translate-y-16 md:translate-y-20" : ""
                        }`}
                      ></div>
                      {/* Lever Arm */}
                      <div
                        className={`absolute top-8 md:top-10 left-1/2 -translate-x-1/2 w-2 bg-[#5d4037] shadow-md transition-all duration-300 ${
                          leverPulled ? "h-8 md:h-10" : "h-16 md:h-20"
                        }`}
                      ></div>
                      {/* Base */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 md:w-8 h-4 md:h-5 bg-[#8d5524] border-2 border-[#5d4037] rounded-b"></div>
                    </button>
                    <p className="text-[10px] md:text-xs text-[#5d4037] font-bold mt-1 whitespace-nowrap uppercase">
                      Pull
                    </p>
                  </div>
                </div>
              </div>

              {/* Bet Selection */}
              <div className="bg-[#fff3e0] p-3 rounded border-2 border-[#a1887f] shadow-sm">
                <p className="text-sm font-bold text-[#5d4037] mb-2 text-center">
                  {t.selectBet || "Select Bet"}:
                </p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {betOptions.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        if (!spinning) {
                          setBetAmount(amount);
                          audioManager.playButtonSound();
                        }
                      }}
                      disabled={spinning || money < amount}
                      className={`px-3 py-2 rounded font-bold text-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                        betAmount === amount
                          ? "bg-[#fbc02d] border-[#f57f17] text-[#5d4037]"
                          : money >= amount
                            ? "bg-[#fff3e0] border-[#c68c53] text-[#5d4037] hover:bg-[#ffe0b2]"
                            : "bg-[#cfd8dc] border-[#90a4ae] text-[#90a4ae] cursor-not-allowed"
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Balance */}
              <div className="bg-[#fff3e0] p-3 rounded border-2 border-[#a1887f] shadow-sm">
                <div className="text-center">
                  <p className="text-xs text-[#6d4c41] mb-1">
                    {t.wallet || "Wallet"}
                  </p>
                  <p className="text-2xl font-bold text-[#388e3c]">${money}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachineModal;
