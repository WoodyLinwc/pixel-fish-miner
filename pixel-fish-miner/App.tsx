import React, { useState, useEffect, useCallback, useRef } from "react";
import GameCanvas from "./components/GameCanvas";
import StatsPanel from "./components/StatsPanel";
import StoreModal from "./components/StoreModal";
import BagModal from "./components/BagModal";
import AchievementsModal from "./components/AchievementsModal";
import SettingsModal from "./components/SettingsModal";
import SlotMachineModal from "./components/SlotMachineModal";
import AchievementToast from "./components/AchievementToast";
import LoadingScreen from "./components/LoadingScreen";
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
import { audioManager } from "./utils/audioManager";
import {
  encryptSaveData,
  decryptSaveData,
  downloadSaveFile,
} from "./utils/encryption";
import { initAds, showBannerAds, showRewardedAd } from "./utils/admob";
import { App as CapApp } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import { Keyboard } from "@capacitor/keyboard";

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
          trashFilterLevel: parsed.trashFilterLevel || 1,
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
          // Migration state
          migrationActive: parsed.migrationActive || false,
          migrationEndTime: parsed.migrationEndTime || 0,
          // BUG FIX: If lastMigrationTime is 0 (fresh game or old save), seed it to
          // Date.now() so the timer condition (lastMigrationTime > 0) is met and
          // migration fires 5 minutes after the game first loads.
          lastMigrationTime:
            parsed.lastMigrationTime > 0
              ? parsed.lastMigrationTime
              : Date.now(),
          migrationPending: parsed.migrationPending || false,
          migrationPendingEndTime: parsed.migrationPendingEndTime || 0,
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
    const validLangs = ["en", "es", "zh", "ja", "ko", "ru", "fr", "ar"];
    return savedLang && validLangs.includes(savedLang)
      ? (savedLang as Language)
      : "en";
  });

  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isSlotMachineOpen, setIsSlotMachineOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isAndroid = !!window.Capacitor;

  const [isMusicOn, setIsMusicOn] = useState(() => {
    const savedMusicPref = localStorage.getItem("pixel-fish-miner-music");
    return savedMusicPref !== null ? savedMusicPref === "true" : true; // Default to true (ON)
  });
  const [isSoundEffectsOn, setIsSoundEffectsOn] = useState(() => {
    const savedSfxPref = localStorage.getItem("pixel-fish-miner-sfx");
    return savedSfxPref !== null ? savedSfxPref === "true" : true; // Default to true (ON)
  });

  // Track if user has interacted with the page (for auto-play)
  const hasInteractedRef = useRef(false);
  const musicStartAttemptedRef = useRef(false);

  // Always holds the latest gameState so Capacitor pause handler can save reliably
  const gameStateRef = useRef(gameState);

  // Persist Music Preferences
  useEffect(() => {
    localStorage.setItem("pixel-fish-miner-music", String(isMusicOn));
  }, [isMusicOn]);

  useEffect(() => {
    localStorage.setItem("pixel-fish-miner-sfx", String(isSoundEffectsOn));
  }, [isSoundEffectsOn]);

  // Queue for unlocked achievements to show popup one by one
  const [achievementQueue, setAchievementQueue] = useState<string[]>([]);

  // Ref to track the last time a fish was caught for combo timeout
  const lastComboTimeRef = useRef<number>(Date.now());

  // Track last plane request timestamp to trigger event
  const [lastPlaneRequestTime, setLastPlaneRequestTime] = useState<number>(0);

  // One-time hour jump for day/night promo codes (not persisted)
  const [jumpToGameHour, setJumpToGameHour] = useState<
    { hour: number; requestedAt: number } | undefined
  >(undefined);

  // Persist State — also keeps gameStateRef in sync for the Capacitor pause handler.
  // The localStorage write is debounced (2s trailing) because gameState changes
  // every catch and every second while powerups are active; a full JSON.stringify
  // + synchronous write on each change is wasteful, especially on mobile.
  // The Capacitor "pause" handler force-saves from gameStateRef immediately,
  // and we flush on unmount, so no progress is lost.
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    gameStateRef.current = gameState;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(
        "pixel-fish-miner-save",
        JSON.stringify(gameStateRef.current),
      );
      saveTimeoutRef.current = null;
    }, 2000);
  }, [gameState]);

  // Flush any pending save on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        localStorage.setItem(
          "pixel-fish-miner-save",
          JSON.stringify(gameStateRef.current),
        );
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("pixel-fish-miner-lang", language);
  }, [language]);

  // Set document direction for RTL languages (Arabic)
  useEffect(() => {
    // Only set lang attribute globally — do NOT set dir="rtl" on root
    // as it flips the entire game layout. RTL is handled per-component.
    document.documentElement.lang = language;
  }, [language]);

  // ===== AUDIO: Sync audio manager with React state =====
  useEffect(() => {
    audioManager.setMusicEnabled(isMusicOn);
  }, [isMusicOn]);

  useEffect(() => {
    audioManager.setSfxEnabled(isSoundEffectsOn);
  }, [isSoundEffectsOn]);

  // Start background music after loading screen finishes + init ads
  useEffect(() => {
    if (!isLoading) {
      audioManager.startMusic();
      initAds().then(() => showBannerAds());
    }
  }, [isLoading]);

  // Handle visibility change (Tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsAutoPaused(true);
        // Force-save on hide — the debounced save may not have fired yet,
        // and on web there is no Capacitor "pause" handler to catch it.
        localStorage.setItem(
          "pixel-fish-miner-save",
          JSON.stringify(gameStateRef.current),
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // ===== APP LIFECYCLE - Pause/Resume Audio =====
  useEffect(() => {
    // Only set up listeners on mobile
    if (!window.Capacitor) return;

    let cancelled = false;
    let pauseListener: any;
    let resumeListener: any;

    const setupAppListeners = async () => {
      // App going to background — pause music and force-save state immediately
      // (React's useEffect save is async and may not fire before Android suspends the app)
      const pl = await CapApp.addListener("pause", () => {
        console.log("App going to background - pausing audio");
        audioManager.pauseMusic();
        localStorage.setItem(
          "pixel-fish-miner-save",
          JSON.stringify(gameStateRef.current),
        );
      });

      // App returning to foreground — ALWAYS call resumeMusic().
      // It resumes the AudioContext (needed for SFX) and only
      // restarts music playback if music is enabled.
      const rl = await CapApp.addListener("resume", () => {
        console.log("App resuming from background - resuming audio");
        audioManager.resumeMusic();
      });

      if (cancelled) {
        pl.remove();
        rl.remove();
      } else {
        pauseListener = pl;
        resumeListener = rl;
      }
    };

    setupAppListeners();

    return () => {
      cancelled = true;
      pauseListener?.remove();
      resumeListener?.remove();
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

  // Migration Timer Logic: Handle migration cooldown and auto-trigger
  useEffect(() => {
    const migrationTimer = setInterval(() => {
      const now = Date.now();
      setGameState((prev) => {
        // 1. Check if active migration should end
        if (prev.migrationActive && now >= prev.migrationEndTime) {
          return {
            ...prev,
            migrationActive: false,
            lastMigrationTime: now, // Reset cooldown
          };
        }

        // 2. Check if the 20-second warning phase should transition to active migration
        if (prev.migrationPending && now >= prev.migrationPendingEndTime) {
          return {
            ...prev,
            migrationPending: false,
            migrationActive: true,
            migrationEndTime: now + 30000, // 30 seconds of migration
          };
        }

        // 3. Check if cooldown is done and we should start the 20-second warning
        const timeSinceLastMigration = now - prev.lastMigrationTime;
        if (
          !prev.migrationActive &&
          !prev.migrationPending &&
          prev.lastMigrationTime > 0 &&
          timeSinceLastMigration >= 300000 // 5 minutes cooldown
        ) {
          return {
            ...prev,
            migrationPending: true,
            migrationPendingEndTime: now + 20000, // 20-second warning
          };
        }

        return prev;
      });
    }, 100);
    return () => clearInterval(migrationTimer);
  }, []);

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

  // Android Native Handlers (Capacitor)
  // One-time native setup (status bar, keyboard) — must not re-run on modal toggles
  useEffect(() => {
    if (!window.Capacitor) return;

    const setupNative = async () => {
      // Hide status bar for fullscreen
      try {
        await StatusBar.hide();
      } catch (error) {
        console.warn("StatusBar hide failed:", error);
      }

      // Prevent keyboard from pushing content
      try {
        await Keyboard.setScroll({ isDisabled: true });
      } catch (error) {
        console.warn("Keyboard setScroll failed:", error);
      }
    };

    setupNative();
  }, []);

  useEffect(() => {
    // Only run on mobile (Capacitor)
    if (!window.Capacitor) return;

    // Guard against the async race: if cleanup runs before addListener
    // resolves, remove the listener as soon as it arrives instead of
    // leaking it (this effect re-runs on every modal toggle).
    let cancelled = false;
    let backButtonListener: any;

    const setupCapacitor = async () => {
      // Handle Android back button
      const listener = await CapApp.addListener("backButton", () => {
        // If any modal is open, close it instead of exiting
        if (isStoreOpen) {
          setIsStoreOpen(false);
        } else if (isBagOpen) {
          setIsBagOpen(false);
        } else if (isSlotMachineOpen) {
          setIsSlotMachineOpen(false);
        } else if (isAchievementsOpen) {
          setIsAchievementsOpen(false);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (isAutoPaused) {
          setIsAutoPaused(false);
        } else {
          // No modals open - show exit confirmation
          const shouldExit = window.confirm("Exit game?");
          if (shouldExit) {
            CapApp.exitApp();
          }
        }
      });

      if (cancelled) {
        // Cleanup already ran while we were awaiting — remove immediately
        listener.remove();
      } else {
        backButtonListener = listener;
      }
    };

    setupCapacitor();

    return () => {
      cancelled = true;
      backButtonListener?.remove();
    };
  }, [
    isStoreOpen,
    isBagOpen,
    isSlotMachineOpen,
    isAchievementsOpen,
    isSettingsOpen,
    isAutoPaused,
  ]);

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
    // Play money sound
    audioManager.playMoneySound();

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
      else if (upgradeId === "clawStrength")
        currentLevel = prev.clawStrengthLevel || 1;
      else if (upgradeId === "fishDensity")
        currentLevel = prev.fishDensityLevel || 1;
      else if (upgradeId === "trashFilter")
        currentLevel = prev.trashFilterLevel || 1;

      if (currentLevel >= upg.maxLevel) {
        console.warn("Already at max level");
        return prev;
      }

      // Calculate cost using formula: baseCost * (costMultiplier ^ (currentLevel - 1))
      const cost = Math.floor(
        upg.baseCost * Math.pow(upg.costMultiplier, currentLevel - 1),
      );

      if (prev.money < cost) {
        console.warn("Not enough money");
        return prev;
      }

      // Play sound
      audioManager.playButtonSound();

      const newMoney = prev.money - cost;
      const newLevel = currentLevel + 1;

      if (upgradeId === "clawSpeed") {
        return { ...prev, money: newMoney, clawSpeedLevel: newLevel };
      } else if (upgradeId === "clawStrength") {
        return { ...prev, money: newMoney, clawStrengthLevel: newLevel };
      } else if (upgradeId === "fishDensity") {
        return { ...prev, money: newMoney, fishDensityLevel: newLevel };
      } else if (upgradeId === "trashFilter") {
        return { ...prev, money: newMoney, trashFilterLevel: newLevel };
      }

      return prev;
    });
  };

  const handleDowngradeUpgrade = (upgradeId: string) => {
    setGameState((prev) => {
      let currentLevel = 1;

      if (upgradeId === "clawSpeed") currentLevel = prev.clawSpeedLevel || 1;
      else if (upgradeId === "clawStrength")
        currentLevel = prev.clawStrengthLevel || 1;
      else if (upgradeId === "fishDensity")
        currentLevel = prev.fishDensityLevel || 1;
      else if (upgradeId === "trashFilter")
        currentLevel = prev.trashFilterLevel || 1;

      if (currentLevel <= 1) {
        console.warn("Already at minimum level");
        return prev;
      }

      const upg = UPGRADES[upgradeId];
      // Calculate the cost that was paid for the current level (to refund 70%)
      const refundCost = Math.floor(
        upg.baseCost * Math.pow(upg.costMultiplier, currentLevel - 2),
      );
      const refund = Math.floor(refundCost * 0.7);

      // Play sound
      audioManager.playButtonSound();

      const newMoney = prev.money + refund;
      const newLevel = currentLevel - 1;

      if (upgradeId === "clawSpeed") {
        return { ...prev, money: newMoney, clawSpeedLevel: newLevel };
      } else if (upgradeId === "clawStrength") {
        return { ...prev, money: newMoney, clawStrengthLevel: newLevel };
      } else if (upgradeId === "fishDensity") {
        return { ...prev, money: newMoney, fishDensityLevel: newLevel };
      } else if (upgradeId === "trashFilter") {
        return { ...prev, money: newMoney, trashFilterLevel: newLevel };
      }

      return prev;
    });
  };

  const handleBuyPowerup = (powerupId: string) => {
    setGameState((prev) => {
      const powerup = POWERUPS[powerupId];

      // Calculate current purchase count for this powerup
      const currentCount = prev.powerupPurchaseCounts?.[powerupId] || 0;

      // Pricing tiers: 1st FREE, then +$250 per purchase, capped at $2000
      const cost = currentCount === 0 ? 0 : Math.min(currentCount * 250, 2000);

      if (prev.money < cost) {
        console.warn("Not enough money for powerup");
        return prev;
      }

      // Add to purchasedPowerups array
      const newPurchased = [...prev.purchasedPowerups, powerupId];

      // Increment purchase count
      const newCounts = {
        ...prev.powerupPurchaseCounts,
        [powerupId]: currentCount + 1,
      };

      // Play sound
      audioManager.playButtonSound();

      return {
        ...prev,
        money: prev.money - cost,
        purchasedPowerups: newPurchased,
        powerupPurchaseCounts: newCounts,
        inventory: {
          ...prev.inventory,
          [powerupId]: (prev.inventory[powerupId] || 0) + 1,
        },
      };
    });
  };

  const handleActivatePowerup = (powerupId: string) => {
    setGameState((prev) => {
      const powerup = POWERUPS[powerupId];

      // Remove from purchased list
      const newPurchased = prev.purchasedPowerups.filter(
        (p) => p !== powerupId,
      );

      // Add to active powerups with expiration time
      const expiresAt = Date.now() + powerup.duration;

      audioManager.playPowerupSound();

      let nextState = {
        ...prev,
        inventory: {
          ...prev.inventory,
          [powerupId]: Math.max(0, (prev.inventory[powerupId] || 0) - 1),
        },
        purchasedPowerups: newPurchased,
        activePowerups: {
          ...prev.activePowerups,
          [powerupId]: expiresAt,
        },
      };

      // Special: Mystery Bag - Add random fish to inventory
      if (powerupId === "mysteryBag") {
        const allNonTrash = FISH_TYPES.filter(
          (f) => !f.isTrash && f.id !== "mystery_bag",
        );
        const randomFish =
          allNonTrash[Math.floor(Math.random() * allNonTrash.length)];

        const newCount = (prev.fishCaught[randomFish.id] || 0) + 1;
        const newMoney = prev.money + randomFish.value;
        const newLifetimeEarnings = prev.lifetimeEarnings + randomFish.value;

        // Add to unlocked if new
        const newUnlocked = prev.unlockedFish.includes(randomFish.id)
          ? prev.unlockedFish
          : [...prev.unlockedFish, randomFish.id];

        nextState = {
          ...nextState,
          money: newMoney,
          lifetimeEarnings: newLifetimeEarnings,
          fishCaught: {
            ...prev.fishCaught,
            [randomFish.id]: newCount,
          },
          unlockedFish: newUnlocked,
        };

        audioManager.playMoneySound();
      }

      // Special: Plane Bait - Trigger plane
      if (powerupId === "planeBait") {
        setLastPlaneRequestTime(Date.now());
      }

      // Special: Magic Conch - Random weather for 60 seconds
      // Rainbow is rare (5%), other weathers equally distributed
      if (powerupId === "magicConch") {
        const r = Math.random();
        let newWeather: WeatherType;
        if (r < 0.05) {
          newWeather = WeatherType.RAINBOW; // 5% chance
        } else if (r < 0.2875) {
          newWeather = WeatherType.RAIN; // 23.75%
        } else if (r < 0.525) {
          newWeather = WeatherType.SNOW; // 23.75%
        } else if (r < 0.7625) {
          newWeather = WeatherType.WIND; // 23.75%
        } else {
          newWeather = WeatherType.FOG; // 23.75%
        }

        nextState = {
          ...nextState,
          weather: newWeather,
          weatherExpiration: Date.now() + 60000, // 60 seconds
        };
      }

      // Run achievement check
      const result = checkAchievements(nextState);

      if (result.newUnlockedIds.length > 0) {
        setAchievementQueue((q) => [...q, ...result.newUnlockedIds]);
      }

      return result.newState;
    });
  };

  const handleSlotBet = (betAmount: number) => {
    setGameState((prev) => {
      const cost = betAmount;
      if (prev.money < cost) {
        console.warn("Not enough money for slot bet");
        return prev;
      }

      audioManager.playButtonSound();

      return {
        ...prev,
        money: prev.money - cost,
      };
    });
  };

  const handleSlotWin = (winAmount: number) => {
    setGameState((prev) => {
      audioManager.playMoneySound();

      return {
        ...prev,
        money: prev.money + winAmount,
        lifetimeEarnings: prev.lifetimeEarnings + winAmount,
      };
    });
  };

  const handleBuyCostume = (costumeId: string) => {
    setGameState((prev) => {
      const costume = COSTUMES.find((c) => c.id === costumeId);
      if (!costume) return prev;

      if (prev.money < costume.cost) {
        console.warn("Not enough money for costume");
        return prev;
      }

      if (prev.unlockedCostumes.includes(costumeId)) {
        console.warn("Costume already unlocked");
        return prev;
      }

      audioManager.playButtonSound();

      return {
        ...prev,
        money: prev.money - costume.cost,
        unlockedCostumes: [...prev.unlockedCostumes, costumeId],
      };
    });
  };

  const handleEquipCostume = (costumeId: string) => {
    setGameState((prev) => {
      if (!prev.unlockedCostumes.includes(costumeId)) {
        console.warn("Costume not unlocked");
        return prev;
      }

      audioManager.playButtonSound();

      return {
        ...prev,
        equippedCostume: costumeId,
      };
    });
  };

  const handleBuyPet = (petId: string) => {
    setGameState((prev) => {
      const pet = PETS.find((p) => p.id === petId);
      if (!pet) return prev;

      if (prev.money < pet.cost) {
        console.warn("Not enough money for pet");
        return prev;
      }

      if (prev.unlockedPets.includes(petId)) {
        console.warn("Pet already unlocked");
        return prev;
      }

      audioManager.playButtonSound();

      return {
        ...prev,
        money: prev.money - pet.cost,
        unlockedPets: [...prev.unlockedPets, petId],
      };
    });
  };

  const handleEquipPet = (petId: string | null) => {
    setGameState((prev) => {
      if (petId && !prev.unlockedPets.includes(petId)) {
        console.warn("Pet not unlocked");
        return prev;
      }

      audioManager.playButtonSound();

      return {
        ...prev,
        equippedPet: petId,
      };
    });
  };

  // Export Save
  const handleExportSave = async () => {
    try {
      const saveData = JSON.stringify(gameState);
      const encrypted = encryptSaveData(saveData);

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `pixel-fish-miner-${timestamp}.fishsave`;

      await downloadSaveFile(encrypted, filename);

      audioManager.playButtonSound();
      return { success: true, message: "Save exported!" };
    } catch (error) {
      console.error("Export error:", error);
      return { success: false, message: "Export failed" };
    }
  };

  // Import Save
  const handleImportSave = async (
    file: File,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const text = await file.text();
      const decrypted = decryptSaveData(text);
      if (!decrypted)
        throw new Error(
          "Invalid save file. Please make sure you're importing a Pixel Fish Miner save.",
        );
      const imported = JSON.parse(decrypted);

      // Merge with INITIAL_GAME_STATE for migration safety
      const merged = {
        ...INITIAL_GAME_STATE,
        ...imported,
      };

      // Validate structure
      if (typeof merged.money !== "number") {
        throw new Error("Invalid save data: money field corrupted");
      }

      // Save to localStorage
      localStorage.setItem("pixel-fish-miner-save", JSON.stringify(merged));

      audioManager.playButtonSound();

      // Reload page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return { success: true, message: "Save imported! Reloading..." };
    } catch (error: any) {
      console.error("Import error:", error);
      return {
        success: false,
        message: error.message || "Import failed - file may be corrupted",
      };
    }
  };

  // Promo Code Handler
  const handleApplyPromoCode = (
    code: string,
  ): { success: boolean; message: string } => {
    const cleanCode = code.trim().toLowerCase();
    const t = TRANSLATIONS[language];

    // One-time codes: check if already used
    const oneTimeCodes = ["rainbow", "unlockall", "woodylin"];
    if (
      oneTimeCodes.includes(cleanCode) &&
      gameState.usedPromoCodes.includes(cleanCode)
    ) {
      return { success: false, message: t.promoMessages.promoUsed };
    }

    // Helper for one-time codes (tracks in usedPromoCodes + increments achievement counter)
    const applyOneTime = (updateFn: (prev: GameState) => GameState) => {
      setGameState((prev) => {
        const nextState = updateFn(prev);
        return {
          ...nextState,
          successfulPromoCodes: (nextState.successfulPromoCodes || 0) + 1,
          usedPromoCodes: [...nextState.usedPromoCodes, cleanCode],
        };
      });
    };

    // Helper for reusable codes (no usedPromoCodes tracking)
    const applyReusable = (updateFn: (prev: GameState) => GameState) => {
      setGameState((prev) => updateFn(prev));
    };

    // --- 💰 Currency & Rewards ---

    if (cleanCode === "money") {
      applyReusable((prev) => ({
        ...prev,
        money: prev.money + 500,
      }));
      return { success: true, message: t.promoMessages.moneyAdded };
    }

    if (cleanCode === "woodylin") {
      applyOneTime((prev) => {
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
      return { success: true, message: t.promoMessages.secretUnlocked };
    }

    // --- 🌦️ Weather Control ---

    if (cleanCode === "rain") {
      applyReusable((prev) => ({
        ...prev,
        weather: WeatherType.RAIN,
        weatherExpiration: undefined, // Lasts until next natural cycle
      }));
      return { success: true, message: t.promoMessages.weatherRain };
    }

    if (cleanCode === "snow") {
      applyReusable((prev) => ({
        ...prev,
        weather: WeatherType.SNOW,
        weatherExpiration: undefined,
      }));
      return { success: true, message: t.promoMessages.weatherSnow };
    }

    if (cleanCode === "wind") {
      applyReusable((prev) => ({
        ...prev,
        weather: WeatherType.WIND,
        weatherExpiration: undefined,
      }));
      return { success: true, message: t.promoMessages.weatherWind };
    }

    if (cleanCode === "fog") {
      applyReusable((prev) => ({
        ...prev,
        weather: WeatherType.FOG,
        weatherExpiration: undefined,
      }));
      return { success: true, message: t.promoMessages.weatherFog };
    }

    if (cleanCode === "rainbow") {
      applyOneTime((prev) => ({
        ...prev,
        weather: WeatherType.RAINBOW,
        weatherExpiration: Date.now() + 30000, // 30 seconds, one-time only
      }));
      return { success: true, message: t.promoMessages.weatherRainbow };
    }

    if (cleanCode === "normal") {
      applyReusable((prev) => ({
        ...prev,
        weather: WeatherType.CLEAR,
        weatherExpiration: undefined,
      }));
      return { success: true, message: t.promoMessages.weatherClear };
    }

    // --- 🐟 Fishing Bonuses ---

    if (cleanCode === "fish") {
      applyReusable((prev) => ({
        ...prev,
        activePowerups: {
          ...prev.activePowerups,
          fishFrenzy: Date.now() + 30000, // 30 seconds
        },
      }));
      return { success: true, message: t.promoMessages.fishFrenzy };
    }

    if (cleanCode === "unlockall") {
      applyOneTime((prev) => {
        const newFishCaught = { ...prev.fishCaught };
        const newUnlockedFish = [...prev.unlockedFish];

        FISH_TYPES.forEach((fish) => {
          if (!newFishCaught[fish.id]) {
            newFishCaught[fish.id] = 1;
          }
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
      return { success: true, message: t.promoMessages.unlockAll };
    }

    // --- ✈️ Special Events ---

    if (cleanCode === "plane" || cleanCode === "airplane") {
      setLastPlaneRequestTime(Date.now());
      return { success: true, message: t.promoMessages.planeIncoming };
    }

    if (cleanCode === "night") {
      setJumpToGameHour({ hour: 19, requestedAt: Date.now() });
      return { success: true, message: t.promoMessages.timeNight };
    }

    if (cleanCode === "day") {
      setJumpToGameHour({ hour: 6, requestedAt: Date.now() });
      return { success: true, message: t.promoMessages.timeDay };
    }

    if (cleanCode === "migration") {
      applyReusable((prev) => ({
        ...prev,
        migrationActive: false,
        migrationPending: true,
        migrationPendingEndTime: Date.now() + 20000, // 20-second warning, then migration starts
        migrationEndTime: 0,
      }));
      return {
        success: true,
        message:
          t.promoMessages.migrationIncoming || "🐟 Migration incoming in 20s",
      };
    }

    // --- ⚠️ Dangerous Codes ---

    if (cleanCode === "reset") {
      const confirmed = window.confirm(
        "⚠️ WARNING: This will DELETE ALL your progress!\n\n" +
          "Your money, fish, achievements, upgrades, costumes, and pets will be PERMANENTLY LOST.\n\n" +
          "This action is IRREVERSIBLE!\n\n" +
          "Are you absolutely sure you want to reset?",
      );

      if (!confirmed) {
        return { success: false, message: "Reset cancelled" };
      }

      localStorage.removeItem("pixel-fish-miner-save");
      setGameState(INITIAL_GAME_STATE);

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      return { success: true, message: "Game reset! Reloading..." };
    }

    return { success: false, message: t.promoMessages.invalidCode };
  };

  const handleAchievementToastComplete = () => {
    setAchievementQueue((prev) => prev.slice(1));
  };

  const handleWatchAd = async (): Promise<void> => {
    const rewarded = await showRewardedAd();
    if (rewarded) {
      // 6 equally-weighted outcomes: $1,500 cash or one of 5 store powerups
      const adRewards = [
        "money",
        "multiClaw",
        "superBait",
        "diamondHook",
        "superNet",
        "magicConch",
      ];
      const picked = adRewards[Math.floor(Math.random() * adRewards.length)];

      if (picked === "money") {
        setGameState((prev) => ({
          ...prev,
          money: prev.money + 1500,
          lifetimeEarnings: prev.lifetimeEarnings + 1500,
        }));
      } else {
        // Add powerup to inventory for free (no cost, no purchase count increment)
        // Works seamlessly with the existing PowerupBar + handleActivatePowerup flow
        setGameState((prev) => ({
          ...prev,
          purchasedPowerups: [...prev.purchasedPowerups, picked],
          inventory: {
            ...prev.inventory,
            [picked]: (prev.inventory[picked] || 0) + 1,
          },
        }));
        audioManager.playPowerupSound();
      }
    }
  };

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Stable references for GameCanvas audio callbacks — inline arrows would
  // get a new identity every App render, defeating GameCanvas's React.memo.
  const handleClawRelease = useCallback(() => {
    audioManager.playClawRelease();
  }, []);
  const handleCatchNothingSound = useCallback(() => {
    audioManager.playCatchNothing();
  }, []);

  // Calculate multipliers based on levels
  const clawSpeedMultiplier = 1 + ((gameState.clawSpeedLevel || 1) - 1) * 0.2;
  const clawThrowSpeedMultiplier =
    1 + ((gameState.clawStrengthLevel || 1) - 1) * 0.1;
  const t = TRANSLATIONS[language];

  // Get current achievement to show
  const currentAchievementId = achievementQueue[0];
  const currentAchievement = currentAchievementId
    ? ACHIEVEMENTS.find((a) => a.id === currentAchievementId)
    : null;

  return (
    <>
      {isLoading ? (
        <LoadingScreen onLoadComplete={handleLoadComplete} />
      ) : (
        <div
          className={`min-h-screen flex flex-col items-center justify-center font-mono p-2 md:p-4 ${isAndroid ? "pt-[50px] pb-[50px]" : ""}`}
        >
          <div className="w-full max-w-[1024px] flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <StatsPanel
              gameState={gameState}
              onOpenStore={() => setIsStoreOpen(true)}
              onOpenBag={() => setIsBagOpen(true)}
              onOpenSlotMachine={() => setIsSlotMachineOpen(true)}
              onOpenAchievements={() => setIsAchievementsOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onWatchAd={handleWatchAd}
              language={language}
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
                trashFilterLevel={gameState.trashFilterLevel || 1}
                paused={
                  isStoreOpen ||
                  isBagOpen ||
                  isSlotMachineOpen ||
                  isAchievementsOpen ||
                  isSettingsOpen ||
                  isAutoPaused
                }
                activePowerups={gameState.activePowerups}
                weather={gameState.weather}
                weatherExpiration={gameState.weatherExpiration}
                isMusicOn={isMusicOn}
                currentCombo={gameState.currentCombo}
                equippedCostume={gameState.equippedCostume}
                equippedPet={gameState.equippedPet}
                unlockedPets={gameState.unlockedPets}
                unlockedFish={gameState.unlockedFish}
                unlockedCostumes={gameState.unlockedCostumes}
                lastPlaneRequestTime={lastPlaneRequestTime}
                forcedGameHour={jumpToGameHour}
                migrationActive={gameState.migrationActive}
                migrationEndTime={gameState.migrationEndTime}
                migrationPending={gameState.migrationPending}
                migrationPendingEndTime={gameState.migrationPendingEndTime}
                onClawRelease={handleClawRelease}
                onCatchNothing={handleCatchNothingSound}
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

              {/* Slot Machine Overlay */}
              <SlotMachineModal
                isOpen={isSlotMachineOpen}
                onClose={() => setIsSlotMachineOpen(false)}
                money={gameState.money}
                onBet={handleSlotBet}
                onWin={handleSlotWin}
                language={language}
              />

              {/* Achievements Overlay */}
              <AchievementsModal
                isOpen={isAchievementsOpen}
                onClose={() => setIsAchievementsOpen(false)}
                gameState={gameState}
                language={language}
              />

              {/* Settings Overlay */}
              <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                language={language}
                onChangeLanguage={setLanguage}
                isMusicOn={isMusicOn}
                onToggleMusic={() => setIsMusicOn((p) => !p)}
                isSoundEffectsOn={isSoundEffectsOn}
                onToggleSoundEffects={() => setIsSoundEffectsOn((p) => !p)}
                onExportSave={handleExportSave}
                onImportSave={handleImportSave}
              />

              {/* Achievement Popup Toast */}
              {currentAchievement && (
                <AchievementToast
                  key={currentAchievement.id}
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
      )}
    </>
  );
};

export default App;
