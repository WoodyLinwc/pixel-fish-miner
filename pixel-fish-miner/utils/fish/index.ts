/**
 * Fish entity rendering dispatcher
 * Routes to specific fish rendering functions based on fish ID
 */

import { EntityFish } from "../../types";
import {
  drawOldBoot,
  drawRustyCan,
  drawPlasticBottle,
  drawStraw,
} from "./trash";
import {
  drawShell,
  drawSeaCucumber,
  drawMysteryBag,
  drawSupplyBox,
  drawCoral,
  drawAnchor,
} from "./staticItems";
import {
  drawSardine,
  drawHerring,
  drawSmallYellowCroaker,
  drawMackerel,
  drawCod,
  drawBoxfish,
  drawPomfret,
  drawPufferfish,
  drawShrimp,
  drawMilkfish,
} from "./commonFish";
import {
  drawPacificSaury,
  drawMullet,
  drawAnchovy,
  drawKingSaury,
  drawKingMullet,
  drawKingAnchovy,
} from "./migrationFish";
import {
  drawClownfish,
  drawSquid,
  drawFluorescentSquid,
  drawSeaBass,
  drawRedSnapper,
  drawSalmon,
  drawTuna,
  drawNeedlefish,
  drawPhantomPerch,
  drawSpectralSardine,
  drawGhostSquid,
  drawAmberjack,
} from "./uncommonFish";
import {
  drawLargeYellowCroaker,
  drawTurbot,
  drawRibbonfish,
  drawGiantGrouper,
  drawAnglerfish,
  drawWolffish,
  drawCrab,
  drawElectricJelly,
  drawBlobfish,
  drawTarpon,
} from "./rareFish";
import {
  drawWhale,
  drawNarwhal,
  drawSailfish,
  drawOceanSunfish,
  drawMahiMahi,
  drawNautilus,
} from "./legendaryFish";
import {
  drawThunderEel,
  drawIceFin,
  drawWindRay,
  drawSeaTurtle,
} from "./weatherFish";

export const drawEntity = (
  ctx: CanvasRenderingContext2D,
  entity: EntityFish,
  rotation: number = 0,
  time: number = 0,
) => {
  ctx.save();
  ctx.translate(entity.x, entity.y);
  ctx.rotate(rotation);
  if (!entity.facingRight) {
    ctx.scale(-1, 1);
  }

  const { type } = entity;
  const w = type.width;
  const h = type.height;

  // --- DRAWING LOGIC BASED ON ID ---
  if (type.id === "old_boot") drawOldBoot(ctx, w, h);
  else if (type.id === "rusty_can") drawRustyCan(ctx, w, h);
  else if (type.id === "plastic_bottle") drawPlasticBottle(ctx, w, h);
  else if (type.id === "straw") drawStraw(ctx, w, h);
  else if (type.id === "mystery_bag") drawMysteryBag(ctx, w, h);
  else if (type.id === "supply_box") drawSupplyBox(ctx, w, h, entity.y);
  else if (type.id === "shell") drawShell(ctx, w, h);
  else if (type.id === "sea_cucumber") drawSeaCucumber(ctx, w, h);
  else if (type.id === "coral") drawCoral(ctx, w, h);
  else if (type.id === "anchor") drawAnchor(ctx, w, h);
  else if (type.id === "sardine") drawSardine(ctx, w, h);
  else if (type.id === "herring") drawHerring(ctx, w, h);
  else if (type.id === "small_yellow_croaker")
    drawSmallYellowCroaker(ctx, w, h);
  else if (type.id === "mackerel") drawMackerel(ctx, w, h);
  // Standard migration fish
  else if (type.id === "pacific_saury") drawPacificSaury(ctx, w, h);
  else if (type.id === "mullet") drawMullet(ctx, w, h);
  else if (type.id === "anchovy") drawAnchovy(ctx, w, h);
  // King migration fish
  else if (type.id === "king_saury") drawKingSaury(ctx, w, h);
  else if (type.id === "king_mullet") drawKingMullet(ctx, w, h);
  else if (type.id === "king_anchovy") drawKingAnchovy(ctx, w, h);
  else if (type.id === "cod") drawCod(ctx, w, h);
  else if (type.id === "clownfish") drawClownfish(ctx, w, h);
  else if (type.id === "squid") drawSquid(ctx, w, h);
  else if (type.id === "fluorescent_squid") drawFluorescentSquid(ctx, w, h);
  else if (type.id === "sea_bass") drawSeaBass(ctx, w, h);
  else if (type.id === "red_snapper") drawRedSnapper(ctx, w, h);
  else if (type.id === "salmon") drawSalmon(ctx, w, h);
  else if (type.id === "tuna") drawTuna(ctx, w, h);
  else if (type.id === "needlefish") drawNeedlefish(ctx, w, h);
  else if (type.id === "phantom_perch") drawPhantomPerch(ctx, w, h);
  else if (type.id === "spectral_sardine") drawSpectralSardine(ctx, w, h);
  else if (type.id === "ghost_squid") drawGhostSquid(ctx, w, h);
  else if (type.id === "pomfret") drawPomfret(ctx, w, h);
  else if (type.id === "large_yellow_croaker")
    drawLargeYellowCroaker(ctx, w, h);
  else if (type.id === "turbot") drawTurbot(ctx, w, h);
  else if (type.id === "ribbonfish") drawRibbonfish(ctx, w, h);
  else if (type.id === "giant_grouper") drawGiantGrouper(ctx, w, h);
  else if (type.id === "anglerfish") drawAnglerfish(ctx, w, h, time);
  else if (type.id === "wolffish") drawWolffish(ctx, w, h);
  else if (type.id === "crab") drawCrab(ctx, w, h);
  else if (type.id === "electric_jelly") drawElectricJelly(ctx, w, h);
  else if (type.id === "shrimp") drawShrimp(ctx, w, h);
  else if (type.id === "boxfish") drawBoxfish(ctx, w, h);
  else if (type.id === "whale") drawWhale(ctx, w, h);
  else if (type.id === "ocean_sunfish") drawOceanSunfish(ctx, w, h);
  else if (type.id === "narwhal") drawNarwhal(ctx, w, h, time);
  else if (type.id === "sailfish") drawSailfish(ctx, w, h, time);
  else if (type.id === "thunder_eel") drawThunderEel(ctx, w, h);
  else if (type.id === "ice_fin") drawIceFin(ctx, w, h);
  else if (type.id === "wind_ray") drawWindRay(ctx, w, h);
  else if (type.id === "sea_turtle") drawSeaTurtle(ctx, w, h, time, entity);
  else if (type.id === "milkfish") drawMilkfish(ctx, w, h);
  else if (type.id === "amberjack") drawAmberjack(ctx, w, h);
  else if (type.id === "blobfish") drawBlobfish(ctx, w, h);
  else if (type.id === "tarpon") drawTarpon(ctx, w, h);
  else if (type.id === "mahi_mahi") drawMahiMahi(ctx, w, h);
  else if (type.id === "nautilus") drawNautilus(ctx, w, h);
  else {
    // Fallback
    ctx.fillStyle = type.color;
    ctx.fillRect(-w / 2, -h / 2, w, h);
  }

  ctx.restore();
};
