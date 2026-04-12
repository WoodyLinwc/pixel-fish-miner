// Audio Manager for Pixel Fish Miner
// ====================================
// Uses Web Audio API instead of HTMLAudioElement.
//
// Why: HTMLAudioElement streams audio progressively. On Android WebView:
//   - .loop restarts at the end of the buffered portion (~1s), not the full track
//   - Going to background releases buffered data, breaking playback on resume
//   - Cloned elements inherit broken buffers, killing SFX
//
// Web Audio API decodes the entire MP3 into an in-memory AudioBuffer (raw PCM).
// Once decoded, the data never gets released — looping, pausing, and resuming
// all work from the full decoded buffer regardless of WebView state.

const MUSIC_VOLUME = 0.3;
const SFX_VOLUME = 0.5;

const SOUND_PATHS: Record<string, string> = {
  background: "./sounds/background.mp3",
  button: "./sounds/button.mp3",
  catchnothing: "./sounds/catchnothing.mp3",
  claw: "./sounds/claw.mp3",
  money: "./sounds/money.mp3",
  powerup: "./sounds/powerup.mp3",
};

class AudioManager {
  // Web Audio API core
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Decoded audio buffers (persist in memory forever once loaded)
  private musicBuffer: AudioBuffer | null = null;
  private sfxBuffers: Map<string, AudioBuffer> = new Map();

  // Current music source node (one-shot — must recreate after each stop)
  private musicSource: AudioBufferSourceNode | null = null;

  // Music position tracking for pause/resume
  private musicStartTime: number = 0; // ctx.currentTime when playback started
  private musicOffset: number = 0; // position in track (seconds)
  private isMusicPlaying: boolean = false;

  // State
  private isMusicEnabled: boolean = true;
  private isSfxEnabled: boolean = true;
  private hasUserInteracted: boolean = false;
  private musicPendingPlay: boolean = false;
  private isLoaded: boolean = false;
  private isLoading: boolean = false;

  constructor() {
    const savedMusic = localStorage.getItem("pixel-fish-miner-music");
    const savedSfx = localStorage.getItem("pixel-fish-miner-sfx");
    this.isMusicEnabled = savedMusic !== null ? savedMusic === "true" : true;
    this.isSfxEnabled = savedSfx !== null ? savedSfx === "true" : true;

    this.setupInteractionListeners();
  }

