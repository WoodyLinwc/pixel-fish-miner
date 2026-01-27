/**
 * Special effect particles (bubbles, sparkles, music notes)
 */

import { EntityFish } from "../../types";
import { Particle } from "./types";

/**
 * Spawn narwhal aura sparkles
 */
export const spawnNarwhalAura = (
  fish: EntityFish,
  particles: Particle[],
): void => {
  if (Math.random() < 0.3) {
    // 30% chance per frame for trail
    const colors = ["#ffeb3b", "#fce4ec", "#e1f5fe", "#fff"];
    particles.push({
      x: fish.x + (Math.random() - 0.5) * fish.type.width,
      y: fish.y + (Math.random() - 0.5) * fish.type.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.5 - Math.random(),
      size: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: "RAINBOW_SPARKLE",
      life: 1.0, // Fade out
    });
  }
};

/**
 * Spawn sea turtle bubbles
 */
export const spawnSeaTurtleBubbles = (
  fish: EntityFish,
  particles: Particle[],
): void => {
  // Reduced frequency from 0.1 to 0.02
  if (Math.random() < 0.02) {
    particles.push({
      x: fish.x + (fish.facingRight ? 10 : -10),
      y: fish.y - 15,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -1 - Math.random(),
      size: 3 + Math.floor(Math.random() * 3), // Integer sizes for pixels
      color: "rgba(255, 255, 255, 0.6)",
      type: "BUBBLE",
      life: 1.0,
    });
  }
};

/**
 * Spawn music notes (idle whistling animation)
 */
export const spawnMusicNotes = (
  particles: Particle[],
  x: number,
  y: number,
): void => {
  // 0.5% chance per frame (~once every 3.3 seconds on avg)
  if (Math.random() < 0.005) {
    const colors = ["#f48fb1", "#81d4fa", "#ce93d8", "#ffcc80", "#e6ee9c"];
    particles.push({
      x,
      y,
      vx: 0.2 + Math.random() * 0.2, // Drift right SLOWLY
      vy: -0.3 - Math.random() * 0.3, // Float up SLOWLY
      size: 14, // Font size
      color: colors[Math.floor(Math.random() * colors.length)],
      type: "MUSIC",
      text: Math.random() > 0.5 ? "♪" : "♫",
      wobble: Math.random() * 100,
    });
  }
};
