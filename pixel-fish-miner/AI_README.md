# Pixel Fish Miner - AI Developer Context

## Project Overview

This project is a React-based arcade game inspired by "Gold Miner," styled with pixel art aesthetics. The player controls a boat with a swinging claw to catch fish, trash, and special items to earn money, upgrade equipment, and complete achievements. The game features a dynamic day/night cycle, weather systems, pet companions, and a cosmetic shop.

## Tech Stack

- **Framework:** React 19 (Hooks heavily used).
- **Build Tool:** Vite 6.x (Fast development and optimized production builds).
- **Mobile Framework:** Capacitor 6.x (Native Android wrapper for web app).
- **Styling:** Tailwind CSS + Inline styles for specific dynamic values.
- **Rendering:** HTML5 Canvas (managed within `GameCanvas.tsx` and `utils/drawing.ts`).
- **State Management:** React `useState` for UI/Persistence, `useRef` for high-frequency game loop data.
- **Persistence:** `localStorage` (Keys: `pixel-fish-miner-save`, `pixel-fish-miner-lang`, `pixel-fish-miner-music`, `pixel-fish-miner-sfx`).
- **Audio:** Web Audio API (managed via `audioManager.ts`). Decodes full MP3 files into in-memory AudioBuffers for reliable playback on both web and mobile.
- **Encryption:** XOR cipher + Base64 encoding for save file export/import (`encryption.ts`).
- **Ads:** `@capacitor-community/admob` for native Android banner ads (Android only, not shown on web).

---

## Mobile Deployment (Capacitor)

The game is deployed as both a web application and a native Android app using Capacitor.

### Platform Configuration

- **Capacitor**: v6.x - Converts React web app to native Android
- **App ID**: `com.woodylin.pixelfishminer`
- **App Name**: Pixel Fish Miner
- **Web Directory**: `dist/` (Vite build output)
- **Target Platforms**: Android (iOS support possible but not configured)

### Mobile-Specific Optimizations

#### Audio System (`utils/audioManager.ts`)

- **API**: Web Audio API (`AudioContext` + `AudioBuffer` + `AudioBufferSourceNode`)
- **Why not HTMLAudioElement**: Android WebView has two critical bugs with `HTMLAudioElement`:
  1. `.loop = true` restarts at the end of the _buffered_ portion (~1 second) instead of the full track
  2. Backgrounding the app releases all buffered audio data, breaking playback on resume and killing SFX clones
- **Solution**: `fetch()` → `decodeAudioData()` decodes entire MP3 into raw PCM stored in JavaScript heap memory. This data is never released by Android's media pipeline.
- **Music Looping**: `AudioBufferSourceNode.loop = true` works correctly because the full decoded buffer is in memory
- **Pause/Resume Lifecycle**:
  - `pauseMusic()`: Saves playback position, destroys source node, calls `AudioContext.suspend()` to free system audio resources
  - `resumeMusic()`: Calls `AudioContext.resume()` (restores both music AND SFX capability), creates fresh source node from saved offset
  - Capacitor `pause` event → `audioManager.pauseMusic()`
  - Capacitor `resume` event → `audioManager.resumeMusic()` (called unconditionally — method handles music toggle internally, but always resumes AudioContext for SFX)
- **SFX**: Each play creates a new lightweight `AudioBufferSourceNode` from pre-decoded buffer — overlapping sounds work naturally, no cloning of broken elements
- **Auto-play Policy**: AudioContext created and sounds loaded on first user interaction (click/touch/keypress). Loading screen tap serves as this interaction on mobile.

#### Ad System (`utils/admob.ts`)

- **Plugin**: `@capacitor-community/admob`
- **Ad Type**: Single adaptive banner at the top of the screen (`BannerAdPosition.TOP_CENTER`)
- **Ad Size**: `BannerAdSize.ADAPTIVE_BANNER` — fills full screen width automatically
- **Android Only**: All admob functions check `window.Capacitor` and return early on web — itch.io web version shows no ads
- **Initialization**: Called in `App.tsx` after loading screen completes (`isLoading` becomes `false`)
- **Layout Padding**: When on Android (`isAndroid = !!window.Capacitor`), the main wrapper adds `pt-[50px] pb-[50px]` to prevent the game content from being hidden behind the banner
- **AdMob Account**: Publisher ID `pub-5626161990859268`
  - App ID: `ca-app-pub-5626161990859268~5811954249`
  - Top Banner Ad Unit ID: `ca-app-pub-5626161990859268/8223329318`
  - Bottom Banner Ad Unit ID: (unused — plugin only supports one banner at a time)
- **Testing**: Set `isTesting: true` in `admob.ts` during development. Switch to `false` before publishing.
- **Known Limitation**: `@capacitor-community/admob` only supports one active banner at a time. A second `showBanner()` call replaces the first. Two simultaneous banners require native Android Java code.
- **Emulator Note**: Test ads do NOT reliably load on Android emulators due to `adservices` being blocked. Always test on a physical device.

