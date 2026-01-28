import { drawDefaultFisherman } from "./fisherman";
import { drawPirateCostume } from "./pirate";
import { drawDiverCostume } from "./diver";
import { drawLifeguardCostume } from "./lifeguard";
import { drawSushiMasterCostume } from "./sushiMaster";
import { drawSailorCostume } from "./sailor";
import { drawCaptainCostume } from "./captain";
import { drawCaptainLunaCostume } from "./captainLuna";
import { drawMarineScientistCostume } from "./marineScientist";
import { drawPolarExplorerCostume } from "./polarExplorer";

/**
 * Main function to render the fisherman with the specified costume
 * @param ctx - Canvas rendering context
 * @param x - X position of the fisherman
 * @param y - Y position of the fisherman (boat level)
 * @param costumeId - ID of the costume to render
 */
export const drawFishermanCostume = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  costumeId: string,
) => {
  ctx.save();
  ctx.translate(x, y);

  switch (costumeId) {
    case "pirate":
      drawPirateCostume(ctx);
      break;
    case "diver":
      drawDiverCostume(ctx);
      break;
    case "lifeguard":
      drawLifeguardCostume(ctx);
      break;
    case "sushi_master":
      drawSushiMasterCostume(ctx);
      break;
    case "sailor":
      drawSailorCostume(ctx);
      break;
    case "captain":
      drawCaptainCostume(ctx);
      break;
    case "captain_luna":
      drawCaptainLunaCostume(ctx);
      break;
    case "marine_scientist":
      drawMarineScientistCostume(ctx);
      break;
    case "polar_explorer":
      drawPolarExplorerCostume(ctx);
      break;
    case "fisherman":
    default:
      drawDefaultFisherman(ctx);
      break;
  }

  ctx.restore();
};
