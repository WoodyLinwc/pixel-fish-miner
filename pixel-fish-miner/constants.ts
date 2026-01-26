import {
  Achievement,
  AchievementCategory,
  FishRarity,
  FishType,
  Upgrade,
  WeatherType,
  Costume,
  Pet,
} from "./types";

export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;
export const SURFACE_Y = 120; // The water level

export const FISH_TYPES: FishType[] = [
  // Trash Items (Shallow Depth)
  {
    id: "old_boot",
    name: "Old Boot",
    rarity: FishRarity.COMMON,
    weight: 50, // Heavy trash
    value: 1,
    speed: 0.5, // Drifts slowly
    color: "#795548",
    width: 25,
    height: 25,
    minDepth: 0.1,
    maxDepth: 0.35,
    isTrash: true,
  },
  {
    id: "rusty_can",
    name: "Rusty Can",
    rarity: FishRarity.COMMON,
    weight: 30,
    value: 2,
    speed: 0.8,
    color: "#ff7043",
    width: 20,
    height: 20,
    minDepth: 0.1,
    maxDepth: 0.4,
    isTrash: true,
  },
  {
    id: "plastic_bottle",
    name: "Plastic Bottle",
    rarity: FishRarity.COMMON,
    weight: 15,
    value: 1,
    speed: 1.0,
    color: "#e1f5fe",
    width: 32, // Longer to look less squeezed
    height: 12,
    minDepth: 0.05,
    maxDepth: 0.25,
    isTrash: true,
  },
  {
    id: "straw",
    name: "Plastic Straw",
    rarity: FishRarity.COMMON,
    weight: 5,
    value: 0,
    speed: 1.2,
    color: "#f44336",
    width: 14, // Reduced width for shorter L-bend
    height: 20, // Reduced height for shorter stem
    minDepth: 0.05,
    maxDepth: 0.2,
    isTrash: true,
  },
  // Stationary Bottom Items
  {
    id: "shell",
    name: "Shiny Shell",
    rarity: FishRarity.COMMON,
    weight: 20,
    value: 250,
    speed: 0, // Stationary
    color: "#f48fb1",
    width: 24,
    height: 20,
    minDepth: 0.9,
    maxDepth: 0.97,
  },
  {
    id: "sea_cucumber",
    name: "Sea Cucumber",
    rarity: FishRarity.UNCOMMON,
    weight: 25,
    value: 200,
    speed: 0, // Stationary
    color: "#7b1fa2",
    width: 40,
    height: 16,
    minDepth: 0.9,
    maxDepth: 0.97,
  },
  {
    id: "coral",
    name: "Coral",
    rarity: FishRarity.COMMON,
    weight: 35,
    value: 150,
    speed: 0, // Stationary
    color: "#ff8a80", // Pink/Red
    width: 55, // Wider for spread out design
    height: 40,
    minDepth: 0.88,
    maxDepth: 0.98,
  },
  // Common Fish
  {
    id: "sardine",
    name: "Sardine",
    rarity: FishRarity.COMMON,
    weight: 10,
    value: 10,
    speed: 2.5,
    color: "#cfd8dc", // Silver
    width: 30,
    height: 12, // Slender
    minDepth: 0.2,
    maxDepth: 0.6,
  },
  {
    id: "herring",
    name: "Herring",
    rarity: FishRarity.COMMON,
    weight: 12,
    value: 15,
    speed: 2.2,
    color: "#90a4ae", // Blue Grey
    width: 34,
    height: 14,
    minDepth: 0.25,
    maxDepth: 0.65,
  },
  {
    id: "small_yellow_croaker",
    name: "Small Yellow Croaker",
    rarity: FishRarity.UNCOMMON,
    weight: 15,
    value: 35,
    speed: 2.5,
    color: "#fff176",
    width: 32,
    height: 14,
    minDepth: 0.2,
    maxDepth: 0.6,
  },
  {
    id: "mackerel",
    name: "Mackerel",
    rarity: FishRarity.COMMON,
    weight: 12,
    value: 20,
    speed: 3.2,
    color: "#90caf9",
    width: 35,
    height: 14,
    minDepth: 0.15,
    maxDepth: 0.5,
  },
  {
    id: "clownfish",
    name: "Clownfish",
    rarity: FishRarity.COMMON,
    weight: 25,
    value: 25,
    speed: 1.8,
    color: "#ff9900",
    width: 30, // Was 40
    height: 18, // Was 25
    minDepth: 0.3,
    maxDepth: 0.7,
  },
  {
    id: "cod",
    name: "Atlantic Cod",
    rarity: FishRarity.COMMON,
    weight: 30,
    value: 55,
    speed: 1.5,
    color: "#8d6e63",
    width: 42,
    height: 20,
    minDepth: 0.5,
    maxDepth: 0.9,
  },
  {
    id: "boxfish",
    name: "Boxfish",
    rarity: FishRarity.UNCOMMON,
    weight: 20,
    value: 45,
    speed: 1.2, // Slow and boxy
    color: "#fdd835", // Yellow
    width: 30,
    height: 24,
    minDepth: 0.3,
    maxDepth: 0.8,
  },
  {
    id: "pomfret",
    name: "Pomfret",
    rarity: FishRarity.UNCOMMON,
    weight: 20,
    value: 60,
    speed: 2.0,
    color: "#b0bec5", // Blue Grey
    width: 35,
    height: 28, // Tall body
    minDepth: 0.3,
    maxDepth: 0.7,
  },
  {
    id: "needlefish",
    name: "Needlefish",
    rarity: FishRarity.UNCOMMON,
    weight: 15,
    value: 45,
    speed: 3.5, // Fast
    color: "#80deea", // Cyan/Light Blue
    width: 60, // Long
    height: 10, // Thin
    minDepth: 0.1, // Surface dweller usually
    maxDepth: 0.4,
  },
  {
    id: "squid",
    name: "Squid",
    rarity: FishRarity.UNCOMMON,
    weight: 30,
    value: 65,
    speed: 1.5,
    color: "#e57373", // Red/Pink
    width: 35,
    height: 20,
    minDepth: 0.4,
    maxDepth: 0.8,
  },
  {
    id: "sea_bass",
    name: "Sea Bass",
    rarity: FishRarity.UNCOMMON,
    weight: 40,
    value: 55,
    speed: 2.0,
    color: "#9ccc65", // Light Green
    width: 48,
    height: 24,
    minDepth: 0.3,
    maxDepth: 0.75,
  },
  {
    id: "red_snapper",
    name: "Red Snapper",
    rarity: FishRarity.UNCOMMON,
    weight: 35,
    value: 80,
    speed: 2.0,
    color: "#ef5350",
    width: 45,
    height: 28,
    minDepth: 0.4,
    maxDepth: 0.8,
  },
  {
    id: "salmon",
    name: "King Salmon",
    rarity: FishRarity.UNCOMMON,
    weight: 45,
    value: 105,
    speed: 2.8,
    color: "#ff8a65", // Deep Orange
    width: 55,
    height: 26,
    minDepth: 0.3,
    maxDepth: 0.8,
  },
  {
    id: "wolffish",
    name: "Wolffish",
    rarity: FishRarity.RARE,
    weight: 50,
    value: 90,
    speed: 1.8,
    color: "#78909c",
    width: 55,
    height: 22,
    minDepth: 0.6,
    maxDepth: 0.95,
  },
  {
    id: "tuna",
    name: "Tuna",
    rarity: FishRarity.UNCOMMON,
    weight: 60,
    value: 125,
    speed: 3.5,
    color: "#3366ff",
    width: 60,
    height: 30,
    minDepth: 0.4,
    maxDepth: 0.9,
  },
  {
    id: "large_yellow_croaker",
    name: "Large Yellow Croaker",
    rarity: FishRarity.RARE,
    weight: 30,
    value: 160,
    speed: 2.2,
    color: "#fbc02d",
    width: 45,
    height: 18,
    minDepth: 0.4,
    maxDepth: 0.8,
  },
  {
    id: "turbot",
    name: "Turbot",
    rarity: FishRarity.RARE,
    weight: 40,
    value: 150,
    speed: 1.0,
    color: "#5d4037", // Dark Brown
    width: 45,
    height: 35, // Rounder than flounder
    minDepth: 0.7,
    maxDepth: 0.95,
  },
  {
    id: "ribbonfish",
    name: "Ribbonfish",
    rarity: FishRarity.RARE,
    weight: 25,
    value: 180,
    speed: 2.0,
    color: "#e0e0e0", // Silver
    width: 70, // Very long
    height: 12, // Thin
    minDepth: 0.6,
    maxDepth: 0.9,
  },
  {
    id: "giant_grouper",
    name: "Giant Grouper",
    rarity: FishRarity.RARE,
    weight: 50,
    value: 200,
    speed: 2.5,
    color: "#6d4c41", // Grayish Brown
    width: 50,
    height: 35,
    minDepth: 0.5,
    maxDepth: 0.85,
  },
  {
    id: "anglerfish",
    name: "Anglerfish",
    rarity: FishRarity.RARE,
    weight: 45,
    value: 250,
    speed: 1.2, // Slow moving
    color: "#311b92", // Dark Deep Purple
    width: 40,
    height: 35,
    minDepth: 0.7, // Deep
    maxDepth: 0.95,
    isNightOnly: true,
  },
  {
    id: "whale",
    name: "Minke Whale",
    rarity: FishRarity.LEGENDARY,
    weight: 150,
    value: 350,
    speed: 1.2,
    color: "#9999ff",
    width: 100,
    height: 60,
    minDepth: 0.6,
    maxDepth: 0.95,
  },
  // Dangerous Fish
  {
    id: "crab",
    name: "Pinchy Crab",
    rarity: FishRarity.UNCOMMON,
    weight: 25,
    value: 0,
    speed: 1.5,
    color: "#d32f2f",
    width: 30,
    height: 20,
    minDepth: 0.3,
    maxDepth: 0.8,
    showInBag: false, // Don't show in bag since it can't be caught
  },
  {
    id: "electric_jelly",
    name: "Electric Jelly",
    rarity: FishRarity.UNCOMMON,
    weight: 20,
    value: 15,
    speed: 1.0,
    color: "#e040fb",
    width: 25,
    height: 30,
    minDepth: 0.3,
    maxDepth: 0.8,
  },
  // Weather Specials (Deep)
  {
    id: "thunder_eel",
    name: "Thunder Eel",
    rarity: FishRarity.RARE,
    weight: 55,
    value: 400,
    speed: 5.0, // Very fast
    color: "#ffff00",
    width: 80, // Long
    height: 15, // Thin
    minDepth: 0.75,
    maxDepth: 0.95,
    requiredWeather: [WeatherType.RAIN],
  },
  {
    id: "ice_fin",
    name: "Ice Fin",
    rarity: FishRarity.RARE,
    weight: 70, // Heavy ice
    value: 400,
    speed: 1.5, // Slow
    color: "#e0f7fa",
    width: 50,
    height: 50, // Blocky/Spiky
    minDepth: 0.75,
    maxDepth: 0.95,
    requiredWeather: [WeatherType.SNOW],
  },
  {
    id: "wind_ray",
    name: "Wind Ray",
    rarity: FishRarity.RARE,
    weight: 40,
    value: 400,
    speed: 4.5,
    color: "#bdbdbd",
    width: 60,
    height: 60,
    minDepth: 0.75,
    maxDepth: 0.95,
    requiredWeather: [WeatherType.WIND],
  },
  {
    id: "sea_turtle",
    name: "Sea Turtle",
    rarity: FishRarity.RARE,
    weight: 80, // Heavy
    value: 400,
    speed: 0.8, // Slow
    color: "#43a047", // Green
    width: 45,
    height: 25,
    minDepth: 0.6,
    maxDepth: 0.9,
    requiredWeather: [WeatherType.FOG],
  },
  {
    id: "narwhal",
    name: "Narwhal",
    rarity: FishRarity.LEGENDARY,
    weight: 90,
    value: 1000,
    speed: 2.0,
    color: "#b0bec5",
    width: 70,
    height: 35,
    minDepth: 0.5,
    maxDepth: 0.9,
    requiredWeather: [WeatherType.RAINBOW],
  },
  // Special
  {
    id: "mystery_bag",
    name: "Mystery Bag",
    rarity: FishRarity.LEGENDARY, // Rare spawn
    weight: 35,
    value: 0, // Determined at runtime
    speed: 2.0,
    color: "#8d6e63",
    width: 24, // Smaller size
    height: 28, // Smaller size
    minDepth: 0.2,
    maxDepth: 0.9,
  },
  // Event Items
  {
    id: "supply_box",
    name: "Supply Box",
    rarity: FishRarity.LEGENDARY,
    weight: 40,
    value: 2000,
    speed: 0,
    color: "#d7ccc8",
    width: 30,
    height: 30,
    minDepth: 0, // Spawns from sky
    maxDepth: 1, // Sinks to bottom
  },
];

