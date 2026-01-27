# Pixel Fish Miner - AI Developer Context

## Project Overview

This project is a React-based arcade game inspired by "Gold Miner," styled with pixel art aesthetics. The player controls a boat with a swinging claw to catch fish, trash, and special items to earn money, upgrade equipment, and complete achievements. The game features a dynamic day/night cycle, weather systems, pet companions, and a cosmetic shop.

## Tech Stack

- **Framework:** React 19 (Hooks heavily used).
- **Styling:** Tailwind CSS + Inline styles for specific dynamic values.
- **Rendering:** HTML5 Canvas (managed within `GameCanvas.tsx` and `utils/drawing.ts`).
- **State Management:** React `useState` for UI/Persistence, `useRef` for high-frequency game loop data.
- **Persistence:** `localStorage` (Keys: `pixel-fish-miner-save`, `pixel-fish-miner-lang`, `pixel-fish-miner-music`, `pixel-fish-miner-sfx`).
- **Audio:** HTML5 Audio API (managed via `audioManager.ts`).
- **Encryption:** XOR cipher + Base64 encoding for save file export/import (`encryption.ts`).

---

## File Structure & Responsibilities

### 1. Core Entry Points

- **`index.html`**:
  - Sets up the DOM root.
  - Imports the "Press Start 2P" font from Google Fonts.
  - Defines global CSS animations (`shake`, `slide-up`, `slide-in-right`, `fade-in`) used for UI feedback.
- **`index.tsx`**: Mounts `App.tsx` to the DOM.
- **`App.tsx`**: **The Application Controller.**
  - **State Owner**: Holds the persistent `GameState`.
  - **Game Loops**:
    - **Weather Cycle**: Rotates weather naturally every 20s (unless locked by event/powerup).
    - **Combo Timer**: Resets combo if 10s pass without a catch.
    - **Powerup Timer**: Updates UI for active effect duration and checks weather expiration.
  - **Global Events**:
    - **Promo Codes**: Handles cheat codes for debugging/events.
    - **Achievements**: Checks logic after every catch/round.
    - **Passive Income**: Updates money from Pet earnings every 30s.
  - **Audio Management**: Controls music and sound effects based on user settings.
  - **UI Composition**: Renders `GameCanvas`, HUD, and Modals.

### 2. Game Engine (`components/GameCanvas.tsx`)

The bridge between React state and the HTML5 Canvas API.

- **Rendering Loop**: Uses `requestAnimationFrame`.
- **Physics & Logic**:
  - **Claw State Machine**:
    - `IDLE`: Rotates (oscillates between angles). Sways if Numbed, Short if Severed.
    - `SHOOTING`: Extends at speed based on `clawThrowSpeedMultiplier`. Handles Collision.
    - `RETRACTING`: Returns at speed inversely proportional to weight (unless Diamond Hook active).
  - **Complex Collision**:
    - **Standard**: Point-based collision detection using rectangular bounds.
    - **Super Net**: Radius-based multi-catch (150px radius).
    - **Debuffs**:
      - 'Crab' cuts line → `SEVERED` state (5s cooldown).
      - 'Electric Jelly' shocks → `NUMBED` state (5s cooldown).
  - **Spawning**:
    - **Weighted Random**: Based on Rarity weights and Fish Density level.
    - **Conditions**: Checks `requiredWeather` and `isNightOnly` (19:00-05:00).
    - **Events**:
      - 'Narwhal' forced spawn every 10s during Rainbow weather.
      - 'Supply Box' via Airplane event (promo code or rare random).
  - **Environment**:
    - **Day/Night Cycle**: 3-minute full cycle (180s = 24 game hours). `gameHour` drives sky gradients and lighting.
    - **Particles**: Rain, Snow, Wind Leaves, Fog Mist, Rainbow Sparkles, Bubbles, Music Notes.
    - **Ambient**: Background boats (parallax), Seagulls, Sun/Moon/Stars, Clouds.