**Required `AndroidManifest.xml` entry** (inside `<application>`):

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-5626161990859268~5811954249"/>
```

**Required `android/variables.gradle` entry**:

```groovy
playServicesAdsVersion = '23.3.0'
```

#### Loading Screen (`components/LoadingScreen.tsx`)

- **Purpose**: 2-second animated loading screen shown on app start, followed by "Tap to Start" prompt
- **Audio Preloading**: Calls `audioManager.preload()` on mount — creates AudioContext (suspended on mobile) and fetches+decodes all MP3s during the 2-second animation, so audio is ready before the user taps
- **Tap to Start**: After progress bar completes, shows "🎣 Tap to Start!" prompt. The tap is a real user gesture, which is **required** by mobile browsers to call `AudioContext.resume()`. Without this, mobile browser audio is silently blocked.
- **Callback Stability**: Uses `useRef` to store `onLoadComplete` callback — prevents infinite re-render loop
  - **Problem**: Inline arrow function prop `onLoadComplete={() => setIsLoading(false)}` creates new reference every render → triggers useEffect cleanup → restarts timer → infinite cycle
  - **Solution**: `onLoadCompleteRef.current = onLoadComplete` + empty dependency array `[]` on useEffect
  - **Belt-and-suspenders**: `App.tsx` also wraps callback in `useCallback` for extra stability

#### Game Physics (`components/GameCanvas.tsx`)

- **Claw Oscillation Speed**:
  - Web: `angleSpeed = 0.03`
  - Mobile: `angleSpeed = 0.02` (33% slower for better touch control)
- **Detection**: Uses `window.Capacitor` check in claw initialization
- **Frame-Rate Independent Physics**: All claw physics are normalized to a 60fps baseline using a `dtFactor` multiplier computed each frame:

  ```typescript
  const dtFactor = dt > 0 ? Math.min(dt / (1000 / 60), 3) : 1;
  ```

  - At 60fps: `dtFactor ≈ 1.0` (no change)
  - At 120fps: `dtFactor ≈ 0.5` (half step per frame = same speed per second)
  - Applied to: claw angle oscillation, shoot extension speed, and retract speed
  - Debuff decays use `Math.pow(factor, dtFactor)` for correct frame-rate independent exponential decay
  - Capped at `3` to prevent a large physics jump if the app was backgrounded and `dt` spikes on resume
  - **Why this matters**: Native Capacitor apps receive the full display refresh rate (90Hz/120Hz on modern Android), whereas browsers often cap at 60Hz. Without this fix, claw swing and catch strength were device-dependent.

#### Keyboard Handling (`components/StoreModal.tsx`)

- **Problem**: Mobile keyboard blocks promo code input
- **Solution**:
  - Input has `onFocus` handler that scrolls element into view with 300ms delay
  - Modal content has `pb-32` padding to ensure space below input
  - Uses `scrollIntoView({ behavior: 'smooth', block: 'center' })`

#### UI Centering (`App.tsx`)

- **Layout**: Main wrapper uses `justify-center` on both mobile and desktop
- **Android Padding**: `pt-[50px] pb-[50px]` added when `isAndroid = !!window.Capacitor` to accommodate top banner ad
- **Previous Issue**: Used `justify-start md:justify-center` causing game to stick to top on mobile
- **Fixed**: Removed top margin and uses consistent centering across all devices

#### Back Button Handling (`App.tsx`)

- **Capacitor App Plugin**: Listens for Android back button
- **Behavior**:
  1. If any modal open → Close modal
  2. If no modals → Show "Exit game?" confirmation
  3. User confirms → App closes
- **Implementation**: Uses `App.addListener('backButton')` event
- **Cleanup**: Removes listeners on component unmount

### Mobile Assets

#### App Icons

**Location**: `android/app/src/main/res/mipmap-*/`

Square icons (`ic_launcher.png`):

- mipmap-mdpi: 48×48px
- mipmap-hdpi: 72×72px
- mipmap-xhdpi: 96×96px
- mipmap-xxhdpi: 144×144px
- mipmap-xxxhdpi: 192×192px

Round icons (`ic_launcher_round.png`):

- Same sizes as square icons
- Circular crop of the square icon

**Current Icon**: Pixel art screenshot showing the fisherman (diver costume) standing on the boat with crane and claw visible, seagull in background, ocean setting.

**Icon Generation**: Icons were generated by center-cropping the source image to square, then resizing to each required density using Pillow (Python).

**Note**: The `mipmap-anydpi-v26/` folder must NOT exist if using plain PNG icons. It references `ic_launcher_foreground` which causes a build error if the adaptive icon layer files don't exist. Delete this folder when using traditional PNG icons.

#### Splash Screens

**Location**: `android/app/src/main/res/drawable-*/splash.png`

Portrait variants (drawable-port-\*):

- mdpi: 320×480
- hdpi: 480×800
- xhdpi: 720×1280
- xxhdpi: 1080×1920
- xxxhdpi: 1440×2560

Landscape variants (drawable-land-\*):

- mdpi: 480×320
- hdpi: 800×480
- xhdpi: 1280×720
- xxhdpi: 1920×1080
- xxxhdpi: 2560×1440

**Design**: Centered pixel fish icon (30% of screen size) on wood brown background (#4a3728)

**Note**: Capacitor native splash disabled (`launchShowDuration: 0`) in favor of custom LoadingScreen component

### Build & Deployment Process

#### Development Workflow

```bash
# Install dependencies
npm install

# Install Capacitor plugins
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor/app @capacitor/status-bar @capacitor/keyboard @capacitor/splash-screen
npm install @capacitor/filesystem @capacitor/share

# Install AdMob plugin
npm install @capacitor-community/admob

# Build React app
npm run build

# Sync to Android (copies dist/ to android project)
npx cap sync

# Open in Android Studio
npx cap open android