export const UPGRADES: Record<string, Upgrade> = {
  clawSpeed: {
    id: "clawSpeed",
    name: "Motor Turbo",
    description: "Retract the claw faster when carrying fish.",
    baseCost: 100,
    costMultiplier: 1.5, // Reduced from 1.8 for smoother long-term curve
    maxLevel: 20, // Increased from 10 to 20
  },
  clawStrength: {
    id: "clawStrength",
    name: "Titanium Grip",
    description: "Increases the speed at which you throw the claw.",
    baseCost: 150,
    costMultiplier: 1.5,
    maxLevel: 20,
  },
  fishDensity: {
    id: "fishDensity",
    name: "Sonar Lure",
    description: "Attracts more fish to the area. Increases max fish count.",
    baseCost: 200,
    costMultiplier: 1.5,
    maxLevel: 20,
  },
  trashFilter: {
    id: "trashFilter",
    name: "Trash Filter",
    description: "Reduces the amount of trash in the water.",
    baseCost: 125,
    costMultiplier: 1.5,
    maxLevel: 20,
  },
};

export const POWERUPS: Record<
  string,
  {
    id: string;
    name: string;
    description: string;
    cost: number;
    duration: number;
  }
> = {
  multiClaw: {
    id: "multiClaw",
    name: "Octopus Gear",
    description: "Deploys 4 extra claws for 30 seconds!",
    cost: 500,
    duration: 30000,
  },
  superBait: {
    id: "superBait",
    name: "Crazy Bait",
    description: "Attracts many fish and repels trash for 30s!",
    cost: 500,
    duration: 30000,
  },
  diamondHook: {
    id: "diamondHook",
    name: "Diamond Hook",
    description: "Instantly reel in anything you catch for 30s!",
    cost: 500,
    duration: 30000,
  },
  superNet: {
    id: "superNet",
    name: "Super Net",
    description: "Expands a net on impact to catch everything nearby!",
    cost: 500,
    duration: 30000,
  },
  magicConch: {
    id: "magicConch",
    name: "Magic Conch",
    description: "Summons a random weather event for 60s!",
    cost: 500,
    duration: 60000,
  },
  rainbowBulb: {
    id: "rainbowBulb",
    name: "Rainbow Jar",
    description: "Instantly summons a double rainbow! Narwhals love this.",
    cost: 5000,
    duration: 60000,
  },
};

