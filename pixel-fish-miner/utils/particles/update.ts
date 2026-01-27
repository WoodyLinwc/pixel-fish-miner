/**
 * Particle update and cleanup logic
 */

import { Particle } from "./types";

/**
 * Update all particles (movement, animation, lifetime)
 */
export const updateParticles = (
  particles: Particle[],
  time: number,
): Particle[] => {
  particles.forEach((p) => {
    // Update position
    p.x += p.vx;
    p.y += p.vy;

    // Snow wobble
    if (p.type === "SNOW" && p.wobble !== undefined) {
      p.x += Math.sin(time * 0.005 + p.wobble) * 0.5;
    }

    // Music note swaying
    if (p.type === "MUSIC" && p.wobble !== undefined) {
      p.x += Math.sin(time * 0.005 + p.wobble) * 0.3;
    }

    // Bubble wobble and pixel snapping
    if (p.type === "BUBBLE") {
      p.x += Math.sin(time * 0.01 + p.y * 0.1) * 0.5;
      // Snap to pixel grid movement roughly
      p.x = Math.round(p.x);
      p.y = Math.round(p.y);
    }

    // Life decay for fading particles
    if (
      p.type === "BUBBLE" ||
      (p.type === "RAINBOW_SPARKLE" && p.life !== undefined)
    ) {
      p.life = (p.life || 1) - 0.02;
    }
  });

  // Filter out dead particles
  return particles.filter((p) => {
    // Music notes die when high up
    if (p.type === "MUSIC") return p.y > 0;

    // Bubbles and sparkles die when life expires
    if (
      p.type === "BUBBLE" ||
      (p.type === "RAINBOW_SPARKLE" && p.life !== undefined)
    ) {
      return (p.life || 0) > 0;
    }

    // Mist particles (off-screen check)
    if (p.type === "MIST") return p.x > -200 && p.x < 1000; // gameWidth + margin

    // General particles (off-screen check)
    return p.y < 700 && p.x > -50 && p.x < 850; // gameHeight + margin, gameWidth + margin
  });
};
