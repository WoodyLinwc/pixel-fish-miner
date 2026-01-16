
import { ClawEntity, ClawState } from '../types';
import { GAME_WIDTH } from '../constants';

export const drawClaw = (ctx: CanvasRenderingContext2D, claw: ClawEntity, isDiamondHookActive: boolean, isSuperNetActive: boolean, time: number, clawY: number) => {
    const startX = GAME_WIDTH / 2 + claw.xOffset;
    const startY = clawY;
    const endX = startX + Math.sin(claw.angle) * claw.length;
    const endY = startY + Math.cos(claw.angle) * claw.length;
    
    // In this context, numbedUntil represents "Severed Until"
    const isDisabled = claw.numbedUntil > time;

    // Rope
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = 3;
    
    if (isDisabled) {
        if (claw.debuffType === 'SEVERED') {
             // Jagged broken rope visual
             ctx.strokeStyle = '#3e2723';
        } else if (claw.debuffType === 'NUMBED') {
            // Flashing electric rope
             const flash = Math.floor(time / 100) % 2 === 0;
             ctx.strokeStyle = flash ? '#ffeb3b' : '#3e2723';
        }
    } else if (isDiamondHookActive) {
        ctx.strokeStyle = '#b3e5fc';
    } else {
        ctx.strokeStyle = '#3e2723';
    }

    if (isDiamondHookActive && !isDisabled) {
        ctx.lineWidth = 4;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 10;
    } else {
        ctx.shadowBlur = 0;
    }
    
    ctx.setLineDash([]); 
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // If severed, draw frayed end and "REPAIRING" text, do NOT draw claw head
    if (isDisabled && claw.debuffType === 'SEVERED') {
        // Draw jagged end
        ctx.save();
        ctx.translate(endX, endY);
        ctx.rotate(-claw.angle);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(-3, 5);
        ctx.lineTo(3, 8);
        ctx.lineTo(-2, 12);
        ctx.stroke();
        ctx.restore();

        // Timer Text
        const remaining = Math.ceil((claw.numbedUntil - time) / 1000);
        ctx.save();
        ctx.fillStyle = '#ef5350';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeText(`REPAIRING ${remaining}s`, endX, endY + 30);
        ctx.fillText(`REPAIRING ${remaining}s`, endX, endY + 30);
        ctx.restore();

        return { x: endX, y: endY };
    }

    // Claw Mechanism
    ctx.save();
    ctx.translate(endX, endY);
    ctx.rotate(-claw.angle); 
    
    // Numbed visual effect for claw head
    if (isDisabled && claw.debuffType === 'NUMBED') {
         const shakeX = (Math.random() - 0.5) * 4;
         const shakeY = (Math.random() - 0.5) * 4;
         ctx.translate(shakeX, shakeY);
         ctx.fillStyle = '#ffeb3b'; // Yellow warning
         ctx.strokeStyle = '#f57f17';
    } else if (isDiamondHookActive) {
        ctx.fillStyle = '#e1f5fe';
        ctx.strokeStyle = '#29b6f6';
    } else if (isSuperNetActive) {
        // Super Net Color
        ctx.fillStyle = '#a5d6a7';
        ctx.strokeStyle = '#2e7d32';
    } else {
        ctx.fillStyle = '#78909c';
        ctx.strokeStyle = '#546e7a';
    }

    // Draw main block
    ctx.fillRect(-8, -4, 16, 8); 
    ctx.lineWidth = 1;
    ctx.strokeRect(-8, -4, 16, 8);

    // Prongs or Net
    const hasCatch = claw.caughtFish.length > 0;
    
    ctx.fillStyle = hasCatch ? '#ef5350' : (isDiamondHookActive && !isDisabled ? '#ffffff' : (isSuperNetActive ? '#c8e6c9' : '#b0bec5')); 
    
    if (isDisabled && claw.debuffType === 'NUMBED') {
        ctx.fillStyle = '#fdd835'; // Electric yellow prongs
    }

    if (hasCatch) {
        // If we have a catch...
        if (isSuperNetActive) {
             // Draw LARGE expanded net containing fish
             // The fish are drawn in GameCanvas using the claw tip coordinate, but they are offset.
             // We draw the net bag to look like it contains them.
             
             ctx.save();
             // Visual shift to align with where fish usually hang (0 to 60px down)
             ctx.translate(0, 30); 
             
             // Net Bag - Modified to be less oval and more sack-like
             ctx.fillStyle = 'rgba(200, 250, 210, 0.4)'; // Lighter, transparent green
             ctx.strokeStyle = '#2e7d32';
             ctx.lineWidth = 2;
             
             ctx.beginPath();
             ctx.moveTo(-10, -30); 
             ctx.lineTo(10, -30);
             // Make it hang like a heavy sack
             ctx.lineTo(35, 40);
             ctx.quadraticCurveTo(0, 65, -35, 40);
             ctx.lineTo(-10, -30);
             ctx.fill();
             ctx.stroke();

             // Grid lines (Crosshatch)
             ctx.beginPath();
             ctx.lineWidth = 1;
             ctx.strokeStyle = 'rgba(46, 125, 50, 0.5)';
             
             // Diagonals 1
             for(let i=-40; i<=60; i+=12) {
                 ctx.moveTo(i, -20);
                 ctx.lineTo(i-30, 60);
             }
             // Diagonals 2
             for(let i=-40; i<=60; i+=12) {
                 ctx.moveTo(i, -20);
                 ctx.lineTo(i+30, 60);
             }
             
             ctx.stroke();
             ctx.restore();
        } else {
             // Standard grip
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(-4, 15);
            ctx.lineTo(4, 15);
            ctx.lineTo(8, 0);
            ctx.fill();
            ctx.stroke();
        }
    } else {
        // Open Claw
        if (isSuperNetActive) {
            // Draw folded net (Projectile)
             ctx.fillStyle = '#a5d6a7';
             ctx.strokeStyle = '#2e7d32';
             // Draw a capsule shape or folded bundle
             ctx.beginPath();
             ctx.ellipse(0, 5, 8, 12, 0, 0, Math.PI*2);
             ctx.fill();
             ctx.stroke();
             // Detail lines
             ctx.beginPath();
             ctx.moveTo(-5, 5); ctx.lineTo(5, 5);
             ctx.moveTo(-5, 10); ctx.lineTo(5, 10);
             ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(-12, 15);
            ctx.lineTo(-8, 20);
            ctx.lineTo(-4, 5);
            ctx.lineTo(4, 5);
            ctx.lineTo(8, 20);
            ctx.lineTo(12, 15);
            ctx.lineTo(8, 0);
            ctx.fill();
            ctx.stroke();
        }
    }
    ctx.restore();

    // Numbed Indicator Text
    if (isDisabled && claw.debuffType === 'NUMBED') {
        const remaining = Math.ceil((claw.numbedUntil - time) / 1000);
        ctx.save();
        ctx.fillStyle = '#ffeb3b';
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(`⚡ ${remaining}s`, endX, endY + 30);
        ctx.fillText(`⚡ ${remaining}s`, endX, endY + 30);
        ctx.restore();
    }
    
    return { x: endX, y: endY };
};