### 3. Rendering System (`utils/`)

Rendering logic is modularized to keep `GameCanvas` clean and maintainable.

#### Core Drawing Files

- **`utils/drawing.ts`**: Barrel export file that re-exports all drawing utilities.
- **`utils/drawHelpers.ts`**: Color interpolation utilities (`hexToRgb`, `lerp`, `lerpColor`).
- **`utils/drawClaw.ts`**: Renders the rope (normal/severed/electric), claw mechanism, and "Net" visual if Super Net is active.
- **`utils/drawPet.ts`**: Renders pixel art for pets (Goldfish, Parrot, Cat, Dog, Penguin, Ghost Crab, Pelican) with idle animations.
- **`utils/drawAirplane.ts`**: Renders the supply drop airplane (cargo plane design) with day/night lighting.
- **`utils/drawFish.ts`**: Main entry for entity rendering. Dispatches to specific files:
  - `fish/commonFish.ts`: Sardine, Herring, Small Yellow Croaker, Mackerel, Cod, Boxfish, Pomfret
  - `fish/uncommonFish.ts`: Clownfish, Squid, Sea Bass, Red Snapper, Salmon, Tuna, Needlefish
  - `fish/rareFish.ts`: Large Yellow Croaker, Turbot, Ribbonfish, Giant Grouper, Anglerfish, Wolffish, Crab, Electric Jelly
  - `fish/legendaryFish.ts`: Whale, Narwhal
  - `fish/weatherFish.ts`: Thunder Eel (Rain), Ice Fin (Snow), Wind Ray (Wind), Sea Turtle (Fog)
  - `fish/staticItems.ts`: Shell, Sea Cucumber, Coral, Mystery Bag, Supply Box
  - `fish/trash.ts`: Old Boot, Rusty Can, Plastic Bottle, Straw
  - Uses `canvas` path drawing commands (rects, arcs, lines, paths) to create pixel art procedurally.

#### Environment Rendering System (`utils/environment/`)

The environment rendering has been extracted into a modular folder structure for better organization and maintainability.

- **`utils/environment/index.ts`**: Main export barrel that re-exports all environment modules and types.

- **`utils/environment/colors.ts`**: Environment color calculation system
  - Exports `getEnvironmentColors(hour, weather)` function
  - Calculates sky gradients based on time of day (Night, Dawn, Day, Dusk)
  - Returns colors for sky (top/bottom), overlays (darkness, weather effects)
  - Handles special weather cases (Fog, Rainbow override normal day/night cycle)
  - Color transitions use `lerpColor` from `drawHelpers.ts` for smooth blending

- **`utils/environment/sky.ts`**: Sky and celestial body rendering
  - `drawSkyGradient()`: Draws gradient background from skyTop to skyBot
  - `drawSun()`: Renders sun with glow (visible 5 AM - 7 PM, arc movement)
  - `drawMoon()`: Renders moon with crater (visible 6 PM - 6 AM, arc movement)
  - `drawStars()`: Renders blinking stars at night with fade-in/fade-out during dawn/dusk

- **`utils/environment/clouds.ts`**: Cloud rendering system
  - Exports `Cloud` type interface
  - `drawClouds()`: Renders moving clouds with pixel art style
  - Cloud color changes based on time (night/day) and weather (stormy, fog)
  - Simple two-layer pixel art design (main body + smaller top detail)

- **`utils/environment/seagulls.ts`**: Seagull rendering and animation
  - Exports `Seagull` type interface
  - `drawSeagull()`: Renders individual seagull with flapping animation
  - 4-state wing animation cycle (Up, Mid, Down, Mid)
  - Flips sprite based on movement direction
  - `drawSeagulls()`: Batch renders all active seagulls

- **`utils/environment/boats.ts`**: Background boat rendering (parallax effect)
  - Exports `BackgroundBoat` type interface
  - Renders two types: SMALL (sailboat) and BIG (cargo ship)
  - Cargo ship features animated smoke puffs
  - Variable scale for depth perception
  - Flips sprite based on movement direction
  - `drawBackgroundBoats()`: Batch renders all boats