# Or run directly on device
npx cap run android
```

#### Convenience Scripts (package.json)

```json
"scripts": {
  "cap:sync": "npm run build && npx cap sync",
  "cap:open": "npx cap open android",
  "cap:run": "npx cap run android"
}
```

#### Configuration Files

**capacitor.config.ts**:

```typescript
{
  appId: 'com.woodylin.pixelfishminer',
  appName: 'Pixel Fish Miner',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  android: {
    allowMixedContent: true,
    captureInput: true
  }
}
```

**index.html** (Mobile Optimizations):

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
/>
<meta name="mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#4a3728" />

<style>
  * {
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>
```

#### Android Project Structure

```
android/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── assets/
│   │       │   └── public/        # Synced from dist/
│   │       ├── res/
│   │       │   ├── mipmap-*/      # App icons (PNG only, no mipmap-anydpi-v26/)
│   │       │   └── drawable-*/    # Splash screens
│   │       ├── AndroidManifest.xml
│   │       └── java/com/woodylin/pixelfishminer/
│   └── build.gradle
├── build.gradle
├── variables.gradle
└── gradle/
```

**Important**: `android/` folder is git-ignored and regenerated via `npx cap add android`

### Mobile-Specific Considerations

#### Storage

- **localStorage** works identically on mobile and web
- Save files persist across app updates
- Location: Android app data directory (not accessible to user)
- Maximum size: ~5-10MB depending on device (well above game needs)

#### Audio Files

- **Location**: Bundled in APK at `assets/public/sounds/`
- **Loading**: On first user interaction, all files are fetched and decoded into in-memory AudioBuffers via Web Audio API
- **Format**: MP3 (maximum compatibility)
- **Files**:
  - background.mp3 (looping music)
  - claw.mp3 (release sound)
  - catchnothing.mp3 (miss sound)
  - money.mp3 (catch sound)
  - powerup.mp3 (powerup activation)
  - button.mp3 (UI click sound)

#### Performance

- **Target**: 60 FPS on mid-range Android devices (2020+)
- **Canvas Size**: Fixed 800×600 (scaled to fit screen)
- **Particle Cap**: Same as web (managed per-type)
- **Fish Cap**: Same as web (density level based)

#### Network

- **No Server Calls**: Game is 100% client-side
- **No Analytics**: No tracking or data collection
- **Offline**: Fully playable offline after initial install
- **Ads**: AdMob banner requires internet connection to load; fails silently if offline

---

## Distribution

### Google Play Store

- **Status**: Not yet published (AdMob app linked via Amazon Appstore placeholder)
- **Package**: `com.woodylin.pixelfishminer`
- **Build**: Generate signed AAB via Android Studio → Build → Generate Signed Bundle/APK
- **AdMob**: Will auto-link once app is live on Play Store. Update App settings in AdMob console after publishing.
- **`app-ads.txt`**: Set up on development website after publishing to comply with AdMob requirements

### itch.io (Web Version)

- **Build**: `npm run build` → zip the `dist/` folder
- **Settings**: Kind = HTML, "This file will be played in the browser" checked
- **Ads**: No ads on web version (`window.Capacitor` is falsy, all AdMob calls are no-ops)

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
    - **Promo Codes**: Handles promo codes for weather control, currency, fishing bonuses, and events. See "Promo Codes" section below.
    - **Achievements**: Checks logic after every catch/round.
    - **Passive Income**: Updates money from Pet earnings every 30s.
      - Tier 1 (Goldfish, Parrot, Penguin): $1 per 30s
      - Tier 2 (Ghost Crab, Cat): $2 per 30s
      - Tier 3 (Pelican, Gentleman Octopus, Dog): $3 per 30s
      - Tier 4 (Kraken): $10 per 30s
  - **Audio Management**: Syncs React state with `audioManager` singleton.
    - `useEffect` syncs `isMusicOn` → `audioManager.setMusicEnabled()`
    - `useEffect` syncs `isSoundEffectsOn` → `audioManager.setSfxEnabled()`
    - `useEffect` calls `audioManager.startMusic()` when `isLoading` becomes `false`
    - `useEffect` calls `initAds().then(() => showBannerAds())` when `isLoading` becomes `false`
    - Capacitor lifecycle: `pause` → `audioManager.pauseMusic()`, `resume` → `audioManager.resumeMusic()` (always unconditional)
    - All game actions call `audioManager.playButtonSound()`, `playMoneySound()`, `playPowerupSound()`, etc.
  - **UI Composition**: Renders `GameCanvas`, HUD, and Modals.
  - **Android Detection**: `const isAndroid = !!window.Capacitor` used for layout padding and ad initialization.

### 2. Ad System (`utils/admob.ts`)

Centralized AdMob management. All functions are no-ops on web.

```
admob.ts exports:
├── initAds()        ← Call once after loading screen, initializes AdMob SDK
├── showBannerAds()  ← Shows adaptive banner at top of screen
└── hideBannerAds()  ← Removes banner (e.g. if needed during gameplay)
```

**AdMob IDs**:

- App ID: `ca-app-pub-1686915079603954~3485842688`
- Top Banner: `ca-app-pub-1686915079603954/6481326679`

### 3. Game Engine (`components/GameCanvas.tsx`)

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

