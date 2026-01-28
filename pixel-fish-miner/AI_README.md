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
      - Tier 1 (Goldfish, Parrot, Penguin): $1 per 30s
      - Tier 2 (Ghost Crab, Cat): $2 per 30s
      - Tier 3 (Pelican, Gentleman Octopus, Dog): $3 per 30s
      - Tier 4 (Kraken): $10 per 30s
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
- **`utils/pets/`**: Modular pet rendering system with individual files per pet:
  - **`utils/pets/index.ts`**: Main pet rendering dispatcher - exports `drawPet(ctx, petId, x, y, time)` function
  - **Individual Pet Files**:
    - `goldfish.ts`: Goldfish tank with swimming animation and bubbles
    - `ghostCrab.ts`: Ghost crab with skitter animation
    - `penguin.ts`: Penguin with flapping wing animation
    - `pelican.ts`: Pelican with throat pouch gulp animation
    - `parrot.ts`: Colorful parrot with multi-colored plumage
    - `cat.ts`: Orange tabby cat in sitting pose
    - `dog.ts`: Brown dog with wagging tail animation
    - `kraken.ts`: Massive sea monster with ONLY tentacles visible (no body) - 8 enormous tentacles (15-12px thick) wrapping around boat with wave animations, suction cups, highlights, and water effects
    - `gentlemanOctopus.ts`: Sophisticated octopus with top hat, monocle, bow tie, mustache, and walking cane - 8 tentacles properly connected to body
  - **Rendering Pattern**: Each pet file exports a `drawPetName()` function that handles its own rendering logic
  - **Animation Types**:
    - Bob animation (parrot, cat, penguin, pelican, gentleman_octopus)
    - Time-based animations (dog tail wag, goldfish swim, ghost crab skitter)
    - Complex animations (kraken tentacle waves, pelican gulp)
- **`utils/drawAirplane.ts`**: Renders the supply drop airplane (cargo plane design) with day/night lighting.
- **`utils/drawBoat.ts`**: Renders the player's fishing boat with hull, deck planks, and rails.
- **`utils/drawLamp.ts`**: Renders the boat's lamp (structure and glow effect) with day/night lighting.
- **`utils/drawCrane.ts`**: Renders the crane/winch mechanism with powerup indicators (Multi-Claw, Diamond Hook, Super Net).

#### Costume Rendering System (`utils/costumes/`)

The costume rendering system provides cosmetic character customization.

- **`utils/costumes/index.ts`**: Main costume rendering dispatcher
  - Exports `drawFishermanCostume(ctx, x, y, costumeId)` function
  - Routes to specific costume rendering functions based on `costumeId`
  - Handles positioning and translation