- **`utils/environment/water.ts`**: Water rendering system
  - `drawWaterBands()`: Renders 5 depth layers with different blue shades
  - `drawWaves()`: Animated wave surface with sine wave motion
  - Wave speed increases during Wind weather
  - `drawWaterSparkles()`: Renders blinking sparkles on water surface (daytime only)
  - Sparkles only appear when light level > 0.6

- **`utils/environment/rainbow.ts`**: Rainbow weather effect
  - `drawRainbow()`: Renders rainbow arc across sky during Rainbow weather
  - 5-color arc (red, yellow, green, blue, purple)
  - Semi-transparent (40% opacity)
  - Positioned above horizon with fixed radius

**Usage Pattern:**

```typescript
// In GameCanvas.tsx render function:
import {
  getEnvironmentColors,
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

// Calculate colors
const { skyTop, skyBot, overlay } = getEnvironmentColors(currentHour, weather);

// Draw environment layers
drawSkyGradient(ctx, GAME_WIDTH, SURFACE_Y, { skyTop, skyBot });
drawSun(ctx, currentHour, GAME_WIDTH, SURFACE_Y);
drawMoon(ctx, currentHour, GAME_WIDTH, SURFACE_Y);
drawStars(ctx, starsRef.current, currentHour, visualTime);
drawClouds(ctx, cloudsRef.current, currentHour, weather);
if (weather === WeatherType.RAINBOW) {
  drawRainbow(ctx, GAME_WIDTH, SURFACE_Y);
}
drawSeagulls(ctx, seagullsRef.current);
drawBackgroundBoats(ctx, backgroundBoatsRef.current, visualTime);
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
```

**Technical Notes:**

- All drawing functions use `ctx.save()` and `ctx.restore()` to prevent style bleeding
- Functions accept explicit parameters rather than relying on closure (makes them testable)
- Rendering order matters: Sky → Celestial → Clouds → Rainbow → Seagulls → Boats → Water
- Each module is self-contained with no external dependencies except types

### 4. Costume System (`utils/costumes/`)

The fisherman costume rendering has been extracted into modular files for better maintainability.

- **`utils/costumes/index.ts`**: Main export that routes costume rendering based on `costumeId`
  - Exports `drawFishermanCostume(ctx, x, y, costumeId)` function
  - Handles `ctx.save()`, `ctx.translate()`, and `ctx.restore()` for positioning
  - Switch statement routes to appropriate costume renderer

- **Individual Costume Files**:
  - `fisherman.ts`: Default costume - yellow hat, red vest with stripes, grey beard
  - `sailor.ts`: Breton striped shirt, blue pants, white sailor cap with gold anchor
  - `diver.ts`: Black wetsuit with cyan stripes, diving mask, yellow snorkel, air tank
  - `pirate.ts`: Red/black vest, wooden leg, hook hand, bandana, eye patch, pistol
  - `lifeguard.ts`: Red uniform with white cross, red shorts, lifebuoy, drink cup, visor cap, whistle
  - `sushiMaster.ts`: White chef coat with black lapels, traditional headband with red emblem, sushi knife, mustache, plate with sushi tower on head
  - `captain.ts`: Dark blue uniform with gold buttons, white beard, captain's hat with gold badge, tobacco pipe

- **File Naming Convention**:
  - Files use **camelCase** (e.g., `sushiMaster.ts`)
  - Costume IDs in constants use **snake_case** (e.g., `"sushi_master"`)
  - Function names use **camelCase** (e.g., `drawSushiMasterCostume()`)

- **Usage in GameCanvas**:

```typescript
import { drawFishermanCostume } from "../utils/costumes";

// In render function:
const manX = GAME_WIDTH / 2 + 40;
const manY = boatY;
drawFishermanCostume(ctx, manX, manY, equippedCostume);
```

