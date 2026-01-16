import React, { useState, useEffect, useCallback, useRef } from "react";
import GameCanvas from "./components/GameCanvas";
import StatsPanel from "./components/StatsPanel";
import StoreModal from "./components/StoreModal";
import BagModal from "./components/BagModal";
import AchievementsModal from "./components/AchievementsModal";
import AchievementToast from "./components/AchievementToast";
import PowerupBar from "./components/PowerupBar";
import {
  GameState,
  FishType,
  Language,
  AchievementCategory,
  WeatherType,
} from "./types";
import {
  INITIAL_GAME_STATE,
  UPGRADES,
  ACHIEVEMENTS,
  FISH_TYPES,
  POWERUPS,
  COSTUMES,
  PETS,
} from "./constants";
import { TRANSLATIONS } from "./locales/translations";
import { Play } from "lucide-react";

const App: React.FC = () => {
  // --- Persistence ---
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem("pixel-fish-miner-save");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: Ensure new fields exist for old saves
        return {
          ...INITIAL_GAME_STATE,
          ...parsed,
          // Ensure levels are valid numbers
          clawSpeedLevel: parsed.clawSpeedLevel || 1,
          clawStrengthLevel: parsed.clawStrengthLevel || 1,
          fishDensityLevel: parsed.fishDensityLevel || 1,
          // If achievements or lifetimeEarnings are missing from save, default them
          achievements: parsed.achievements || [],
          lifetimeEarnings: parsed.lifetimeEarnings || parsed.money || 0,
          inventory: parsed.inventory || {},
          activePowerups: parsed.activePowerups || {},
          purchasedPowerups: parsed.purchasedPowerups || [],
          usedPromoCodes: parsed.usedPromoCodes || [], // Migration for new field
          successfulPromoCodes: parsed.successfulPromoCodes || 0, // Migration for promo achievement
          weather: parsed.weather || WeatherType.CLEAR,
          weatherExpiration: parsed.weatherExpiration,
          currentCombo: parsed.currentCombo || 0,
          maxCombo: parsed.maxCombo || 0,
          unlockedCostumes: parsed.unlockedCostumes || ["default"],
          equippedCostume: parsed.equippedCostume || "default",
          unlockedPets: parsed.unlockedPets || [],
          equippedPet: parsed.equippedPet || null,
        };
      } catch (e) {
        console.error("Failed to parse save data", e);
        return INITIAL_GAME_STATE;
      }
    }
    return INITIAL_GAME_STATE;
  });

  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem("pixel-fish-miner-lang");
    return savedLang === "en" || savedLang === "es" || savedLang === "zh"
      ? savedLang
      : "en";
  });

  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isAutoPaused, setIsAutoPaused] = useState(false);

  // Music State (Placeholder)
  const [isMusicOn, setIsMusicOn] = useState(false);

  // Queue for unlocked achievements to show popup one by one
  const [achievementQueue, setAchievementQueue] = useState<string[]>([]);

  // Ref to track the last time a fish was caught for combo timeout
  const lastComboTimeRef = useRef<number>(Date.now());

  // Track last plane request timestamp to trigger event
  const [lastPlaneRequestTime, setLastPlaneRequestTime] = useState<number>(0);

  // Persist State
  useEffect(() => {
    localStorage.setItem("pixel-fish-miner-save", JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem("pixel-fish-miner-lang", language);
  }, [language]);

  // Handle visibility change (Tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsAutoPaused(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Force re-render periodically to update powerup timers in UI and check weather expiration
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => {
        let needsUpdate = false;
        let nextState = { ...prev };

        // Check Weather Expiration (For Rainbow/Magic Conch)
        if (prev.weatherExpiration && Date.now() > prev.weatherExpiration) {
          nextState.weather = WeatherType.CLEAR;
          nextState.weatherExpiration = undefined;
          needsUpdate = true;
        }

        // Just trigger a re-render if active powerups exist or we have an expiring weather
        if (
          Object.keys(prev.activePowerups).length > 0 ||
          prev.weatherExpiration
        ) {
          needsUpdate = true;
        }

        return needsUpdate ? nextState : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Combo Timeout Logic: Reset combo if > 10s without catch
  useEffect(() => {
    const comboTimer = setInterval(() => {
      setGameState((prev) => {
        if (prev.currentCombo > 0) {
          const timeSinceLastCatch = Date.now() - lastComboTimeRef.current;
          // Don't reset combo if paused
          if (
            !isAutoPaused &&
            !isStoreOpen &&
            !isBagOpen &&
            !isAchievementsOpen &&
            timeSinceLastCatch > 10000
          ) {
            return { ...prev, currentCombo: 0 };
          }
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(comboTimer);
  }, [isAutoPaused, isStoreOpen, isBagOpen, isAchievementsOpen]);

  // Natural Weather Change Logic
  useEffect(() => {
    const weatherTimer = setInterval(() => {
      setGameState((prev) => {
        // If paused or Magic Conch is active or weather has an expiration, do not change naturally
        if (isAutoPaused || isStoreOpen || isBagOpen || isAchievementsOpen)
          return prev;
        if (prev.weatherExpiration) return prev;
        if ((prev.activePowerups["magicConch"] || 0) > Date.now()) return prev;

        // If a special weather is active (but not expired/forced), 30% chance to revert to CLEAR
        if (prev.weather !== WeatherType.CLEAR) {
          if (Math.random() < 0.3) {
            return { ...prev, weather: WeatherType.CLEAR };
          }
        }
        // If CLEAR, 5% chance to change to a random weather (excluding Rainbow)
        else {
          if (Math.random() < 0.05) {
            const r = Math.random();
            let newWeather = WeatherType.RAIN;
            if (r < 0.25) newWeather = WeatherType.RAIN;
            else if (r < 0.5) newWeather = WeatherType.SNOW;
            else if (r < 0.75) newWeather = WeatherType.WIND;
            else newWeather = WeatherType.FOG;

            return { ...prev, weather: newWeather };
          }
        }
        return prev;
      });
    }, 20000); // Check every 20 seconds
    return () => clearInterval(weatherTimer);
  }, [isAutoPaused, isStoreOpen, isBagOpen, isAchievementsOpen]);

  // --- Logic ---

  // Check achievements based on current state (called after updates)
  const checkAchievements = (newState: GameState) => {
    const newUnlockedIds: string[] = [];

    // Calculate current stats
    let totalFish = 0;
    let totalTrash = 0;
    let totalMystery = 0;
    let totalWeatherFish = 0;
    const totalMoney = newState.lifetimeEarnings;
    const maxCombo = newState.maxCombo;
    const totalPromoCodes = newState.successfulPromoCodes || 0;

    FISH_TYPES.forEach((fish) => {
      const count = newState.fishCaught[fish.id] || 0;
      if (fish.id === "mystery_bag") {
        totalMystery += count;
      } else if (fish.isTrash) {
        totalTrash += count;
      } else {
        totalFish += count;
      }

      // Count special weather fish
      if (fish.requiredWeather && fish.requiredWeather.length > 0) {
        totalWeatherFish += count;
      }
    });

    ACHIEVEMENTS.forEach((ach) => {
      if (newState.achievements.includes(ach.id)) return; // Already unlocked

      let achieved = false;
      switch (ach.category) {
        case AchievementCategory.FISH:
          achieved = totalFish >= ach.threshold;
          break;
        case AchievementCategory.TRASH:
          achieved = totalTrash >= ach.threshold;
          break;
        case AchievementCategory.MYSTERY:
          achieved = totalMystery >= ach.threshold;
          break;
        case AchievementCategory.MONEY:
          achieved = totalMoney >= ach.threshold;
          break;
        case AchievementCategory.WEATHER:
          achieved = totalWeatherFish >= ach.threshold;
          break;
        case AchievementCategory.COMBO:
          achieved = maxCombo >= ach.threshold;
          break;
        case AchievementCategory.NARWHAL:
          achieved = (newState.fishCaught["narwhal"] || 0) >= ach.threshold;
          break;
        case AchievementCategory.PROMO:
          achieved = totalPromoCodes >= ach.threshold;
          break;
      }

      if (achieved) {
        newUnlockedIds.push(ach.id);
      }
    });

    if (newUnlockedIds.length > 0) {
      return {
        newState: {
          ...newState,
          achievements: [...newState.achievements, ...newUnlockedIds],
        },
        newUnlockedIds,
      };
    }

    return { newState, newUnlockedIds: [] };
  };

  // --- Actions ---

  const handleFishCaught = useCallback((fish: FishType) => {
    setGameState((prev) => {
      const newCount = (prev.fishCaught[fish.id] || 0) + 1;
      const newMoney = prev.money + fish.value;
      const newLifetimeEarnings = prev.lifetimeEarnings + fish.value;

      const newUnlocked = prev.unlockedFish.includes(fish.id)
        ? prev.unlockedFish
        : [...prev.unlockedFish, fish.id];

      let nextState = {
        ...prev,
        money: newMoney,
        lifetimeEarnings: newLifetimeEarnings,
        fishCaught: {
          ...prev.fishCaught,
          [fish.id]: newCount,
        },
        unlockedFish: newUnlocked,
      };

      // Run achievement check
      const result = checkAchievements(nextState);

      if (result.newUnlockedIds.length > 0) {
        setAchievementQueue((q) => [...q, ...result.newUnlockedIds]);
      }

      return result.newState;
    });
  }, []);

  const handlePassiveIncome = useCallback((amount: number) => {
    setGameState((prev) => ({
      ...prev,
      money: prev.money + amount,
      lifetimeEarnings: prev.lifetimeEarnings + amount,
    }));
  }, []);

  // Called by GameCanvas when claw returns (empty or full)
  const handleRoundComplete = useCallback((caughtSomething: boolean) => {
    if (caughtSomething) {
      lastComboTimeRef.current = Date.now();
    }

    setGameState((prev) => {
      let newCombo = prev.currentCombo;
      let newMaxCombo = prev.maxCombo;

      if (caughtSomething) {
        newCombo += 1;
        if (newCombo > newMaxCombo) {
          newMaxCombo = newCombo;
        }
      } else {
        newCombo = 0;
      }

      let nextState = {
        ...prev,
        currentCombo: newCombo,
        maxCombo: newMaxCombo,
      };

      // Run achievement check
      const result = checkAchievements(nextState);

      if (result.newUnlockedIds.length > 0) {
        setAchievementQueue((q) => [...q, ...result.newUnlockedIds]);
      }

      return result.newState;
    });
  }, []);

  const handleBuyUpgrade = (upgradeId: string) => {
    setGameState((prev) => {
      const upg = UPGRADES[upgradeId];
      let currentLevel = 1;

      if (upgradeId === "clawSpeed") currentLevel = prev.clawSpeedLevel || 1;
      if (upgradeId === "clawStrength")
        currentLevel = prev.clawStrengthLevel || 1;
      if (upgradeId === "fishDensity")
        currentLevel = prev.fishDensityLevel || 1;

      const cost = Math.floor(
        upg.baseCost * Math.pow(upg.costMultiplier, currentLevel - 1)
      );

      if (prev.money >= cost && currentLevel < upg.maxLevel) {
        const newState = { ...prev, money: prev.money - cost };

        if (upgradeId === "clawSpeed") {
          newState.clawSpeedLevel = (prev.clawSpeedLevel || 1) + 1;
        }
        if (upgradeId === "clawStrength") {
          newState.clawStrengthLevel = (prev.clawStrengthLevel || 1) + 1;
        }
        if (upgradeId === "fishDensity") {
          newState.fishDensityLevel = (prev.fishDensityLevel || 1) + 1;
        }
        return newState;
      }
      return prev;
    });
  };

  const handleDowngradeUpgrade = (upgradeId: string) => {
    setGameState((prev) => {
      const upg = UPGRADES[upgradeId];
      let currentLevel = 1;

      if (upgradeId === "clawSpeed") currentLevel = prev.clawSpeedLevel || 1;
      if (upgradeId === "clawStrength")
        currentLevel = prev.clawStrengthLevel || 1;
      if (upgradeId === "fishDensity")
        currentLevel = prev.fishDensityLevel || 1;

      if (currentLevel > 1) {
        // Refund calculation: Cost of previous level (level - 2 for array index/exponent logic)
        // Example: At Lvl 2, you paid Base * Mult^0. Refund that.
        // Exponent is (CurrentLevel - 2)
        const refund = Math.floor(
          upg.baseCost * Math.pow(upg.costMultiplier, currentLevel - 2)
        );

        const newState = { ...prev, money: prev.money + refund };

        if (upgradeId === "clawSpeed") {
          newState.clawSpeedLevel = (prev.clawSpeedLevel || 1) - 1;
        }
        if (upgradeId === "clawStrength") {
          newState.clawStrengthLevel = (prev.clawStrengthLevel || 1) - 1;
        }
        if (upgradeId === "fishDensity") {
          newState.fishDensityLevel = (prev.fishDensityLevel || 1) - 1;
        }
        return newState;
      }
      return prev;
    });
  };

  const handleBuyPowerup = (powerupId: string) => {
    // Find powerup key from id
    const powerupKey = Object.keys(POWERUPS).find(
      (key) => POWERUPS[key].id === powerupId
    );
    if (!powerupKey) return;

    const powerup = POWERUPS[powerupKey];

    setGameState((prev) => {
      const hasBoughtBefore = prev.purchasedPowerups.includes(powerupId);
      const cost = hasBoughtBefore ? powerup.cost : 0; // First purchase is free

      if (prev.money >= cost) {
        return {
          ...prev,
          money: prev.money - cost,
          inventory: {
            ...prev.inventory,
            [powerupId]: (prev.inventory[powerupId] || 0) + 1,
          },
          purchasedPowerups: hasBoughtBefore
            ? prev.purchasedPowerups
            : [...prev.purchasedPowerups, powerupId],
        };
      }
      return prev;
    });
  };

  const handleActivatePowerup = (powerupId: string) => {
    // Find powerup key from id
    const powerupKey = Object.keys(POWERUPS).find(
      (key) => POWERUPS[key].id === powerupId
    );
    if (!powerupKey) return;

    const powerup = POWERUPS[powerupKey];
    const duration = powerup.duration;

    // Special Logic for Magic Conch
    if (powerupId === "magicConch") {
      const weathers = [
        WeatherType.RAIN,
        WeatherType.SNOW,
        WeatherType.WIND,
        WeatherType.FOG,
      ];
      const randomWeather =
        weathers[Math.floor(Math.random() * weathers.length)];

      setGameState((prev) => ({
        ...prev,
        weather: randomWeather,
        weatherExpiration: Date.now() + duration,
      }));
    }

    // Special Logic for Rainbow Bulb
    if (powerupId === "rainbowBulb") {
      setGameState((prev) => ({
        ...prev,
        weather: WeatherType.RAINBOW,
        weatherExpiration: Date.now() + duration,
      }));
    }

    setGameState((prev) => {
      const currentCount = prev.inventory[powerupId] || 0;
      if (currentCount > 0) {
        return {
          ...prev,
          inventory: {
            ...prev.inventory,
            [powerupId]: currentCount - 1,
          },
          activePowerups: {
            ...prev.activePowerups,
            [powerupId]: Date.now() + duration,
          },
        };
      }
      return prev;
    });
  };

  const handleBuyCostume = (costumeId: string) => {
    const costume = COSTUMES.find((c) => c.id === costumeId);
    if (!costume) return;

    setGameState((prev) => {
      if (
        prev.money >= costume.cost &&
        !prev.unlockedCostumes.includes(costumeId)
      ) {
        return {
          ...prev,
          money: prev.money - costume.cost,
          unlockedCostumes: [...prev.unlockedCostumes, costumeId],
          equippedCostume: costumeId, // Auto equip on buy
        };
      }
      return prev;
    });
  };

  const handleEquipCostume = (costumeId: string) => {
    setGameState((prev) => {
      if (prev.unlockedCostumes.includes(costumeId)) {
        return {
          ...prev,
          equippedCostume: costumeId,
        };
      }
      return prev;
    });
  };

  const handleBuyPet = (petId: string) => {
    const pet = PETS.find((p) => p.id === petId);
    if (!pet) return;

    setGameState((prev) => {
      if (prev.money >= pet.cost && !prev.unlockedPets.includes(petId)) {
        return {
          ...prev,
          money: prev.money - pet.cost,
          unlockedPets: [...prev.unlockedPets, petId],
          equippedPet: petId, // Auto equip on buy
        };
      }
      return prev;
    });
  };

  const handleEquipPet = (petId: string) => {
    setGameState((prev) => {
      if (prev.unlockedPets.includes(petId)) {
        // Toggle off if already equipped
        if (prev.equippedPet === petId) {
          return { ...prev, equippedPet: null };
        }
        return { ...prev, equippedPet: petId };
      }
      return prev;
    });
  };

  const handleApplyPromoCode = (
    code: string
  ): { success: boolean; message: string } => {
    const cleanCode = code.trim().toLowerCase();
    const t = TRANSLATIONS[language].promoMessages;

    // Helper function to increment promo counter and check achievements
    const incrementPromoCounter = (
      updateState: (prev: GameState) => GameState
    ) => {
      setGameState((prev) => {
        const updatedState = updateState(prev);
        const stateWithPromo = {
          ...updatedState,
          successfulPromoCodes: (updatedState.successfulPromoCodes || 0) + 1,
        };

        // Check for promo achievements
        const result = checkAchievements(stateWithPromo);
        if (result.newUnlockedIds.length > 0) {
          setAchievementQueue((q) => [...q, ...result.newUnlockedIds]);
        }

        return result.newState;
      });
    };

    // Weather Codes
    if (cleanCode === "rain") {
      incrementPromoCounter((prev) => ({
        ...prev,
        weather: WeatherType.RAIN,
        weatherExpiration: undefined,
      }));
      return { success: true, message: t.weatherRain };
    }
    if (cleanCode === "snow") {
      incrementPromoCounter((prev) => ({
        ...prev,
        weather: WeatherType.SNOW,
        weatherExpiration: undefined,
      }));
      return { success: true, message: t.weatherSnow };
    }
    if (cleanCode === "wind") {
      incrementPromoCounter((prev) => ({
        ...prev,
        weather: WeatherType.WIND,
        weatherExpiration: undefined,
      }));
      return { success: true, message: t.weatherWind };
    }
    if (cleanCode === "fog") {
      incrementPromoCounter((prev) => ({
        ...prev,
        weather: WeatherType.FOG,
        weatherExpiration: undefined,
      }));
      return { success: true, message: t.weatherFog };
    }

    // Rainbow Code - ONE TIME USE
    if (cleanCode === "rainbow") {
      if (
        gameState.usedPromoCodes &&
        gameState.usedPromoCodes.includes("rainbow")
      ) {
        return { success: false, message: t.promoUsed };
      }
      incrementPromoCounter((prev) => ({
        ...prev,
        weather: WeatherType.RAINBOW,
        weatherExpiration: Date.now() + 60000, // 60 Seconds
        usedPromoCodes: [...(prev.usedPromoCodes || []), "rainbow"],
      }));
      return { success: true, message: t.weatherRainbow };
    }

    // Airplane Code
    if (cleanCode === "plane" || cleanCode === "airplane") {
      setLastPlaneRequestTime(Date.now());
      incrementPromoCounter((prev) => prev);
      return { success: true, message: t.planeIncoming };
    }

    if (cleanCode === "normal") {
      incrementPromoCounter((prev) => ({
        ...prev,
        weather: WeatherType.CLEAR,
        weatherExpiration: undefined,
      }));
      return { success: true, message: t.weatherClear };
    }

    // Money Code
    if (cleanCode === "money") {
      incrementPromoCounter((prev) => ({
        ...prev,
        money: prev.money + 500,
      }));
      return { success: true, message: t.moneyAdded };
    }

    // Cheat: Fish Frenzy
    if (cleanCode === "fish") {
      incrementPromoCounter((prev) => ({
        ...prev,
        activePowerups: {
          ...prev.activePowerups,
          fishFrenzy: Date.now() + 20000,
        },
      }));
      return { success: true, message: t.fishFrenzy };
    }

    // Unlock Code: unlock
    if (cleanCode === "unlock") {
      incrementPromoCounter((prev) => {
        // Unlock all fish in bag (set count to 1)
        const newFishCaught = { ...prev.fishCaught };
        const newUnlockedFish = [...prev.unlockedFish];

        FISH_TYPES.forEach((fish) => {
          // Set count to 1 if not present
          if (!newFishCaught[fish.id]) {
            newFishCaught[fish.id] = 1;
          }

          // Add to unlocked list if not present
          if (!newUnlockedFish.includes(fish.id)) {
            newUnlockedFish.push(fish.id);
          }
        });

        return {
          ...prev,
          fishCaught: newFishCaught,
          unlockedFish: newUnlockedFish,
        };
      });
      return { success: true, message: t.unlockAll };
    }

    // Secret Codes
    if (cleanCode === "woody") {
      incrementPromoCounter((prev) => {
        const CHEAT_AMOUNT = 9999999;
        const newMoney = prev.money >= CHEAT_AMOUNT ? 0 : CHEAT_AMOUNT;

        let nextState = {
          ...prev,
          money: newMoney,
        };

        // Unlock Secret Achievement
        const secretId = "secret_woody";
        if (!prev.achievements.includes(secretId)) {
          nextState.achievements = [...prev.achievements, secretId];
          setAchievementQueue((q) => [...q, secretId]);
        }

        return nextState;
      });
      return { success: true, message: t.secretUnlocked };
    }

    return { success: false, message: t.invalidCode };
  };

  const handleAchievementToastComplete = () => {
    setAchievementQueue((prev) => prev.slice(1));
  };

  // Calculate multipliers based on levels
  const clawSpeedMultiplier = 1 + ((gameState.clawSpeedLevel || 1) - 1) * 0.2;
  const clawThrowSpeedMultiplier =
    1 + ((gameState.clawStrengthLevel || 1) - 1) * 0.15;
  const t = TRANSLATIONS[language];

  // Get current achievement to show
  const currentAchievementId = achievementQueue[0];
  const currentAchievement = currentAchievementId
    ? ACHIEVEMENTS.find((a) => a.id === currentAchievementId)
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center font-mono p-2 md:p-4">
      <div className="w-full max-w-[1024px] flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] mt-8 md:mt-0">
        <StatsPanel
          gameState={gameState}
          onOpenStore={() => setIsStoreOpen(true)}
          onOpenBag={() => setIsBagOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          language={language}
          setLanguage={setLanguage}
          isMusicOn={isMusicOn}
          toggleMusic={() => setIsMusicOn((p) => !p)}
        />

        {/* Game Area - Connected to StatsPanel (top) and Footer (bottom) */}
        <div className="relative border-x-8 border-[#5d4037] bg-[#5d4037]">
          <GameCanvas
            onFishCaught={handleFishCaught}
            onRoundComplete={handleRoundComplete}
            onPassiveIncome={handlePassiveIncome}
            clawSpeedMultiplier={clawSpeedMultiplier}
            clawThrowSpeedMultiplier={clawThrowSpeedMultiplier}
            fishDensityLevel={gameState.fishDensityLevel || 1}
            paused={
              isStoreOpen || isBagOpen || isAchievementsOpen || isAutoPaused
            }
            activePowerups={gameState.activePowerups}
            weather={gameState.weather}
            weatherExpiration={gameState.weatherExpiration}
            isMusicOn={isMusicOn}
            currentCombo={gameState.currentCombo}
            equippedCostume={gameState.equippedCostume}
            equippedPet={gameState.equippedPet}
            lastPlaneRequestTime={lastPlaneRequestTime}
          />

          {/* Auto Pause Overlay */}
          {isAutoPaused && (
            <div
              onClick={() => setIsAutoPaused(false)}
              className="absolute inset-0 z-[100] bg-black/70 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer select-none animate-fade-in"
            >
              <div className="bg-[#5d4037] p-8 border-4 border-[#8d6e63] rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] text-center transform hover:scale-105 transition-transform duration-200">
                <h1 className="text-4xl text-[#ffeb3b] mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] tracking-widest">
                  {t.paused}
                </h1>
                <div className="flex items-center justify-center gap-2 text-white animate-pulse">
                  <Play size={20} fill="white" />
                  <span className="text-sm font-bold uppercase">
                    {t.resume}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Powerup Bar Overlay */}
          <PowerupBar
            gameState={gameState}
            onActivate={handleActivatePowerup}
          />

          {/* Store Overlay */}
          <StoreModal
            isOpen={isStoreOpen}
            onClose={() => setIsStoreOpen(false)}
            gameState={gameState}
            onBuy={handleBuyUpgrade}
            onDowngrade={handleDowngradeUpgrade}
            onBuyPowerup={handleBuyPowerup}
            onBuyCostume={handleBuyCostume}
            onEquipCostume={handleEquipCostume}
            onBuyPet={handleBuyPet}
            onEquipPet={handleEquipPet}
            onApplyPromoCode={handleApplyPromoCode}
            language={language}
          />

          {/* Bag Overlay */}
          <BagModal
            isOpen={isBagOpen}
            onClose={() => setIsBagOpen(false)}
            gameState={gameState}
            language={language}
          />

          {/* Achievements Overlay */}
          <AchievementsModal
            isOpen={isAchievementsOpen}
            onClose={() => setIsAchievementsOpen(false)}
            gameState={gameState}
            language={language}
          />

          {/* Achievement Popup Toast */}
          {currentAchievement && (
            <AchievementToast
              key={currentAchievement.id} // Re-mount for animation when ID changes
              achievement={currentAchievement}
              onComplete={handleAchievementToastComplete}
              language={language}
            />
          )}
        </div>

        {/* Integrated Instructions Footer */}
        <div className="bg-[#5d4037] border-x-8 border-b-8 border-[#5d4037] overflow-hidden">
          <div className="bg-[#8d6e63] p-2 text-center text-[10px] text-[#3e2723] font-bold uppercase tracking-wide">
            <p>{t.controls}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
