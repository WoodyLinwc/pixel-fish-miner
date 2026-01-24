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
} from "../utils/drawing";

interface GameCanvasProps {
  clawSpeedMultiplier: number;
  clawThrowSpeedMultiplier: number;
  fishDensityLevel: number;
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
    [weather, activePowerups],
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

    // --- Draw Surface (Sky) ---
    const skyGrad = ctx.createLinearGradient(0, 0, 0, SURFACE_Y);
    skyGrad.addColorStop(0, skyTop);
    skyGrad.addColorStop(1, skyBot);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, GAME_WIDTH, SURFACE_Y);

    // --- Celestial Bodies ---
    // Sun logic: 6 AM to 18 PM. Peak at 12.
    if (currentHour >= 5 && currentHour <= 19) {
      const sunDuration = 14;
      const sunProgress = (currentHour - 5) / sunDuration; // 0 to 1
      // Arc movement: x goes 0 to width, y goes up then down
      const sunX = sunProgress * GAME_WIDTH;
      const sunY = SURFACE_Y - 20 - Math.sin(sunProgress * Math.PI) * 100;

      // Sun Glow
      ctx.fillStyle = "rgba(255, 255, 200, 0.3)";
      ctx.beginPath();
      ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
      ctx.fill();
      // Sun Core
      ctx.fillStyle = "#ffeb3b";
      ctx.beginPath();
      ctx.arc(sunX, sunY, 15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Moon logic: 18 PM to 6 AM. Peak at 0 (midnight).
    let moonProgress = -1;
    if (currentHour >= 18) moonProgress = (currentHour - 18) / 12;
    else if (currentHour <= 6) moonProgress = (currentHour + 6) / 12;

    if (moonProgress >= 0 && moonProgress <= 1) {
      const moonX = moonProgress * GAME_WIDTH;
      const moonY = SURFACE_Y - 30 - Math.sin(moonProgress * Math.PI) * 90;

      ctx.fillStyle = "#f4f4f4"; // White moon
      ctx.beginPath();
      ctx.arc(moonX, moonY, 12, 0, Math.PI * 2);
      ctx.fill();
      // Crater
      ctx.fillStyle = "#e0e0e0";
      ctx.beginPath();
      ctx.arc(moonX + 4, moonY - 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stars (Only visible at night/dusk)
    if (currentHour >= 18 || currentHour <= 6) {
      let alpha = 1;
      // Fade in dusk/dawn
      if (currentHour >= 18 && currentHour < 20) alpha = (currentHour - 18) / 2;
      if (currentHour >= 4 && currentHour < 6)
        alpha = 1 - (currentHour - 4) / 2;

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      starsRef.current.forEach((star, i) => {
        const blink = Math.sin(visualTime * 0.005 + star.blinkOffset) > 0;
        if (blink) {
          ctx.fillRect(star.x, star.y, star.size, star.size);
        }
      });
    }

    // Moving Clouds
    ctx.fillStyle = currentHour > 19 || currentHour < 5 ? "#546e7a" : "#ffffff";
    if (weather === WeatherType.RAIN || weather === WeatherType.SNOW)
      ctx.fillStyle = "#78909c"; // Stormy clouds
    if (weather === WeatherType.FOG) ctx.fillStyle = "#eceff1"; // Fog clouds

    cloudsRef.current.forEach((cloud) => {
      ctx.fillRect(cloud.x, cloud.y, cloud.w, cloud.h);
      // Simple pixel art detail: smaller block on top
      ctx.fillRect(cloud.x + 10, cloud.y - 10, cloud.w - 20, 10);
    });

    // --- Draw Rainbow (If Active) ---
    if (weather === WeatherType.RAINBOW) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      const colors = ["#f44336", "#ffeb3b", "#4caf50", "#2196f3", "#9c27b0"];
      const centerX = GAME_WIDTH / 2;
      const centerY = SURFACE_Y + 400;
      const radiusBase = 600;

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusBase - i * 15, Math.PI, 2 * Math.PI);
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 15;
        ctx.stroke();
      }
      ctx.restore();
    }

    // --- Draw Airplane (If Active) ---
    if (airplaneRef.current) {
      const isNight = currentHour >= 19 || currentHour < 5;
      const p = airplaneRef.current;
      drawAirplane(ctx, p.x, p.y, isNight, visualTime, p.vx > 0);
    }

    // --- Seagulls ---
    seagullsRef.current.forEach((s) => {
      const { x, y, vx, flapState } = s;
      const facingRight = vx > 0;

      ctx.save();
      ctx.translate(x, y);
      if (!facingRight) ctx.scale(-1, 1);

      // Body
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-5, -2, 12, 5);

      // Tail
      ctx.fillStyle = "#cfd8dc";
      ctx.fillRect(-8, 0, 3, 2);

      // Head area
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(5, -5, 5, 5);

      // Beak
      ctx.fillStyle = "#ffb74d";
      ctx.fillRect(9, -2, 3, 2);

      // Eye
      ctx.fillStyle = "#263238";
      ctx.fillRect(7, -4, 1, 1);

      // Wings (Greyish)
      ctx.fillStyle = "#e0e0e0";
      const state = flapState % 4; // 0: Up, 1: Mid, 2: Down, 3: Mid

      if (state === 0) {
        // Up
        ctx.fillRect(-2, -8, 6, 6); // Wing up
      } else if (state === 1 || state === 3) {
        // Mid
        ctx.fillRect(-2, -1, 8, 3);
      } else {
        // Down
        ctx.fillRect(-2, 1, 6, 5);
      }

      ctx.restore();
    });

    // --- Draw Background Boats (NEW) ---
    // Draw them right at the horizon line (SURFACE_Y), but behind water/main boat
    backgroundBoatsRef.current.forEach((b) => {
      ctx.save();
      ctx.translate(b.x, b.y);

      // Use stored scale for variety
      const scale = b.scale || 0.6;
      ctx.scale(scale, scale);

      if (b.vx < 0) ctx.scale(-1, 1); // Flip if moving left

      if (b.type === "SMALL") {
        // Sailboat
        // Hull
        ctx.fillStyle = "#5d4037";
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.lineTo(10, 6);
        ctx.lineTo(-10, 6);
        ctx.fill();
        // Mast
        ctx.fillStyle = "#3e2723";
        ctx.fillRect(-2, -20, 2, 20);
        // Sail
        ctx.fillStyle = "#eceff1";
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(14, -4);
        ctx.lineTo(0, -4);
        ctx.fill();
      } else {
        // Big Ship (Cargo)
        // Hull
        ctx.fillStyle = "#37474f"; // Dark BlueGrey
        ctx.fillRect(-40, -4, 80, 10);
        ctx.fillStyle = "#b71c1c"; // Red bottom line (water line)
        ctx.fillRect(-40, 2, 80, 4);

        // Bridge
        ctx.fillStyle = "#cfd8dc"; // White/Grey upper
        ctx.fillRect(10, -14, 20, 10);
        // Windows
        ctx.fillStyle = "#263238";
        ctx.fillRect(14, -10, 12, 2);

        // Cargo Containers
        // Use time-seeded random color logic or simple pattern
        const colors = ["#ef5350", "#42a5f5", "#66bb6a", "#ffa726"];
        // Fixed colored containers for stability
        ctx.fillStyle = "#ef5350";
        ctx.fillRect(-20, -10, 10, 6);
        ctx.fillStyle = "#42a5f5";
        ctx.fillRect(-8, -10, 10, 6);

        // Smoke
        if (Math.floor(visualTime / 200) % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.beginPath();
          ctx.arc(20, -18, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    });

    // --- Draw Water ---
    const waterBaseColors = [
      "#4fc3f7",
      "#29b6f6",
      "#03a9f4",
      "#039be5",
      "#0288d1",
    ];
    let lightLevel = 1.0;
    if (currentHour >= 20 || currentHour < 4) lightLevel = 0.5;
    else if (currentHour >= 18)
      lightLevel = 0.7; // Sunset
    else if (currentHour < 6) lightLevel = 0.6; // Dawn

    const bandSize = (GAME_HEIGHT - SURFACE_Y) / 5;

    waterBaseColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, SURFACE_Y + i * bandSize, GAME_WIDTH, bandSize);
    });

    // --- Waves ---
    ctx.fillStyle = "#e1f5fe";
    const waveChunkWidth = 10;
    const waveAmplitude = 3;
    const waveSpeed = 0.005;
    const waveWindSpeed = weather === WeatherType.WIND ? 3 : 1;
    for (let x = 0; x <= GAME_WIDTH; x += waveChunkWidth) {
      const yOffset =
        Math.sin(x * 0.05 + visualTime * waveSpeed * waveWindSpeed) *
        waveAmplitude;
      const discreteY = Math.floor(yOffset);
      ctx.fillRect(x, SURFACE_Y + discreteY - 2, waveChunkWidth + 1, 5);
    }

    // --- Sparkles ---
    if (lightLevel > 0.6) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 15; i++) {
        const px = (i * 97) % GAME_WIDTH;
        const py = SURFACE_Y + 20 + ((i * 43) % (GAME_HEIGHT - SURFACE_Y - 40));
        const blink = Math.sin(visualTime * 0.005 + i);
        if (blink > 0.8) {
          ctx.fillRect(px, py, 4, 4);
        }
      }
    }

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

    // Fisherman
    const manX = GAME_WIDTH / 2 + 40;
    const manY = boatY;
    ctx.save();
    ctx.translate(manX, manY);

    if (equippedCostume === "pirate") {
      // --- PIRATE ---
      // Legs (One wooden)
      ctx.fillStyle = "#283593"; // Dark pants
      ctx.fillRect(0, -20, 8, 20); // Right leg (normal)
      ctx.fillStyle = "#8d6e63"; // Wooden leg
      ctx.fillRect(14, -20, 4, 20);

      // Torso (Red/Black stripes or Vest)
      ctx.fillStyle = "#b71c1c"; // Red Vest
      ctx.fillRect(-2, -45, 24, 25);
      ctx.fillStyle = "#212121"; // Black Shirt
      ctx.fillRect(2, -45, 16, 25);

      // Arms
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(-6, -42, 6, 20);
      ctx.fillRect(20, -42, 6, 20);

      // Head
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(2, -58, 16, 14);

      // Bandana (Red)
      ctx.fillStyle = "#d32f2f";
      ctx.fillRect(0, -62, 20, 8);
      ctx.fillRect(16, -60, 6, 4); // Knot

      // Eye Patch
      ctx.fillStyle = "black";
      ctx.fillRect(10, -54, 4, 4);
    } else if (equippedCostume === "diver") {
      // --- DIVER ---
      // Legs (Wetsuit)
      ctx.fillStyle = "#212121"; // Black wetsuit
      ctx.fillRect(0, -20, 8, 20);
      ctx.fillRect(12, -20, 8, 20);

      // Torso (Wetsuit with colored stripes)
      ctx.fillStyle = "#212121"; // Black wetsuit
      ctx.fillRect(-2, -45, 24, 25);

      // Colored stripe accents
      ctx.fillStyle = "#00bcd4"; // Cyan stripe
      ctx.fillRect(0, -38, 20, 3);
      ctx.fillRect(0, -28, 20, 3);

      // Arms (Wetsuit sleeves)
      ctx.fillStyle = "#212121";
      ctx.fillRect(-6, -42, 6, 20);
      ctx.fillRect(20, -42, 6, 20);

      // Air tank on back (visible on side)
      ctx.fillStyle = "#90a4ae"; // Gray tank
      ctx.fillRect(-6, -44, 5, 16);
      ctx.fillStyle = "#263238"; // Dark straps
      ctx.fillRect(-2, -40, 2, 2);
      ctx.fillRect(-2, -32, 2, 2);

      // Head (covered by mask)
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(2, -58, 16, 14);

      // Few thin short hairs on top of head
      ctx.fillStyle = "#5d4037"; // Dark brown hair
      ctx.fillRect(4, -59, 2, 3); // Hair strand 1
      ctx.fillRect(8, -60, 2, 4); // Hair strand 2 (slightly taller)
      ctx.fillRect(12, -59, 2, 3); // Hair strand 3
      ctx.fillRect(6, -58, 2, 2); // Hair strand 4 (short)
      ctx.fillRect(14, -58, 2, 2); // Hair strand 5 (short)

      // Diving Mask (Large goggles)
      ctx.fillStyle = "#263238"; // Dark frame
      ctx.fillRect(0, -56, 20, 8);

      // Glass lenses (light blue tint)
      ctx.fillStyle = "#4dd0e1";
      ctx.fillRect(2, -54, 7, 4); // Left lens
      ctx.fillRect(11, -54, 7, 4); // Right lens

      // Snorkel tube (larger and more prominent)
      ctx.fillStyle = "#ffeb3b"; // Yellow snorkel
      ctx.fillRect(20, -64, 4, 18); // Longer vertical tube
      ctx.fillRect(16, -66, 4, 4); // Top bend
      ctx.fillRect(20, -66, 8, 4); // Top opening (wider)
      // Mouthpiece
      ctx.fillStyle = "#212121";
      ctx.fillRect(18, -58, 3, 4);
    } else if (equippedCostume === "lifeguard") {
      // --- LIFEGUARD ---
      // Legs (Red shorts)
      ctx.fillStyle = "#d32f2f"; // Red shorts
      ctx.fillRect(0, -20, 8, 12);
      ctx.fillRect(12, -20, 8, 12);

      // Legs below shorts (skin)
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(0, -8, 8, 8);
      ctx.fillRect(12, -8, 8, 8);

      // Torso (Red tank top)
      ctx.fillStyle = "#d32f2f"; // Red top
      ctx.fillRect(-2, -45, 24, 25);

      // White cross emblem
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(8, -38, 4, 12); // Vertical
      ctx.fillRect(4, -34, 12, 4); // Horizontal

      // Left Arm (holding lifebuoy)
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(-6, -42, 6, 20);

      // Lifebuoy on left hand (moved closer to body)
      // Outer ring (orange/red)
      ctx.fillStyle = "#ff5722";
      ctx.fillRect(-18, -36, 20, 20); // Outer square (moved 4px right)
      // Cut out the hollow center (transparent/background)
      ctx.fillStyle = "#87ceeb"; // Sky blue for hollow center
      ctx.fillRect(-14, -32, 12, 12); // Inner hollow
      // White stripes on buoy (all 4 sides)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-18, -33, 4, 14); // Left vertical stripe
      ctx.fillRect(-2, -33, 4, 14); // Right vertical stripe
      ctx.fillRect(-15, -36, 14, 4); // Top horizontal stripe
      ctx.fillRect(-15, -19, 14, 3); // Bottom horizontal stripe
      // Rope attachment detail
      ctx.fillStyle = "#ffd54f"; // Yellow rope
      ctx.fillRect(-8, -38, 2, 4);

      // Right Arm (holding drink)
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(20, -42, 6, 20);

      // Drink cup in right hand (slightly bigger)
      ctx.fillStyle = "#ffeb3b"; // Yellow cup
      ctx.fillRect(24, -30, 8, 10);
      // Straw
      ctx.fillStyle = "#d32f2f"; // Red straw
      ctx.fillRect(29, -36, 2, 14);
      // Ice/liquid inside
      ctx.fillStyle = "#81c784"; // Green drink (lime/mint)
      ctx.fillRect(25, -28, 6, 7);
      // Ice cubes
      ctx.fillStyle = "#e3f2fd";
      ctx.fillRect(26, -27, 2, 2);
      ctx.fillRect(28, -25, 2, 2);

      // Head
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(2, -58, 16, 14);

      // Visor cap (Red with white bill)
      ctx.fillStyle = "#d32f2f"; // Red cap
      ctx.fillRect(2, -62, 16, 6);
      ctx.fillStyle = "#ffffff"; // White bill
      ctx.fillRect(0, -58, 20, 2);

      // Whistle on neck (silver)
      ctx.fillStyle = "#90a4ae";
      ctx.fillRect(8, -46, 4, 2);
    } else if (equippedCostume === "sushi_master") {
      // --- SUSHI MASTER ---
      // Legs (Dark pants)
      ctx.fillStyle = "#424242"; // Dark gray pants
      ctx.fillRect(0, -20, 8, 20);
      ctx.fillRect(12, -20, 8, 20);

      // Torso (White chef coat)
      ctx.fillStyle = "#ffffff"; // White coat
      ctx.fillRect(-2, -45, 24, 25);

      // Coat cross-over (traditional style)
      ctx.fillStyle = "#f5f5f5"; // Slight gray for depth
      ctx.fillRect(2, -45, 16, 25);

      // Black collar trim
      ctx.fillStyle = "#212121";
      ctx.fillRect(0, -45, 4, 20); // Left lapel
      ctx.fillRect(16, -45, 4, 20); // Right lapel

      // Arms (White sleeves)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-6, -42, 6, 16);
      ctx.fillRect(20, -42, 6, 16);

      // Hands
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(-6, -26, 6, 4);
      ctx.fillRect(20, -26, 6, 4);

      // Sushi Knife in Right Hand (held properly, pointing inward)
      // Handle in hand
      ctx.fillStyle = "#5d4037"; // Dark wood handle
      ctx.fillRect(22, -25, 4, 3); // Handle held in hand
      // Blade extending from handle toward left
      ctx.fillStyle = "#b0bec5"; // Silver blade
      ctx.fillRect(12, -26, 10, 2); // Blade main body
      ctx.fillRect(10, -25, 2, 1); // Blade tip (pointed)
      // Blade shine
      ctx.fillStyle = "#eceff1"; // Highlight
      ctx.fillRect(14, -25, 6, 1); // Shine on blade

      // Head
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(2, -58, 16, 14);

      // Fill gap between head and hat with white
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(2, -60, 16, 2);

      // Traditional headband (Hachimaki - white) - HIGHER
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, -66, 20, 6);

      // Red rising sun emblem on headband
      ctx.fillStyle = "#d32f2f";
      ctx.fillRect(8, -64, 4, 4);

      // Mustache (small, distinguished)
      ctx.fillStyle = "#212121";
      ctx.fillRect(4, -50, 4, 2); // Left side
      ctx.fillRect(12, -50, 4, 2); // Right side

      // --- THINNER PLATE ON HEAD ---
      // Fill gap between hat and plate
      ctx.fillStyle = "#e0e0e0"; // Gray support/base
      ctx.fillRect(6, -68, 8, 2); // Small base on top of hat

      // Plate (thinner - white ceramic with shadow, edges removed)
      ctx.fillStyle = "#f5f5f5"; // Light gray shadow/depth
      ctx.fillRect(-4, -70, 28, 2); // Thinner plate bottom edge (2px instead of 3px)
      ctx.fillStyle = "#ffffff"; // White plate surface
      ctx.fillRect(-4, -72, 28, 2); // Thinner plate top
      // Plate center detail (slight curve/shine)
      ctx.fillStyle = "#fafafa"; // Very light highlight
      ctx.fillRect(4, -71, 12, 1);

      // --- SUSHI PILE ON PLATE (bottom to top) - MOVED DOWN ---

      // BOTTOM LAYER: 3 SMALL FISH (moved down 2px)
      // Left fish (orange/red)
      ctx.fillStyle = "#ff6b35"; // Orange fish body
      ctx.fillRect(0, -75, 6, 3); // Body
      ctx.fillStyle = "#e63946"; // Red tail
      ctx.fillRect(-1, -74, 2, 1); // Tail fin
      ctx.fillStyle = "#212121"; // Black eye
      ctx.fillRect(5, -75, 1, 1);

      // Center fish (silver/gray)
      ctx.fillStyle = "#90a4ae"; // Silver fish body
      ctx.fillRect(7, -75, 6, 3); // Body
      ctx.fillStyle = "#607d8b"; // Darker tail
      ctx.fillRect(6, -74, 2, 1); // Tail fin
      ctx.fillStyle = "#212121"; // Black eye
      ctx.fillRect(12, -75, 1, 1);

      // Right fish (blue)
      ctx.fillStyle = "#42a5f5"; // Blue fish body
      ctx.fillRect(14, -75, 6, 3); // Body
      ctx.fillStyle = "#1976d2"; // Darker blue tail
      ctx.fillRect(13, -74, 2, 1); // Tail fin
      ctx.fillStyle = "#212121"; // Black eye
      ctx.fillRect(19, -75, 1, 1);

      // MIDDLE LAYER: 2 ONIGIRI (moved down 2px)
      // Left onigiri
      ctx.fillStyle = "#ffffff"; // White rice triangle
      ctx.fillRect(3, -84, 5, 2); // Top tip
      ctx.fillRect(2, -82, 7, 3); // Middle
      ctx.fillRect(1, -79, 9, 3); // Bottom
      // Nori wrap on bottom
      ctx.fillStyle = "#212121";
      ctx.fillRect(2, -79, 7, 2);

      // Right onigiri
      ctx.fillStyle = "#ffffff"; // White rice triangle
      ctx.fillRect(12, -84, 5, 2); // Top tip
      ctx.fillRect(11, -82, 7, 3); // Middle
      ctx.fillRect(10, -79, 9, 3); // Bottom
      // Nori wrap on bottom
      ctx.fillStyle = "#212121";
      ctx.fillRect(11, -79, 7, 2);

      // TOP LAYER: 1 TEMPURA SHRIMP (centered) (moved down 2px)
      ctx.fillStyle = "#ffb74d"; // Golden fried coating
      // Shrimp body (curved)
      ctx.fillRect(6, -92, 3, 6); // Tail section
      ctx.fillRect(8, -90, 4, 6); // Body section
      ctx.fillRect(11, -88, 3, 4); // Head section
      // Darker fried bits
      ctx.fillStyle = "#ff9800";
      ctx.fillRect(7, -91, 2, 2);
      ctx.fillRect(9, -89, 2, 2);
      // Shrimp tail detail (red)
      ctx.fillStyle = "#d32f2f";
      ctx.fillRect(6, -93, 2, 2);
    } else if (equippedCostume === "sailor") {
      // --- SAILOR BOY ---
      // Legs (Blue jeans/denim)
      ctx.fillStyle = "#1976d2"; // Bright blue pants
      ctx.fillRect(0, -20, 8, 20);
      ctx.fillRect(12, -20, 8, 20);

      // Torso (White shirt with blue horizontal stripes - Breton style)
      ctx.fillStyle = "#ffffff"; // White base
      ctx.fillRect(-2, -45, 24, 25);

      // Blue horizontal stripes
      ctx.fillStyle = "#1565c0"; // Navy blue stripes
      ctx.fillRect(-2, -43, 24, 3); // Stripe 1
      ctx.fillRect(-2, -37, 24, 3); // Stripe 2
      ctx.fillRect(-2, -31, 24, 3); // Stripe 3
      ctx.fillRect(-2, -25, 24, 3); // Stripe 4

      // Arms (White sleeves with stripes)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-6, -42, 6, 20);
      ctx.fillRect(20, -42, 6, 20);
      // Blue stripes on arms
      ctx.fillStyle = "#1565c0";
      ctx.fillRect(-6, -40, 6, 2);
      ctx.fillRect(-6, -34, 6, 2);
      ctx.fillRect(20, -40, 6, 2);
      ctx.fillRect(20, -34, 6, 2);
      // Hands
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(-6, -22, 6, 4);
      ctx.fillRect(20, -22, 6, 4);

      // Head
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(2, -58, 16, 14);

      // Sailor Cap (White round cap with blue band)
      ctx.fillStyle = "#ffffff"; // White cap top (round/flat style)
      ctx.fillRect(0, -64, 20, 8); // Main cap
      ctx.fillStyle = "#1565c0"; // Blue band
      ctx.fillRect(0, -58, 20, 3); // Band around bottom
      // Cap badge/anchor detail
      ctx.fillStyle = "#ffca28"; // Gold anchor
      ctx.fillRect(9, -62, 2, 4); // Anchor vertical
      ctx.fillRect(7, -60, 6, 2); // Anchor horizontal
    } else if (equippedCostume === "captain") {
      // --- CAPTAIN ---
      // Legs (Dark Blue)
      ctx.fillStyle = "#0d47a1";
      ctx.fillRect(0, -20, 8, 20);
      ctx.fillRect(12, -20, 8, 20);

      // Torso (Dark Blue Jacket)
      ctx.fillStyle = "#0d47a1";
      ctx.fillRect(-2, -45, 24, 25);

      // Gold Buttons
      ctx.fillStyle = "#ffca28";
      ctx.fillRect(8, -42, 4, 2);
      ctx.fillRect(8, -36, 4, 2);
      ctx.fillRect(8, -30, 4, 2);

      // Arms (Dark Blue sleeves)
      ctx.fillStyle = "#0d47a1";
      ctx.fillRect(-6, -42, 6, 16);
      ctx.fillRect(20, -42, 6, 16);
      // Hands
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(-6, -26, 6, 4);
      ctx.fillRect(20, -26, 6, 4);

      // Tobacco Pipe in Right Hand (held properly)
      // Pipe stem goes through/from hand
      ctx.fillStyle = "#5d4037"; // Dark brown stem
      ctx.fillRect(20, -25, 10, 2); // Stem extending from hand
      // Pipe bowl at the end
      ctx.fillStyle = "#8d6e63"; // Brown bowl
      ctx.fillRect(30, -27, 4, 5); // Bowl
      // Bowl opening/inside
      ctx.fillStyle = "#4e342e"; // Darker inside
      ctx.fillRect(31, -27, 2, 2); // Bowl opening

      // Head
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(2, -58, 16, 14);

      // Beard (White)
      ctx.fillStyle = "#eeeeee";
      ctx.fillRect(2, -48, 16, 6);

      // Captain Hat (Large White)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-2, -66, 24, 8);
      // Black Visor
      ctx.fillStyle = "black";
      ctx.fillRect(0, -58, 20, 2);
      // Gold Badge
      ctx.fillStyle = "#ffca28";
      ctx.fillRect(8, -64, 4, 4);
    } else {
      // --- DEFAULT ---
      ctx.fillStyle = "#283593";
      ctx.fillRect(0, -20, 8, 20);
      ctx.fillRect(12, -20, 8, 20);
      ctx.fillStyle = "#c62828";
      ctx.fillRect(-2, -45, 24, 25);
      ctx.fillStyle = "#b71c1c";
      ctx.fillRect(2, -45, 4, 25);
      ctx.fillRect(10, -45, 4, 25);
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(-6, -42, 6, 20);
      ctx.fillRect(20, -42, 6, 20);
      ctx.fillStyle = "#ffccbc";
      ctx.fillRect(2, -58, 16, 14);
      // Default Beard (Greyish)
      ctx.fillStyle = "#eeeeee";
      ctx.fillRect(2, -48, 16, 8);
      // Hat (Yellow)
      ctx.fillStyle = "#fdd835";
      ctx.fillRect(0, -62, 20, 6);
      ctx.fillRect(14, -62, 10, 4);
    }

    ctx.restore();

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
