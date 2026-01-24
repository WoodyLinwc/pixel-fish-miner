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

  constructor() {
    this.initAudio();
  }

  private initAudio() {
    try {
      console.log("🎵 Initializing Audio Manager...");

      // Initialize background music (MP3 format for maximum compatibility)
      this.bgMusic = new Audio("/sounds/background.mp3");
      this.bgMusic.loop = true;
      this.bgMusic.volume = this.musicVolume;
      console.log("✅ Background music loaded");

      // Initialize sound effects (all MP3 for maximum compatibility)
      this.sounds.claw = new Audio("/sounds/claw.mp3");
      this.sounds.catchNothing = new Audio("/sounds/catchnothing.mp3");
      this.sounds.money = new Audio("/sounds/money.mp3");
      this.sounds.powerup = new Audio("/sounds/powerup.mp3");
      this.sounds.button = new Audio("/sounds/button.mp3");

      // Set volume for all sound effects
      Object.values(this.sounds).forEach((sound) => {
        sound.volume = this.sfxVolume;
      });

      console.log("✅ Sound effects loaded:", Object.keys(this.sounds));
      this.initialized = true;
    } catch (error) {
      console.error("❌ Error initializing audio:", error);
    }
  }

  // Background Music Controls
  public startMusic() {
    if (!this.initialized) {
      console.warn("⚠️ Audio not initialized yet");
      return;
    }

    if (!this.musicEnabled || !this.bgMusic) {
      console.log("🔇 Music disabled or not loaded");
      return;
    }

    console.log("🎵 Starting background music...");
    this.bgMusic
      .play()
      .then(() => console.log("✅ Background music playing"))
      .catch((error) => {
        console.warn(
          "⚠️ Background music play blocked (user interaction needed):",
          error.message,
        );
      });
  }

  public stopMusic() {
    if (!this.bgMusic) return;
    console.log("🔇 Stopping background music");
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }

  public toggleMusic(enabled: boolean) {
    console.log(`🎵 Music toggle: ${enabled}`);
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  // Sound Effects Controls
  public toggleSoundEffects(enabled: boolean) {
    console.log(`🔊 Sound effects toggle: ${enabled}`);
    this.soundEffectsEnabled = enabled;
  }

  // Play specific sound effects
  public playClawRelease() {
    console.log("🔊 Playing claw release sound");
    this.playSound("claw");
  }

  public playCatchNothing() {
    console.log("🔊 Playing catch nothing sound");
    this.playSound("catchNothing");
  }

  public playMoneySound() {
    console.log("🔊 Playing money sound");
    this.playSound("money");
  }

  public playPowerupSound() {
    console.log("🔊 Playing powerup sound");
    this.playSound("powerup");
  }

  public playButtonSound() {
    console.log("🔊 Playing button sound");
    this.playSound("button");
  }

  private playSound(soundKey: string) {
    if (!this.initialized) {
      console.warn("⚠️ Audio not initialized yet");
      return;
    }

    if (!this.soundEffectsEnabled) {
      console.log("🔇 Sound effects disabled");
      return;
    }

    const sound = this.sounds[soundKey];
    if (!sound) {
      console.error(`❌ Sound ${soundKey} not found in loaded sounds`);
      return;
    }

    // Clone and play to allow overlapping sounds
    try {
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = this.sfxVolume;
      soundClone
        .play()
        .then(() => console.log(`✅ ${soundKey} played successfully`))
        .catch((error) => {
          console.warn(`⚠️ Sound ${soundKey} play error:`, error.message);
        });
    } catch (error) {
      console.error(`❌ Error playing sound ${soundKey}:`, error);
    }
  }

  // Volume controls (optional for future use)
  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.musicVolume;
    }
    console.log(
      `🎵 Music volume set to ${Math.round(this.musicVolume * 100)}%`,
    );
  }

  public setSFXVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = this.sfxVolume;
    });
    console.log(`🔊 SFX volume set to ${Math.round(this.sfxVolume * 100)}%`);
  }
}

// Create singleton instance
export const audioManager = new AudioManager();
