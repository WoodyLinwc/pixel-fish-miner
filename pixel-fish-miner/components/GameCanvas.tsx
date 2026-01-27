import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  FishType,
  FishRarity,
  WeatherType,
  EntityFish,
  FloatingText,
  Particle,
  ClawState,
  ClawEntity,
} from "../types";
import { FISH_TYPES, GAME_WIDTH, GAME_HEIGHT, SURFACE_Y } from "../constants";
import {
  getEnvironmentColors,
  drawEntity,
  drawClaw,
  drawPet,
  drawAirplane,
  drawSkyGradient,
  drawSun,
  drawMoon,
  drawStars,
  drawClouds,
  drawSeagulls,
  drawBackgroundBoats,
  drawWaterBands,
  drawWaves,
  drawWaterSparkles,
  drawRainbow,
} from "../utils/drawing";
import { drawFishermanCostume } from "../utils/costumes";

interface GameCanvasProps {
  clawSpeedMultiplier: number;
  clawThrowSpeedMultiplier: number;
  fishDensityLevel: number;
  trashFilterLevel: number;
  onFishCaught: (fish: FishType) => void;
  paused: boolean;
  activePowerups: Record<string, number>; // Map of powerup ID to expiration time
  weather: WeatherType;
  weatherExpiration?: number; // End time for weather event
  isMusicOn: boolean;
  currentCombo: number; // For display
  onRoundComplete: (caughtSomething: boolean) => void; // To update combo
  equippedCostume: string; // Current costume ID
  equippedPet: string | null; // Current pet ID
  lastPlaneRequestTime?: number; // Trigger for promo code plane
  onPassiveIncome: (amount: number) => void;
  onClawRelease?: () => void; // Sound callback
  onCatchNothing?: () => void; // Sound callback
}

// --- Day/Night Cycle Constants ---
const DAY_DURATION_SECONDS = 180; // 3 minutes per day
const GAME_HOURS_PER_SECOND = 24 / DAY_DURATION_SECONDS;
const START_HOUR = 6; // Start at 6 AM

// Spawn Rate Weights
const RARITY_WEIGHTS = {
  [FishRarity.COMMON]: 50,
  [FishRarity.UNCOMMON]: 25,
  [FishRarity.RARE]: 10,
  [FishRarity.LEGENDARY]: 4,
};

