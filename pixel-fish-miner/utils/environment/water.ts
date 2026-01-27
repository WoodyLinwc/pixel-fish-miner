/**
 * Water rendering: bands, waves, sparkles
 */

import { WeatherType } from "../../types";

/**
 * Draw water bands (depth layers)
 */
export const drawWaterBands = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  surfaceY: number,
) => {
  const waterBaseColors = [
    "#4fc3f7",
    "#29b6f6",
    "#03a9f4",
    "#039be5",
    "#0288d1",
  ];

  const bandSize = (height - surfaceY) / 5;

  ctx.save();
  waterBaseColors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, surfaceY + i * bandSize, width, bandSize);
  });
  ctx.restore();
};

/**
 * Draw animated waves on water surface
 */
export const drawWaves = (
  ctx: CanvasRenderingContext2D,
  width: number,
  surfaceY: number,
  visualTime: number,
  weather: WeatherType,
) => {
  ctx.save();
  ctx.fillStyle = "#e1f5fe";

  const waveChunkWidth = 10;
  const waveAmplitude = 3;
  const waveSpeed = 0.005;
  const waveWindSpeed = weather === WeatherType.WIND ? 3 : 1;

  for (let x = 0; x <= width; x += waveChunkWidth) {
    const yOffset =
      Math.sin(x * 0.05 + visualTime * waveSpeed * waveWindSpeed) *
      waveAmplitude;
    const discreteY = Math.floor(yOffset);
    ctx.fillRect(x, surfaceY + discreteY - 2, waveChunkWidth + 1, 5);
  }

  ctx.restore();
};

/**
 * Draw sparkles on water (during day)
 */
export const drawWaterSparkles = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  surfaceY: number,
  lightLevel: number,
  visualTime: number,
) => {
  if (lightLevel > 0.6) {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";

    for (let i = 0; i < 15; i++) {
      const px = (i * 97) % width;
      const py = surfaceY + 20 + ((i * 43) % (height - surfaceY - 40));
      const blink = Math.sin(visualTime * 0.005 + i);
      if (blink > 0.8) {
        ctx.fillRect(px, py, 4, 4);
      }
    }

    ctx.restore();
  }
};