### 4. Rendering System (`utils/`)

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
  - `commonFish.ts`: Sardine, Herring, Small Yellow Croaker, Mackerel, Cod, Boxfish, Pomfret, Pufferfish
  - **`migrationFish.ts`**: Pacific Saury, Mullet, Anchovy (only spawn during migration events)
  - `uncommonFish.ts`: Clownfish, Squid, Sea Bass, Red Snapper, Salmon, Tuna, Needlefish, Phantom Perch, Spectral Sardine, Ghost Squid
  - `rareFish.ts`: Large Yellow Croaker, Turbot, Ribbonfish, Giant Grouper, Anglerfish, Wolffish, Crab, Electric Jelly
  - `legendaryFish.ts`: Whale, Narwhal
  - `weatherFish.ts`: Thunder Eel (Rain), Ice Fin (Snow), Wind Ray (Wind), Sea Turtle (Fog)
  - `staticItems.ts`: Shell, Sea Cucumber, Coral, Anchor, Mystery Bag, Supply Box
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
  - **Boat Types**: SMALL (sailboat), BIG (cargo ship), GHOST (Flying Dutchman)
  - **Ghost Boat**: Haunted galleon with fade effect (opacity 0.0-1.0), glowing green lanterns, only spawns after Kraken purchase
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
  - **Ghost Fish** (unlockable): Phantom Perch, Spectral Sardine, Ghost Squid (Kraken unlock)
- **Rare** (15% spawn weight): Turbot, Giant Grouper, Anglerfish, etc.
- **Legendary** (5% spawn weight): Whale, Narwhal (weather-dependent)

**Technical Details:**

- Weighted random selection using cumulative probability
- Position randomization within screen bounds
- Velocity and direction variation for natural movement
- Special conditions (night-only, weather-specific) enforced
- **Unlock filtering**: Ghost fish only spawn if `unlockedFish` includes their ID

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

**Special Fish Categories**:

- **Migration Fish** (Timed Event):
  - `pacific_saury`: Pacific Saury ($18, 38x12, Common) - Light cyan elongated fish with beak-like mouth
  - `mullet`: Mullet ($22, 36x16, Common) - Blue-grey robust fish with forked tail
  - `anchovy`: Anchovy ($12, 26x10, Common) - Light grey-blue slender fish with lateral stripe
  - Only spawn during migration events (30-second duration)
  - Replace ALL other fish spawns during event
  - Auto-triggers every 5 minutes
  - Visual indicator: "Migration Xs" countdown text below player boat
- **Ghost Fish** (Unlockable via Kraken purchase):
  - `phantom_perch`: Pale blue translucent fish ($85, 42x22, Uncommon)
  - `spectral_sardine`: Pale purple wispy fish ($70, 38x16, Uncommon)
  - `ghost_squid`: Pale blue-white ethereal squid ($75, 40x24, Uncommon)
  - Only spawn after purchasing Kraken pet ($500,000)
  - Filtered from spawn pool via `unlockedFish` check
- `showInBag`: Whether to display in encyclopedia

### Upgrades (`UPGRADES`)

Four upgrade paths with 20 levels each:

- **Motor Turbo** (`clawSpeed`): Base cost $50, 1.5x multiplier per level
- **Titanium Grip** (`clawStrength`): Base cost $75, 1.5x multiplier per level
- **Sonar Lure** (`fishDensity`): Base cost $100, 1.5x multiplier per level
- **Trash Filter** (`trashFilter`): Base cost $200, 1.6x multiplier per level

### Powerups (`POWERUPS`)

Single-use consumables with **dynamic pricing system** (NEW):

**Dynamic Pricing**:

- 1st purchase: **FREE** ($0)
- 2nd purchase: $250
- 3rd purchase: $500
- 4th purchase: $750
- 5th purchase: $1,000
- 6th+ purchases: $1,250 (MAXIMUM CAP)

**Available Powerups**:

- **Octopus Gear** (`multiClaw`): 4 extra claws for 30s
- **Crazy Bait** (`superBait`): Attracts fish + repels trash for 30s
- **Diamond Hook** (`diamondHook`): Instant reel-in for 30s
- **Super Net** (`superNet`): 150px radius catch on impact for 30s
- **Magic Conch** (`magicConch`): Random weather event for 60s
- **Rainbow Jar** (`rainbowBulb`): Instant rainbow weather (promo code unlock only)

Note: Purchase counts tracked per powerup in `gameState.powerupPurchaseCounts`

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
  - **Special Unlock**: Purchasing Kraken unlocks:
    - 3 Ghost Fish (Phantom Perch, Spectral Sardine, Ghost Squid)
    - Flying Dutchman ghost boat (background element)
    - "Tame the Kraken" achievement (🐙)

---

## Game Events & Systems

### Migration Event System

The migration system creates timed events where special migration fish temporarily replace all regular fish spawns.

**Migration Fish** (defined in `utils/fish/migrationFish.ts`):

- **Pacific Saury** (`pacific_saury`): $18, 38x12px, Light cyan-blue elongated body with beak-like mouth, forked tail
- **Mullet** (`mullet`): $22, 36x16px, Blue-grey robust body with deeply forked tail, silver belly stripe
- **Anchovy** (`anchovy`): $12, 26x10px, Light grey-blue slender body with signature lateral stripe

**Event Mechanics**:

- **Warning phase**: 20-second countdown before migration starts — orange banner with light yellow text "⚠ Migration in Xs" displays below the boat
- **Duration**: 30 seconds of active migration after the warning
- **Cooldown**: 5 minutes (300,000ms) after migration ends before the next warning phase begins
- **Effect**: During active migration, ALL regular fish (common, uncommon, rare, legendary, weather) are filtered out of spawning
- **Visual Indicator**: During active migration, a blue "Migration Xs" countdown banner displays below the player boat
- **Auto-trigger**: Fires 5 minutes after game load (or after last migration ends)