const GameCanvas: React.FC<GameCanvasProps> = ({
  clawSpeedMultiplier,
  clawThrowSpeedMultiplier,
  fishDensityLevel,
  trashFilterLevel,
  onFishCaught,
  paused,
  activePowerups,
  weather,
  weatherExpiration,
  isMusicOn,
  currentCombo,
  onRoundComplete,
  equippedCostume,
  equippedPet,
  lastPlaneRequestTime,
  onPassiveIncome,
  onClawRelease,
  onCatchNothing,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Game State Refs
  const gameHour = useRef<number>(START_HOUR);
  const starsRef = useRef<
    { x: number; y: number; size: number; blinkOffset: number }[]
  >([]);
  const cloudsRef = useRef<
    { x: number; y: number; w: number; h: number; speed: number }[]
  >([]);
  const seagullsRef = useRef<
    { x: number; y: number; vx: number; flapTimer: number; flapState: number }[]
  >([]);
  const particlesRef = useRef<Particle[]>([]);
  const backgroundBoatsRef = useRef<
    {
      x: number;
      y: number;
      vx: number;
      type: "SMALL" | "BIG";
      color: number;
      scale: number;
    }[]
  >([]);

  // Airplane Ref
  const airplaneRef = useRef<{
    x: number;
    y: number;
    vx: number;
    hasDropped: boolean;
  } | null>(null);
  // Store the request time processed to prevent duplicates
  const processedPlaneRequestRef = useRef<number>(0);

  const clawsRef = useRef<ClawEntity[]>([]);

  // Claw Constants
  const clawMaxLength = useRef<number>(GAME_HEIGHT * 1.1);
  const clawY = useRef<number>(50);

  const fishes = useRef<EntityFish[]>([]);
  const floatingTexts = useRef<FloatingText[]>([]);
  const lastSpawnTime = useRef<number>(0);

  // Trash suppression state
  const trashSuppressionUntil = useRef<number>(0);

  // Narwhal Spawn Timer
  const lastNarwhalSpawnTime = useRef<number>(0);

  // Pet Income Timer
  const lastPetIncomeTime = useRef<number>(Date.now());

  const [isShaking, setIsShaking] = useState(false);

  // Reset Narwhal Spawn Timer when weather changes to Rainbow
  useEffect(() => {
    if (weather === WeatherType.RAINBOW) {
      // Reset to 0 so the first one spawns immediately
      lastNarwhalSpawnTime.current = 0;
    }
  }, [weather]);

  // Initialize Claws
  useEffect(() => {
    // 5 claws: 1 main (0), 2 left (-offsets), 2 right (+offsets)
    // Indexes: 0=Main, 1=Left1, 2=Right1, 3=Left2, 4=Right2
    const offsets = [0, -35, 35, -70, 70];
    const initialClaws: ClawEntity[] = [];

    for (let i = 0; i < 5; i++) {
      initialClaws.push({
        state: ClawState.IDLE,
        angle: 0,
        angleSpeed: 0.03 * (Math.random() > 0.5 ? 1 : -1), // Randomize start direction for organic feel
        length: 60,
        xOffset: offsets[i],
        caughtFish: [],
        numbedUntil: 0,
        debuffType: "NONE",
      });
    }
    clawsRef.current = initialClaws;
  }, []);

  // Init Environment Objects & Static Fish
  useEffect(() => {
    // Stars
    const stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * (SURFACE_Y - 20),
        size: Math.random() > 0.8 ? 2 : 1,
        blinkOffset: Math.random() * 10,
      });
    }
    starsRef.current = stars;

    // Clouds
    const clouds = [];
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * GAME_WIDTH,
        y: 10 + Math.random() * 60,
        w: 50 + Math.random() * 40,
        h: 15 + Math.random() * 10,
        speed: 0.1 + Math.random() * 0.3,
      });
    }
    cloudsRef.current = clouds;

    // Static Bottom Items (Shells & Sea Cucumbers & Coral)
    // Remove any existing static items first to prevent duplication on re-mounts/Strict Mode
    fishes.current = fishes.current.filter(
      (f) =>
        f.type.id !== "shell" &&
        f.type.id !== "sea_cucumber" &&
        f.type.id !== "coral",
    );

    const staticTypes = FISH_TYPES.filter(
      (f) => f.id === "shell" || f.id === "sea_cucumber" || f.id === "coral",
    );
    const placedStaticItems: EntityFish[] = []; // Keep track locally to check collisions during generation

    staticTypes.forEach((type) => {
      // Generate 2 or 3 of each
      const count = Math.random() > 0.5 ? 3 : 2;
      for (let i = 0; i < count; i++) {
        let attempts = 0;
        let placed = false;

        // Try up to 20 times to find a non-overlapping spot
        while (attempts < 20 && !placed) {
          const x = 50 + Math.random() * (GAME_WIDTH - 100);
          const y = GAME_HEIGHT - type.height / 2;

          // Check collision with already placed static items
          let overlap = false;
          for (const other of placedStaticItems) {
            const dist = Math.abs(x - other.x);
            // Calculate minimum distance needed: half width of both + 10px padding
            const minGap = type.width / 2 + other.type.width / 2 + 10;
            if (dist < minGap) {
              overlap = true;
              break;
            }
          }

          if (!overlap) {
            const newFish = {
              x,
              y,
              vx: 0,
              type: type,
              facingRight: Math.random() > 0.5,
            };
            fishes.current.push(newFish);
            placedStaticItems.push(newFish);
            placed = true;
          }
          attempts++;
        }
      }
    });
  }, []);

  // Updated to support custom life duration
  const addFloatingText = (
    text: string,
    color: string,
    x?: number,
    y?: number,
    duration?: number,
  ) => {
    floatingTexts.current.push({
      x: x !== undefined ? x : GAME_WIDTH / 2 + 100,
      y: y !== undefined ? y : SURFACE_Y - 50,
      text: text,
      color: color,
      life: duration || 1.0,
      id: Math.random(),
    });
  };

  // Helper: Weighted Spawn
  const getWeightedFishType = useCallback(
    (isSuperBaitActive: boolean) => {
      // CHEAT: Fish Frenzy - Force spawn special weather fish
      if ((activePowerups["fishFrenzy"] || 0) > Date.now()) {
        const specialFish = FISH_TYPES.filter(
          (f) => f.requiredWeather && f.requiredWeather.length > 0,
        );
        if (specialFish.length > 0) {
          return specialFish[Math.floor(Math.random() * specialFish.length)];
        }
      }

      let availableFish = FISH_TYPES;

      // Filter out trash if Super Bait is active
      if (isSuperBaitActive) {
        availableFish = availableFish.filter((f) => !f.isTrash);
      }

      // Apply Trash Filter reduction based on level
      // Level 1 = 100% trash, Level 20 = 5% trash (95% reduction)
      if (!isSuperBaitActive && trashFilterLevel > 1) {
        const trashReductionPercent = ((trashFilterLevel - 1) / 19) * 0.95; // 0% to 95%
        const randomValue = Math.random();

        // Filter out trash based on reduction percentage
        if (randomValue < trashReductionPercent) {
          availableFish = availableFish.filter((f) => !f.isTrash);
        }
      }

      // Filter out static items from random spawning logic (Shell, Sea Cucumber, Coral)
      availableFish = availableFish.filter(
        (f) => f.id !== "shell" && f.id !== "sea_cucumber" && f.id !== "coral",
      );

      // Filter out supply_box (Event Only)
      availableFish = availableFish.filter((f) => f.id !== "supply_box");

      // Filter by Weather
      availableFish = availableFish.filter((f) => {
        if (!f.requiredWeather) return true;
        // Logic for Narwhal uniqueness:
        // During Rainbow, do NOT allow Narwhal in the random pool.
        // It will be injected specifically by the timer in spawnFish.
        if (f.id === "narwhal") {
          return false;
        }
        return f.requiredWeather.includes(weather);
      });

      // Filter by Time (Night Only)
      // Night is roughly considered 19:00 to 05:00
      const currentHour = gameHour.current;
      const isNight = currentHour >= 19 || currentHour < 5;

      availableFish = availableFish.filter((f) => {
        if (f.isNightOnly && !isNight) return false;
        return true;
      });

      const totalWeight = availableFish.reduce(
        (acc, fish) => acc + (RARITY_WEIGHTS[fish.rarity] || 10),
        0,
      );
      let random = Math.random() * totalWeight;

      for (const fish of availableFish) {
        const weight = RARITY_WEIGHTS[fish.rarity] || 10;
        if (random < weight) {
          return fish;
        }
        random -= weight;
      }
      return availableFish[0];
    },
    [weather, activePowerups, trashFilterLevel],
  );

  // Helper: Spawn a fish
  const spawnFish = useCallback(
    (isSuperBaitActive: boolean) => {
      let type = getWeightedFishType(isSuperBaitActive);
      const now = Date.now();

      // --- FORCE NARWHAL LOGIC (10s Interval) ---
      // If it's Rainbow weather, check if 10s have passed since last Narwhal.
      if (weather === WeatherType.RAINBOW) {
        if (now - lastNarwhalSpawnTime.current >= 10000) {
          const narwhalType = FISH_TYPES.find((f) => f.id === "narwhal");
          if (narwhalType) {
            type = narwhalType;
            lastNarwhalSpawnTime.current = now; // Reset timer
          }
        }
      }

      const fishOnly = FISH_TYPES.filter(
        (f) =>
          !f.isTrash &&
          (!f.requiredWeather || f.requiredWeather.includes(weather)) &&
          f.id !== "shell" &&
          f.id !== "sea_cucumber" &&
          f.id !== "coral" &&
          f.id !== "narwhal" &&
          f.id !== "supply_box",
      );

      // If trash is suppressed via Mystery Bag and we picked trash, force pick a standard fish
      if (
        (Date.now() < trashSuppressionUntil.current || isSuperBaitActive) &&
        type.isTrash
      ) {
        if (fishOnly.length > 0) {
          type = fishOnly[Math.floor(Math.random() * fishOnly.length)];
        }
      }

      // Cap the number of trash items on screen.
      const currentTrashCount = fishes.current.filter(
        (f) => f.type.isTrash,
      ).length;
      // Increased trash cap from 12 to 25 to allow more trash
      if (type.isTrash && currentTrashCount >= 25) {
        if (fishOnly.length > 0) {
          type = fishOnly[Math.floor(Math.random() * fishOnly.length)];
        }
      }

      const startLeft = Math.random() < 0.5;

      let y =
        type.minDepth * GAME_HEIGHT +
        Math.random() * (type.maxDepth - type.minDepth) * GAME_HEIGHT;
      const safeTop = SURFACE_Y + 30;
      const safeBottom = GAME_HEIGHT - 30;

      // Ensure it spawns within game bounds regardless of config
      if (y < safeTop) y = safeTop;
      if (y > safeBottom) y = safeBottom;

      // Standard moving spawn (off-screen)
      fishes.current.push({
        x: startLeft ? -type.width : GAME_WIDTH + type.width,
        y: y,
        vx: startLeft ? type.speed : -type.speed,
        type: type,
        facingRight: startLeft,
      });
    },
    [getWeightedFishType, weather],
  );

  // Triggered when Mystery Bag is caught
  const triggerMysteryBag = useCallback(() => {
    const isMoneyPrize = Math.random() > 0.5;

    if (isMoneyPrize) {
      // Give Money
      const bonusValue = 100 + Math.floor(Math.random() * 201); // 100 - 300
      return bonusValue;
    } else {
      // Disappear all trash for 20 seconds
      trashSuppressionUntil.current = Date.now() + 20000;
      // Remove existing trash
      fishes.current = fishes.current.filter((f) => !f.type.isTrash);
      return 0; // No immediate cash value, but utility value
    }
  }, []);

  const update = useCallback(
    (time: number, dt: number) => {
      if (paused) return;

      const isMultiClawActive = (activePowerups["multiClaw"] || 0) > Date.now();
      const isSuperBaitActive = (activePowerups["superBait"] || 0) > Date.now();
      const isDiamondHookActive =
        (activePowerups["diamondHook"] || 0) > Date.now();
      const isFishFrenzyActive =
        (activePowerups["fishFrenzy"] || 0) > Date.now();
      const isSuperNetActive = (activePowerups["superNet"] || 0) > Date.now();

      const now = Date.now();

      // --- Pet Passive Income Logic ---
      if (equippedPet) {
        // Every 30 seconds
        if (now - lastPetIncomeTime.current > 30000) {
          let amount = 0;
          if (["goldfish", "parrot", "penguin"].includes(equippedPet)) {
            amount = 1;
          } else if (["ghost_crab", "cat"].includes(equippedPet)) {
            amount = 2;
          } else if (["pelican", "dog"].includes(equippedPet)) {
            amount = 3;
          }

          if (amount > 0) {
            onPassiveIncome(amount);
            addFloatingText(
              `+$${amount}`,
              "#ffd700",
              GAME_WIDTH / 2 - 40,
              SURFACE_Y - 50,
            );
          }
          lastPetIncomeTime.current = now;
        }
      } else {
        // Keep timer updated so it starts counting fresh when pet is equipped
        lastPetIncomeTime.current = now;
      }

      // --- Update Time ---
      const deltaHours = (dt / 1000) * GAME_HOURS_PER_SECOND;
      gameHour.current = (gameHour.current + deltaHours) % 24;

      // --- Update Airplane Logic ---
      // Check if supply box exists
      const hasSupplyBox = fishes.current.some(
        (f) => f.type.id === "supply_box",
      );

      // Trigger via Promo Code
      // (Promo code can override the supply box check if requested, but logic here respects the one-box rule for safety if desired.
      // However, usually cheats are cheats. I'll let promo codes work regardless, but random generation will block.)
      if (
        lastPlaneRequestTime &&
        lastPlaneRequestTime > processedPlaneRequestRef.current &&
        !airplaneRef.current
      ) {
        const startLeft = Math.random() > 0.5;
        airplaneRef.current = {
          x: startLeft ? -100 : GAME_WIDTH + 100,
          y: 30 + Math.random() * 30, // High in sky
          vx: startLeft ? 2.5 : -2.5, // Reasonably fast
          hasDropped: false,
        };
        processedPlaneRequestRef.current = lastPlaneRequestTime;
      }

      // Random Rare Occurrence (0.01% chance per frame)
      // Only if no supply box exists
      if (!airplaneRef.current && !hasSupplyBox && Math.random() < 0.0001) {
        const startLeft = Math.random() > 0.5;
        airplaneRef.current = {
          x: startLeft ? -100 : GAME_WIDTH + 100,
          y: 30 + Math.random() * 30,
          vx: startLeft ? 2.5 : -2.5,
          hasDropped: false,
        };
      }

      // Update Airplane
      if (airplaneRef.current) {
        const p = airplaneRef.current;
        p.x += p.vx;

        // Logic to drop box (When near center, with some randomness)
        const centerX = GAME_WIDTH / 2;
        const dropZone = 100; // Drop within 100px of center

        if (
          !p.hasDropped &&
          Math.abs(p.x - centerX) < dropZone &&
          Math.random() < 0.1
        ) {
          // SPAWN SUPPLY BOX
          const supplyBoxType = FISH_TYPES.find((f) => f.id === "supply_box");
          if (supplyBoxType) {
            fishes.current.push({
              x: p.x,
              y: p.y + 20, // Start just below plane
              vx: 0, // Falls straight down mostly
              vy: 0.8, // Slow fall (Parachute speed)
              type: supplyBoxType,
              facingRight: true,
            });
            p.hasDropped = true;
          }
        }

        // Despawn plane
        if (p.x < -200 || p.x > GAME_WIDTH + 200) {
          airplaneRef.current = null;
        }
      }

      // --- Update Background Boats ---
      // Spawn randomly - Reduced occurrence from 0.001 to 0.0005
      if (Math.random() < 0.0005) {
        const isBig = Math.random() > 0.7; // 30% chance for big ship
        const startLeft = Math.random() > 0.5;
        // Move significantly slower to simulate distance parallax
        const speed = (isBig ? 0.15 : 0.3) * (Math.random() * 0.5 + 0.5);

        // Randomize size (scale) to add variety
        // NEW: Increased minimum and maximum size
        const sizeMult = 1.0 + Math.random() * 0.5; // 1.0x to 1.5x variation (was 0.8x to 1.2x)
        const finalScale = 0.75 * sizeMult; // Base scale 0.75 (was 0.6)

        backgroundBoatsRef.current.push({
          x: startLeft ? -150 : GAME_WIDTH + 150,
          y: SURFACE_Y - 5, // Sit slightly above horizon
          vx: startLeft ? speed : -speed,
          type: isBig ? "BIG" : "SMALL",
          color: Math.random(), // For random variation if needed
          scale: finalScale,
        });
      }

      // Update Boat Positions
      backgroundBoatsRef.current.forEach((b) => {
        b.x += b.vx;
      });
      // Remove off-screen boats
      backgroundBoatsRef.current = backgroundBoatsRef.current.filter(
        (b) => b.x > -200 && b.x < GAME_WIDTH + 200,
      );

      // --- Update Seagulls ---
      // Spawn (Daytime only: 5am to 8pm)
      if (gameHour.current > 5 && gameHour.current < 20) {
        if (Math.random() < 0.003 && seagullsRef.current.length < 5) {
          // 0.3% chance per frame
          const startLeft = Math.random() > 0.5;
          seagullsRef.current.push({
            x: startLeft ? -30 : GAME_WIDTH + 30,
            y: 10 + Math.random() * (SURFACE_Y - 60), // Keep them high enough
            vx: startLeft
              ? 0.5 + Math.random() * 0.5
              : -(0.5 + Math.random() * 0.5),
            flapTimer: Math.random() * 10,
            flapState: 0,
          });
        }
      }

      seagullsRef.current.forEach((s) => {
        s.x += s.vx;
        s.y += Math.sin(time * 0.003 + s.x * 0.05) * 0.2; // Gentle bobbing
        s.flapTimer++;
        if (s.flapTimer > 8) {
          // Flap speed
          s.flapState = (s.flapState + 1) % 4;
          s.flapTimer = 0;
        }
      });

      // Despawn
      seagullsRef.current = seagullsRef.current.filter(
        (s) => s.x > -50 && s.x < GAME_WIDTH + 50,
      );

      // --- Weather Particles ---
      // Spawn new particles
      if (weather === WeatherType.RAIN) {
        if (
          particlesRef.current.filter((p) => p.type === "RAIN").length < 100
        ) {
          // Spawn multiple drops
          for (let i = 0; i < 3; i++) {
            particlesRef.current.push({
              x: Math.random() * GAME_WIDTH,
              y: -10,
              vx: -2 + Math.random(),
              vy: 10 + Math.random() * 5,
              size: 2 + Math.random() * 2,
              color: "rgba(179, 229, 252, 0.6)",
              type: "RAIN",
            });
          }
        }
      } else if (weather === WeatherType.SNOW) {
        if (particlesRef.current.filter((p) => p.type === "SNOW").length < 80) {
          if (Math.random() < 0.2) {
            particlesRef.current.push({
              x: Math.random() * GAME_WIDTH,
              y: -10,
              vx: -1 + Math.random() * 2,
              vy: 1 + Math.random() * 2,
              size: 2 + Math.random() * 2,
              color: "white",
              type: "SNOW",
              wobble: Math.random() * 10,
            });
          }
        }
      } else if (weather === WeatherType.WIND) {
        if (particlesRef.current.filter((p) => p.type === "LEAF").length < 40) {
          if (Math.random() < 0.1) {
            // Wind lines / leaves
            const isLeaf = Math.random() > 0.5;
            particlesRef.current.push({
              x: -20,
              y: Math.random() * (SURFACE_Y + 50),
              vx: 5 + Math.random() * 10,
              vy: Math.random() - 0.5,
              size: isLeaf ? 4 : 2,
              color: isLeaf ? "#a1887f" : "rgba(255,255,255,0.3)",
              type: "LEAF",
            });
          }
        }
      } else if (weather === WeatherType.FOG) {
        // Mist particles: Slow horizontal drift, semi-transparent
        if (particlesRef.current.filter((p) => p.type === "MIST").length < 30) {
          if (Math.random() < 0.05) {
            const startLeft = Math.random() > 0.5;
            particlesRef.current.push({
              x: startLeft ? -100 : GAME_WIDTH + 100,
              y:
                Math.random() * SURFACE_Y +
                Math.random() * (GAME_HEIGHT - SURFACE_Y) * 0.5, // Mostly upper half
              vx: startLeft
                ? 0.2 + Math.random() * 0.3
                : -0.2 - Math.random() * 0.3,
              vy: 0,
              size: 40 + Math.random() * 60, // Large blobs
              color: "rgba(255, 255, 255, 0.15)", // Very faint
              type: "MIST",
            });
          }
        }
      } else if (weather === WeatherType.RAINBOW) {
        // Rainbow Sparkles
        if (
          particlesRef.current.filter((p) => p.type === "RAINBOW_SPARKLE")
            .length < 60
        ) {
          if (Math.random() < 0.1) {
            const colors = [
              "#f44336",
              "#ffeb3b",
              "#4caf50",
              "#2196f3",
              "#9c27b0",
            ];
            particlesRef.current.push({
              x: Math.random() * GAME_WIDTH,
              y: -10,
              vx: (Math.random() - 0.5) * 1,
              vy: 1 + Math.random() * 2,
              size: 3,
              color: colors[Math.floor(Math.random() * colors.length)],
              type: "RAINBOW_SPARKLE",
            });
          }
        }
      }

      // --- Narwhal Aura & Sea Turtle Bubbles (Special Effects) ---
      fishes.current.forEach((f) => {
        // Narwhal Aura: Continuous sparkles
        if (f.type.id === "narwhal") {
          if (Math.random() < 0.3) {
            // 30% chance per frame for trail
            const colors = ["#ffeb3b", "#fce4ec", "#e1f5fe", "#fff"];
            particlesRef.current.push({
              x: f.x + (Math.random() - 0.5) * f.type.width,
              y: f.y + (Math.random() - 0.5) * f.type.height,
              vx: (Math.random() - 0.5) * 0.5,
              vy: -0.5 - Math.random(),
              size: 2 + Math.random() * 3,
              color: colors[Math.floor(Math.random() * colors.length)],
              type: "RAINBOW_SPARKLE",
              life: 1.0, // Fade out
            });
          }
        }

        // Reduced frequency from 0.1 to 0.02
        if (f.type.id === "sea_turtle" && Math.random() < 0.02) {
          // Emit bubble
          particlesRef.current.push({
            x: f.x + (f.facingRight ? 10 : -10),
            y: f.y - 15,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -1 - Math.random(),
            size: 3 + Math.floor(Math.random() * 3), // Integer sizes for pixels
            color: "rgba(255, 255, 255, 0.6)",
            type: "BUBBLE",
            life: 1.0,
          });
        }
      });

      // --- Music Notes (Idle Whistling) ---
      // Random chance to whistle regardless of music setting to provide visual flair
      // 0.5% chance per frame (~once every 3.3 seconds on avg, bursty)
      if (Math.random() < 0.005) {
        const boatY = SURFACE_Y - 25;
        const manX = GAME_WIDTH / 2 + 40;
        const manY = boatY;

        // Spawn closer to mouth height (approx -50 from manY)
        const mouthY = manY - 55;
        const mouthX = manX + 10;

        const colors = ["#f48fb1", "#81d4fa", "#ce93d8", "#ffcc80", "#e6ee9c"];
        particlesRef.current.push({
          x: mouthX,
          y: mouthY,
          vx: 0.2 + Math.random() * 0.2, // Drift right SLOWLY
          vy: -0.3 - Math.random() * 0.3, // Float up SLOWLY
          size: 14, // Font size
          color: colors[Math.floor(Math.random() * colors.length)],
          type: "MUSIC",
          text: Math.random() > 0.5 ? "♪" : "♫",
          wobble: Math.random() * 100,
        });
      }

      // Update particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.type === "SNOW" && p.wobble !== undefined) {
          p.x += Math.sin(time * 0.005 + p.wobble) * 0.5;
        }
        if (p.type === "MUSIC" && p.wobble !== undefined) {
          // Swaying motion
          p.x += Math.sin(time * 0.005 + p.wobble) * 0.3;
        }
        if (
          p.type === "BUBBLE" ||
          (p.type === "RAINBOW_SPARKLE" && p.life !== undefined)
        ) {
          p.life = (p.life || 1) - 0.02;
          if (p.type === "BUBBLE") {
            p.x += Math.sin(time * 0.01 + p.y * 0.1) * 0.5; // Bubble wobble
            // Snap to pixel grid movement roughly
            p.x = Math.round(p.x);
            p.y = Math.round(p.y);
          }
        }
      });

      // Clean up particles
      particlesRef.current = particlesRef.current.filter((p) => {
        // Music notes die when high up
        if (p.type === "MUSIC") return p.y > 0 && p.y < GAME_HEIGHT;
        if (
          p.type === "BUBBLE" ||
          (p.type === "RAINBOW_SPARKLE" && p.life !== undefined)
        )
          return (p.life || 0) > 0;
        if (p.type === "MIST") return p.x > -200 && p.x < GAME_WIDTH + 200;
        return p.y < GAME_HEIGHT + 10 && p.x > -50 && p.x < GAME_WIDTH + 50;
      });

      // --- Update Clouds ---
      const windSpeedMultiplier = weather === WeatherType.WIND ? 5 : 1;
      cloudsRef.current.forEach((cloud) => {
        cloud.x += cloud.speed * windSpeedMultiplier;
        if (cloud.x > GAME_WIDTH) {
          cloud.x = -cloud.w;
          cloud.y = 10 + Math.random() * 60; // reset height variation
        }
      });

      // --- Update Floating Texts ---
      floatingTexts.current.forEach((t) => {
        t.y -= 1.0; // Float up
        t.life -= 0.015; // Decay
      });
      floatingTexts.current = floatingTexts.current.filter((t) => t.life > 0);

      // --- Update Fishes ---
      // Calculate max fish based on density level
      const baseMaxFish = 60;
      const extraFishPerLevel = 8;
      const totalMaxFish =
        baseMaxFish + (fishDensityLevel - 1) * extraFishPerLevel;

      // Spawn rate also increases with level (decreases interval)
      // Base 500ms, -30ms per level
      const baseSpawnInterval = 500;
      const intervalReductionPerLevel = 30;
      let currentSpawnInterval =
        baseSpawnInterval - (fishDensityLevel - 1) * intervalReductionPerLevel;
      if (currentSpawnInterval < 150) currentSpawnInterval = 150; // Cap speed

      // Spawn faster if Super Bait OR Fish Frenzy is active
      const spawnInterval =
        isSuperBaitActive || isFishFrenzyActive ? 150 : currentSpawnInterval;
      const maxFish =
        isSuperBaitActive || isFishFrenzyActive
          ? Math.max(100, totalMaxFish + 20)
          : totalMaxFish;

      if (time - lastSpawnTime.current > spawnInterval) {
        if (fishes.current.length < maxFish) {
          spawnFish(isSuperBaitActive);
        }
        lastSpawnTime.current = time;
      }

      fishes.current.forEach((f) => {
        f.x += f.vx;

        // Vertical movement (for sinking items like supply_box)
        if (f.vy) {
          f.y += f.vy;
          // Water entry physics
          if (f.y > SURFACE_Y) {
            // If it was a parachute drop (slow vy), maintain a reasonable sink speed
            // Don't let it drift too fast or too slow.
            if (f.vy < 0.5) f.vy = 0.5; // Min sink speed
            if (f.vy > 2.0) f.vy *= 0.95; // Dampen fast entries

            // Splash effect on entry (Only once)
            // We detect entry by checking if it was just above surface previously.
            // Since we don't store prev Y, we check a small range.
            if (f.y < SURFACE_Y + 5 && Math.random() < 0.5) {
              particlesRef.current.push({
                x: f.x,
                y: SURFACE_Y,
                vx: (Math.random() - 0.5) * 2,
                vy: -2 - Math.random() * 2,
                size: 2,
                color: "white",
                type: "RAIN", // Reusing rain logic for splash
              });
            }
          }
          // Stop at bottom
          // Since y represents the center, we stop when y + height/2 hits the bottom
          const bottomLimit = GAME_HEIGHT - f.type.height / 2;
          if (f.y > bottomLimit) {
            f.vy = 0;
            f.y = bottomLimit;
          }
        }

        // Sea Turtle Special Movement (Seagull-like bobbing)
        if (f.type.id === "sea_turtle") {
          // Bob vertically while moving horizontally
          // Uses the same math as seagulls but slightly scaled
          f.y += Math.sin(time * 0.003 + f.x * 0.05) * 0.5;
        }
      });

      // Filter moving fish that go offscreen. Keep stationary fish (vx === 0)
      fishes.current = fishes.current.filter((f) => {
        if (f.type.speed === 0) return true; // Keep stationary fish
        // Check if Narwhal left screen - if so, allow respawn? No, sticking to "one per event"
        // But if we wanted to retry, we'd reset hasSpawnedNarwhal here.
        // For now, if you miss it, you miss it for this rainbow.
        return f.x > -200 && f.x < GAME_WIDTH + 200;
      });

      // --- Update Claws ---
      clawsRef.current.forEach((claw, index) => {
        const isActive =
          index === 0 || isMultiClawActive || claw.state !== ClawState.IDLE;

        const isDisabled = claw.numbedUntil > now;
        if (!isActive) {
          if (claw.state === ClawState.IDLE) {
            claw.length = 60;
            claw.angle = 0;
          }
          return;
        }

        const clawX = GAME_WIDTH / 2 + claw.xOffset;

        if (claw.state === ClawState.IDLE) {
          // Only rotate if not disabled or if it's just numbed (can sway slightly)
          if (!isDisabled) {
            claw.angle += claw.angleSpeed;
            if (claw.angle > 1.2 || claw.angle < -1.2) {
              claw.angleSpeed *= -1;
            }
          } else {
            // If severed, keep short. If numbed, just drift.
            if (claw.debuffType === "SEVERED") {
              claw.angle = claw.angle * 0.9;
              claw.length = 60;
            } else if (claw.debuffType === "NUMBED") {
              claw.angle = claw.angle * 0.95;
            }
          }
        } else if (claw.state === ClawState.SHOOTING) {
          const shootSpeed = 8 * clawThrowSpeedMultiplier;
          claw.length += shootSpeed;

          const tipX = clawX + Math.sin(claw.angle) * claw.length;
          const tipY = clawY.current + Math.cos(claw.angle) * claw.length;

          // Check Fish Collision First
          if (claw.caughtFish.length === 0) {
            let hitFishIndex = -1;

            // Find first collision
            for (let i = 0; i < fishes.current.length; i++) {
              const f = fishes.current[i];
              const dx = tipX - f.x;
              const dy = tipY - f.y;
              if (
                Math.abs(dx) < f.type.width / 1.5 &&
                Math.abs(dy) < f.type.height / 1.5
              ) {
                hitFishIndex = i;
                break;
              }
            }

            if (hitFishIndex !== -1) {
              const primaryCaught = fishes.current[hitFishIndex];

              // --- CRAB CHECK (Immediate Snip) ---
              // Crabs still snip even if you use a net (logic choice: tough pincers!)
              if (primaryCaught.type.id === "crab") {
                claw.numbedUntil = Date.now() + 5000;
                claw.debuffType = "SEVERED";
                addFloatingText("SNIP!", "#d32f2f");
                // Drop fish immediately
                claw.caughtFish = [];
                claw.length = 60; // Snap back
                claw.state = ClawState.IDLE;
                fishes.current.splice(hitFishIndex, 1); // Remove crab from ocean
                onRoundComplete(false); // Count as miss since we lost it
                return; // Done with this claw frame
              }

              // --- NET LOGIC ---
              if (isSuperNetActive) {
                // Radius catch
                const catchRadius = 150;
                const caughtIndices = new Set<number>();
                const fishesToCatch: EntityFish[] = [];

                fishes.current.forEach((f, idx) => {
                  const dx = tipX - f.x;
                  const dy = tipY - f.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);

                  // Don't catch crabs in the net, they cut it! (or just ignore them to be nice)
                  // Let's safe-guard: ignore crabs for net expansion to avoid insta-snip logic complication
                  if (dist < catchRadius && f.type.id !== "crab") {
                    caughtIndices.add(idx);
                    fishesToCatch.push(f);
                  }
                });

                // Ensure primary hit is included if it wasn't a crab
                if (
                  primaryCaught.type.id !== "crab" &&
                  !fishesToCatch.includes(primaryCaught)
                ) {
                  // It should be included by radius logic since distance is ~0, but just in case
                  fishesToCatch.push(primaryCaught);
                  // Need index
                  caughtIndices.add(hitFishIndex);
                }

                // Add to claw
                claw.caughtFish = fishesToCatch;

                // Remove from ocean (sort indices desc to splice correctly)
                const sortedIndices = Array.from(caughtIndices).sort(
                  (a, b) => b - a,
                );
                sortedIndices.forEach((idx) => fishes.current.splice(idx, 1));
              } else {
                // Normal Catch
                claw.caughtFish = [primaryCaught];
                fishes.current.splice(hitFishIndex, 1);
              }

              claw.state = ClawState.RETRACTING;
            }
          }

          // If no fish caught, check walls
          if (
            claw.caughtFish.length === 0 &&
            claw.state === ClawState.SHOOTING
          ) {
            const hitWall = tipX < 0 || tipX > GAME_WIDTH || tipY > GAME_HEIGHT;
            const hitMax = claw.length >= clawMaxLength.current;

            if (hitWall || hitMax) {
              claw.state = ClawState.RETRACTING;
              if (hitWall && index === 0) {
                // Only shake on main claw hit for sanity
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 500);
                // Play catch nothing sound
                if (onCatchNothing) onCatchNothing();
              }
            }
          }
        } else if (claw.state === ClawState.RETRACTING) {
          let speed = 10;
          if (claw.caughtFish.length > 0) {
            if (isDiamondHookActive) {
              // Maximum speed, disregard weight
              speed = 30;
            } else {
              // Calculate total weight
              const totalWeight = claw.caughtFish.reduce(
                (acc, f) => acc + f.type.weight,
                0,
              );
              // Average weight damping or additive? Additive makes net catches heavy!
              // Let's damp slightly so 5 fish don't stop the claw entirely
              const weightFactor = totalWeight / 5;
              speed = (10 / weightFactor) * clawSpeedMultiplier;
              if (speed < 0.5) speed = 0.5;
            }
          }

          claw.length -= speed;

          if (claw.length <= 60) {
            claw.length = 60;
            claw.state = ClawState.IDLE;

            if (claw.caughtFish.length > 0) {
              // Report Combo Success (Only once per retrieval)
              onRoundComplete(true);

              // Process all caught items
              claw.caughtFish.forEach((caughtFish) => {
                const caughtItem = caughtFish.type;

                // --- MYSTERY BAG LOGIC ---
                if (caughtItem.id === "mystery_bag") {
                  const bonus = triggerMysteryBag();
                  if (bonus > 0) {
                    onFishCaught({ ...caughtItem, value: bonus });
                    addFloatingText(`+$${bonus}`, "#ffd700");
                  } else {
                    addFloatingText("NO TRASH!", "#81d4fa");
                  }
                }
                // --- ELECTRIC JELLY LOGIC ---
                else if (caughtItem.id === "electric_jelly") {
                  // Apply Numb Effect but Keep Catch
                  if (!isSuperNetActive) {
                    claw.numbedUntil = Date.now() + 5000;
                    claw.debuffType = "NUMBED";
                    addFloatingText("SHOCK!", "#ffeb3b");
                  } else {
                    addFloatingText("SAFE!", "#69f0ae");
                  }
                  onFishCaught(caughtItem);
                }
                // --- SUPPLY BOX LOGIC ---
                else if (caughtItem.id === "supply_box") {
                  onFishCaught(caughtItem);
                  addFloatingText(
                    `SUPPLY DROP! +$${caughtItem.value}`,
                    "#76ff03",
                  );
                } else {
                  // Normal Fish/Trash
                  onFishCaught(caughtItem);
                  const color = caughtItem.isTrash ? "#795548" : "#e1f5fe";
                  addFloatingText(
                    `+1 ${caughtItem.name} ($${caughtItem.value})`,
                    color,
                  );
                }
              });

              // Clear claw
              claw.caughtFish = [];
            } else {
              // Returned empty -> Miss
              onRoundComplete(false);
            }
          }
        }
      });
    },
    [
      clawSpeedMultiplier,
      clawThrowSpeedMultiplier,
      fishDensityLevel,
      onFishCaught,
      paused,
      spawnFish,
      triggerMysteryBag,
      activePowerups,
      weather,
      isMusicOn,
      onRoundComplete,
      lastPlaneRequestTime,
      onPassiveIncome,
      equippedPet,
    ],
  );

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const visualTime = Date.now();
    const currentHour = gameHour.current;
    const {
      skyTop,
      skyBot,
      overlay,
      rainOverlay,
      snowOverlay,
      windOverlay,
      fogOverlay,
    } = getEnvironmentColors(currentHour, weather);

    const isMultiClawActive = (activePowerups["multiClaw"] || 0) > Date.now();
    const isSuperBaitActive = (activePowerups["superBait"] || 0) > Date.now();
    const isDiamondHookActive =
      (activePowerups["diamondHook"] || 0) > Date.now();
    const isFishFrenzyActive = (activePowerups["fishFrenzy"] || 0) > Date.now();
    const isSuperNetActive = (activePowerups["superNet"] || 0) > Date.now();

    // Clear
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // --- Draw Sky ---
    drawSkyGradient(ctx, GAME_WIDTH, SURFACE_Y, { skyTop, skyBot });

    // --- Draw Celestial Bodies ---
    drawSun(ctx, currentHour, GAME_WIDTH, SURFACE_Y);
    drawMoon(ctx, currentHour, GAME_WIDTH, SURFACE_Y);
    drawStars(ctx, starsRef.current, currentHour, visualTime);

    // --- Draw Clouds ---
    drawClouds(ctx, cloudsRef.current, currentHour, weather);

    // --- Draw Rainbow (If Active) ---
    if (weather === WeatherType.RAINBOW) {
      drawRainbow(ctx, GAME_WIDTH, SURFACE_Y);
    }

    // --- Draw Airplane (If Active) ---
    if (airplaneRef.current) {
      const isNight = currentHour >= 19 || currentHour < 5;
      const p = airplaneRef.current;
      drawAirplane(ctx, p.x, p.y, isNight, visualTime, p.vx > 0);
    }

    // --- Draw Seagulls ---
    drawSeagulls(ctx, seagullsRef.current);

    // --- Draw Background Boats ---
    drawBackgroundBoats(ctx, backgroundBoatsRef.current, visualTime);

    // --- Calculate Light Level (for water) ---
    let lightLevel = 1.0;
    if (currentHour >= 20 || currentHour < 4) lightLevel = 0.5;
    else if (currentHour >= 18)
      lightLevel = 0.7; // Sunset
    else if (currentHour < 6) lightLevel = 0.6; // Dawn

    // --- Draw Water ---
    drawWaterBands(ctx, GAME_WIDTH, GAME_HEIGHT, SURFACE_Y);
    drawWaves(ctx, GAME_WIDTH, SURFACE_Y, visualTime, weather);
    drawWaterSparkles(
      ctx,
      GAME_WIDTH,
      GAME_HEIGHT,
      SURFACE_Y,
      lightLevel,
      visualTime,
    );

    // --- Draw Objects ---
    // Boat
    const boatY = SURFACE_Y - 25;
    const boatWidth = 160;
    const boatHeight = 35;
    const boatX = GAME_WIDTH / 2 - boatWidth / 2;

    ctx.fillStyle = "#5d4037";
    ctx.fillRect(boatX, boatY, boatWidth, boatHeight);

    ctx.fillStyle = "#4e342e";
    ctx.fillRect(boatX, boatY + 10, boatWidth, 2);
    ctx.fillRect(boatX, boatY + 20, boatWidth, 2);

    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(boatX + 10, boatY - 10, boatWidth - 20, 5);
    ctx.fillRect(boatX + 10, boatY - 10, 5, 10);
    ctx.fillRect(boatX + boatWidth - 15, boatY - 10, 5, 10);

    // Lamp (Left Side)
    const lampX = boatX - 14; // Moved further left (hanging off side)
    const lampY = boatY - 25;
    const isLampOn = currentHour >= 18 || currentHour < 6;

    // Bracket/Support connecting to boat
    ctx.fillStyle = "#4e342e"; // Dark wood
    ctx.fillRect(lampX + 2, boatY + 2, 16, 4); // Horizontal arm attaching to hull

    // Post/Housing vertical line
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(lampX, lampY, 4, 30);

    // Lantern Housing
    ctx.fillStyle = "#263238";
    ctx.fillRect(lampX - 3, lampY, 10, 2); // Top lid
    ctx.fillRect(lampX - 2, lampY + 12, 8, 2); // Bottom base

    // Lantern Glass
    ctx.fillStyle = isLampOn ? "#ffeb3b" : "#90a4ae";
    ctx.fillRect(lampX - 2, lampY + 2, 8, 10);

    // Handle ring
    ctx.strokeStyle = "#263238";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(lampX + 2, lampY - 2, 3, Math.PI, 0);
    ctx.stroke();

    // Crane
    ctx.fillStyle = "#455a64";
    ctx.fillRect(
      GAME_WIDTH / 2 - 8,
      clawY.current - 10,
      16,
      SURFACE_Y - clawY.current + 10,
    );

    // Draw extra gear if multi-claw active
    if (isMultiClawActive) {
      ctx.fillStyle = "#2196f3"; // Blue gear indicator
      ctx.fillRect(GAME_WIDTH / 2 - 12, clawY.current - 15, 24, 6);
    }
    // Draw extra gear if diamond hook active
    if (isDiamondHookActive) {
      ctx.fillStyle = "#ab47bc"; // Purple gear indicator
      ctx.fillRect(GAME_WIDTH / 2 - 14, clawY.current - 18, 28, 4);
    }
    // Draw extra gear if super net active
    if (isSuperNetActive) {
      ctx.fillStyle = "#4caf50"; // Green gear indicator
      ctx.fillRect(GAME_WIDTH / 2 - 16, clawY.current - 21, 32, 4);
    }

    ctx.fillStyle = "#263238";
    ctx.beginPath();
    ctx.arc(GAME_WIDTH / 2, clawY.current, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#546e7a";
    ctx.beginPath();
    ctx.arc(GAME_WIDTH / 2, clawY.current, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pet (Rendered behind or next to fisherman)
    if (equippedPet) {
      drawPet(ctx, equippedPet, GAME_WIDTH / 2 - 40, boatY, visualTime);
    }

    // Fisherman (using costume system)
    const manX = GAME_WIDTH / 2 + 40;
    const manY = boatY;
    drawFishermanCostume(ctx, manX, manY, equippedCostume);

    // Fishes
    fishes.current.forEach((f) => drawEntity(ctx, f, 0, visualTime));

    // Caught Fish (Rendered on each claw)
    clawsRef.current.forEach((claw, index) => {
      const isActive =
        index === 0 || isMultiClawActive || claw.state !== ClawState.IDLE;
      if (isActive && claw.caughtFish.length > 0) {
        const gripOffset = 15;
        const startX = GAME_WIDTH / 2 + claw.xOffset;
        const tipX = startX + Math.sin(claw.angle) * (claw.length + gripOffset);
        const tipY =
          clawY.current + Math.cos(claw.angle) * (claw.length + gripOffset);

        // Loop through all caught items
        claw.caughtFish.forEach((fish, i) => {
          let offsetX = 0;
          let offsetY = 0;

          if (isSuperNetActive) {
            // Scatter in the bag
            // Deterministic pseudo-random based on index
            offsetX = ((i * 17) % 40) - 20; // -20 to 20
            offsetY = 10 + ((i * 23) % 50); // 10 to 60 down
          } else {
            // Standard grip (Tight)
            offsetX = (i % 2 === 0 ? 1 : -1) * (i * 2);
            offsetY = i * 2;
          }

          fish.x = tipX + offsetX;
          fish.y = tipY + offsetY;
          drawEntity(ctx, fish, -claw.angle, visualTime);
        });
      }
    });

    // Claws
    clawsRef.current.forEach((claw, index) => {
      const isActive =
        index === 0 || isMultiClawActive || claw.state !== ClawState.IDLE;
      if (isActive) {
        drawClaw(
          ctx,
          claw,
          isDiamondHookActive,
          isSuperNetActive,
          visualTime,
          clawY.current,
        );
      }
    });

    // Draw Floating Texts
    floatingTexts.current.forEach((t) => {
      ctx.save();
      // Use life as alpha if it's decaying (<1), but if it's holding (>1), keep it 1.0
      ctx.globalAlpha = Math.min(1.0, t.life);

      // Removed bold for thinner text
      ctx.font = '10px "Press Start 2P"';
      ctx.textAlign = "left";

      // 8-way outline manually for pixel perfection at small sizes
      // This is much cleaner than strokeText which eats into the font
      ctx.fillStyle = "black";
      ctx.fillText(t.text, t.x - 1, t.y - 1);
      ctx.fillText(t.text, t.x + 1, t.y - 1);
      ctx.fillText(t.text, t.x - 1, t.y + 1);
      ctx.fillText(t.text, t.x + 1, t.y + 1);

      // Main text on top
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);

      ctx.restore();
    });

    // --- Draw Particles (Weather & Music) ---
    particlesRef.current.forEach((p) => {
      ctx.fillStyle = p.color;
      if (p.type === "RAIN") {
        ctx.fillRect(p.x, p.y, 2, p.size * 3);
      } else if (p.type === "SNOW") {
        ctx.fillRect(p.x, p.y, p.size, p.size);
      } else if (p.type === "LEAF") {
        ctx.fillRect(p.x, p.y, p.size, p.size);
      } else if (p.type === "WIND_LINE") {
        ctx.fillRect(p.x, p.y, 30, 2);
      } else if (p.type === "MIST") {
        // Draw circle for mist
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "RAINBOW_SPARKLE") {
        // Diamond shape sparkle
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.size);
        ctx.lineTo(p.x + p.size, p.y);
        ctx.lineTo(p.x, p.y + p.size);
        ctx.lineTo(p.x - p.size, p.y);
        ctx.fill();
      } else if (p.type === "BUBBLE") {
        // Draw pixel bubble (Square)
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;

        // Snap to pixel grid
        const size = Math.floor(p.size);
        ctx.strokeRect(
          Math.floor(p.x - size / 2) + 0.5,
          Math.floor(p.y - size / 2) + 0.5,
          size,
          size,
        );

        // Highlight
        ctx.fillStyle = "white";
        ctx.fillRect(Math.floor(p.x) + 1, Math.floor(p.y - size / 2) + 1, 1, 1);
      } else if (p.type === "MUSIC" && p.text) {
        ctx.save();
        // Simple font for music notes, larger and bold
        ctx.font = 'bold 16px "Courier New"';
        ctx.textAlign = "center";
        // Outline for visibility
        ctx.fillStyle = "black";
        ctx.fillText(p.text, p.x + 1, p.y + 1);
        // Fill
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
      }
    });

    // --- GLOBAL OVERLAY (Lighting + Weather) ---
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // --- LAMP LIGHT GLOW (Rendered ON TOP of darkness) ---
    if (isLampOn) {
      ctx.save();
      const glowX = lampX + 2;
      const glowY = lampY + 7;
      // Warm glow gradient
      const gradient = ctx.createRadialGradient(
        glowX,
        glowY,
        2,
        glowX,
        glowY,
        150,
      );
      gradient.addColorStop(0, "rgba(255, 235, 59, 0.5)"); // Bright core
      gradient.addColorStop(0.1, "rgba(255, 235, 59, 0.2)"); // Soft Halo
      gradient.addColorStop(1, "rgba(255, 235, 59, 0)"); // Transparent

      ctx.fillStyle = gradient;
      // Draw glow as a large circle intersecting the darkness
      ctx.beginPath();
      ctx.arc(glowX, glowY, 150, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Weather Specific Overlays
    if (weather === WeatherType.RAIN) {
      ctx.fillStyle = rainOverlay;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else if (weather === WeatherType.SNOW) {
      ctx.fillStyle = snowOverlay;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else if (weather === WeatherType.WIND) {
      ctx.fillStyle = windOverlay;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else if (weather === WeatherType.FOG) {
      ctx.fillStyle = fogOverlay;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // --- COMBO UI ---
    if (currentCombo >= 3) {
      ctx.save();
      // Pulsating Scale
      const scale = 1 + Math.sin(visualTime * 0.01) * 0.1;
      ctx.translate(100, 100);
      ctx.scale(scale, scale);

      ctx.font = 'bold 14px "Press Start 2P"'; // Reduced size
      ctx.textAlign = "center";
      ctx.strokeStyle = "#3e2723";
      ctx.lineWidth = 4; // Reduced stroke

      // Colors shift based on combo height
      let comboColor = "#ffeb3b"; // Yellow
      if (currentCombo >= 10) comboColor = "#ff9800"; // Orange
      if (currentCombo >= 50) comboColor = "#f44336"; // Red
      if (currentCombo >= 100) comboColor = "#e040fb"; // Purple

      const text = `COMBO x${currentCombo}`;
      ctx.strokeText(text, 0, 0);
      ctx.fillStyle = comboColor;
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    // --- Timers UI ---
    let timerY = 80;

    // Rainbow/Magic Conch Timer (Weather Expiration)
    if (weatherExpiration && weather === WeatherType.RAINBOW) {
      const remaining = Math.ceil((weatherExpiration - visualTime) / 1000);
      if (remaining > 0) {
        ctx.save();
        ctx.font = 'bold 16px "Press Start 2P"';
        // Pulsing Rainbow colors for text
        const hue = (visualTime * 0.1) % 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        const text = `RAINBOW TIME: ${remaining}s`;
        ctx.strokeText(text, GAME_WIDTH / 2, timerY);
        ctx.fillText(text, GAME_WIDTH / 2, timerY);
        ctx.restore();
        timerY += 30;
      }
    }

    // Fish Frenzy Timer
    if (isFishFrenzyActive) {
      const expiration = activePowerups["fishFrenzy"];
      const remaining = Math.ceil((expiration - visualTime) / 1000);

      if (remaining > 0) {
        ctx.save();
        ctx.font = 'bold 16px "Press Start 2P"';
        const blink = Math.floor(visualTime / 100) % 2 === 0;
        ctx.fillStyle = blink ? "#ffeb3b" : "#ff5722";
        ctx.strokeStyle = "#bf360c";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        const text = `FISH FRENZY: ${remaining}s`;
        ctx.strokeText(text, GAME_WIDTH / 2, timerY);
        ctx.fillText(text, GAME_WIDTH / 2, timerY);
        ctx.restore();
        timerY += 30;
      }
    }

    // Diamond Hook Timer
    if (isDiamondHookActive) {
      const expiration = activePowerups["diamondHook"];
      const remaining = Math.ceil((expiration - visualTime) / 1000);

      if (remaining > 0) {
        ctx.save();
        ctx.font = 'bold 16px "Press Start 2P"';
        const blink = Math.floor(visualTime / 500) % 2 === 0;
        ctx.fillStyle = blink ? "#e1f5fe" : "#fff";
        ctx.strokeStyle = "#0288d1";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        const text = `DIAMOND HOOK: ${remaining}s`;
        ctx.strokeText(text, GAME_WIDTH / 2, timerY);
        ctx.fillText(text, GAME_WIDTH / 2, timerY);
        ctx.restore();
        timerY += 30;
      }
    }

    // Super Net Timer
    if (isSuperNetActive) {
      const expiration = activePowerups["superNet"];
      const remaining = Math.ceil((expiration - visualTime) / 1000);

      if (remaining > 0) {
        ctx.save();
        ctx.font = 'bold 16px "Press Start 2P"';
        const blink = Math.floor(visualTime / 500) % 2 === 0;
        ctx.fillStyle = blink ? "#69f0ae" : "#fff";
        ctx.strokeStyle = "#2e7d32";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        const text = `SUPER NET: ${remaining}s`;
        ctx.strokeText(text, GAME_WIDTH / 2, timerY);
        ctx.fillText(text, GAME_WIDTH / 2, timerY);
        ctx.restore();
        timerY += 30;
      }
    }

    // Multi-Claw Timer
    if (isMultiClawActive) {
      const expiration = activePowerups["multiClaw"];
      const remaining = Math.ceil((expiration - visualTime) / 1000);

      // Only draw if still active (expiration > visualTime)
      if (remaining > 0) {
        ctx.save();
        ctx.font = 'bold 16px "Press Start 2P"';
        const blink = Math.floor(visualTime / 500) % 2 === 0;
        ctx.fillStyle = blink ? "#2196f3" : "#fff";
        ctx.strokeStyle = "#0d47a1";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        const text = `OCTOPUS: ${remaining}s`;
        ctx.strokeText(text, GAME_WIDTH / 2, timerY);
        ctx.fillText(text, GAME_WIDTH / 2, timerY);
        ctx.restore();
        timerY += 30;
      }
    }

    // Super Bait Timer
    if (isSuperBaitActive) {
      const expiration = activePowerups["superBait"];
      const remaining = Math.ceil((expiration - visualTime) / 1000);

      // Only draw if still active
      if (remaining > 0) {
        ctx.save();
        ctx.font = 'bold 16px "Press Start 2P"';
        const blink = Math.floor(visualTime / 500) % 2 === 0;
        ctx.fillStyle = blink ? "#00acc1" : "#fff";
        ctx.strokeStyle = "#006064";
        ctx.lineWidth = 4;
        ctx.textAlign = "center";
        const text = `SUPER BAIT: ${remaining}s`;
        ctx.strokeText(text, GAME_WIDTH / 2, timerY);
        ctx.fillText(text, GAME_WIDTH / 2, timerY);
        ctx.restore();
        timerY += 30;
      }
    }

    // Trash Suppression Timer
    if (trashSuppressionUntil.current > visualTime && !isSuperBaitActive) {
      const remaining = Math.ceil(
        (trashSuppressionUntil.current - visualTime) / 1000,
      );

      ctx.save();
      ctx.font = 'bold 16px "Press Start 2P"';
      // Blink effect
      const blink = Math.floor(visualTime / 500) % 2 === 0;
      ctx.fillStyle = blink ? "#ffeb3b" : "#fff";
      ctx.strokeStyle = "#3e2723";
      ctx.lineWidth = 4;
      ctx.textAlign = "center";

      const text = `NO TRASH: ${remaining}s`;

      // Draw at top center in the sky
      ctx.strokeText(text, GAME_WIDTH / 2, timerY);
      ctx.fillText(text, GAME_WIDTH / 2, timerY);
      ctx.restore();
    }
  }, [
    activePowerups,
    weather,
    weatherExpiration,
    currentCombo,
    equippedCostume,
    equippedPet,
    fishDensityLevel,
  ]);

  const tick = useCallback(
    (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time;
      }
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      update(time, dt);
      render();
      requestRef.current = requestAnimationFrame(tick);
    },
    [update, render],
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [tick]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowDown") {
        const isMultiClawActive =
          (activePowerups["multiClaw"] || 0) > Date.now();
        // Trigger all active claws that are NOT numbed
        clawsRef.current.forEach((claw, index) => {
          const isActive = index === 0 || isMultiClawActive;
          const isDisabled = claw.numbedUntil > Date.now();
          if (isActive && !isDisabled && claw.state === ClawState.IDLE) {
            claw.state = ClawState.SHOOTING;
            // Play claw release sound
            if (onClawRelease) onClawRelease();
          }
        });
      }
    };

    const handleTouch = () => {
      const isMultiClawActive = (activePowerups["multiClaw"] || 0) > Date.now();
      clawsRef.current.forEach((claw, index) => {
        const isActive = index === 0 || isMultiClawActive;
        const isDisabled = claw.numbedUntil > Date.now();
        if (isActive && !isDisabled && claw.state === ClawState.IDLE) {
          claw.state = ClawState.SHOOTING;
          // Play claw release sound
          if (onClawRelease) onClawRelease();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("mousedown", handleTouch);
      canvas.addEventListener("touchstart", handleTouch);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (canvas) {
        canvas.removeEventListener("mousedown", handleTouch);
        canvas.removeEventListener("touchstart", handleTouch);
      }
    };
  }, [activePowerups]);

  return (
    <div
      className={`relative overflow-hidden bg-[#29b6f6] max-w-full ${isShaking ? "animate-shake" : ""}`}
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="block max-w-full h-auto"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
};

export default GameCanvas;
