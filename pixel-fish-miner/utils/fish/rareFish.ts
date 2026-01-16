
export const drawLargeYellowCroaker = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Darker Yellow body
    ctx.fillStyle = '#fdd835'; 
    ctx.fillRect(-w/2, -h/2, w, h);
    
    // Lighter belly
    ctx.fillStyle = '#fff9c4';
    ctx.fillRect(-w/2, h/4, w, h/4);

    // Fins
    ctx.fillStyle = '#fbc02d';
    // Dorsal
    ctx.beginPath();
    ctx.moveTo(-5, -h/2);
    ctx.lineTo(5, -h/2 - 6);
    ctx.lineTo(15, -h/2);
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(-w/2 - 8, -6);
    ctx.lineTo(-w/2 - 8, 6);
    ctx.fill();
    // Pectoral
    ctx.fillRect(5, 2, 6, 4);

    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -4, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 2, -3, 2, 2);
};

export const drawTurbot = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Turbot: Diamond/Round flatfish, speckled
    ctx.fillStyle = '#5d4037'; // Dark Brown

    // Diamond body shape (more circular than pomfret)
    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.lineTo(0, -h/2);
    ctx.lineTo(-w/2, 0);
    ctx.lineTo(0, h/2);
    ctx.fill();

    // Speckles (Lighter brown)
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(-10, -10, 3, 3);
    ctx.fillRect(5, 5, 3, 3);
    ctx.fillRect(10, -5, 3, 3);
    ctx.fillRect(-5, 10, 3, 3);
    ctx.fillRect(0, 0, 3, 3);

    // Fins (Fringe style all around)
    ctx.fillStyle = '#4e342e';
    ctx.beginPath();
    ctx.moveTo(0, -h/2);
    ctx.lineTo(-w/2, 0);
    ctx.lineTo(0, h/2);
    ctx.stroke(); // Outline back half

    // Tail
    ctx.fillRect(-w/2 - 4, -4, 4, 8);

    // Eyes (Top)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/4, -8, 3, 3);
    ctx.fillRect(w/6, -5, 3, 3);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/4 + 1, -7, 1, 1);
    ctx.fillRect(w/6 + 1, -4, 1, 1);
};

export const drawRibbonfish = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Long, silver, ribbon-like
    ctx.fillStyle = '#eeeeee'; // Silver body
    ctx.fillRect(-w/2, -h/2, w, h);
    
    // Red Dorsal Fin
    ctx.fillStyle = '#ef5350';
    ctx.fillRect(-w/2, -h/2 - 4, w * 0.9, 4); // Long fin
    
    // Eye (Right side)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/2 - 8, -4, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/2 - 6, -3, 2, 2);
};

export const drawGiantGrouper = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Giant Grouper: Grayish Brown
    const baseColor = '#6d4c41'; // Matches constants
    const spotColor = '#4e342e'; // Darker brown
    const finColor = '#5d4037';

    ctx.fillStyle = baseColor;
    ctx.fillRect(-w/2, -h/2, w, h);

    // Scales/Spots
    ctx.fillStyle = spotColor; 
    for(let i=0; i<4; i++) {
        for(let j=0; j<3; j++) {
            if ((i+j)%2 === 0) {
                ctx.fillRect(-w/3 + i*10, -10 + j*10, 4, 4);
            }
        }
    }

    // Tail
    ctx.fillStyle = finColor;
    ctx.fillRect(-w/2 - 10, -12, 10, 24);

    // Eye (White Sclera)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -6, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 2, -5, 2, 2);
    
    // Fin
    ctx.fillStyle = finColor;
    ctx.fillRect(-10, -h/2 - 5, 20, 5);
};