**Three-phase lifecycle**:

1. **Cooldown** (5 min): `migrationPending: false`, `migrationActive: false`
2. **Warning** (20 sec): `migrationPending: true` — shows orange warning banner, no fish changes yet
3. **Active** (30 sec): `migrationActive: true` — fish cleared and replaced with migration fish

**State Management** (in `constants.ts` INITIAL_GAME_STATE and `types.ts` GameState):

```typescript
migrationActive: boolean; // Is migration currently happening
migrationEndTime: number; // Timestamp when active migration ends (Date.now() + 30000)
lastMigrationTime: number; // Timestamp when last migration ended (for cooldown)
migrationPending: boolean; // Is the 20-second warning phase active
migrationPendingEndTime: number; // Timestamp when warning ends and active migration begins
```

**Implementation Details**:

- **Timer Logic** (`App.tsx`): Checks every 100ms. Priority order: (1) end active migration, (2) transition pending → active, (3) trigger new warning after cooldown
- **Initial seed fix**: On fresh game or old save where `lastMigrationTime === 0`, `App.tsx` seeds it to `Date.now()` so the first migration fires 5 minutes after load. Without this, the `lastMigrationTime > 0` guard permanently blocked migration on new installs.
- **Spawning Filter** (`utils/fish/fish.ts`): `getWeightedFishType()` accepts `migrationActive` parameter
  - If `migrationActive === true`: Only spawns pacific_saury, mullet, anchovy
  - If `migrationActive === false`: Filters out migration fish from spawn pool
- **Fish Clearing** (`GameCanvas.tsx`): Migration state tracking runs **before** the `if (paused) return` check in `update()`. This ensures `previousMigrationActive` ref stays in sync even when modals are open.
- **Time-based Checks**: Uses `Date.now()` comparisons to handle state transitions without waiting for React state updates
- **Canvas refs**: `migrationPendingRef` and `migrationPendingEndTimeRef` are kept in sync with props each render, alongside the existing `migrationActiveRef` and `migrationEndTimeRef`

**Translations** (sample — all 8 languages have full coverage):

- English: Pacific Saury, Mullet, Anchovy
- Spanish: Paparda del Pacífico, Mújol, Anchoa
- Chinese: 秋刀鱼, 鲻鱼, 凤尾鱼
- Japanese: サンマ, ボラ, カタクチイワシ
- Korean: 꽁치, 숭어, 멸치
- Arabic: سوري المحيط الهادي, بوري, أنشوفة

---

## Localization (`locales/`)

Multi-language support with complete translations for 8 languages, including RTL support for Arabic.

### Structure

- **`locales/translations.ts`**: Barrel export mapping Language type to translation objects
- **`locales/en.ts`**: English (default)
- **`locales/es.ts`**: Spanish (Español)
- **`locales/zh.ts`**: Chinese (中文)
- **`locales/ja.ts`**: Japanese (日本語)
- **`locales/ko.ts`**: Korean (한국어)
- **`locales/ru.ts`**: Russian (RU)
- **`locales/fr.ts`**: French (FR)
- **`locales/ar.ts`**: Arabic (عربي) — RTL language

### Language Type (`types.ts`)

```typescript
export type Language = "en" | "es" | "zh" | "ja" | "ko" | "ru" | "fr" | "ar";
```

### Translation Objects

All translation files export an object with these sections:

- **UI Labels**: title, buttons, modals, controls
- **Fish Names**: All catchable entities
  - Migration Fish: Pacific Saury ("Pacific Saury" / "Paparda del Pacífico" / "秋刀鱼"), Mullet ("Mullet" / "Mújol" / "鲻鱼"), Anchovy ("Anchovy" / "Anchoa" / "凤尾鱼")
  - Ghost Fish: Phantom Perch ("Phantom Perch" / "Perca Fantasma" / "幻影鲈鱼"), Spectral Sardine ("Spectral Sardine" / "Sardina Espectral" / "光谱沙丁鱼"), Ghost Squid ("Ghost Squid" / "Calamar Fantasma" / "幽灵鱿鱼")
- **Upgrades**: Names and descriptions for all upgrade paths
- **Powerups**: Names and descriptions for all consumables
- **Costumes**: Names and descriptions for all skins
  - Captain Luna: "Moon Guardian" / "Guardiana Lunar" / "月之船长"
  - Marine Scientist: "Marine Scientist" / "Científica Marina" / "海洋科学家"
  - Polar Explorer: "Polar Explorer" / "Exploradora Polar" / "极地探险家"
- **Pets**: Names and descriptions for all companions
  - Gentleman Octopus: "Sir Octavius" / "Don Octavio" / "章鱼绅士"
  - Kraken: "Kraken" / "Kraken" / "克拉肯"
- **Achievements**: Description templates with {0} placeholders
  - Kraken Achievement: "Tame the Kraken" / "Domina el Kraken" / "驯服克拉肯"
- **Promo Messages**: Feedback for promo code usage

### Implementation

Language selection is stored in `localStorage` with key `pixel-fish-miner-lang`. The `TRANSLATIONS` object is used throughout components via:

```typescript
import { TRANSLATIONS } from "../locales/translations";
const t = TRANSLATIONS[language];
```