export const COSTUMES: Costume[] = [
  {
    id: "default",
    name: "Fisherman",
    description: "The classic look. Reliable and ready to fish.",
    cost: 0,
  },
  {
    id: "sailor",
    name: "Sailor Boy",
    description: "Ahoy! A neat uniform for the open seas.",
    cost: 7500, // Increased from 2500
  },
  {
    id: "diver",
    name: "Diver",
    description: "Equipped for the depths with scuba gear.",
    cost: 20000,
  },
  {
    id: "pirate",
    name: "Dread Pirate",
    description: "Yarrr! Rule the waves with this rugged outfit.",
    cost: 45000, // Increased from 6500
  },
  {
    id: "lifeguard",
    name: "Lifeguard",
    description: "Ready to save the day in bright red.",
    cost: 80000,
  },
  {
    id: "sushi_master",
    name: "Sushi Master",
    description: "Traditional chef attire for a culinary expert.",
    cost: 150000,
  },
  {
    id: "captain",
    name: "Sea Captain",
    description: "A distinguished look for a master angler.",
    cost: 250000, // Increased from 20000 - True Endgame Goal
  },
];

export const PETS: Pet[] = [
  {
    id: "goldfish",
    name: "Goldfish Tank",
    description: "A quiet friend in a glass home.",
    cost: 5000,
  },
  {
    id: "parrot",
    name: "Parrot",
    description: "A colorful companion that loves crackers.",
    cost: 12000,
  },
  {
    id: "penguin",
    name: "Penguin",
    description: "A waddling wanderer. Keeps the fish fresh!",
    cost: 25000,
  },
  {
    id: "ghost_crab",
    name: "Ghost Crab",
    description: "Fast on its feet. Don't worry, he doesn't pinch lines.",
    cost: 40000,
  },
  {
    id: "cat",
    name: "Cat",
    description: "Hates water, loves fish.",
    cost: 55000,
  },
  {
    id: "pelican",
    name: "Pelican",
    description:
      "Has a massive beak for storage. Don't let him eat the profits!",
    cost: 85000,
  },
  {
    id: "dog",
    name: "Dog",
    description: "A loyal friend for long voyages.",
    cost: 120000,
  },
];