export const drawAnglerfish = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    // Anglerfish: Grouper-like blocky shape
    const bodyColor = '#311b92'; // Dark Deep Purple
    const finColor = '#4527a0';

    // Body (Rect)
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-w/2, -h/2, w, h);

    // Tail
    ctx.fillStyle = finColor;
    ctx.fillRect(-w/2 - 10, -10, 10, 20);

    // Top Fin (Spiky)
    ctx.beginPath();
    ctx.moveTo(-10, -h/2);
    ctx.lineTo(0, -h/2 - 8);
    ctx.lineTo(10, -h/2);
    ctx.fill();

    // Mouth Line (Indication of big jaw)
    ctx.fillStyle = '#1a237e'; // Dark shadow
    ctx.fillRect(0, 4, w/2, 2);

    // Teeth (Protruding)
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(w/2 - 4, 6, 2, 4); // Bottom tooth
    ctx.fillRect(w/2, 6, 2, 3); // Bottom tooth
    ctx.fillRect(w/2 - 2, 0, 2, 4); // Top tooth

    // Eye (Small, white)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/4, -h/4 - 4, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/4 + 1, -h/4 - 3, 2, 2);

    // Lure (Hook shape at front)
    ctx.strokeStyle = '#9575cd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Start from forehead
    ctx.moveTo(w/3, -h/2);
    // Curve forward like a hook
    ctx.lineTo(w/2 + 8, -h/2 - 5); 
    ctx.lineTo(w/2 + 12, -h/4);
    ctx.stroke();

    // Lure Bulb (Dim Light with Gradient)
    const lureX = w/2 + 12;
    const lureY = -h/4 + 2;
    
    // Pulsating effect variables
    const pulse = Math.sin(time * 0.003); // -1 to 1, slow breath
    const radius = 20 + pulse * 5; 
    const alpha = 0.4 + pulse * 0.1;

    // Gradient
    const gradient = ctx.createRadialGradient(lureX, lureY, 2, lureX, lureY, radius);
    gradient.addColorStop(0, `rgba(255, 255, 224, ${alpha + 0.2})`); // Core (brighter)
    gradient.addColorStop(0.4, `rgba(255, 235, 59, ${alpha})`); // Mid yellow
    gradient.addColorStop(1, 'rgba(255, 235, 59, 0)'); // Transparent edge

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(lureX, lureY, radius, 0, Math.PI*2);
    ctx.fill();
    
    // Small solid bulb in center
    ctx.fillStyle = '#fff9c4'; 
    ctx.beginPath();
    ctx.arc(lureX, lureY, 3, 0, Math.PI*2); 
    ctx.fill();
};

export const drawWolffish = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Wolffish: Long, grey, menacing
    ctx.fillStyle = '#78909c'; // Blue Grey
    
    // Body (Elongated)
    ctx.fillRect(-w/2, -h/2, w, h);
    
    // Head (Larger block)
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(w/4, -h/2 - 2, w/4 + 2, h + 4);

    // Teeth (White pixels sticking out)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/2, -4, 3, 3); // Top tooth
    ctx.fillRect(w/2, 4, 3, 4);  // Bottom tooth

    // Dorsal Fin (Long along back)
    ctx.fillStyle = '#455a64';
    ctx.fillRect(-w/2 + 5, -h/2 - 4, w - 10, 4);

    // Tail
    ctx.beginPath();
    ctx.moveTo(-w/2, 0);
    ctx.lineTo(-w/2 - 8, -8);
    ctx.lineTo(-w/2 - 8, 8);
    ctx.fill();

    // Eye (Mean look)
    ctx.fillStyle = 'white';
    ctx.fillRect(w/3, -6, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(w/3 + 1, -5, 2, 2);
    // Eyebrow
    ctx.fillStyle = '#37474f';
    ctx.fillRect(w/3, -8, 6, 2);
};

export const drawCrab = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Square Crab
    ctx.fillStyle = '#d32f2f'; // Red
    // Body Rect
    ctx.fillRect(-w/2, -h/3, w, h*0.6);
    
    // Claws (Rects)
    ctx.fillStyle = '#b71c1c';
    ctx.fillRect(-w/2 - 6, -h/2, 6, 6); // Left
    ctx.fillRect(w/2, -h/2, 6, 6); // Right
    
    // Legs (Lines)
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Simple L-legs
    ctx.moveTo(-w/4, h/4); ctx.lineTo(-w/2, h/2);
    ctx.moveTo(w/4, h/4); ctx.lineTo(w/2, h/2);
    ctx.stroke();

    // Eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(-6, -h/2 - 2, 4, 4);
    ctx.fillRect(2, -h/2 - 2, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(-5, -h/2 - 1, 2, 2);
    ctx.fillRect(3, -h/2 - 1, 2, 2);
};

export const drawElectricJelly = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Square Jelly
    ctx.fillStyle = '#e040fb'; // Purple Dome Rect
    ctx.fillRect(-w/2, -h/2, w, h/2);
    
    // Tentacles (Rect Lines)
    ctx.fillStyle = '#ea80fc';
    const tentacleW = 4;
    const gap = 2;
    // 4 Tentacles
    for(let i=0; i<4; i++) {
            ctx.fillRect(-w/2 + i*(tentacleW+gap) + 2, 0, tentacleW, h/2);
    }

    // Eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(-6, -h/4, 4, 4);
    ctx.fillRect(2, -h/4, 4, 4);
    ctx.fillStyle = 'black';
    ctx.fillRect(-5, -h/4 + 1, 2, 2);
    ctx.fillRect(3, -h/4 + 1, 2, 2);

    // Sparks
    if (Math.random() > 0.5) {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(w/2, 0, 3, 3);
            ctx.fillRect(-w/2 - 3, 5, 2, 2);
    }
};