- **Adding New Costumes**:
  1. Create new file in `utils/costumes/` (e.g., `ninja.ts`)
  2. Export function: `export const drawNinjaCostume = (ctx: CanvasRenderingContext2D) => { ... }`
  3. Add case to `index.ts` switch statement
  4. Add costume definition to `COSTUMES` in `constants.ts`
  5. Add translations to all language files

- **Technical Notes**:
  - All drawing assumes `ctx` is already translated to `(manX, manY)` position
  - Coordinates are relative to the fisherman's base position (boat deck)
  - Each costume function is self-contained with no external dependencies
  - Uses pixel art style with `ctx.fillRect()` for all rendering

### 5. Data Models (`types.ts` & `constants.ts`)

- **`types.ts`**:
  - `GameState`: Inventory, Upgrades, Unlocks, Active Effects, Settings. Includes `trashFilterLevel` for upgrade progression.
  - `FishType`: Fish properties including optional `showInBag` flag to hide from encyclopedia (used for Crab).
  - `WeatherType`: `CLEAR`, `RAIN`, `SNOW`, `WIND`, `FOG`, `RAINBOW`.
  - `ClawDebuff`: Status effects - `NONE`, `SEVERED`, `NUMBED`.
  - `ClawState`: `IDLE`, `SHOOTING`, `RETRACTING`.
- **`constants.ts`**: **Game Balance.**
  - `GAME_WIDTH`: 800px, `GAME_HEIGHT`: 600px, `SURFACE_Y`: 200px (water line).
  - `FISH_TYPES`: ~40 entities including fish, trash, static decor, and event items. Crab has `showInBag: false` (uncatchable, hidden from encyclopedia).
  - `UPGRADES`:
    - Claw Speed ($200 base) - Retract speed multiplier.
    - Claw Strength ($200 base) - Throw speed multiplier.
    - Fish Density ($400 base) - Spawn rate and max fish count.
    - Trash Filter ($400 base) - Reduces trash spawn rate (Level 1: 0%, Level 20: 95% reduction).
  - `POWERUPS`:
    - `multiClaw` (5 claws, 30s), `superBait` (No trash, fast spawn, 30s)
    - `diamondHook` (Fast retract, 30s), `superNet` (Radius catch, 30s)
    - `magicConch` (Random Weather, 60s), `rainbowBulb` (Rainbow Weather, 60s - unlocked via promo)
  - `COSTUMES`: Fisherman (default), Sailor, Diver, Pirate, Lifeguard, Sushi Master, Captain.
  - `PETS`: Goldfish ($50, $1/30s), Parrot ($100, $1/30s), Cat ($300, $2/30s), Dog ($500, $3/30s), Penguin ($200, $1/30s), Ghost Crab ($400, $2/30s), Pelican ($600, $3/30s).
  - `ACHIEVEMENTS`: Trophies for Fish, Money, Trash, Combo, Weather, Narwhal, Promo Codes, Secrets.

### 6. UI Components

- **`StatsPanel.tsx`**: Top HUD. Displays money, Shop/Bag/Slots/Achievement/Settings buttons.
- **`StoreModal.tsx`**: The main progression hub. Tabs for Upgrades, Powerups, Pets, Costumes, Promo Codes.
- **`BagModal.tsx`**: Encyclopedia. Renders fish icons dynamically using `drawEntity` on mini-canvases. Shows caught count and total stats.
- **`SlotMachineModal.tsx`**: Casino-style mini-game. Bet money, spin reels with fish symbols, win multipliers. Features:
  - **5 reels** (modern slot machine format)
  - **Sequential stopping**: Reels stop one-by-one from left to right (400ms delay)
  - Gold ring highlights on stopped reels
  - **Consecutive matching only**: Must match from leftmost reel
  - 7 fish symbol emojis (🐟 🐠 🦈 🐡 🦞 🦑 🐙)
  - Bet amounts: $25, $50, $100, $250, $500
  - **3-tier payout**: 20x (5 consecutive), 5x (4 consecutive), 2x (3 consecutive)
  - Expected RTP: ~50% (player-favorable but challenging)
  - Animated spinning with sound effects
  - Interactive lever on the right side
  - Messages display for 5 seconds (longer visibility)
  - Payout table shows "consecutive from left" rule
  - Mobile-optimized with scrollable content
