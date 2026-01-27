/**
 * Airplane spawning logic (supply drop event)
 */

import { GAME_WIDTH, SURFACE_Y } from "../../constants";

export interface Airplane {
  x: number;
  y: number;
  vx: number;
  hasDropped: boolean;
}

/**
 * Check if should spawn airplane (promo code or random)
 */
export const shouldSpawnAirplane = (
  hasSupplyBox: boolean,
  airplaneExists: boolean,
): boolean => {
  // Only if no supply box exists and no airplane currently flying
  if (airplaneExists || hasSupplyBox) return false;

  // Random Rare Occurrence (0.01% chance per frame)
  return Math.random() < 0.0001;
};

/**
 * Create airplane entity
 */
export const createAirplane = (): Airplane => {
  const startLeft = Math.random() > 0.5;
  return {
    x: startLeft ? -100 : GAME_WIDTH + 100,
    y: 30 + Math.random() * 30, // High in sky
    vx: startLeft ? 2.5 : -2.5, // Reasonably fast
    hasDropped: false,
  };
};

/**
 * Update airplane position
 * Returns true if airplane should be despawned
 */
export const updateAirplane = (airplane: Airplane): boolean => {
  airplane.x += airplane.vx;

  // Despawn if off-screen
  return airplane.x < -200 || airplane.x > GAME_WIDTH + 200;
};

/**
 * Check if airplane should drop supply box
 */
export const shouldDropSupplyBox = (airplane: Airplane): boolean => {
  if (airplane.hasDropped) return false;

  const centerX = GAME_WIDTH / 2;
  const dropZone = 100; // Drop within 100px of center

  return Math.abs(airplane.x - centerX) < dropZone && Math.random() < 0.1;
};
