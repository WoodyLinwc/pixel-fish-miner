/**
 * Background boat spawning logic
 */

import { GAME_WIDTH, SURFACE_Y } from "../../constants";
import { BackgroundBoat } from "../environment/boats"; // Import existing type

/**
 * Spawn background boats (parallax effect)
 */
export const spawnBackgroundBoats = (
  boats: BackgroundBoat[],
  hasKraken: boolean = false, // NEW PARAMETER
): void => {
  // Regular boat spawning
  if (Math.random() < 0.0005) {
    const isBig = Math.random() > 0.7; // 30% chance for big ship
    const startLeft = Math.random() > 0.5;
    // Move significantly slower to simulate distance parallax
    const speed = (isBig ? 0.15 : 0.3) * (Math.random() * 0.5 + 0.5);

    // Randomize size (scale) to add variety
    const sizeMult = 1.0 + Math.random() * 0.5; // 1.0x to 1.5x variation
    const finalScale = 0.75 * sizeMult; // Base scale 0.75

    boats.push({
      x: startLeft ? -150 : GAME_WIDTH + 150,
      y: SURFACE_Y - 5, // Sit slightly above horizon
      vx: startLeft ? speed : -speed,
      type: isBig ? "BIG" : "SMALL",
      color: Math.random(), // For random variation if needed
      scale: finalScale,
    });
  }

  // NEW: Ghost boat spawning (only if Kraken owned)
  if (hasKraken && Math.random() < 0.0003) {
    const startLeft = Math.random() > 0.5;
    const speed = 0.25 * (Math.random() * 0.5 + 0.5);
    const sizeMult = 0.8 + Math.random() * 0.4; // 0.8x to 1.2x variation
    const finalScale = 0.7 * sizeMult; // Slightly smaller base scale

    boats.push({
      x: startLeft ? -150 : GAME_WIDTH + 150,
      y: SURFACE_Y - 8, // Slightly higher for ethereal effect
      vx: startLeft ? speed : -speed,
      type: "GHOST",
      color: Math.random(),
      scale: finalScale,
      opacity: 0.3, // Initial opacity
    });
  }
};

/**
 * Update boat positions
 */
export const updateBackgroundBoats = (
  boats: BackgroundBoat[],
): BackgroundBoat[] => {
  boats.forEach((b) => {
    b.x += b.vx;
  });

  // Remove off-screen boats
  return boats.filter((b) => b.x > -200 && b.x < GAME_WIDTH + 200);
};