- **`AchievementsModal.tsx`**: Displays achievement progress with visual progress bars.
- **`SettingsModal.tsx`**:
  - Music/SFX toggles, Language selection (EN/ES/ZH).
  - **Import/Export Save**: Download encrypted `.fishsave` files or upload to restore progress across devices.
  - Credits section with creator info and tech stack.
  - Mobile-optimized with scrollable content (`max-h-[75vh]`).
- **`PowerupBar.tsx`**: Bottom-right UI to activate inventory powerups. Shows count badges and active timers.
- **`AchievementToast.tsx`**: Pop-up notification for unlocks (4s duration, slides in from right).

### 7. Localization (`locales/`)

- **`translations.ts`**: Central export for all language dictionaries.
- **`en.ts`**, **`es.ts`**, **`zh.ts`**: Translation objects for English, Spanish, Chinese.

### 8. Audio System (`utils/audioManager.ts`)

- **Singleton Pattern**: Single `audioManager` instance exported.
- **Background Music**: Loops ocean ambience (`background.mp3`), controlled by user toggle.
- **Sound Effects**: Claw release, catch nothing, money, powerup, button click (all `.mp3`).
- **Volume Control**: Music at 30%, SFX at 50%.
- **Auto-play Handling**: Waits for user interaction before starting music (browser policy compliance).

---

## Game Systems & Logic Flows

### Passive Income (Pets)

- **Concept**: Pets generate money over time while equipped.
- **Implementation**: `GameCanvas.tsx` tracks `lastPetIncomeTime`. Every 30s, calls `onPassiveIncome`.
- **Rates**: Tiered based on pet cost (e.g., Goldfish $1, Dog $3, Pelican $3).
- **Visual**: Floating text "+$X" appears above boat when income is earned.

### Weather System

- **States**:
  - **CLEAR**: Default state, normal spawns.
  - **RAIN**: Spawns 'Thunder Eel'. Rain particle effects. Dark overlay.
  - **SNOW**: Spawns 'Ice Fin'. Snow particles with wobble. Light overlay.
  - **WIND**: Spawns 'Wind Ray'. Leaf particles, fast-moving clouds.
  - **FOG**: Spawns 'Sea Turtle'. Mist particles, grey sky, fog overlay.
  - **RAINBOW**: Spawns 'Narwhal' every 10s. Rainbow visual arc, sparkle particles.
- **Natural Transitions**:
  - Every 20s: 30% chance to clear from special weather, 5% chance to change from clear.
- **Forced Weather**:
  - Magic Conch (60s random weather), Rainbow Bulb (60s rainbow), Promo Codes (permanent until changed).

### Claw Mechanics

- **Multi-Claw Powerup**: Renders 5 distinct claws at x-offsets [-70, -35, 0, 35, 70]. Only center claw checks wall collision for shake effect.
- **Debuffs**:
  - **Severed** (Crab): Claw retracts immediately, visual broken rope, 5s repair timer, unusable.
  - **Numbed** (Electric Jelly): Claw retracts, turns yellow/flashing, 5s shock timer, unusable.
  - Note: Super Net protects against Electric Jelly shock but not Crab snip.
- **Super Net**:
  - Ignores single-point collision.
  - Captures all entities within 150px radius.
  - Visualizes as expanded green net bag with crosshatch pattern.
  - Fish are drawn scattered inside the net using deterministic offsets.
- **Weight System**:
  - Retract speed = `(10 / totalWeight) * clawSpeedMultiplier`.
  - Diamond Hook overrides weight, sets speed to 30.

