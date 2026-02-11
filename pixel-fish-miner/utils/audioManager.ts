// Audio Manager for Pixel Fish Miner
// Handles all background music and sound effects

class AudioManager {
  private bgMusic: HTMLAudioElement | null = null;
  private sounds: Record<string, HTMLAudioElement> = {};
  private musicEnabled: boolean = false;
  private soundEffectsEnabled: boolean = true;
  private musicVolume: number = 0.3; // 30% volume for background music
  private sfxVolume: number = 0.5; // 50% volume for sound effects
  private initialized: boolean = false;
  private musicReady: boolean = false; // Track if music is fully loaded

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    try {
      // Initialize background music (MP3 format for maximum compatibility)
      this.bgMusic = new Audio("/sounds/background.mp3");
      this.bgMusic.loop = true;
      this.bgMusic.volume = this.musicVolume;
      this.bgMusic.preload = "auto"; // Force full preload on mobile

      // Wait for music to be fully loaded before allowing playback
      this.bgMusic.addEventListener("canplaythrough", () => {
        this.musicReady = true;
        console.log("Background music fully loaded");
      });

      // Handle loading errors
      this.bgMusic.addEventListener("error", (e) => {
        console.error("Music loading error:", e);
        this.musicReady = false;
      });

      // Initialize sound effects (all MP3 for maximum compatibility)
      this.sounds.claw = new Audio("/sounds/claw.mp3");
      this.sounds.catchNothing = new Audio("/sounds/catchnothing.mp3");
      this.sounds.money = new Audio("/sounds/money.mp3");
      this.sounds.powerup = new Audio("/sounds/powerup.mp3");
      this.sounds.button = new Audio("/sounds/button.mp3");

      // Set volume and preload for all sound effects
      Object.values(this.sounds).forEach((sound) => {
        sound.volume = this.sfxVolume;
        sound.preload = "auto";
      });

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  }

  // Background Music Controls
  public startMusic() {
    if (!this.initialized || !this.musicEnabled || !this.bgMusic) {
      return;
    }

    // Only play if music is fully loaded
    if (!this.musicReady) {
      console.log("Music not ready yet, waiting for load...");
      // Try again after music loads
      this.bgMusic?.addEventListener(
        "canplaythrough",
        () => {
          if (this.musicEnabled) {
            this.bgMusic?.play().catch((error) => {
              console.warn("Music play blocked:", error.message);
            });
          }
        },
        { once: true },
      );
      return;
    }

    this.bgMusic.play().catch((error) => {
      // Browser blocked auto-play (user interaction needed)
      console.warn("Music play blocked:", error.message);
    });
  }

  public stopMusic() {
    if (!this.bgMusic) return;
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

  public toggleMusic(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  // Force load audio (useful for mobile - call on first user interaction)
  public forceLoadMusic() {
    if (this.bgMusic && !this.musicReady) {
      this.bgMusic.load();
    }
  }

  // Sound Effects Controls
  public toggleSoundEffects(enabled: boolean) {
    this.soundEffectsEnabled = enabled;
  }

  // Play specific sound effects
  public playClawRelease() {
    this.playSound("claw");
  }

  public playCatchNothing() {
    this.playSound("catchNothing");
  }

  public playMoneySound() {
    this.playSound("money");
  }

  public playPowerupSound() {
    this.playSound("powerup");
  }

  public playButtonSound() {
    this.playSound("button");
  }

  private playSound(soundKey: string) {
    if (!this.initialized || !this.soundEffectsEnabled) {
      return;
    }

    const sound = this.sounds[soundKey];
    if (!sound) {
      console.error(`Sound ${soundKey} not found`);
      return;
    }

    // Clone and play to allow overlapping sounds
    try {
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = this.sfxVolume;

      // Ensure sound is loaded before playing (mobile fix)
      if (soundClone.readyState >= 2) {
        // HAVE_CURRENT_DATA or better - ready to play
        soundClone.play().catch((error) => {
          console.warn(`Sound ${soundKey} play error:`, error.message);
        });
      } else {
        // Wait for sound to load, then play
        soundClone.addEventListener(
          "canplay",
          () => {
            soundClone.play().catch((error) => {
              console.warn(`Sound ${soundKey} play error:`, error.message);
            });
          },
          { once: true },
        );
        soundClone.load(); // Force load
      }
    } catch (error) {
      console.error(`Error playing sound ${soundKey}:`, error);
    }
  }

  // Volume controls (optional for future use)
  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.musicVolume;
    }
  }

  public setSFXVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = this.sfxVolume;
    });
  }
}

// Create singleton instance
export const audioManager = new AudioManager();
