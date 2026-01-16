
export const drawAirplane = (ctx: CanvasRenderingContext2D, x: number, y: number, isNight: boolean, time: number, facingRight: boolean) => {
    ctx.save();
    ctx.translate(x, y);
    // Base scale for the new design
    ctx.scale(0.8, 0.8);
    if (!facingRight) ctx.scale(-1, 1);

    // --- CARGO PLANE DESIGN ---

    // 1. Far Wing (Behind body)
    ctx.fillStyle = '#757575'; // Dark Grey
    ctx.beginPath();
    ctx.moveTo(10, -5);
    ctx.lineTo(-20, -15);
    ctx.lineTo(-10, -5);
    ctx.fill();

    // 2. Main Fuselage
    // Red Body
    ctx.fillStyle = '#d32f2f';
    // Rounded nose rectangle
    ctx.beginPath();
    ctx.moveTo(40, 0); // Nose tip
    ctx.quadraticCurveTo(45, 10, 30, 15); // Nose bottom curve
    ctx.lineTo(-40, 10); // Bottom rear
    ctx.lineTo(-45, -5); // Tail connection
    ctx.lineTo(-40, -15); // Top rear
    ctx.lineTo(30, -15); // Top front
    ctx.quadraticCurveTo(45, -15, 40, 0); // Nose top curve
    ctx.fill();

    // Cockpit Windows (Dark Blue)
    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.moveTo(35, -10);
    ctx.lineTo(40, -5);
    ctx.lineTo(40, 0);
    ctx.lineTo(32, -5);
    ctx.fill();
    // Glare on window
    ctx.fillStyle = '#90a4ae';
    ctx.fillRect(36, -8, 2, 2);

    // 3. Tail Section
    ctx.fillStyle = '#b71c1c'; // Darker Red
    ctx.beginPath();
    ctx.moveTo(-40, -10);
    ctx.lineTo(-55, -35); // Vertical stabilizer top
    ctx.lineTo(-45, -10);
    ctx.fill();
    
    // Horizontal stabilizer
    ctx.fillStyle = '#c62828';
    ctx.beginPath();
    ctx.moveTo(-45, -5);
    ctx.lineTo(-55, 0);
    ctx.lineTo(-45, 5);
    ctx.fill();

    // 4. Near Wing (Front)
    ctx.fillStyle = '#9e9e9e'; // Silver/Grey
    ctx.beginPath();
    ctx.moveTo(20, -10); // Root
    ctx.lineTo(-10, 20); // Tip
    ctx.lineTo(-30, 20); // Tip trailing
    ctx.lineTo(0, -10); // Root trailing
    ctx.fill();
    
    // Wing Engine/Holder
    ctx.fillStyle = '#424242';
    ctx.fillRect(5, 5, 8, 4);

    // 5. Propeller
    // Hub
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(44, 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Blades (Spinning blur)
    ctx.fillStyle = 'rgba(238, 238, 238, 0.4)';
    ctx.beginPath();
    ctx.ellipse(46, 2, 4, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 6. Details
    // Stripe on side
    ctx.fillStyle = 'white';
    ctx.fillRect(-30, -2, 50, 4);
    
    // Door outline
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-10, -5, 10, 12);

    // --- NIGHT LIGHTS ---
    if (isNight) {
        const blink = Math.floor(time / 250) % 2 === 0;
        if (blink) {
            // Red light on tail
            ctx.fillStyle = '#ff1744';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff1744';
            ctx.beginPath();
            ctx.arc(-55, -35, 2, 0, Math.PI*2);
            ctx.fill();
            
            // Green light on wingtip
            ctx.fillStyle = '#00e676';
            ctx.shadowColor = '#00e676';
            ctx.beginPath();
            ctx.arc(-20, 20, 2, 0, Math.PI*2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
        }
        // Steady white nose light
        ctx.fillStyle = '#fff9c4';
        ctx.beginPath();
        ctx.arc(40, 10, 1.5, 0, Math.PI*2);
        ctx.fill();
    }

    ctx.restore();
};
