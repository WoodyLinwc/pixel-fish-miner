
import { WeatherType } from '../types';
import { lerpColor } from './drawHelpers';

export const getEnvironmentColors = (hour: number, weather: WeatherType) => {
    // 0-4: Night, 4-6: Dawn, 6-17: Day, 17-19: Dusk, 19-24: Night

    // Colors
    const nightSkyTop = '#0d1b2a';
    const nightSkyBot = '#1b263b';
    const dawnSkyTop = '#4a2c2a';
    const dawnSkyBot = '#ff9e80'; // Peach
    const daySkyTop = '#b3e5fc';
    const daySkyBot = '#81d4fa';
    const duskSkyTop = '#2e1c2b'; // Deep purple
    const duskSkyBot = '#ff7043'; // Orange
    
    // Fog colors (Grey/Desaturated)
    const fogSkyTop = '#cfd8dc';
    const fogSkyBot = '#90a4ae';

    // Rainbow colors (Vibrant)
    const rainbowSkyTop = '#81d4fa';
    const rainbowSkyBot = '#b39ddb';

    const nightOverlay = 'rgba(0, 5, 20, 0.6)';
    const dawnOverlay = 'rgba(255, 100, 50, 0.1)';
    const dayOverlay = 'rgba(0, 0, 0, 0)';
    const duskOverlay = 'rgba(80, 20, 60, 0.2)';
    
    // Weather Overlays
    const rainOverlay = 'rgba(0, 20, 40, 0.4)';
    const snowOverlay = 'rgba(200, 220, 255, 0.2)';
    const windOverlay = 'rgba(200, 200, 200, 0.1)';
    const fogOverlay = 'rgba(200, 210, 220, 0.3)'; // Thick white/grey mist
    const rainbowOverlay = 'rgba(0,0,0,0)'; // Clear, handled by canvas drawing manually

    let skyTop, skyBot, overlay;

    if (weather === WeatherType.FOG) {
        // Override normal cycle for heavy fog
        // But mix slightly with time of day for night fog vs day fog
        if (hour >= 20 || hour < 4) {
             skyTop = lerpColor(nightSkyTop, fogSkyTop, 0.3);
             skyBot = lerpColor(nightSkyBot, fogSkyBot, 0.3);
             overlay = nightOverlay; // Keep it dark
        } else {
             skyTop = fogSkyTop;
             skyBot = fogSkyBot;
             overlay = fogOverlay;
        }
    } else if (weather === WeatherType.RAINBOW) {
        // Force vibrant sky for Rainbow weather regardless of time (magic!)
        skyTop = rainbowSkyTop;
        skyBot = rainbowSkyBot;
        overlay = rainbowOverlay;
    } else {
        if (hour >= 20 || hour < 4) {
            // Full Night
            skyTop = nightSkyTop;
            skyBot = nightSkyBot;
            overlay = nightOverlay;
        } else if (hour >= 4 && hour < 6) {
            // Dawn
            const t = (hour - 4) / 2;
            skyTop = lerpColor(nightSkyTop, dawnSkyTop, t);
            skyBot = lerpColor(nightSkyBot, dawnSkyBot, t);
            overlay = nightOverlay; 
            if (t > 0.5) overlay = dawnOverlay;
        } else if (hour >= 6 && hour < 8) {
            // Dawn to Day
            const t = (hour - 6) / 2;
            skyTop = lerpColor(dawnSkyTop, daySkyTop, t);
            skyBot = lerpColor(dawnSkyBot, daySkyBot, t);
            overlay = t < 0.5 ? dawnOverlay : dayOverlay;
        } else if (hour >= 8 && hour < 17) {
            // Day
            skyTop = daySkyTop;
            skyBot = daySkyBot;
            overlay = dayOverlay;
        } else if (hour >= 17 && hour < 19) {
            // Day to Dusk
            const t = (hour - 17) / 2;
            skyTop = lerpColor(daySkyTop, duskSkyTop, t);
            skyBot = lerpColor(daySkyBot, duskSkyBot, t);
            overlay = t > 0.5 ? duskOverlay : dayOverlay;
        } else if (hour >= 19 && hour < 20) {
            // Dusk to Night
            const t = (hour - 19) / 1;
            skyTop = lerpColor(duskSkyTop, nightSkyTop, t);
            skyBot = lerpColor(duskSkyBot, nightSkyBot, t);
            overlay = t > 0.5 ? nightOverlay : duskOverlay;
        } else {
            skyTop = nightSkyTop;
            skyBot = nightSkyBot;
            overlay = nightOverlay;
        }
    }

    return { skyTop, skyBot, overlay, rainOverlay, snowOverlay, windOverlay, fogOverlay };
};
