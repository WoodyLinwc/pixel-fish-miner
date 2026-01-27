/**
 * Powerup and effect timer rendering
 */

/**
 * Draw a single timer with blinking effect
 */
const drawTimer = (
  ctx: CanvasRenderingContext2D,
  label: string,
  remaining: number,
  color1: string,
  strokeColor: string,
  y: number,
  time: number,
  gameWidth: number,
) => {
  ctx.save();
  ctx.font = 'bold 16px "Press Start 2P"';

  // Blink effect (every 500ms)
  const blink = Math.floor(time / 500) % 2 === 0;
  ctx.fillStyle = blink ? color1 : "#fff";
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 4;
  ctx.textAlign = "center";

  const text = `${label}: ${remaining}s`;
  ctx.strokeText(text, gameWidth / 2, y);
  ctx.fillText(text, gameWidth / 2, y);

  ctx.restore();
};

/**
 * Draw all active powerup timers
 * Returns the final Y position for stacking additional UI elements
 */
export const drawPowerupTimers = (
  ctx: CanvasRenderingContext2D,
  activePowerups: Record<string, number>,
  visualTime: number,
  startY: number,
  gameWidth: number,
): number => {
  let timerY = startY;

  // Fish Frenzy Timer
  const fishFrenzyExpiration = activePowerups["fishFrenzy"];
  if (fishFrenzyExpiration && fishFrenzyExpiration > visualTime) {
    const remaining = Math.ceil((fishFrenzyExpiration - visualTime) / 1000);
    drawTimer(
      ctx,
      "FISH FRENZY",
      remaining,
      "#ffeb3b",
      "#bf360c",
      timerY,
      visualTime,
      gameWidth,
    );
    timerY += 30;
  }

  // Diamond Hook Timer
  const diamondHookExpiration = activePowerups["diamondHook"];
  if (diamondHookExpiration && diamondHookExpiration > visualTime) {
    const remaining = Math.ceil((diamondHookExpiration - visualTime) / 1000);
    drawTimer(
      ctx,
      "DIAMOND HOOK",
      remaining,
      "#e1f5fe",
      "#0288d1",
      timerY,
      visualTime,
      gameWidth,
    );
    timerY += 30;
  }

  // Super Net Timer
  const superNetExpiration = activePowerups["superNet"];
  if (superNetExpiration && superNetExpiration > visualTime) {
    const remaining = Math.ceil((superNetExpiration - visualTime) / 1000);
    drawTimer(
      ctx,
      "SUPER NET",
      remaining,
      "#69f0ae",
      "#2e7d32",
      timerY,
      visualTime,
      gameWidth,
    );
    timerY += 30;
  }

  // Multi-Claw Timer
  const multiClawExpiration = activePowerups["multiClaw"];
  if (multiClawExpiration && multiClawExpiration > visualTime) {
    const remaining = Math.ceil((multiClawExpiration - visualTime) / 1000);
    drawTimer(
      ctx,
      "OCTOPUS",
      remaining,
      "#2196f3",
      "#0d47a1",
      timerY,
      visualTime,
      gameWidth,
    );
    timerY += 30;
  }

  // Super Bait Timer
  const superBaitExpiration = activePowerups["superBait"];
  if (superBaitExpiration && superBaitExpiration > visualTime) {
    const remaining = Math.ceil((superBaitExpiration - visualTime) / 1000);
    drawTimer(
      ctx,
      "SUPER BAIT",
      remaining,
      "#00acc1",
      "#006064",
      timerY,
      visualTime,
      gameWidth,
    );
    timerY += 30;
  }

  return timerY;
};

/**
 * Draw rainbow weather timer (special case with rainbow colors)
 */
export const drawRainbowTimer = (
  ctx: CanvasRenderingContext2D,
  weatherExpiration: number,
  visualTime: number,
  y: number,
  gameWidth: number,
) => {
  const remaining = Math.ceil((weatherExpiration - visualTime) / 1000);

  if (remaining <= 0) return;

  ctx.save();
  ctx.font = 'bold 16px "Press Start 2P"';

  // Pulsing Rainbow colors for text
  const hue = (visualTime * 0.1) % 360;
  ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.textAlign = "center";

  const text = `RAINBOW TIME: ${remaining}s`;
  ctx.strokeText(text, gameWidth / 2, y);
  ctx.fillText(text, gameWidth / 2, y);

  ctx.restore();
};

/**
 * Draw trash suppression timer (from Mystery Bag effect)
 */
export const drawTrashSuppressionTimer = (
  ctx: CanvasRenderingContext2D,
  suppressionUntil: number,
  visualTime: number,
  y: number,
  gameWidth: number,
  isSuperBaitActive: boolean,
) => {
  // Don't show if Super Bait is active (redundant)
  if (isSuperBaitActive) return;
  if (suppressionUntil <= visualTime) return;

  const remaining = Math.ceil((suppressionUntil - visualTime) / 1000);

  ctx.save();
  ctx.font = 'bold 16px "Press Start 2P"';

  // Blink effect
  const blink = Math.floor(visualTime / 500) % 2 === 0;
  ctx.fillStyle = blink ? "#ffeb3b" : "#fff";
  ctx.strokeStyle = "#3e2723";
  ctx.lineWidth = 4;
  ctx.textAlign = "center";

  const text = `NO TRASH: ${remaining}s`;
  ctx.strokeText(text, gameWidth / 2, y);
  ctx.fillText(text, gameWidth / 2, y);

  ctx.restore();
};
