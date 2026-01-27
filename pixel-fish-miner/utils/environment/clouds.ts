/**
 * Cloud rendering system
 */

import { WeatherType } from "../../types";

export interface Cloud {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
}

/**
 * Draw moving clouds with pixel art style
 */
export const drawClouds = (
  ctx: CanvasRenderingContext2D,
  clouds: Cloud[],
  currentHour: number,
  weather: WeatherType,
) => {
  ctx.save();

  // Cloud color based on time and weather
  if (currentHour > 19 || currentHour < 5) {
    ctx.fillStyle = "#546e7a"; // Night clouds
  } else if (weather === WeatherType.RAIN || weather === WeatherType.SNOW) {
    ctx.fillStyle = "#78909c"; // Stormy clouds
  } else if (weather === WeatherType.FOG) {
    ctx.fillStyle = "#eceff1"; // Fog clouds
  } else {
    ctx.fillStyle = "#ffffff"; // Day clouds
  }

  clouds.forEach((cloud) => {
    // Main cloud body
    ctx.fillRect(cloud.x, cloud.y, cloud.w, cloud.h);
    // Simple pixel art detail: smaller block on top
    ctx.fillRect(cloud.x + 10, cloud.y - 10, cloud.w - 20, 10);
  });

  ctx.restore();
};
