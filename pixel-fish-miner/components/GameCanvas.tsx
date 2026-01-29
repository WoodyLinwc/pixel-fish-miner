import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  FishType,
  FishRarity,
  WeatherType,
  EntityFish,
  FloatingText,
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
  drawBoat,
  drawLamp,
  drawLampGlow,
  drawCrane,
  drawFloatingTexts,
  checkFishCollision,
  getNetCatch,
  checkWallCollision,
  drawPowerupTimers,
  drawRainbowTimer,
  drawTrashSuppressionTimer,
  drawCombo,
  drawLightingOverlay,
  drawWeatherOverlay,
  // Particle system
  Particle, // Now importing from utils/particles
  spawnWeatherParticles,
  spawnNarwhalAura,
  spawnSeaTurtleBubbles,
  spawnMusicNotes,
  updateParticles,
  renderParticles,
  // Spawning system
  spawnFish as spawnFishEntity,
  spawnSeagulls as spawnSeagullEntities,
  updateSeagulls as updateSeagullEntities,
  spawnBackgroundBoats as spawnBackgroundBoatEntities,
  updateBackgroundBoats as updateBackgroundBoatEntities,
  shouldSpawnAirplane,
  createAirplane,
  updateAirplane as updateAirplaneEntity,
  shouldDropSupplyBox,
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
  unlockedPets: string[]; // NEW: List of unlocked pet IDs
  unlockedFish: string[]; // NEW: List of unlocked fish IDs
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
  unlockedPets,
  unlockedFish,
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
          } else if (
            ["pelican", "gentleman_octopus", "dog"].includes(equippedPet)
          ) {
            amount = 3;
          } else if (["kraken"].includes(equippedPet)) {
            amount = 10;
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
      const hasSupplyBox = fishes.current.some(
        (f) => f.type.id === "supply_box",
      );

      // Trigger via Promo Code
      if (
        lastPlaneRequestTime &&
        lastPlaneRequestTime > processedPlaneRequestRef.current &&
        !airplaneRef.current
      ) {
        airplaneRef.current = createAirplane();
        processedPlaneRequestRef.current = lastPlaneRequestTime;
      }

      // Random Rare Occurrence
      if (shouldSpawnAirplane(hasSupplyBox, !!airplaneRef.current)) {
        airplaneRef.current = createAirplane();
      }

      // Update Airplane
      if (airplaneRef.current) {
        const p = airplaneRef.current;

        // Check if should drop supply box
        if (shouldDropSupplyBox(p)) {
          const supplyBoxType = FISH_TYPES.find((f) => f.id === "supply_box");
          if (supplyBoxType) {
            fishes.current.push({
              x: p.x,
              y: p.y + 20, // Start just below plane
              vx: 0,
              vy: 0.8, // Slow fall (Parachute speed)
              type: supplyBoxType,
              facingRight: true,
            });
            p.hasDropped = true;
          }
        }

        // Update position and check if should despawn
        if (updateAirplaneEntity(p)) {
          airplaneRef.current = null;
        }
      }

      // --- Update Background Boats ---
      const hasKraken = unlockedPets.includes("kraken");
      spawnBackgroundBoatEntities(backgroundBoatsRef.current, hasKraken);
      backgroundBoatsRef.current = updateBackgroundBoatEntities(
        backgroundBoatsRef.current,
      );

      // --- Update Seagulls ---
      spawnSeagullEntities(seagullsRef.current, gameHour.current);
      seagullsRef.current = updateSeagullEntities(seagullsRef.current, time);

      // --- Weather Particles ---
      spawnWeatherParticles(
        weather,
        particlesRef.current,
        GAME_WIDTH,
        GAME_HEIGHT,
        SURFACE_Y,
      );

      // --- Special Effect Particles ---
      fishes.current.forEach((f) => {
        if (f.type.id === "narwhal") {
          spawnNarwhalAura(f, particlesRef.current);
        }
        if (f.type.id === "sea_turtle") {
          spawnSeaTurtleBubbles(f, particlesRef.current);
        }
      });

      // --- Music Notes (Idle Whistling) ---
      const boatY = SURFACE_Y - 25;
      const manX = GAME_WIDTH / 2 + 40;
      const manY = boatY;
      const mouthY = manY - 55;
      const mouthX = manX + 10;
      spawnMusicNotes(particlesRef.current, mouthX, mouthY);

      // Update and filter particles
      particlesRef.current = updateParticles(particlesRef.current, time);

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
          const { shouldUpdateNarwhalTime } = spawnFishEntity(
            fishes.current,
            weather,
            gameHour.current,
            trashFilterLevel,
            isSuperBaitActive,
            isFishFrenzyActive,
            trashSuppressionUntil.current,
            lastNarwhalSpawnTime.current,
            unlockedFish, // NEW: Pass unlocked fish list
          );

          if (shouldUpdateNarwhalTime) {
            lastNarwhalSpawnTime.current = Date.now();
          }
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
            const hitFishIndex = checkFishCollision(tipX, tipY, fishes.current);

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
                const { fish: fishesToCatch, indices: sortedIndices } =
                  getNetCatch(tipX, tipY, fishes.current, catchRadius);

                // Ensure primary hit is included if it wasn't a crab
                if (
                  primaryCaught.type.id !== "crab" &&
                  !fishesToCatch.includes(primaryCaught)
                ) {
                  fishesToCatch.push(primaryCaught);
                }

                // Add to claw
                claw.caughtFish = fishesToCatch;

                // Remove from ocean (indices already sorted descending)
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
            const hitWallOrMax = checkWallCollision(
              tipX,
              tipY,
              claw.length,
              clawMaxLength.current,
              GAME_WIDTH,
              GAME_HEIGHT,
            );

            if (hitWallOrMax) {
              claw.state = ClawState.RETRACTING;
              if (hitWallOrMax && index === 0) {
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
      trashFilterLevel,
      onFishCaught,
      paused,
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

    drawBoat(ctx, boatX, boatY, boatWidth, boatHeight);

    // Lamp
    const lampX = boatX - 14;
    const lampY = boatY - 25;
    const isLampOn = currentHour >= 18 || currentHour < 6;

    drawLamp(ctx, lampX, lampY, boatY, isLampOn);

    // Crane
    drawCrane(
      ctx,
      GAME_WIDTH / 2,
      clawY.current,
      SURFACE_Y,
      isMultiClawActive,
      isDiamondHookActive,
      isSuperNetActive,
    );

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
    drawFloatingTexts(ctx, floatingTexts.current);

    // --- Draw Particles (Weather & Music) ---
    renderParticles(ctx, particlesRef.current);

    // --- GLOBAL OVERLAY (Lighting + Weather) ---
    drawLightingOverlay(ctx, overlay, GAME_WIDTH, GAME_HEIGHT);

    // --- LAMP LIGHT GLOW (Rendered ON TOP of darkness) ---
    if (isLampOn) {
      drawLampGlow(ctx, lampX, lampY);
    }

    // Weather Specific Overlays
    drawWeatherOverlay(
      ctx,
      weather,
      rainOverlay,
      snowOverlay,
      windOverlay,
      fogOverlay,
      GAME_WIDTH,
      GAME_HEIGHT,
    );

    // --- COMBO UI ---
    drawCombo(ctx, currentCombo, visualTime, 100, 100);

    // --- Timers UI ---
    let timerY = 80;

    // Rainbow Timer (Special weather timer)
    if (weatherExpiration && weather === WeatherType.RAINBOW) {
      drawRainbowTimer(ctx, weatherExpiration, visualTime, timerY, GAME_WIDTH);
      timerY += 30;
    }

    // All Powerup Timers
    timerY = drawPowerupTimers(
      ctx,
      activePowerups,
      visualTime,
      timerY,
      GAME_WIDTH,
    );

    // Trash Suppression Timer
    drawTrashSuppressionTimer(
      ctx,
      trashSuppressionUntil.current,
      visualTime,
      timerY,
      GAME_WIDTH,
      isSuperBaitActive,
    );
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