- **Individual Costume Files**:
  - `fisherman.ts`: Default fisherman (yellow hat, red vest, blue pants, grey beard)
  - `pirate.ts`: Dread Pirate (bandana, eye patch, hook hand, wooden leg, pistol)
  - `sailor.ts`: Sailor Boy (Breton striped shirt, blue pants, sailor cap with anchor)
  - `diver.ts`: Diver (black wetsuit with cyan stripes, diving mask, snorkel, air tank, short hair)
  - `lifeguard.ts`: Lifeguard (red uniform with white cross, lifebuoy, drink, visor cap, whistle)
  - `sushiMaster.ts`: Sushi Master (white chef coat, headband with rising sun, sushi knife, mustache, sushi tower on head)
  - `captain.ts`: Sea Captain (dark blue uniform, gold buttons, white beard, captain's hat, tobacco pipe)
  - **`captainLuna.ts`**: Captain Luna (moon-themed sailor uniform, blue skirt, white top with red bow, blonde twin-tails, gold tiara with TWO pink gems on sides, moon crescent on forehead) - Slimmer build with 14px wide face
  - **`marineScientist.ts`**: Marine Scientist (white lab coat, khaki pants, water boots, clipboard, water sample test tube, long flowing brown hair, pearl earrings, ID badge)
  - **`polarExplorer.ts`**: Polar Explorer (bright orange parka with fur trim, black snow boots, ski goggles with orange lenses, ice axe in hand, neck warmer, expedition gear)

- **Rendering Details**:
  - All costumes use `ctx.fillRect()` for pixel art style
  - Coordinates are relative to translated position (fisherman base at x, y)
  - Each costume maintains consistent proportions (head, torso, arms, legs)
  - Props and accessories are carefully positioned to match hand/body positions

#### Collision Detection System (`utils/collision.ts`)

Collision detection logic extracted for testability and reusability.

- **`checkFishCollision(tipX, tipY, fishes)`**: Returns index of first fish hit by claw tip, or -1 if no collision
  - Uses bounding box detection with 1.5x tolerance for better game feel
  - Checks all fish in array sequentially
- **`getNetCatch(tipX, tipY, fishes, radius)`**: Returns all fish within Super Net radius
  - Radius-based collision for multi-catch (default 150px)
  - Automatically skips crabs (they cut the net)
  - Returns `{ fish: EntityFish[], indices: number[] }`
  - Indices are pre-sorted descending for safe array removal
- **`checkWallCollision(tipX, tipY, clawLength, maxLength, gameWidth, gameHeight)`**: Checks if claw hit boundaries
  - Returns true if hit left/right/bottom walls OR reached max length
  - Used to trigger claw retraction

**Usage Pattern:**

```typescript
// In GameCanvas.tsx update loop:
import {
  checkFishCollision,
  getNetCatch,
  checkWallCollision,
} from "../utils/collision";

// Check single fish collision
const hitIndex = checkFishCollision(tipX, tipY, fishes.current);

// Check net collision (Super Net powerup)
const { fish, indices } = getNetCatch(tipX, tipY, fishes.current, 150);

// Check wall collision
const hitWall = checkWallCollision(
  tipX,
  tipY,
  claw.length,
  maxLength,
  GAME_WIDTH,
  GAME_HEIGHT,
);
```

**Technical Notes:**

- Collision boxes are slightly smaller than visual sprites (width/1.5) for better feel
- Net catch automatically filters out crabs to prevent line cutting
- Functions are pure (no side effects) for easy testing

#### Fish Rendering System (`utils/fish/`)

The fish rendering system is organized in a modular folder structure with entity-specific rendering functions.

- **`utils/fish/index.ts`**: Main entity rendering dispatcher
  - Exports `drawEntity(ctx, entity, rotation, time)` function
  - Routes to specific fish rendering functions based on `entity.type.id`
  - Handles entity positioning, rotation, and sprite flipping
  - Includes fallback rendering for unknown entity types

- **Individual Fish Category Files**:
  - `commonFish.ts`: Sardine, Herring, Small Yellow Croaker, Mackerel, Cod, Boxfish, Pomfret
  - `uncommonFish.ts`: Clownfish, Squid, Sea Bass, Red Snapper, Salmon, Tuna, Needlefish
  - `rareFish.ts`: Large Yellow Croaker, Turbot, Ribbonfish, Giant Grouper, Anglerfish, Wolffish, Crab, Electric Jelly
  - `legendaryFish.ts`: Whale, Narwhal
  - `weatherFish.ts`: Thunder Eel (Rain), Ice Fin (Snow), Wind Ray (Wind), Sea Turtle (Fog)
  - `staticItems.ts`: Shell, Sea Cucumber, Coral, Mystery Bag, Supply Box
  - `trash.ts`: Old Boot, Rusty Can, Plastic Bottle, Straw

- **Rendering Details**:
  - Uses `canvas` path drawing commands (rects, arcs, lines, paths) to create pixel art procedurally
  - All fish functions follow pattern: `drawFishName(ctx: CanvasRenderingContext2D, w: number, h: number)`
  - Some fish have animated features (e.g., Anglerfish lure glow, Narwhal sparkles, Sea Turtle bubbles)
  - Entity coordinates are center-based (entity.x, entity.y is the center point)

**Usage Pattern:**

```typescript
// In GameCanvas.tsx or BagModal.tsx:
import { drawEntity } from "../utils/fish";

// Draw a fish entity
drawEntity(ctx, fishEntity, rotationAngle, visualTime);
```

**Technical Notes:**

- `drawEntity` handles `ctx.save()`, positioning, rotation, flipping, and `ctx.restore()`
- Individual fish renderers assume context is already positioned and scaled
- Time parameter used for animated effects (glow, particles, etc.)
- Uses procedural canvas drawing (no image assets)

#### Environment Rendering System (`utils/environment/`)

Modular environment rendering with separate concerns for sky, water, and ambient elements.

- **`utils/environment/index.ts`**: Barrel export file
- **`utils/environment/sky.ts`**: Sky gradient rendering with day/night cycle
  - Handles normal day/night transitions
  - Special weather overrides (Fog, Rainbow)
  - Sun/Moon/Stars rendering based on game hour
- **`utils/environment/clouds.ts`**: Cloud rendering with parallax scrolling
- **`utils/environment/water.ts`**: Water surface and underwater gradient
- **`utils/environment/rainbow.ts`**: Double rainbow effect during Rainbow weather
- **`utils/environment/boats.ts`**: Background boats with parallax motion
- **`utils/environment/seagulls.ts`**: Animated seagulls flying across the sky

**Technical Details:**

- All functions accept explicit parameters (no global state access)
- Use `ctx.save()` and `ctx.restore()` for isolation
- Weather and time-of-day affect colors and visibility
- Parallax effects create depth perception

#### Particle System (`utils/particles/`)

Sophisticated particle system for weather effects and visual feedback.

- **`utils/particles/types.ts`**: TypeScript definitions for all particle types
- **`utils/particles/weather.ts`**: Weather particle generators (rain, snow, wind leaves, fog)
- **`utils/particles/effects.ts`**: Special effect particles (bubbles, sparkles, music notes)
- **`utils/particles/render.ts`**: Particle rendering logic
- **`utils/particles/update.ts`**: Particle physics and lifecycle management

**Particle Types:**

- **Weather**: Rain drops, snowflakes, wind leaves, fog mist
- **Special**: Rainbow sparkles, bubbles, music notes
- **Properties**: Each particle has position, velocity, size, opacity, lifetime

**Technical Notes:**

- Particles are spawned conditionally based on weather state
- Automatic cleanup when particles expire or leave screen bounds
- Physics include gravity, wind, and natural motion
- Optimized to handle hundreds of particles simultaneously

#### Spawning System (`utils/spawning/`)

Intelligent entity spawning with weighted randomization.

- **`utils/spawning/fish.ts`**: Fish spawning logic with rarity weights
  - Considers Fish Density upgrade level
  - Filters by weather requirements and time of day
  - Prevents overcrowding (max fish cap)
- **`utils/spawning/trash.ts`**: Trash spawning with Trash Filter consideration
  - Respects Trash Filter upgrade level
  - Caps at 25 trash items maximum
  - Suppressed during Mystery Bag effect (20s)
- **`utils/spawning/events.ts`**: Special event spawning (Narwhal, Supply Box)

**Spawning Weights:**

- **Common** (50% spawn weight): Sardine, Herring, Mackerel, etc.
- **Uncommon** (30% spawn weight): Clownfish, Squid, Salmon, etc.
- **Rare** (15% spawn weight): Turbot, Giant Grouper, Anglerfish, etc.
- **Legendary** (5% spawn weight): Whale, Narwhal (weather-dependent)

**Technical Details:**

- Weighted random selection using cumulative probability
- Position randomization within screen bounds
- Velocity and direction variation for natural movement
- Special conditions (night-only, weather-specific) enforced

---

## Game Constants (`constants.ts`)

Central configuration file for all game content and balancing.

### Fish Types (`FISH_TYPES`)

Defines all catchable entities with properties:

- `id`: Unique identifier (snake_case)
- `name`: Display name
- `value`: Money earned when caught
- `weight`: Affects reel-in speed (higher = slower)
- `rarity`: Spawn weight (Common: 50, Uncommon: 30, Rare: 15, Legendary: 5)
- `width`, `height`: Visual size
- `requiredWeather`: Optional weather condition for spawning
- `isNightOnly`: Optional flag for 19:00-05:00 spawning
- `showInBag`: Whether to display in encyclopedia

### Upgrades (`UPGRADES`)

Four upgrade paths with 20 levels each:

- **Motor Turbo** (`clawSpeed`): Base cost $50, 1.5x multiplier per level
- **Titanium Grip** (`clawStrength`): Base cost $75, 1.5x multiplier per level
- **Sonar Lure** (`fishDensity`): Base cost $100, 1.5x multiplier per level
- **Trash Filter** (`trashFilter`): Base cost $200, 1.6x multiplier per level

### Powerups (`POWERUPS`)

Single-use consumables with timed effects:

- **Octopus Gear** (`multiClaw`): $500, 4 extra claws for 30s, 1 free then paid
- **Crazy Bait** (`superBait`): $300, attracts fish + repels trash for 30s, 1 free then paid
- **Diamond Hook** (`diamondHook`): $400, instant reel-in for 30s, 1 free then paid
- **Super Net** (`superNet`): $600, 150px radius catch for 30s, 1 free then paid
- **Magic Conch** (`magicConch`): $250, random weather for 60s, 1 free then paid
- **Rainbow Jar** (`rainbowBulb`): $0 (promo code unlock), instant rainbow weather

### Costumes (`COSTUMES`)

Cosmetic character skins:

- **Fisherman** (Default): $0
- **Sailor Boy** (`sailor`): $5,000
- **Diver** (`diver`): $15,000
- **Dread Pirate** (`pirate`): $25,000
- **Lifeguard** (`lifeguard`): $35,000
- **Sushi Master** (`sushi_master`): $50,000
- **Sea Captain** (`captain`): $75,000
- **Marine Scientist** (`marine_scientist`): $60,000 - Female scientist with lab coat, long hair, clipboard
- **Polar Explorer** (`polar_explorer`): $100,000 - Female explorer with parka, ice axe, ski goggles
- **Captain Luna** (`captain_luna`): $200,000 - Moon-themed magical sailor with twin gems

### Pets (`PETS`)

Companion animals with passive income generation:

- **Goldfish Tank** (`goldfish`): $2,000, $1 per 30s
- **Parrot** (`parrot`): $5,000, $1 per 30s
- **Cat** (`cat`): $10,000, $2 per 30s
- **Dog** (`dog`): $15,000, $3 per 30s
- **Penguin** (`penguin`): $20,000, $1 per 30s
- **Ghost Crab** (`ghost_crab`): $30,000, $2 per 30s (skittering animation)
- **Pelican** (`pelican`): $50,000, $3 per 30s (throat pouch animation)
- **Gentleman Octopus** (`gentleman_octopus`): $80,000, $3 per 30s - Refined octopus with top hat, monocle, bow tie, and cane
- **Kraken** (`kraken`): $500,000, $10 per 30s - Massive sea monster with 8 enormous tentacles (15-12px thick) wrapping around the boat

---

## Localization (`locales/`)

Multi-language support with complete translations.

### Structure

- **`locales/translations.ts`**: Barrel export mapping Language type to translation objects
- **`locales/en.ts`**: English (default)
- **`locales/es.ts`**: Spanish (Español)
- **`locales/zh.ts`**: Chinese (中文)

### Translation Objects

All translation files export an object with these sections:

- **UI Labels**: title, buttons, modals, controls
- **Fish Names**: All catchable entities
- **Upgrades**: Names and descriptions for all upgrade paths
- **Powerups**: Names and descriptions for all consumables
- **Costumes**: Names and descriptions for all skins
  - Captain Luna: "Moon Guardian" / "Guardiana Lunar" / "月之船长"
  - Marine Scientist: "Marine Scientist" / "Científica Marina" / "海洋科学家"
  - Polar Explorer: "Polar Explorer" / "Exploradora Polar" / "极地探险家"
- **Pets**: Names and descriptions for all companions
  - Gentleman Octopus: "Sir Octavius" / "Don Octavio" / "章鱼绅士"
  - Kraken: "Kraken" / "Kraken" / "深海巨妖"
- **Achievements**: Description templates with {0} placeholders
- **Promo Messages**: Feedback for promo code usage

### Implementation

Language selection is stored in `localStorage` with key `pixel-fish-miner-lang`. The `TRANSLATIONS` object is used throughout components via:

```typescript
import { TRANSLATIONS } from "../locales/translations";
const t = TRANSLATIONS[language];
```

---

## UI Components (`components/`)

React components for game interface.

### Modal Components

- **`StoreModal.tsx`**: Shop interface for upgrades, powerups, costumes, and pets
  - Displays owned/equipped status
  - Handles purchase transactions
  - Shows promo code input
  - Costume icons: 🎣 (fisherman), 🏴‍☠️ (pirate), 👨🏻‍✈️ (captain), 🌊 (sailor), 🤿 (diver), 🛟 (lifeguard), 🍣 (sushi master), 🌙 (captain luna), 🔬 (marine scientist), 🧊 (polar explorer)
  - Pet icons: 🐠 (goldfish), 🦜 (parrot), 🐈 (cat), 🐕 (dog), 🐧 (penguin), 🦀 (ghost crab), 🦢 (pelican), 🎩 (gentleman octopus), 🐙 (kraken)
- **`BagModal.tsx`**: Encyclopedia showing caught fish
  - Grid layout with fish sprites
  - Shows catch count and value
  - Displays "???" for uncaught species
  - Visual rendering of each entity type
- **`AchievementsModal.tsx`**: Achievement tracking
  - Progress bars for incomplete achievements
  - Checkmarks for completed achievements
  - Categories: Fish count, Trash cleaned, Money earned, Combos, Weather fish, Narwhals, Mystery bags, Promo codes
- **`SettingsModal.tsx`**: Game settings and save management
  - Music/SFX toggles
  - Language selection (EN/ES/ZH)
  - Save export/import with encryption
  - Credits display

- **`SlotMachineModal.tsx`**: Gambling mini-game
  - Bet selection ($50-$500)
  - Three-reel slot machine
  - Payout multipliers (2x-100x)
  - Jackpot animation

### HUD Components

- **`GameCanvas.tsx`**: Main game rendering component
  - Handles all canvas drawing via `requestAnimationFrame`
  - Manages game state refs (claw, fish, particles)
  - Processes input (click/space to fish)
  - Renders environment, entities, costumes, pets, effects

---

## Audio System (`utils/audioManager.ts`)

Centralized audio management with volume control and browser compatibility.

### Audio Files

Located in `/public/` directory:

- **`music.mp3`**: Ocean ambient background music (looping)
- **`catchfish.mp3`**: Successful catch sound
- **`catchnothing.mp3`**: Empty claw return sound
- **`money.mp3`**: Fish caught sound
- **`powerup.mp3`**: Purchase/activation sound
- **`button.mp3`**: UI button click sound

### Implementation Notes

- **Format**: All MP3 for maximum browser compatibility
- **Volume**: Background music 30%, SFX 50% (adjustable in code)
- **Cloning**: SFX are cloned on play to allow overlapping sounds
- **Auto-play Policy**: Music only starts after first user interaction (click/touch/keypress)
- **Persistence**: Music/SFX preferences saved to localStorage

---

## Save Import/Export System

### Overview

Players can download their game progress as an encrypted `.fishsave` file and upload it to restore progress on different devices.

### Encryption (`utils/encryption.ts`)

- **Method**: XOR cipher + Checksum verification + Base64 encoding
- **Purpose**: Prevents casual save editing, detects file tampering
- **Security Level**: Good enough to stop 95% of users from cheating (not military-grade)
- **Key Functions**:
  - `encryptSaveData(jsonString)`: Adds checksum, XOR encrypts, Base64 encodes
  - `decryptSaveData(base64String)`: Base64 decodes, XOR decrypts, verifies checksum, validates JSON
  - `downloadSaveFile(encrypted, filename)`: Creates blob and triggers browser download

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

- **Export Button**: Blue button with download icon, shows success feedback
- **Import Button**: Green button with upload icon, opens file picker filtered to `.fishsave`
- **Feedback**: Success/error messages appear for 3 seconds
- **Auto-reload**: Page reloads after successful import to apply changes

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

- Origin `(0,0)` is top-left corner
- `SURFACE_Y = 200` defines the water line
- Y-axis increases downward
- All entity positions are center-based (entity.x, entity.y is the center point)

### Pixel Art Rendering

- All drawing is procedural via canvas commands (no image assets)
- `ctx.imageSmoothingEnabled = false` ensures sharp pixel rendering
- Uses `ctx.scale()` for flipping sprites horizontally
- Drawing functions receive `w` (width) and `h` (height) as parameters

### State Management

- **React State** (`useState`): Used for UI-driven data that triggers re-renders (money, inventory, modals)
- **Refs** (`useRef`): Used for high-frequency game data that changes every frame (fish positions, claw state, particles)
- **Separation**: This prevents unnecessary React re-renders during game loop

### Performance Considerations

- **Particle Management**: Particles are filtered/removed when off-screen or expired
- **Fish Spawning**: Capped at calculated max (baseMaxFish + density level bonuses)
- **Trash Cap**: Maximum 25 trash items on screen simultaneously
- **Canvas Clearing**: Full canvas cleared every frame (no retained mode)
- **Modular Rendering**: Environment, fish, costumes, particles, etc. are in separate files to reduce function size and improve maintainability

### Extension Points

To add new content:

1. **New Fish**:
   - Add entry to `FISH_TYPES` in `constants.ts`
   - Add translation in `locales/en.ts`, `es.ts`, `zh.ts`
   - Create draw function in appropriate `utils/fish/*.ts` file
   - Export from `utils/fish/index.ts`
   - Use `showInBag: false` to hide from encyclopedia if needed

2. **New Powerup**:
   - Add to `POWERUPS` in `constants.ts`
   - Add translation for all languages
   - Implement logic in `GameCanvas.tsx` and `StoreModal.tsx`

3. **New Upgrade**:
   - Add to `UPGRADES` in `constants.ts`
   - Add translation for all languages
   - Update `GameState` type with new level property
   - Add to `handleBuyUpgrade` and `handleDowngradeUpgrade` in `App.tsx`
   - Implement effect logic (e.g., Trash Filter modifies spawn logic in `getWeightedFishType`)

4. **New Costume**:
   - Create new file in `utils/costumes/` using camelCase (e.g., `captainLuna.ts`)
   - Export draw function: `export const drawCaptainLunaCostume = (ctx: CanvasRenderingContext2D) => { ... }`
   - Add to `COSTUMES` in `constants.ts` with snake_case ID (e.g., `"captain_luna"`)
   - Add translation for all languages in `locales/`
   - Import and add case in `utils/costumes/index.ts` switch statement
   - Add icon mapping in `StoreModal.tsx` `getCostumeIcon()` function
   - Render using `ctx.fillRect()` for pixel art style
   - All coordinates relative to translated position (fisherman base)
   - Maintain consistent proportions: head ~14-16px wide, body ~20-24px wide

5. **New Pet**:
   - Create new file in `utils/pets/` using camelCase (e.g., `dolphin.ts`)
   - Export draw function: `export const drawDolphin = (ctx: CanvasRenderingContext2D, time: number, bob: number) => { ... }`
   - Add to `PETS` in `constants.ts` with cost and income properties
   - Add translation for all languages in `locales/`
   - Import and add case in `utils/pets/index.ts` switch statement
   - Add icon mapping in `StoreModal.tsx` `getPetIcon()` function
   - Update passive income logic in `App.tsx` pet income calculation
   - Income tiers: $1/30s (basic), $2/30s (mid), $3/30s (premium), $10/30s (legendary)
   - Use idle animations (bob, wave, flap, etc.) with `Math.sin(time * speed)` for natural motion
   - Pets that sit flat (goldfish, kraken) use `ctx.translate(0, 4)` instead of bob parameter

6. **New Environment Element**:
   - Determine which module it belongs to (sky, water, ambient objects)
   - Add draw function to appropriate file in `utils/environment/`
   - Export from `utils/environment/index.ts`
   - Call from `GameCanvas.tsx` render function in correct layer order
   - Follow pattern: accept explicit parameters, use `ctx.save()`/`ctx.restore()`

7. **New Particle Effect**:
   - Add particle type to `ParticleType` in `utils/particles/types.ts`
   - Create spawn function in `utils/particles/weather.ts` or `utils/particles/effects.ts`
   - Add rendering logic in `utils/particles/render.ts`
   - Update logic in `utils/particles/update.ts` if special physics needed
   - Call spawn function from `GameCanvas.tsx` update loop

8. **New Spawnable Entity**:
   - Add spawn logic to appropriate file in `utils/spawning/`
   - Consider weather conditions, time of day, and other filters
   - Use rarity weights for balanced spawning
   - Call spawn function from `GameCanvas.tsx` update loop
   - Ensure proper cleanup when entities go off-screen

### Known Quirks

- **Static Fish**: Shell, Sea Cucumber, Coral are spawned once at init and never despawn (decorative)
- **Narwhal Spawning**: During Rainbow weather, standard random spawning excludes Narwhal; it only spawns via timed injection (10s intervals)
- **Trash Suppression**: Mystery Bag creates 20s period where trash doesn't spawn (separate from Super Bait)
- **Combo Pause**: Combo timer pauses when any modal is open
- **Weather Priority**: Fog and Rainbow override normal day/night sky colors
- **Crab Hidden**: Pinchy Crab appears in gameplay (cuts line) but is hidden from Bag/Encyclopedia (`showInBag: false`)
- **Trash Filter**: Progressively reduces trash spawn rate. Formula: `((level-1)/19)*0.95` gives 0-95% reduction across 20 levels
- **Rendering Order**: Matters for layering - Sky → Celestial → Clouds → Rainbow → Airplane → Seagulls → Boats → Water → Boat → Fisherman/Costume → Pet → Fish → Claws → Particles → Overlays
- **GameCanvas Size**: After refactoring, reduced from ~1500 lines to ~725 lines (52% reduction) by extracting rendering, collision, particles, and spawning logic into dedicated utility modules
- **Pet Rendering**: Pet rendering system is modular with one file per pet in `utils/pets/`. Kraken renders at water level (translated +4px) with no body visible, only massive tentacles (15-12px thick). Gentleman Octopus renders with standard bob animation and all 8 tentacles properly connected to body bottom.
- **Costume Rendering**: Captain Luna has slimmer body proportions and face width of 14px (vs 16px for most other costumes). Marine Scientist and Polar Explorer are female characters with appropriate proportions and details.
