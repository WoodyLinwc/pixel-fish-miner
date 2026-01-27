/**
 * Screen overlay rendering (lighting, weather effects)
 */

import { WeatherType } from "../../types";

/**
 * Draw global lighting overlay (day/night darkness)
 */
export const drawLightingOverlay = (
  ctx: CanvasRenderingContext2D,
  overlay: string,
  gameWidth: number,
  gameHeight: number,
) => {
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
};

/**
 * Draw weather-specific overlays
 */
export const drawWeatherOverlay = (
  ctx: CanvasRenderingContext2D,
  weather: WeatherType,
  rainOverlay: string,
  snowOverlay: string,
  windOverlay: string,
  fogOverlay: string,
  gameWidth: number,
  gameHeight: number,
) => {
  let overlayColor: string | null = null;

  if (weather === WeatherType.RAIN) {
    overlayColor = rainOverlay;
  } else if (weather === WeatherType.SNOW) {
    overlayColor = snowOverlay;
  } else if (weather === WeatherType.WIND) {
    overlayColor = windOverlay;
  } else if (weather === WeatherType.FOG) {
    overlayColor = fogOverlay;
  }

  if (overlayColor) {
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
  }
};
