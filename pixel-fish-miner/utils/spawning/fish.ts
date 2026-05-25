/**
 * Fish spawning logic
 */

import {
  FISH_TYPES,
  GAME_WIDTH,
  GAME_HEIGHT,
  SURFACE_Y,
} from "../../constants";
import { EntityFish, FishRarity, FishType, WeatherType } from "../../types";

// Spawn Rate Weights
const RARITY_WEIGHTS = {
  [FishRarity.COMMON]: 50,
  [FishRarity.UNCOMMON]: 25,
  [FishRarity.RARE]: 10,
  [FishRarity.LEGENDARY]: 4,
};

// All 6 migration fish IDs (3 normal + 3 kings)
const MIGRATION_FISH_IDS = [
  "pacific_saury",
  "mullet",
  "anchovy",
  "king_saury",
  "king_mullet",
  "king_anchovy",
];

/**
 * Get weighted random fish type based on conditions
 */
export const getWeightedFishType = (
  weather: WeatherType,
  gameHour: number,
  trashFilterLevel: number,
  isSuperBaitActive: boolean,
  isFishFrenzyActive: boolean,
  unlockedFish: string[], // NEW PARAMETER
  migrationActive: boolean = false, // NEW: Migration parameter
): FishType => {
  // CHEAT: Fish Frenzy - Force spawn special weather fish
  if (isFishFrenzyActive) {
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

  // Filter out static items from random spawning logic (Shell, Sea Cucumber, Coral, Anchor)
  availableFish = availableFish.filter(
    (f) =>
      f.id !== "shell" &&
      f.id !== "sea_cucumber" &&
      f.id !== "coral" &&
      f.id !== "anchor",
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
  const isNight = gameHour >= 19 || gameHour < 5;

  availableFish = availableFish.filter((f) => {
    if (f.isNightOnly && !isNight) return false;
    return true;
  });

  // NEW: Filter out ghost fish if not unlocked
  availableFish = availableFish.filter((f) => {
    if (
      f.id === "phantom_perch" ||
      f.id === "spectral_sardine" ||
      f.id === "ghost_squid"
    ) {
      return unlockedFish.includes(f.id);
    }
    return true;
  });

  // MIGRATION - Only migration fish spawn (normal + king), all others filtered out
  if (migrationActive) {
    // During migration, ONLY the 6 migration fish can spawn (3 normal + 3 kings).
    // Kings use RARE weight (10) vs commons at COMMON weight (50), so they appear
    // roughly 1-in-6 times — rare but catchable in a migration window.
    availableFish = FISH_TYPES.filter((f) => MIGRATION_FISH_IDS.includes(f.id));
  } else {
    // Outside migration, exclude ALL migration fish (normal and kings)
    availableFish = availableFish.filter(
      (f) => !MIGRATION_FISH_IDS.includes(f.id),
    );
  }

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
};

/**
 * Spawn a fish entity
 */
export const spawnFish = (
  fishes: EntityFish[],
  weather: WeatherType,
  gameHour: number,
  trashFilterLevel: number,
  isSuperBaitActive: boolean,
  isFishFrenzyActive: boolean,
  trashSuppressionUntil: number,
  lastNarwhalSpawnTime: number,
  unlockedFish: string[], // NEW PARAMETER
  migrationActive: boolean = false, // NEW: Migration parameter
): { shouldUpdateNarwhalTime: boolean } => {
  const now = Date.now();
  let type = getWeightedFishType(
    weather,
    gameHour,
    trashFilterLevel,
    isSuperBaitActive,
    isFishFrenzyActive,
    unlockedFish, // PASS THE NEW PARAMETER
    migrationActive, // PASS MIGRATION PARAMETER
  );

  let shouldUpdateNarwhalTime = false;

  // --- FORCE NARWHAL LOGIC (10s Interval) ---
  // If it's Rainbow weather, check if 10s have passed since last Narwhal.
  if (weather === WeatherType.RAINBOW) {
    if (now - lastNarwhalSpawnTime >= 10000) {
      const narwhalType = FISH_TYPES.find((f) => f.id === "narwhal");
      if (narwhalType) {
        type = narwhalType;
        shouldUpdateNarwhalTime = true;
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
      f.id !== "anchor" &&
      f.id !== "narwhal" &&
      f.id !== "supply_box",
  );

  // If trash is suppressed via Mystery Bag and we picked trash, force pick a standard fish
  if ((now < trashSuppressionUntil || isSuperBaitActive) && type.isTrash) {
    if (fishOnly.length > 0) {
      type = fishOnly[Math.floor(Math.random() * fishOnly.length)];
    }
  }

  // Cap the number of trash items on screen.
  const currentTrashCount = fishes.filter((f) => f.type.isTrash).length;
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
  fishes.push({
    x: startLeft ? -type.width : GAME_WIDTH + type.width,
    y: y,
    vx: startLeft ? type.speed : -type.speed,
    type: type,
    facingRight: startLeft,
  });

  return { shouldUpdateNarwhalTime };
};
