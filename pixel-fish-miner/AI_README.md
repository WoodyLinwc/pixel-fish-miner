
# Pixel Fish Miner - AI Developer Context

## Project Overview
This project is a React-based arcade game inspired by "Gold Miner," styled with pixel art aesthetics. The player controls a boat with a swinging claw to catch fish, trash, and special items to earn money, upgrade equipment, and complete achievements. The game features a dynamic day/night cycle, weather systems, pet companions, and a cosmetic shop.

## Tech Stack
*   **Framework:** React 19 (Hooks heavily used).
*   **Styling:** Tailwind CSS + Inline styles for specific dynamic values.
*   **Rendering:** HTML5 Canvas (managed within `GameCanvas.tsx` and `utils/drawing.ts`).
*   **State Management:** React `useState` for UI/Persistence, `useRef` for high-frequency game loop data.
*   **Persistence:** `localStorage` (Keys: `pixel-fish-miner-save`, `pixel-fish-miner-lang`).

---

## File Structure & Responsibilities

### 1. Core Entry Points
*   **`index.html`**:
    *   Sets up the DOM root.
    *   Imports the "Press Start 2P" font.
    *   Defines global CSS animations (`shake`, `slide-up`, `slide-in-right`) used for UI feedback.
*   **`index.tsx`**: Mounts `App.tsx` to the DOM.
*   **`App.tsx`**: **The Application Controller.**
    *   **State Owner**: Holds the persistent `GameState`.
    *   **Game Loops**:
        *   **Weather Cycle**: Rotates weather naturally every 20s (unless locked by event).
        *   **Combo Timer**: Resets combo if 10s pass without a catch.
        *   **Powerup Timer**: Updates UI for active effect duration.
    *   **Global Events**: 
        *   **Promo Codes**: Handles cheat codes for debugging/events.
        *   **Achievements**: Checks logic after every catch/round.
        *   **Passive Income**: Updates money from Pet earnings.
    *   **UI Composition**: Renders `GameCanvas`, HUD, and Modals.

### 2. Game Engine (`components/GameCanvas.tsx`)
The bridge between React state and the HTML5 Canvas API.
*   **Rendering Loop**: Uses `requestAnimationFrame`.
*   **Physics & Logic**:
    *   **Claw State Machine**: 
        *   `IDLE`: Rotates. (Sways if Numbed, Short if Severed).
        *   `SHOOTING`: Extends. Handles Collision.
        *   `RETRACTING`: Returns. Speed depends on weight (unless Diamond Hook).
    *   **Complex Collision**: 
        *   **Standard**: Point-collision.
        *   **Super Net**: Radius-based multi-catch.
        *   **Debuffs**: 'Crab' cuts line (`SEVERED`), 'Electric Jelly' shocks (`NUMBED`).
    *   **Spawning**:
        *   **Weighted Random**: Based on Rarity and Fish Density level.
        *   **Conditions**: Checks `requiredWeather` and `isNightOnly`.
        *   **Events**: 'Narwhal' forced spawn during Rainbow weather. 'Supply Box' via Airplane.
    *   **Environment**:
        *   **Day/Night Cycle**: `gameHour` variable drives sky gradients and lighting.
        *   **Particles**: Rain, Snow, Wind Leaves, Fog Mist, Rainbow Sparkles, Bubbles, Music Notes.
        *   **Ambient**: Background boats (parallax), Seagulls, Sun/Moon/Stars.

### 3. Canvas Rendering (`utils/`)
Rendering logic is modularized to keep `GameCanvas` clean.
*   **`utils/drawHelpers.ts`**: Color interpolation utilities.
*   **`utils/drawEnvironment.ts`**: Calculates sky/overlay colors based on Hour and Weather.
*   **`utils/drawClaw.ts`**: Renders the rope (normal, severed, electric), the claw mechanism, and the "Net" visual if Super Net is active.
*   **`utils/drawPet.ts`**: Renders specific pixel art for pets (Goldfish, Parrot, Cat, Dog, etc.) with idle animations.
*   **`utils/drawAirplane.ts`**: Renders the supply drop airplane with day/night lighting.
*   **`utils/drawFish.ts`**: Main entry for entity rendering. Dispatches to specific files:
    *   `fish/commonFish.ts`, `fish/rareFish.ts`, `fish/legendaryFish.ts`, etc.
    *   Uses `canvas` path drawing commands (rects, arcs, lines) to create pixel art procedurally.