### Supply Drop Event

- **Trigger**:
  - Promo code `plane` or `airplane` (instant).
  - Rare random chance per frame (0.01%) if no supply box exists.
- **Visual**: Cargo airplane flies across top of screen (`drawAirplane`), drops box near center with parachute.
- **Physics**: Box falls slowly (vy=0.8) until hitting surface, then sinks with damping.
- **Reward**: High cash value ($2000).

### Day/Night Cycle

- **Duration**: 180 seconds = 24 game hours (7.5 seconds per game hour).
- **Start Time**: 6 AM.
- **Sky Colors**: Interpolated between Night→Dawn→Day→Dusk→Night using `lerpColor`.
- **Celestial Bodies**:
  - Sun: Visible 5 AM - 7 PM, arc movement across sky.
  - Moon: Visible 6 PM - 6 AM, arc movement with craters.
  - Stars: Blink at night, fade during dawn/dusk.
- **Lighting**: Lamp on boat turns on at night (6 PM+), casts warm glow overlay.
- **Night Fish**: Anglerfish spawns only during night hours (19:00-05:00).

### Combo System

- **Increment**: Each successful catch increases combo by 1.
- **Reset**: Missing a catch or 10s timeout resets to 0.
- **Visual**:
  - Displays "COMBO x{count}" when ≥3.
  - Pulsating scale animation.
  - Color changes: Yellow (3+), Orange (10+), Red (50+), Purple (100+).
- **Achievements**: Track max combo reached.

### Slot Machine System

- **Concept**: Casino-style gambling mini-game accessible from top HUD.
- **Format**: Modern 5-reel slot machine (industry standard)
- **Mechanics**:
  - Player selects bet amount ($25-$500)
  - 5 reels spin showing random fish symbols
  - **Reels stop sequentially** from left to right (400ms delay between each)
  - Each stopped reel gets a gold ring highlight
  - Result determined with weighted randomness
- **Symbols**: 7 fish emojis (🐟 🐠 🦈 🐡 🦞 🦑 🐙)
- **Winning Condition**: **Consecutive matches from LEFT to RIGHT only**
  - Must start from the first (leftmost) reel
  - Matches must be adjacent/consecutive
  - Example WIN: 🐟🐟🐟🦈🐠 (3 consecutive from left)
  - Example LOSE: 🐟🦈🐟🐟🐟 (not consecutive from left)
- **Payouts** (3 tiers):
  - 5 consecutive: 20x bet (1% chance) - MEGA JACKPOT 💎💎
  - 4 consecutive: 5x bet (4% chance) - JACKPOT 💎
  - 3 consecutive: 2x bet (15% chance) - WIN ✨
  - Less than 3 consecutive: Lose bet (80% chance) 😔
- **Expected Return**: ~50% RTP (Return to Player) = (0.01×20 + 0.04×5 + 0.15×2) = 0.50
- **Note**: 50% RTP gives house a 50% edge - makes the game more challenging!
- **Implementation**:
  - State management tracks bet amount, spinning status, stopped reels
  - Money deducted immediately on spin
  - Winnings added on completion with sound effects
  - Game pauses while slot machine is open
  - Interactive lever animates when pulled
  - Messages display for 5 seconds (longer visibility)
  - Payout table shows "consecutive from left" rule
- **UI**: Modal matches game's wood/pixel aesthetic, 5 reels with sequential stop animation, lever positioned on right side

---

## Cheat Codes (Promo Codes)

Entered in the Store Modal input field:

