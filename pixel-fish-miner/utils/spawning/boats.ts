/**
 * Background boat spawning logic
 */

import { GAME_WIDTH, SURFACE_Y } from "../../constants";
import { BackgroundBoat } from "../environment/boats"; // Import existing type

/**
 * Spawn background boats (parallax effect)
 */
export const spawnBackgroundBoats = (boats: BackgroundBoat[]): void => {
  // Reduced occurrence from 0.001 to 0.0005
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
