/**
 * Seagull spawning logic
 */

import { GAME_WIDTH, SURFACE_Y } from "../../constants";
import { Seagull } from "../environment/seagulls"; // Import existing type

/**
 * Spawn seagulls (daytime only: 5am to 8pm)
 */
export const spawnSeagulls = (seagulls: Seagull[], gameHour: number): void => {
  if (gameHour > 5 && gameHour < 20) {
    if (Math.random() < 0.003 && seagulls.length < 5) {
      // 0.3% chance per frame
      const startLeft = Math.random() > 0.5;
      seagulls.push({
        x: startLeft ? -30 : GAME_WIDTH + 30,
        y: 10 + Math.random() * (SURFACE_Y - 60), // Keep them high enough
        vx: startLeft
          ? 0.5 + Math.random() * 0.5
          : -(0.5 + Math.random() * 0.5),
        flapTimer: Math.random() * 10,
        flapState: 0,
      });
    }
  }
};

/**
 * Update seagull positions and animation
 */
export const updateSeagulls = (
  seagulls: Seagull[],
  time: number,
): Seagull[] => {
  seagulls.forEach((s) => {
    s.x += s.vx;
    s.y += Math.sin(time * 0.003 + s.x * 0.05) * 0.2; // Gentle bobbing
    s.flapTimer++;
    if (s.flapTimer > 8) {
      // Flap speed
      s.flapState = (s.flapState + 1) % 4;
      s.flapTimer = 0;
    }
  });

  // Despawn off-screen
  return seagulls.filter((s) => s.x > -50 && s.x < GAME_WIDTH + 50);
};
