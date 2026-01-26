export enum FishRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  LEGENDARY = "LEGENDARY",
}

export type Language = "en" | "es" | "zh";

export enum WeatherType {
  CLEAR = "CLEAR",
  RAIN = "RAIN",
  SNOW = "SNOW",
  WIND = "WIND",
  FOG = "FOG",
  RAINBOW = "RAINBOW",
}

export interface FishType {
  id: string;
  name: string;
  rarity: FishRarity;
  weight: number; // Affects retraction speed (higher = slower)
  value: number;
  speed: number; // Swimming speed
  color: string;
  width: number;
  height: number;
  minDepth: number; // 0 to 1 (percentage of screen height)
  maxDepth: number;
  isTrash?: boolean; // Identifies if the item is trash
  requiredWeather?: WeatherType[]; // Only spawns during these weather conditions
  isNightOnly?: boolean; // Only spawns during night hours
  showInBag?: boolean; // Optional flag to hide from bag/encyclopedia (default: true)
}

export interface GameState {
  money: number;
  lifetimeEarnings: number; // Total money earned ever (for achievements)
  fishCaught: Record<string, number>; // fishId -> count
  unlockedFish: string[]; // List of fish IDs seen/caught
  achievements: string[]; // List of unlocked achievement IDs
  clawSpeedLevel: number;
  clawStrengthLevel: number; // Could affect ability to catch heavy items
  fishDensityLevel: number; // Increases max fish on screen
  trashFilterLevel: number; // Reduces trash spawn rate
  inventory: Record<string, number>; // itemId -> quantity owned
  activePowerups: Record<string, number>; // powerupId -> expiration timestamp
  purchasedPowerups: string[]; // List of powerup IDs bought at least once
  usedPromoCodes: string[]; // Track used one-time codes
  successfulPromoCodes: number; // Count of successful promo code uses (for achievements)
  weather: WeatherType;
  weatherExpiration?: number; // Timestamp when special weather ends
  currentCombo: number;
  maxCombo: number;
  unlockedCostumes: string[]; // List of costume IDs
  equippedCostume: string; // Current costume ID
  unlockedPets: string[]; // List of pet IDs
  equippedPet: string | null; // Current pet ID
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel: number;
}

export interface Costume {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export interface Pet {
  id: string;
  name: string;
  description: string;
  cost: number;
}

export enum AchievementCategory {
  FISH = "FISH",
  TRASH = "TRASH",
  MYSTERY = "MYSTERY",
  MONEY = "MONEY",
  SECRET = "SECRET",
  WEATHER = "WEATHER",
  COMBO = "COMBO",
  NARWHAL = "NARWHAL",
  PROMO = "PROMO",
}

export interface Achievement {
  id: string;
  category: AchievementCategory;
  threshold: number;
  icon: string; // Just a simple emoji or char for now
}

// --- Internal Game Entities ---

export type EntityFish = {
  x: number;
  y: number;
  vx: number;
  vy?: number; // Added for sinking items
  type: FishType;
  facingRight: boolean;
};

export type FloatingText = {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number; // 0 to 1
  id: number;
};

export type ParticleType =
  | "RAIN"
  | "SNOW"
  | "LEAF"
  | "WIND_LINE"
  | "MUSIC"
  | "MIST"
  | "BUBBLE"
  | "RAINBOW_SPARKLE";

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: ParticleType;
  wobble?: number;
  text?: string; // For music notes
  life?: number; // 0 to 1 for fading
};

export enum ClawState {
  IDLE,
  SHOOTING,
  RETRACTING,
}

export type ClawDebuff = "NONE" | "NUMBED" | "SEVERED";

export type ClawEntity = {
  state: ClawState;
  angle: number;
  angleSpeed: number;
  length: number;
  xOffset: number; // Offset from center
  caughtFish: EntityFish[];
  numbedUntil: number; // Timestamp until which the claw is disabled (for any reason)
  debuffType: ClawDebuff;
};
