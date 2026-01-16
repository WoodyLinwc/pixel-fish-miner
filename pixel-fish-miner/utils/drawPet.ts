
export const drawPet = (ctx: CanvasRenderingContext2D, petId: string, x: number, y: number, time: number) => {
    ctx.save();
    ctx.translate(x, y);

    // Subtle idle animation calculation
    const bob = Math.sin(time * 0.005) * 2;

    if (petId === 'goldfish') {
        // --- GOLDFISH TANK (Cuboid) ---
        // Does not bob up and down with the character breathing, sits flat on the boat deck
        ctx.translate(0, 4); 

        const tankW = 24;
        const tankH = 16;
        const tankHalfW = tankW / 2;

        // Draw from bottom-center roughly (y=0 is bottom of pet area)
        // Tank Background (Glass tint)
        ctx.fillStyle = 'rgba(225, 245, 254, 0.4)';
        ctx.fillRect(-tankHalfW, -tankH, tankW, tankH);

        // Water (Blue fill, slightly lower than top)
        const waterLevelY = -tankH + 4;
        ctx.fillStyle = 'rgba(66, 165, 245, 0.8)'; // Semi-transparent blue
        ctx.fillRect(-tankHalfW + 2, waterLevelY, tankW - 4, tankH - 6);

        // Surface Line (Lighter blue)
        ctx.fillStyle = '#81d4fa';
        ctx.fillRect(-tankHalfW + 2, waterLevelY, tankW - 4, 2);

        // Plants (Green strips at bottom)
        ctx.fillStyle = '#66bb6a';
        ctx.fillRect(-6, -6, 2, 4); // Left weed
        ctx.fillRect(4, -8, 2, 6); // Right weed
        ctx.fillRect(-1, -5, 2, 3); // Center weed

        // Fish (Orange)
        // Animation: Swim left/right inside the tank
        const swimRange = 5;
        const swim = Math.sin(time * 0.003) * swimRange;
        const facingRight = Math.cos(time * 0.003) > 0;
        
        ctx.save();
        // Fish Y position roughly middle of water
        ctx.translate(swim, -tankH/2 + 2);
        if (!facingRight) ctx.scale(-1, 1);
        
        ctx.fillStyle = '#ff6d00'; // Orange
        // Body
        ctx.fillRect(-3, -2, 6, 4);
        // Tail
        ctx.beginPath();
        ctx.moveTo(-3, 0);
        ctx.lineTo(-5, -2);
        ctx.lineTo(-5, 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = 'black';
        ctx.fillRect(1, -1, 1, 1);
        ctx.restore();
        
        // Bubbles
        const bubbleY = (time * 0.02) % 10;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        // Only show if bubble is below surface
        if (bubbleY < 8) {
             ctx.fillRect(swim + 3, -tankH/2 + 2 - bubbleY, 1, 1);
        }

        // Tank Frame/Outline
        ctx.strokeStyle = '#90a4ae'; // Grey rim
        ctx.lineWidth = 2;
        ctx.strokeRect(-tankHalfW, -tankH, tankW, tankH);
        
        // Top Rim (Darker)
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(-tankHalfW - 1, -tankH - 2, tankW + 2, 2);

        // Glare on glass (Diagonal lines)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(-tankHalfW + 4, -tankH + 4);
        ctx.lineTo(-tankHalfW + 8, -tankH + 4);
        ctx.lineTo(-tankHalfW + 4, -tankH + 8);
        ctx.fill();

    } else if (petId === 'ghost_crab') {
        // --- GHOST CRAB (Pixel Style) ---
        // Skitter animation (Horizontal movement)
        const skitter = Math.sin(time * 0.01) * 8; 
        ctx.translate(skitter, 0);

        // Pale Body (Sand color) - STRICTLY RECTANGULAR
        ctx.fillStyle = '#efebe9'; 
        ctx.fillRect(-7, -8, 14, 8); // Box body

        // Eyes Stalks (Vertical Rects)
        ctx.fillStyle = '#d7ccc8'; 
        ctx.fillRect(-6, -14, 2, 6);
        ctx.fillRect(4, -14, 2, 6);
        
        // Eye dots (Square)
        ctx.fillStyle = 'black';
        ctx.fillRect(-6, -14, 2, 2);
        ctx.fillRect(4, -14, 2, 2);

        // Legs (Pixel steps)
        ctx.fillStyle = '#efebe9';
        // Left legs
        ctx.fillRect(-9, -2, 2, 2);
        ctx.fillRect(-10, -4, 2, 2);
        ctx.fillRect(-9, -6, 2, 2);
        // Right legs
        ctx.fillRect(7, -2, 2, 2);
        ctx.fillRect(8, -4, 2, 2);
        ctx.fillRect(7, -6, 2, 2);

        // Claws (Blocky)
        ctx.fillStyle = '#d7ccc8';
        // Left claw (small)
        ctx.fillRect(-11, -8, 4, 4); 
        ctx.fillRect(-11, -9, 2, 1); // Tip
        
        // Right claw (big)
        ctx.fillRect(7, -10, 6, 6); 
        ctx.fillRect(7, -11, 2, 1); // Tip

    } else if (petId === 'penguin') {
        // --- PENGUIN (Pixel Style) ---
        ctx.translate(0, bob);

        // Body (Black Block)
        ctx.fillStyle = '#212121'; 
        ctx.fillRect(-7, -18, 14, 18);
        // Top head trim
        ctx.fillRect(-5, -20, 10, 2);

        // Belly (White Block)
        ctx.fillStyle = 'white';
        ctx.fillRect(-5, -16, 10, 14);

        // Eyes (Square)
        ctx.fillStyle = 'black';
        ctx.fillRect(-4, -14, 2, 2);
        ctx.fillRect(2, -14, 2, 2);

        // Beak (Orange Block)
        ctx.fillStyle = '#ff9800';
        ctx.fillRect(-1, -12, 2, 2); 

        // Feet (Orange Blocks)
        ctx.fillStyle = '#ff9800';
        ctx.fillRect(-6, 0, 4, 2);
        ctx.fillRect(2, 0, 4, 2);

        // Wings (Black side blocks)
        // Little flap animation
        const flap = Math.sin(time * 0.01) * 2 > 0 ? 1 : 0;
        ctx.fillStyle = '#212121';
        
        // Left Wing
        ctx.fillRect(-8 - flap, -12, 2, 8);
        // Right Wing
        ctx.fillRect(6 + flap, -12, 2, 8);

    } else if (petId === 'pelican') {
        // --- PELICAN (Pixel Style) ---
        ctx.translate(0, bob);

        // Body (White Block)
        ctx.fillStyle = 'white';
        ctx.fillRect(-7, -12, 14, 12);

        // Neck (White Vertical Block)
        ctx.fillRect(0, -20, 6, 8);

        // Head (White Block)
        ctx.fillRect(0, -24, 8, 6);

        // Beak (Yellow Block)
        ctx.fillStyle = '#fdd835';
        ctx.fillRect(8, -24, 10, 4); 
        
        // Throat Pouch (Deep Orange Blocks)
        const gulp = Math.sin(time * 0.002) * 2;
        ctx.fillStyle = '#fb8c00';
        // Main pouch block
        ctx.fillRect(8, -20, 10, 6 + Math.floor(gulp)); 
        // Bottom tip
        ctx.fillRect(10, -14 + Math.floor(gulp), 6, 2); 

        // Eye (Square)
        ctx.fillStyle = 'black';
        ctx.fillRect(4, -22, 2, 2);

        // Wing (Grey Block folded)
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(-5, -10, 8, 6);

        // Legs (Orange Blocks)
        ctx.fillStyle = '#f57f17';
        ctx.fillRect(-3, 0, 2, 4);
        ctx.fillRect(1, 0, 2, 4);

    } else {
        // --- EXISTING LIVING ANIMALS (Parrot, Cat, Dog) ---
        ctx.translate(0, bob);

        if (petId === 'parrot') {
            // --- PARROT ---
            // Green body
            ctx.fillStyle = '#43a047'; 
            ctx.fillRect(0, -12, 10, 12);
            
            // Red Wing
            ctx.fillStyle = '#d32f2f'; 
            ctx.fillRect(2, -8, 6, 6);

            // Yellow Head/Neck
            ctx.fillStyle = '#fdd835'; 
            ctx.fillRect(2, -16, 8, 6);

            // Beak (Grey)
            ctx.fillStyle = '#616161';
            ctx.fillRect(8, -14, 4, 3);

            // Eye
            ctx.fillStyle = 'black';
            ctx.fillRect(6, -14, 2, 2);

            // Tail
            ctx.fillStyle = '#1976d2'; // Blue tail
            ctx.fillRect(-4, -6, 4, 2);
            ctx.fillRect(-6, -4, 6, 2);

            // Legs
            ctx.fillStyle = '#f57f17';
            ctx.fillRect(2, 0, 2, 2);
            ctx.fillRect(6, 0, 2, 2);

        } else if (petId === 'cat') {
            // --- CAT ---
            // Orange Tabby
            ctx.fillStyle = '#fb8c00'; 
            // Body (Sitting)
            ctx.fillRect(0, -10, 12, 10);
            
            // Head
            ctx.fillRect(2, -16, 10, 8);
            
            // Ears
            ctx.fillStyle = '#e65100';
            ctx.beginPath();
            ctx.moveTo(3, -16); ctx.lineTo(5, -19); ctx.lineTo(7, -16); // Left
            ctx.moveTo(8, -16); ctx.lineTo(10, -19); ctx.lineTo(12, -16); // Right
            ctx.fill();

            // White Chest
            ctx.fillStyle = '#fff3e0';
            ctx.fillRect(2, -8, 4, 6);

            // Tail (Up)
            ctx.fillStyle = '#fb8c00';
            ctx.fillRect(-2, -8, 2, 8);
            ctx.fillRect(-4, -10, 2, 4);

            // Eyes
            ctx.fillStyle = '#1b5e20'; // Green eyes
            ctx.fillRect(4, -13, 2, 2);
            ctx.fillRect(9, -13, 2, 2);

        } else if (petId === 'dog') {
            // --- DOG ---
            // Brown Dog (Sitting)
            ctx.fillStyle = '#8d6e63'; 
            
            // Body
            ctx.fillRect(0, -12, 14, 12);
            
            // Head
            ctx.fillRect(4, -18, 10, 8);

            // Ears (Floppy)
            ctx.fillStyle = '#5d4037';
            ctx.fillRect(2, -16, 4, 6); // Left ear flap
            ctx.fillRect(12, -16, 4, 6); // Right ear flap

            // Snout
            ctx.fillStyle = '#d7ccc8'; 
            ctx.fillRect(12, -14, 4, 4);
            
            // Nose
            ctx.fillStyle = 'black';
            ctx.fillRect(15, -14, 2, 2);

            // Eyes
            ctx.fillStyle = 'black';
            ctx.fillRect(6, -15, 2, 2);
            ctx.fillRect(10, -15, 2, 2);

            // Tail (Wagging)
            const tailWag = Math.sin(time * 0.015) * 4;
            ctx.fillStyle = '#8d6e63';
            ctx.save();
            ctx.translate(-2, -4);
            ctx.rotate(tailWag * 0.1);
            ctx.fillRect(-4, -2, 6, 2);
            ctx.restore();
        }
    }

    ctx.restore();
};