### RTL Support (Arabic)

Arabic is the only RTL language. RTL direction is **not** applied globally (that would flip the entire game canvas and button layouts). Instead, it is scoped per-component:

- **`App.tsx`**: Sets `document.documentElement.lang` attribute only — does NOT set `dir="rtl"` on root
- **Modal components**: Each modal applies `dir={isRTL ? "rtl" : "ltr"}` on its inner content wrapper
- **Game canvas**: Always renders LTR (pixel coordinates, not CSS flow)
- **Stats panel / HUD**: Stays LTR to avoid flipping game layout

To add RTL to a modal:

```typescript
const isRTL = language === "ar";
// On the content wrapper div:
<div dir={isRTL ? "rtl" : "ltr"} className="...">
```

### Language Selector UI (`SettingsModal.tsx`)

- 8 language buttons displayed in a 4-column grid (`grid grid-cols-4 gap-1`)
- Button labels: EN, ES, 中文, 日本語, 한국어, RU, FR, عربي
- Active language highlighted in green, others in grey
- Scrollbar padding flips for RTL: `pr-2` (LTR) → `pl-2` (RTL)

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
  - Categories: Fish count, Trash cleaned, Money earned, Combos, Weather fish, Narwhals, Mystery bags, Promo codes, Kraken (pet unlock)
- **`SettingsModal.tsx`**: Game settings and save management
  - Music/SFX toggles
  - Language selection (8 languages in 4×2 grid: EN/ES/中文/日本語/한국어/RU/FR/عربي)
  - RTL support scoped to modal content for Arabic
  - Save export/import with encryption
  - Credits display
- **`SlotMachineModal.tsx`**: Gambling mini-game
  - Bet selection ($25, $50, $100, $250, $500)
  - Five-reel slot machine with sequential reel stopping
  - Payout multipliers: 2x (3-in-a-row), 5x (4-in-a-row), 20x (5-in-a-row)
  - Jackpot animation with sound
  - `onBet(betAmount)` deducts the selected bet; `onWin(winAmount)` adds winnings
  - **Bug fixed**: `handleSlotBet` in `App.tsx` previously hardcoded `cost = 10` and ignored the `betAmount` argument. Fixed to accept and deduct the actual bet amount.

### Loading & System Components

- **`LoadingScreen.tsx`**: 2-second animated loading screen with progress bar, then "Tap to Start" prompt. Calls `audioManager.preload()` on mount to decode audio during animation. Uses `useRef` for callback to prevent infinite re-render loop (see Mobile Deployment section for details).

### HUD Components

- **`GameCanvas.tsx`**: Main game rendering component
  - Handles all canvas drawing via `requestAnimationFrame`
  - Manages game state refs (claw, fish, particles)
  - Processes input (click/space to fish)
  - Renders environment, entities, costumes, pets, effects

---

## Audio System (`utils/audioManager.ts`)

Centralized audio management using the **Web Audio API** for reliable cross-platform playback.

### Why Web Audio API (not HTMLAudioElement)

`HTMLAudioElement` streams audio progressively, which causes two fatal bugs on Android WebView:

1. **1-second loop bug**: `.loop = true` restarts playback at the end of the currently-buffered portion (~1 second) instead of waiting for the full track to finish. The browser sees the buffer boundary as "end of audio" and loops.
2. **Background buffer eviction**: When the user swipes away from the app, Android reclaims memory by releasing all buffered audio data. The JavaScript objects still exist but are empty shells. On resume, `.play()` re-buffers from scratch, triggering Bug 1 again. SFX cloned from these empty elements produce silence.

**Web Audio API** avoids both issues: `fetch()` downloads the full MP3, `decodeAudioData()` decodes it into raw PCM stored in JavaScript's heap memory. This data is never released by Android's media pipeline. `AudioBufferSourceNode.loop = true` operates on the complete decoded buffer, so looping works correctly.

### Architecture

```
AudioManager (singleton)
├── AudioContext              ← Created on first user interaction
│   ├── musicGain (GainNode)  ← Volume: 0.3, connects to destination
│   └── sfxGain (GainNode)    ← Volume: 0.5, connects to destination
├── musicBuffer (AudioBuffer) ← Decoded background.mp3 PCM data
├── sfxBuffers (Map)          ← Decoded PCM for each SFX
│   ├── "button" → AudioBuffer
│   ├── "claw" → AudioBuffer
│   ├── "catchnothing" → AudioBuffer
│   ├── "money" → AudioBuffer
│   └── "powerup" → AudioBuffer
└── musicSource (AudioBufferSourceNode) ← Current playing instance
```

### Audio Files

Located in `/public/sounds/` directory:

- **`background.mp3`**: Ocean ambient background music (looping)
- **`claw.mp3`**: Claw release/throw sound
- **`catchnothing.mp3`**: Empty claw return sound
- **`money.mp3`**: Fish caught / money earned sound
- **`powerup.mp3`**: Powerup activation sound
- **`button.mp3`**: UI button click sound

### Lifecycle

