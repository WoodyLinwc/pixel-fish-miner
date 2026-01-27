/**
 * Sky rendering: gradient, sun, moon, and stars
 */

interface SkyColors {
  skyTop: string;
  skyBot: string;
}

/**
 * Draw sky gradient background
 */
export const drawSkyGradient = (
  ctx: CanvasRenderingContext2D,
  width: number,
  surfaceY: number,
  colors: SkyColors,
) => {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, surfaceY);
  skyGrad.addColorStop(0, colors.skyTop);
  skyGrad.addColorStop(1, colors.skyBot);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, surfaceY);
};

/**
 * Draw the sun (visible during day: 5 AM - 7 PM)
 */
export const drawSun = (
  ctx: CanvasRenderingContext2D,
  currentHour: number,
  width: number,
  surfaceY: number,
) => {
  if (currentHour >= 5 && currentHour <= 19) {
    const sunDuration = 14;
    const sunProgress = (currentHour - 5) / sunDuration; // 0 to 1
    // Arc movement: x goes 0 to width, y goes up then down
    const sunX = sunProgress * width;
    const sunY = surfaceY - 20 - Math.sin(sunProgress * Math.PI) * 100;

    ctx.save();
    // Sun Glow
    ctx.fillStyle = "rgba(255, 255, 200, 0.3)";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
    ctx.fill();
    // Sun Core
    ctx.fillStyle = "#ffeb3b";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

/**
 * Draw the moon (visible at night: 6 PM - 6 AM)
 */
export const drawMoon = (
  ctx: CanvasRenderingContext2D,
  currentHour: number,
  width: number,
  surfaceY: number,
) => {
  let moonProgress = -1;
  if (currentHour >= 18) moonProgress = (currentHour - 18) / 12;
  else if (currentHour <= 6) moonProgress = (currentHour + 6) / 12;

  if (moonProgress >= 0 && moonProgress <= 1) {
    const moonX = moonProgress * width;
    const moonY = surfaceY - 30 - Math.sin(moonProgress * Math.PI) * 90;

    ctx.save();
    ctx.fillStyle = "#f4f4f4"; // White moon
    ctx.beginPath();
    ctx.arc(moonX, moonY, 12, 0, Math.PI * 2);
    ctx.fill();
    // Crater
    ctx.fillStyle = "#e0e0e0";
    ctx.beginPath();
    ctx.arc(moonX + 4, moonY - 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
};

/**
 * Draw stars (visible at night with blinking animation)
 */
export const drawStars = (
  ctx: CanvasRenderingContext2D,
  stars: { x: number; y: number; size: number; blinkOffset: number }[],
  currentHour: number,
  visualTime: number,
) => {
  // Stars only visible at night/dusk
  if (currentHour >= 18 || currentHour <= 6) {
    let alpha = 1;
    // Fade in dusk/dawn
    if (currentHour >= 18 && currentHour < 20) alpha = (currentHour - 18) / 2;
    if (currentHour >= 4 && currentHour < 6) alpha = 1 - (currentHour - 4) / 2;

    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    stars.forEach((star) => {
      const blink = Math.sin(visualTime * 0.005 + star.blinkOffset) > 0;
      if (blink) {
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }
    });
    ctx.restore();
  }
};
