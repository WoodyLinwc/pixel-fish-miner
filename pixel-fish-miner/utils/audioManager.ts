// Audio Manager for Pixel Fish Miner
class AudioManager {
  private bgMusic: HTMLAudioElement | null = null;
  private sounds: Record<string, HTMLAudioElement> = {};
  private musicEnabled: boolean = false;
  private soundEffectsEnabled: boolean = true;
  private musicVolume: number = 0.3;
  private sfxVolume: number = 0.5;
  private initialized: boolean = false;
  private isMobile: boolean = false;

  constructor() {
    this.isMobile = !!window.Capacitor;
    this.initAudio();
  }

  private initAudio() {
    try {
      this.bgMusic = new Audio("/sounds/background.mp3");
      this.bgMusic.loop = true;
      this.bgMusic.volume = this.musicVolume;

      if (this.isMobile) {
        this.bgMusic.preload = "auto";
        this.bgMusic.load();
      }

      this.sounds.claw = new Audio("/sounds/claw.mp3");
      this.sounds.catchNothing = new Audio("/sounds/catchnothing.mp3");
      this.sounds.money = new Audio("/sounds/money.mp3");
      this.sounds.powerup = new Audio("/sounds/powerup.mp3");
      this.sounds.button = new Audio("/sounds/button.mp3");

      Object.values(this.sounds).forEach((sound) => {
        sound.volume = this.sfxVolume;
        if (this.isMobile) {
          sound.preload = "auto";
          sound.load();
        }
      });

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  }

  public startMusic() {
    if (!this.initialized || !this.musicEnabled || !this.bgMusic) {
      return;
    }

    const playPromise = this.bgMusic.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Music play blocked:", error.message);
        if (this.isMobile) {
          this.bgMusic?.load();
        }
      });
    }
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

  public toggleSoundEffects(enabled: boolean) {
    this.soundEffectsEnabled = enabled;
  }

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

    try {
      if (this.isMobile) {
        sound.currentTime = 0;
        const playPromise = sound.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn(`Sound ${soundKey} play error:`, error.message);
          });
        }
      } else {
        const soundClone = sound.cloneNode() as HTMLAudioElement;
        soundClone.volume = this.sfxVolume;
        soundClone.play().catch((error) => {
          console.warn(`Sound ${soundKey} play error:`, error.message);
        });
      }
    } catch (error) {
      console.error(`Error playing sound ${soundKey}:`, error);
    }
  }

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

export const audioManager = new AudioManager();