  // ─── AudioContext Setup ───────────────────────────────────────

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = MUSIC_VOLUME;
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = SFX_VOLUME;
      this.sfxGain.connect(this.ctx.destination);
    }

    return this.ctx;
  }

  // ─── Audio Loading ────────────────────────────────────────────

  /**
   * Preload all sounds during the loading screen (before any user gesture).
   * Creates AudioContext (starts suspended on mobile) and fetches+decodes all MP3s.
   * This way, when the user finally taps, we only need ctx.resume() which is instant.
   */
  async preload(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;

    try {
      this.ensureContext();
      await this.loadAllSounds();
    } catch (err) {
      console.warn("Preload failed, will retry on interaction:", err);
    }
  }

  private async loadAllSounds(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;
    this.isLoading = true;

    const ctx = this.ensureContext();

    try {
      const entries = Object.entries(SOUND_PATHS);

      // Fetch and decode all files in parallel
      const results = await Promise.allSettled(
        entries.map(async ([key, path]) => {
          const response = await fetch(path);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          return { key, audioBuffer };
        }),
      );

      for (const result of results) {
        if (result.status === "fulfilled") {
          const { key, audioBuffer } = result.value;
          if (key === "background") {
            this.musicBuffer = audioBuffer;
          } else {
            this.sfxBuffers.set(key, audioBuffer);
          }
        } else {
          console.warn("Failed to load sound:", result.reason);
        }
      }

      this.isLoaded = true;
    } catch (err) {
      console.error("Audio loading error:", err);
    } finally {
      this.isLoading = false;
    }
  }

  // ─── User Interaction Gate ────────────────────────────────────

  private setupInteractionListeners(): void {
    const unlock = async () => {
      if (this.hasUserInteracted) return;
      this.hasUserInteracted = true;

      // Resume AudioContext synchronously in the user gesture — critical for mobile browsers.
      // Sounds should already be loaded via preload(), but load as fallback if not.
      const ctx = this.ensureContext();
      if (ctx.state === "suspended") {
        // Do NOT await — calling resume() synchronously in the gesture is what
        // mobile browsers require. Awaiting it can lose the gesture context.
        ctx.resume().catch(() => {});
      }

      // Fallback: load sounds if preload() wasn't called or failed
      if (!this.isLoaded) {
        await this.loadAllSounds();
      }

      // Start music if it was waiting
      if (this.musicPendingPlay && this.isMusicEnabled) {
        this.playMusicInternal();
      }

      document.removeEventListener("click", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("keydown", unlock);
    };

    document.addEventListener("click", unlock);
    document.addEventListener("touchstart", unlock);
    document.addEventListener("keydown", unlock);
  }

  // ─── Background Music ─────────────────────────────────────────

  /** Start background music from the beginning. Call after loading screen. */
  startMusic(): void {
    if (!this.isMusicEnabled) return;

    if (!this.hasUserInteracted || !this.isLoaded) {
      this.musicPendingPlay = true;
      return;
    }

    this.musicOffset = 0;
    this.playMusicInternal();
  }

  /** Create a new source node and start playing from musicOffset */
  private playMusicInternal(): void {
    if (!this.musicBuffer || !this.ctx || !this.musicGain) return;
    this.musicPendingPlay = false;

    // Stop any existing source
    this.destroyMusicSource();

    // Make sure context is running
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    const source = this.ctx.createBufferSource();
    source.buffer = this.musicBuffer;
    source.loop = true; // Works correctly with Web Audio — full PCM is in memory
    source.connect(this.musicGain);

    const offset = this.musicOffset % this.musicBuffer.duration;
    source.start(0, offset);

    this.musicSource = source;
    this.musicStartTime = this.ctx.currentTime;
    this.isMusicPlaying = true;

    source.onended = () => {
      if (this.musicSource === source) {
        this.isMusicPlaying = false;
      }
    };
  }

  /** Stop and disconnect the current source node */
  private destroyMusicSource(): void {
    if (this.musicSource) {
      try {
        this.musicSource.onended = null;
        this.musicSource.stop();
        this.musicSource.disconnect();
      } catch {
        // May already be stopped
      }
      this.musicSource = null;
    }
    this.isMusicPlaying = false;
  }

  /** Save how far into the track we are */
  private savePosition(): void {
    if (this.isMusicPlaying && this.ctx && this.musicBuffer) {
      const elapsed = this.ctx.currentTime - this.musicStartTime;
      this.musicOffset =
        (this.musicOffset + elapsed) % this.musicBuffer.duration;
    }
  }

  /**
   * Pause music and suspend AudioContext.
   * Call from Capacitor 'pause' event (app going to background).
   */
  pauseMusic(): void {
    this.savePosition();
    this.destroyMusicSource();

    // Suspend context to release system audio resources on mobile
    if (this.ctx && this.ctx.state === "running") {
      this.ctx.suspend().catch(() => {});
    }
  }

  /**
   * Resume AudioContext and restart music if enabled.
   * ALWAYS call this from Capacitor 'resume' event — it resumes the
   * AudioContext so SFX work again, even if music is toggled off.
   */
  resumeMusic(): void {
    if (!this.hasUserInteracted || !this.isLoaded || !this.ctx) return;

    // Always resume the AudioContext (needed for SFX too)
    if (this.ctx.state === "suspended") {
      this.ctx
        .resume()
        .then(() => {
          // Only restart music if it's enabled
          if (this.isMusicEnabled) {
            this.playMusicInternal();
          }
        })
        .catch(() => {});
    } else if (this.isMusicEnabled) {
      this.playMusicInternal();
    }
  }

  /** Stop music and reset to beginning */
  stopMusic(): void {
    this.musicOffset = 0;
    this.destroyMusicSource();
    this.musicPendingPlay = false;
  }

  // ─── Music Toggle ─────────────────────────────────────────────

  setMusicEnabled(enabled: boolean): void {
    this.isMusicEnabled = enabled;

    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  getMusicEnabled(): boolean {
    return this.isMusicEnabled;
  }

  // ─── SFX Toggle ───────────────────────────────────────────────

  setSfxEnabled(enabled: boolean): void {
    this.isSfxEnabled = enabled;
  }

  getSfxEnabled(): boolean {
    return this.isSfxEnabled;
  }

  // ─── Sound Effect Playback ────────────────────────────────────

  /**
   * Play a one-shot sound effect.
   * Creates a new AudioBufferSourceNode from the pre-decoded buffer.
   * Multiple overlapping plays are fine — source nodes are lightweight.
   */
  private playSfx(key: string): void {
    if (!this.isSfxEnabled || !this.hasUserInteracted) return;
    if (!this.ctx || !this.sfxGain) return;

    const buffer = this.sfxBuffers.get(key);
    if (!buffer) return;

    // Resume context if suspended (safety net)
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.sfxGain);
    source.start(0);
    // AudioBufferSourceNodes auto-GC after playback — no cleanup needed
  }

  playButtonSound(): void {
    this.playSfx("button");
  }

  playClawRelease(): void {
    this.playSfx("claw");
  }

  playCatchNothing(): void {
    this.playSfx("catchnothing");
  }

  playMoneySound(): void {
    this.playSfx("money");
  }

  playPowerupSound(): void {
    this.playSfx("powerup");
  }
}

export const audioManager = new AudioManager();