export const INITIAL_GAME_STATE = {
  money: 0,
  lifetimeEarnings: 0,
  fishCaught: {},
  unlockedFish: [],
  achievements: [],
  clawSpeedLevel: 1,
  clawStrengthLevel: 1,
  fishDensityLevel: 1,
  trashFilterLevel: 1,
  inventory: {},
  activePowerups: {},
  purchasedPowerups: [],
  usedPromoCodes: [], // Init empty
  successfulPromoCodes: 0, // Track successful promo uses
  weather: WeatherType.CLEAR,
  weatherExpiration: undefined,
  currentCombo: 0,
  maxCombo: 0,
  unlockedCostumes: ["default"],
  equippedCostume: "default",
  unlockedPets: [],
  equippedPet: null,
};

export const ACHIEVEMENTS: Achievement[] = [
  // Fish
  {
    id: "fish_1",
    category: AchievementCategory.FISH,
    threshold: 1,
    icon: "🐟",
  },
  {
    id: "fish_5",
    category: AchievementCategory.FISH,
    threshold: 5,
    icon: "🐟",
  },
  {
    id: "fish_20",
    category: AchievementCategory.FISH,
    threshold: 20,
    icon: "🐠",
  },
  {
    id: "fish_50",
    category: AchievementCategory.FISH,
    threshold: 50,
    icon: "🐠",
  },
  {
    id: "fish_100",
    category: AchievementCategory.FISH,
    threshold: 100,
    icon: "🦈",
  },
  {
    id: "fish_500",
    category: AchievementCategory.FISH,
    threshold: 500,
    icon: "🦈",
  },
  {
    id: "fish_1000",
    category: AchievementCategory.FISH,
    threshold: 1000,
    icon: "👑",
  },
  {
    id: "fish_5000",
    category: AchievementCategory.FISH,
    threshold: 5000,
    icon: "👾",
  }, // New

  // Weather Specials
  {
    id: "weather_1",
    category: AchievementCategory.WEATHER,
    threshold: 1,
    icon: "🌧️",
  },
  {
    id: "weather_5",
    category: AchievementCategory.WEATHER,
    threshold: 5,
    icon: "💨",
  },
  {
    id: "weather_10",
    category: AchievementCategory.WEATHER,
    threshold: 10,
    icon: "❄️",
  },
  {
    id: "weather_50",
    category: AchievementCategory.WEATHER,
    threshold: 50,
    icon: "⚡",
  }, // New

  // Trash
  {
    id: "trash_1",
    category: AchievementCategory.TRASH,
    threshold: 1,
    icon: "👞",
  },
  {
    id: "trash_5",
    category: AchievementCategory.TRASH,
    threshold: 5,
    icon: "👞",
  },
  {
    id: "trash_20",
    category: AchievementCategory.TRASH,
    threshold: 20,
    icon: "👞",
  },
  {
    id: "trash_50",
    category: AchievementCategory.TRASH,
    threshold: 50,
    icon: "🥾",
  },
  {
    id: "trash_100",
    category: AchievementCategory.TRASH,
    threshold: 100,
    icon: "🥾",
  },
  {
    id: "trash_500",
    category: AchievementCategory.TRASH,
    threshold: 500,
    icon: "🥾",
  },
  {
    id: "trash_1000",
    category: AchievementCategory.TRASH,
    threshold: 1000,
    icon: "♻️",
  },

  // Mystery
  {
    id: "mystery_1",
    category: AchievementCategory.MYSTERY,
    threshold: 1,
    icon: "📦",
  },
  {
    id: "mystery_5",
    category: AchievementCategory.MYSTERY,
    threshold: 5,
    icon: "🛍️",
  },
  {
    id: "mystery_20",
    category: AchievementCategory.MYSTERY,
    threshold: 20,
    icon: "🎁",
  },

  // Money - Expanded for new economy
  {
    id: "money_100",
    category: AchievementCategory.MONEY,
    threshold: 100,
    icon: "🪙",
  },
  {
    id: "money_1000",
    category: AchievementCategory.MONEY,
    threshold: 1000,
    icon: "💴",
  },
  {
    id: "money_5000",
    category: AchievementCategory.MONEY,
    threshold: 5000,
    icon: "💶",
  },
  {
    id: "money_10000",
    category: AchievementCategory.MONEY,
    threshold: 10000,
    icon: "💷",
  },
  {
    id: "money_50000",
    category: AchievementCategory.MONEY,
    threshold: 50000,
    icon: "💵",
  },
  {
    id: "money_100000",
    category: AchievementCategory.MONEY,
    threshold: 100000,
    icon: "💰",
  },
  {
    id: "money_500000",
    category: AchievementCategory.MONEY,
    threshold: 500000,
    icon: "💎",
  }, // New
  {
    id: "money_1000000",
    category: AchievementCategory.MONEY,
    threshold: 1000000,
    icon: "🏦",
  }, // New

  // Combo
  {
    id: "combo_5",
    category: AchievementCategory.COMBO,
    threshold: 5,
    icon: "🧨",
  },
  {
    id: "combo_10",
    category: AchievementCategory.COMBO,
    threshold: 10,
    icon: "🔥",
  },
  {
    id: "combo_50",
    category: AchievementCategory.COMBO,
    threshold: 50,
    icon: "❤️‍🔥",
  },
  {
    id: "combo_100",
    category: AchievementCategory.COMBO,
    threshold: 100,
    icon: "☄️",
  },

  // Secret
  {
    id: "secret_woody",
    category: AchievementCategory.SECRET,
    threshold: 1,
    icon: "🤠",
  },
  // Narwhal
  {
    id: "catch_narwhal",
    category: AchievementCategory.NARWHAL,
    threshold: 1,
    icon: "🦄",
  },

  // Promo King
  {
    id: "promo_1",
    category: AchievementCategory.PROMO,
    threshold: 1,
    icon: "🎫",
  },
];
