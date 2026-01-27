/**
 * Collision detection utilities for fishing game
 */

import { EntityFish } from "../types";

/**
 * Check if claw tip collides with any fish
 * Returns index of first fish hit, or -1 if no collision
 */
export const checkFishCollision = (
  tipX: number,
  tipY: number,
  fishes: EntityFish[],
): number => {
  for (let i = 0; i < fishes.length; i++) {
    const f = fishes[i];
    const dx = tipX - f.x;
    const dy = tipY - f.y;

    // Collision box is slightly smaller than visual sprite for better feel
    if (
      Math.abs(dx) < f.type.width / 1.5 &&
      Math.abs(dy) < f.type.height / 1.5
    ) {
      return i;
    }
  }
  return -1;
};

/**
 * Get all fish within net radius (for Super Net powerup)
 * Returns caught fish and their indices (sorted descending for safe removal)
 */
export const getNetCatch = (
  tipX: number,
  tipY: number,
  fishes: EntityFish[],
  radius: number,
): { fish: EntityFish[]; indices: number[] } => {
  const caughtIndices: number[] = [];
  const fishesToCatch: EntityFish[] = [];

  fishes.forEach((f, idx) => {
    // Skip crabs - they cut the net!
    if (f.type.id === "crab") return;

    const dx = tipX - f.x;
    const dy = tipY - f.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius) {
      caughtIndices.push(idx);
      fishesToCatch.push(f);
    }
  });

  // Sort indices descending so we can safely splice from array
  return {
    fish: fishesToCatch,
    indices: caughtIndices.sort((a, b) => b - a),
  };
};

/**
 * Check if claw hit a wall or reached max length
 */
export const checkWallCollision = (
  tipX: number,
  tipY: number,
  clawLength: number,
  maxLength: number,
  gameWidth: number,
  gameHeight: number,
): boolean => {
  const hitWall = tipX < 0 || tipX > gameWidth || tipY > gameHeight;
  const hitMax = clawLength >= maxLength;
  return hitWall || hitMax;
};