- **`money`**: Adds $500.
- **`rain`**: Forces Rain weather (permanent until changed).
- **`snow`**: Forces Snow weather.
- **`wind`**: Forces Wind weather.
- **`fog`**: Forces Fog weather.
- **`rainbow`**: Forces Rainbow weather for 60s (ONE TIME USE, unlocks Rainbow Bulb powerup).
- **`normal`**: Resets weather to Clear.
- **`fish`**: Activates "Fish Frenzy" powerup (20s rapid special fish spawning).
- **`plane`** / **`airplane`**: Summons a Supply Drop airplane immediately.
- **`unlock`**: Unlocks all fish in the Encyclopedia (sets caught count to 1).
- **`woody`**: Secret code - Toggles max money ($9,999,999) on/off + Secret Achievement unlock.
- **`reset`**: **⚠️ DANGEROUS** - Deletes all progress with confirmation dialog. Clears localStorage and reloads game.

All successful promo codes increment `successfulPromoCodes` counter for achievement tracking.

---

## Audio System Details

### Files Required (in `/public/sounds/`)

- **`background.mp3`**: Ocean ambience loop.
- **`claw.mp3`**: Claw release sound.
- **`catchnothing.mp3`**: Empty claw return sound.
- **`money.mp3`**: Fish caught sound.
- **`powerup.mp3`**: Purchase/activation sound.
- **`button.mp3`**: UI button click sound.

### Implementation Notes

- **Format**: All MP3 for maximum browser compatibility.
- **Volume**: Background music 30%, SFX 50% (adjustable in code).
- **Cloning**: SFX are cloned on play to allow overlapping sounds.
- **Auto-play Policy**: Music only starts after first user interaction (click/touch/keypress).
- **Persistence**: Music/SFX preferences saved to localStorage.

---

## Save Import/Export System

### Overview

Players can download their game progress as an encrypted `.fishsave` file and upload it to restore progress on different devices.

### Encryption (`utils/encryption.ts`)

- **Method**: XOR cipher + Checksum verification + Base64 encoding.
- **Purpose**: Prevents casual save editing, detects file tampering.
- **Security Level**: Good enough to stop 95% of users from cheating (not military-grade).
- **Key Functions**:
  - `encryptSaveData(jsonString)`: Adds checksum, XOR encrypts, Base64 encodes.
  - `decryptSaveData(base64String)`: Base64 decodes, XOR decrypts, verifies checksum, validates JSON.
  - `downloadSaveFile(encrypted, filename)`: Creates blob and triggers browser download.

### Encryption Flow

1. **Export**:
   - Serialize `gameState` to JSON
   - Calculate checksum and prepend to data
   - XOR encrypt with secret key
   - Encode to Base64
   - Download as `pixel-fish-miner-YYYY-MM-DD.fishsave`

2. **Import**:
   - User selects `.fishsave` file
   - Read file as text
   - Decode from Base64
   - XOR decrypt
   - Verify checksum (detects tampering)
   - Parse and validate JSON structure
   - Merge with `INITIAL_GAME_STATE` for migration safety
   - Save to localStorage and reload page

### UI Implementation (SettingsModal.tsx)

- **Export Button**: Blue button with download icon, shows success feedback.
- **Import Button**: Green button with upload icon, opens file picker filtered to `.fishsave`.
- **Feedback**: Success/error messages appear for 3 seconds.
- **Auto-reload**: Page reloads after successful import to apply changes.

### Error Handling

Import will fail and show error if:

- File is not valid Base64
- Checksum verification fails (tampered data)
- Not valid JSON after decryption
- Missing required GameState fields (corrupted structure)
- File was modified in text editor

### Use Cases

- **Cross-device play**: Export from PC, import on mobile
- **Backup**: Save progress before risky gameplay
- **Recovery**: Restore after browser data cleared
- **Sharing**: Share max-level saves with friends (not synced)

---

## Developer Notes

### Canvas Coordinate System

- Origin `(0,0)` is top-left corner.
- `SURFACE_Y = 200` defines the water line.
- Y-axis increases downward.
- All entity positions are center-based (entity.x, entity.y is the center point).

### Pixel Art Rendering

- All drawing is procedural via canvas commands (no image assets).
- `ctx.imageSmoothingEnabled = false` ensures sharp pixel rendering.
- Uses `ctx.scale()` for flipping sprites horizontally.
- Drawing functions receive `w` (width) and `h` (height) as parameters.