### 4. Data Models (`types.ts` & `constants.ts`)
*   **`types.ts`**:
    *   `GameState`: Inventory, Upgrades, Unlocks, Active Effects.
    *   `WeatherType`: `CLEAR`, `RAIN`, `SNOW`, `WIND`, `FOG`, `RAINBOW`.
    *   `ClawDebuff`: Status effects on the claw.
*   **`constants.ts`**: **Game Balance.**
    *   `FISH_TYPES`: ~40 entities including trash, static decor, and event items.
    *   `UPGRADES`: Claw Speed, Strength, Fish Density.
    *   `POWERUPS`: 
        *   `multiClaw` (5 claws), `superBait` (No trash, fast spawn), `diamondHook` (Fast retract), `superNet` (Radius catch), `magicConch` (Random Weather), `rainbowBulb` (Rainbow Weather).
    *   `COSTUMES`: Fisherman, Sailor, Pirate, Captain.
    *   `PETS`: Goldfish, Parrot, Cat, Dog, Penguin, Ghost Crab, Pelican.
    *   `ACHIEVEMENTS`: Trophies for Fish, Money, Trash, Combo, Weather, Secrets.

### 5. UI Components
*   **`StatsPanel.tsx`**: HUD. Money, Shop/Bag/Achievement toggles, Settings.
*   **`StoreModal.tsx`**: The main progression hub. Tabs for Upgrades, Powerups, Pets, Costumes.
*   **`BagModal.tsx`**: Encyclopedia. Renders fish icons dynamically using `drawEntity` on mini-canvases.
*   **`PowerupBar.tsx`**: Bottom-right UI to activate inventory powerups.
*   **`AchievementToast.tsx`**: Pop-up notification for unlocks.

---

## Game Systems & Logic Flows

### Passive Income (Pets)
*   **Concept**: Pets generate money over time.
*   **Implementation**: `GameCanvas.tsx` tracks `lastPetIncomeTime`. Every 30s, calls `onPassiveIncome`.
*   **Rates**: Tiered based on pet cost (e.g., Goldfish $1, Dog $3).

### Weather System
*   **States**:
    *   **RAIN**: Spawns 'Thunder Eel'. Rain particles.
    *   **SNOW**: Spawns 'Ice Fin'. Snow particles.
    *   **WIND**: Spawns 'Wind Ray'. Leaf particles, fast clouds.
    *   **FOG**: Spawns 'Sea Turtle'. Mist particles.
    *   **RAINBOW**: Spawns 'Narwhal' (Gold). Rainbow visual overlay.
*   **Triggers**: Natural cycle (20s), Magic Conch (Random 60s), Rainbow Bulb (Rainbow 60s), Promo Codes.

### Claw Mechanics
*   **Multi-Claw**: Renders 5 distinct claws. Only the main one collision-checks walls for "Shake" effect, but all can catch fish.
*   **Debuffs**:
    *   **Severed**: Caused by Crab. Claw retracts immediately, visual broken rope, unusable for 5s.
    *   **Numbed**: Caused by Electric Jelly. Claw retracts, turns yellow/flashing, unusable for 5s.
*   **Super Net**: Ignores single-point collision. Captures all entities within radius. Visualizes as a bag/sack.

### Supply Drop Event
*   **Trigger**: Promo code `plane` or random low chance per frame.
*   **Visual**: Airplane flies across top screen (`drawAirplane`).
*   **Logic**: Drops a `supply_box` entity which falls with gravity/drag.
*   **Reward**: High cash value ($2000).

---

## Cheat Codes (Promo Codes)
Entered in the Store Modal input:
*   **`money`**: Adds $500.
*   **`rain`**: Forces Rain weather.
*   **`snow`**: Forces Snow weather.
*   **`wind`**: Forces Wind weather.
*   **`fog`**: Forces Fog weather.
*   **`rainbow`**: Forces Rainbow weather (Narwhal spawn chance).
*   **`normal`**: Resets weather to Clear.
*   **`fish`**: Activates "Fish Frenzy" (Rapid spawn rate).
*   **`plane`**: Summons a Supply Drop airplane.
*   **`unlock`**: Unlocks all fish in the Encyclopedia.
*   **`woody`**: Secret code (Max Money + Secret Achievement).

---

## Developer Notes
*   **Canvas Coord System**: `(0,0)` is top-left. `SURFACE_Y` defines the water line.
*   **Pixel Art**: All drawing is done via code (rects/paths), not image assets. This ensures sharp scaling.
*   **Extension**: To add new items, update `constants.ts`, `translations.ts`, and create a draw function in `utils/fish/`.
