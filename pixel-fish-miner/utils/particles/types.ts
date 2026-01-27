/**
 * Particle system type definitions
 */

export type ParticleType =
  | "RAIN"
  | "SNOW"
  | "LEAF"
  | "WIND_LINE"
  | "MIST"
  | "RAINBOW_SPARKLE"
  | "BUBBLE"
  | "MUSIC";

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  type: ParticleType;
  wobble?: number; // Used for snow and music wobble animation
  life?: number; // Used for bubbles and rainbow sparkles fade
  text?: string; // Used for music notes (♪ or ♫)
}
