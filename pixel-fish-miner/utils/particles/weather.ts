/**
 * Weather particle spawning and management
 */

import { WeatherType } from "../../types";
import { Particle } from "./types";

/**
 * Spawn rain particles
 */
export const spawnRain = (particles: Particle[], gameWidth: number): void => {
  if (particles.filter((p) => p.type === "RAIN").length < 100) {
    // Spawn multiple drops
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: Math.random() * gameWidth,
        y: -10,
        vx: -2 + Math.random(),
        vy: 10 + Math.random() * 5,
        size: 2 + Math.random() * 2,
        color: "rgba(179, 229, 252, 0.6)",
        type: "RAIN",
      });
    }
  }
};

/**
 * Spawn snow particles
 */
export const spawnSnow = (particles: Particle[], gameWidth: number): void => {
  if (particles.filter((p) => p.type === "SNOW").length < 80) {
    if (Math.random() < 0.2) {
      particles.push({
        x: Math.random() * gameWidth,
        y: -10,
        vx: -1 + Math.random() * 2,
        vy: 1 + Math.random() * 2,
        size: 2 + Math.random() * 2,
        color: "white",
        type: "SNOW",
        wobble: Math.random() * 10,
      });
    }
  }
};

/**
 * Spawn wind particles (leaves and wind lines)
 */
export const spawnWind = (particles: Particle[], surfaceY: number): void => {
  if (particles.filter((p) => p.type === "LEAF").length < 40) {
    if (Math.random() < 0.1) {
      const isLeaf = Math.random() > 0.5;
      particles.push({
        x: -20,
        y: Math.random() * (surfaceY + 50),
        vx: 5 + Math.random() * 10,
        vy: Math.random() - 0.5,
        size: isLeaf ? 4 : 2,
        color: isLeaf ? "#a1887f" : "rgba(255,255,255,0.3)",
        type: "LEAF",
      });
    }
  }
};

/**
 * Spawn fog/mist particles
 */
export const spawnFog = (
  particles: Particle[],
  gameWidth: number,
  gameHeight: number,
  surfaceY: number,
): void => {
  if (particles.filter((p) => p.type === "MIST").length < 30) {
    if (Math.random() < 0.05) {
      const startLeft = Math.random() > 0.5;
      particles.push({
        x: startLeft ? -100 : gameWidth + 100,
        y:
          Math.random() * surfaceY +
          Math.random() * (gameHeight - surfaceY) * 0.5, // Mostly upper half
        vx: startLeft ? 0.2 + Math.random() * 0.3 : -0.2 - Math.random() * 0.3,
        vy: 0,
        size: 40 + Math.random() * 60, // Large blobs
        color: "rgba(255, 255, 255, 0.15)", // Very faint
        type: "MIST",
      });
    }
  }
};

/**
 * Spawn rainbow sparkles
 */
export const spawnRainbowSparkles = (
  particles: Particle[],
  gameWidth: number,
): void => {
  if (particles.filter((p) => p.type === "RAINBOW_SPARKLE").length < 60) {
    if (Math.random() < 0.1) {
      const colors = ["#f44336", "#ffeb3b", "#4caf50", "#2196f3", "#9c27b0"];
      particles.push({
        x: Math.random() * gameWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 1,
        vy: 1 + Math.random() * 2,
        size: 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: "RAINBOW_SPARKLE",
      });
    }
  }
};

/**
 * Spawn all weather particles based on current weather
 */
export const spawnWeatherParticles = (
  weather: WeatherType,
  particles: Particle[],
  gameWidth: number,
  gameHeight: number,
  surfaceY: number,
): void => {
  if (weather === WeatherType.RAIN) {
    spawnRain(particles, gameWidth);
  } else if (weather === WeatherType.SNOW) {
    spawnSnow(particles, gameWidth);
  } else if (weather === WeatherType.WIND) {
    spawnWind(particles, surfaceY);
  } else if (weather === WeatherType.FOG) {
    spawnFog(particles, gameWidth, gameHeight, surfaceY);
  } else if (weather === WeatherType.RAINBOW) {
    spawnRainbowSparkles(particles, gameWidth);
  }
};