### State Management

- **React State** (`useState`): Used for UI-driven data that triggers re-renders (money, inventory, modals).
- **Refs** (`useRef`): Used for high-frequency game data that changes every frame (fish positions, claw state, particles).
- **Separation**: This prevents unnecessary React re-renders during game loop.

### Performance Considerations

- **Particle Management**: Particles are filtered/removed when off-screen or expired.
- **Fish Spawning**: Capped at calculated max (baseMaxFish + density level bonuses).
- **Trash Cap**: Maximum 25 trash items on screen simultaneously.
- **Canvas Clearing**: Full canvas cleared every frame (no retained mode).
- **Modular Rendering**: Environment, fish, costumes, etc. are in separate files to reduce function size and improve maintainability.

### Extension Points

To add new content:

1. **New Fish**:
   - Add entry to `FISH_TYPES` in `constants.ts`.
   - Add translation in `locales/en.ts`, `es.ts`, `zh.ts`.
   - Create draw function in appropriate `utils/fish/*.ts` file.
   - Export from `utils/drawFish.ts`.
   - Use `showInBag: false` to hide from encyclopedia if needed.

2. **New Powerup**:
   - Add to `POWERUPS` in `constants.ts`.
   - Add translation.
   - Implement logic in `GameCanvas.tsx` and `StoreModal.tsx`.

3. **New Upgrade**:
   - Add to `UPGRADES` in `constants.ts`.
   - Add translation for all languages.
   - Update `GameState` type with new level property.
   - Add to `handleBuyUpgrade` and `handleDowngradeUpgrade` in `App.tsx`.
   - Implement effect logic (e.g., Trash Filter modifies spawn logic in `getWeightedFishType`).

4. **New Costume**:
   - Create new file in `utils/costumes/` using camelCase (e.g., `astronaut.ts`)
   - Export draw function: `export const drawAstronautCostume = (ctx: CanvasRenderingContext2D) => { ... }`
   - Add to `COSTUMES` in `constants.ts` with snake_case ID (e.g., `"astronaut"`)
   - Add translation for all languages in `locales/`
   - Import and add case in `utils/costumes/index.ts` switch statement
   - Render using `ctx.fillRect()` for pixel art style
   - All coordinates relative to translated position (fisherman base)

5. **New Pet**:
   - Add to `PETS` in `constants.ts`.
   - Add translation.
   - Implement draw function in `utils/drawPet.ts`.

6. **New Environment Element**:
   - Determine which module it belongs to (sky, water, ambient objects)
   - Add draw function to appropriate file in `utils/environment/`
   - Export from `utils/environment/index.ts`
   - Call from `GameCanvas.tsx` render function in correct layer order
   - Follow pattern: accept explicit parameters, use `ctx.save()`/`ctx.restore()`

### Known Quirks

- **Static Fish**: Shell, Sea Cucumber, Coral are spawned once at init and never despawn (decorative).
- **Narwhal Spawning**: During Rainbow weather, standard random spawning excludes Narwhal; it only spawns via timed injection.
- **Trash Suppression**: Mystery Bag creates 20s period where trash doesn't spawn (separate from Super Bait).
- **Combo Pause**: Combo timer pauses when any modal is open.
- **Weather Priority**: Fog and Rainbow override normal day/night sky colors.
- **Crab Hidden**: Pinchy Crab appears in gameplay (cuts line) but is hidden from Bag/Encyclopedia (`showInBag: false`).
- **Trash Filter**: Progressively reduces trash spawn rate. Formula: `((level-1)/19)*0.95` gives 0-95% reduction across 20 levels.
- **Rendering Order**: Matters for layering - Sky → Celestial → Clouds → Rainbow → Airplane → Seagulls → Boats → Water → Boat → Fisherman → Fish → Claws → Particles → Overlays.