1. **Constructor**: Reads music/SFX preferences from localStorage, sets up user interaction listeners
2. **Loading screen mount** (`preload()`): Creates `AudioContext` (starts suspended on mobile browsers), calls `fetch()` + `decodeAudioData()` for all 6 sound files in parallel, stores decoded `AudioBuffer`s in memory. This happens **before** any user gesture.
3. **User taps "Tap to Start"**: Triggers `unlock` listener which calls `AudioContext.resume()` synchronously in the gesture (critical for mobile browsers — must NOT be awaited). Sounds are already decoded from step 2, so playback is instant.
4. **After loading screen** (`startMusic()`): Creates `AudioBufferSourceNode` with `loop = true`, connects to `musicGain`, starts playback
5. **App background** (`pauseMusic()`): Saves playback position (`musicOffset`), destroys source node, suspends `AudioContext`
6. **App foreground** (`resumeMusic()`): Resumes `AudioContext` (needed for SFX too), creates new source node from saved offset. `AudioBuffer` data is still intact in memory
7. **Toggle off** (`stopMusic()`): Resets offset to 0, destroys source node

### Public Methods

| Method                  | Description                                        | Called From                                      |
| ----------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `preload()`             | Preload AudioContext + decode all sounds           | `LoadingScreen.tsx` on mount                     |
| `startMusic()`          | Start background music from beginning              | `App.tsx` after loading                          |
| `pauseMusic()`          | Save position, destroy source, suspend context     | Capacitor `pause` event                          |
| `resumeMusic()`         | Resume context + restart music from saved position | Capacitor `resume` event                         |
| `stopMusic()`           | Stop and reset to beginning                        | Internal (toggle off)                            |
| `setMusicEnabled(bool)` | Toggle music on/off                                | `App.tsx` useEffect on `isMusicOn`               |
| `setSfxEnabled(bool)`   | Toggle SFX on/off                                  | `App.tsx` useEffect on `isSoundEffectsOn`        |
| `playButtonSound()`     | UI click                                           | Buy, equip, export, import, slot bet             |
| `playClawRelease()`     | Claw throw                                         | `GameCanvas` `onClawRelease` prop                |
| `playCatchNothing()`    | Empty return                                       | `GameCanvas` `onCatchNothing` prop               |
| `playMoneySound()`      | Fish caught                                        | `handleFishCaught`, `handleSlotWin`, mystery bag |
| `playPowerupSound()`    | Powerup used                                       | `handleActivatePowerup`                          |

### Implementation Notes

- **Format**: All MP3 for maximum browser/WebView compatibility
- **Volume**: Background music 30%, SFX 50% (constants at top of file)
- **SFX Overlap**: Each `playSfx()` call creates a new `AudioBufferSourceNode` — these are lightweight objects that auto-GC after playback
- **Auto-play Policy**: Audio preloaded during loading screen via `preload()` (AudioContext created suspended). On "Tap to Start", `ctx.resume()` is called synchronously in the user gesture — critical for mobile browsers. `resume()` must NOT be awaited or the gesture context expires. Music queued via `musicPendingPlay` flag if `startMusic()` called before interaction.
- **Persistence**: Music/SFX toggle preferences saved to localStorage (`pixel-fish-miner-music`, `pixel-fish-miner-sfx`)
- **Position Tracking**: `musicOffset` tracks seconds into the track, `musicStartTime` tracks `ctx.currentTime` at play start. On pause: `offset = (offset + elapsed) % duration`
- **Singleton**: Exported as `audioManager` instance, imported throughout `App.tsx`

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
  - `downloadSaveFile(encrypted, filename)`: Platform-aware file export:
    - **Web**: Creates Blob URL → hidden `<a download>` element → browser download
    - **Mobile** (`Capacitor.isNativePlatform()`): Writes to cache via `Filesystem.writeFile()` → opens native share sheet via `Share.share()`
    - **Platform Detection**: Uses `Capacitor.isNativePlatform()` (NOT `window.Capacitor`, which is truthy everywhere when @capacitor/core is installed)

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

`decryptSaveData()` returns `string | null`. A null result (failed decryption/checksum) is explicitly checked before passing to `JSON.parse()`:

```typescript
const decrypted = decryptSaveData(text);
if (!decrypted)
  throw new Error(
    "Invalid save file. Please make sure you're importing a Pixel Fish Miner save.",
  );
const imported = JSON.parse(decrypted);
```

This narrows the type to `string` for TypeScript and surfaces a player-friendly message via the existing `catch` block instead of a raw type error.

### Use Cases

- **Cross-device play**: Export from PC, import on mobile
- **Backup**: Save progress before risky gameplay
- **Recovery**: Restore after browser data cleared
- **Sharing**: Share max-level saves with friends (not synced)

---

## Promo Codes (`handleApplyPromoCode` in App.tsx)

Promo codes are entered in the Store modal input field. Some codes are **reusable** (can be entered multiple times), others are **one-time only** (tracked in `gameState.usedPromoCodes`).

### Available Codes

**💰 Currency & Rewards**:

- `money` — Adds $500 to wallet (reusable)
- `woodylin` — Toggles $9,999,999 max money + unlocks secret achievement (one-time)

**🌦️ Weather Control**:

- `rain` — Forces Rain weather (reusable, lasts until next natural cycle)
- `snow` — Forces Snow weather (reusable)
- `wind` — Forces Wind weather (reusable)
- `fog` — Forces Fog weather (reusable)
- `rainbow` — Forces Rainbow weather for 30s, enables Narwhal spawns (one-time)
- `normal` — Resets to Clear weather (reusable)

**🐟 Fishing Bonuses**:

- `fish` — Activates Fish Frenzy for 30s: rapid spawn rate, weather-only fish (reusable, sets `activePowerups.fishFrenzy` directly)
- `unlockall` — Unlocks all fish in Encyclopedia (one-time)

**✈️ Special Events**:

- `plane` / `airplane` — Summons Supply Drop airplane (reusable, calls `setLastPlaneRequestTime`)
- `migration` — Immediately starts the 20-second warning phase, then triggers a full migration event (reusable, good for testing the migration system)

**⚠️ Dangerous**:

- `reset` — Deletes ALL progress with confirmation dialog (always available)

### Implementation Details

- **One-time codes** (`rainbow`, `unlockall`, `woodylin`): Use `applyOneTime()` helper which adds to `usedPromoCodes` array and increments `successfulPromoCodes` counter for achievement tracking
- **Reusable codes** (`money`, weather codes, `fish`, `plane`, `migration`): Use `applyReusable()` helper which applies state changes without tracking in `usedPromoCodes`
- **Feedback messages**: All use `t.promoMessages.*` translation keys. The `migration` code uses `t.promoMessages.migrationIncoming` with a hardcoded fallback `"🐟 Migration incoming in 20s"` — add the key to locale files to translate it
- **Input clearing**: Input field always clears after submit (both valid and invalid codes)
- **Rainbow Jar powerup**: Only visible in the Store after `rainbow` promo code has been used (checked via `gameState.usedPromoCodes.includes("rainbow")`)

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
   - Add translation in all locale files (`locales/en.ts`, `es.ts`, `zh.ts`, `ja.ts`, `ko.ts`, `ru.ts`, `fr.ts`, `ar.ts`)
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

- **Static Fish**: Shell, Sea Cucumber, Coral, Anchor are spawned once at init and never despawn (decorative)
- **Narwhal Spawning**: During Rainbow weather, standard random spawning excludes Narwhal; it only spawns via timed injection (10s intervals)
- **Migration Event**: Pacific Saury, Mullet, and Anchovy only spawn during 30-second migration events. A 20-second warning phase (`migrationPending`) precedes each migration, showing an orange "⚠ Migration in Xs" banner. When active migration starts, ALL existing fish (except static decorations) are cleared and only migration fish spawn. Auto-triggers 5 minutes after game load. **Bug fixed**: `lastMigrationTime` was initialized to `0`, causing the `lastMigrationTime > 0` guard to permanently block migration on fresh installs — fixed by seeding to `Date.now()` on load.
- **Ghost Fish Unlock**: Phantom Perch, Spectral Sardine, and Ghost Squid only spawn after purchasing Kraken pet. Filtered in `getWeightedFishType` via `unlockedFish` check
- **Ghost Boat**: Flying Dutchman only spawns after Kraken purchase. Features fade effect (opacity 0.0-1.0) and glowing green lanterns
- **Trash Suppression**: Mystery Bag creates 20s period where trash doesn't spawn (separate from Super Bait)
- **Combo Pause**: Combo timer pauses when any modal is open
- **Weather Priority**: Fog and Rainbow override normal day/night sky colors
- **Crab Hidden**: Pinchy Crab appears in gameplay (cuts line) but is hidden from Bag/Encyclopedia (`showInBag: false`)
- **Trash Filter**: Progressively reduces trash spawn rate. Formula: `((level-1)/19)*0.95` gives 0-95% reduction across 20 levels
- **Powerup Pricing**: Dynamic pricing system - 1st purchase FREE, then $250, $500, $750, $1,000, capped at $1,250. Tracked per powerup in `gameState.powerupPurchaseCounts`
- **Rendering Order**: Matters for layering - Sky → Celestial → Clouds → Rainbow → Airplane → Seagulls → Boats (including ghost boat) → Water → Boat → Fisherman/Costume → Pet → Fish (including ghost fish) → Claws → Particles → Overlays
- **GameCanvas Size**: After refactoring, reduced from ~1500 lines to ~725 lines (52% reduction) by extracting rendering, collision, particles, and spawning logic into dedicated utility modules
- **Pet Rendering**: Pet rendering system is modular with one file per pet in `utils/pets/`. Kraken renders at water level (translated +4px) with no body visible, only massive tentacles (15-12px thick). Gentleman Octopus renders with standard bob animation and all 8 tentacles properly connected to body bottom.
- **Costume Rendering**: Captain Luna has slimmer body proportions and face width of 14px (vs 16px for most other costumes). Marine Scientist and Polar Explorer are female characters with appropriate proportions and details.
- **AdMob Emulator**: Test ads will NOT show on Android emulator due to `adservices` being blocked. Always test on a physical device.
- **AdMob Single Banner**: `@capacitor-community/admob` only supports one active banner at a time. A second `showBanner()` call replaces the first. Two simultaneous banners require native Android Java code.
- **mipmap-anydpi-v26**: Delete this folder if it exists and you are using plain PNG icons. It causes a Gradle build error referencing a missing `ic_launcher_foreground` resource.
- **TypeScript `never[]` arrays**: After VS Code / TS language server updates, empty array literals (`const stars = []`) are inferred as `never[]` when `noImplicitAny` is not explicitly set. Fix by typing them against their ref: `const stars: typeof starsRef.current = []`. This affects `stars` and `clouds` in the environment init `useEffect` in `GameCanvas.tsx`.
- **TypeScript `noImplicitAny`**: If a VS Code update causes widespread implicit `any` errors despite all types being declared, add `"noImplicitAny": false` to `tsconfig.json` `compilerOptions` and restart the TS server. The game does not rely on implicit any — this suppresses false positives from TS server version changes.
