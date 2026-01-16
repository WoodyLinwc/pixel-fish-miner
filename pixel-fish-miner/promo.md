# Pixel Fish Miner - Promo Codes Reference

This document lists all available promo codes that can be entered in the Store Modal.

## How to Use Promo Codes

1. Open the Shop in-game
2. Find the "Promo Code" input field at the bottom
3. Enter the code (case-insensitive)
4. Click "APPLY" or press Enter

---

## Available Promo Codes

### 💰 Currency & Rewards

| Code    | Effect                         | Notes                                     |
| ------- | ------------------------------ | ----------------------------------------- |
| `money` | Adds $500 to wallet            | Can be used multiple times                |
| `woody` | Max Money + Secret Achievement | Secret code - unlocks special achievement |

### 🌦️ Weather Control

| Code      | Effect                                   | Duration                 |
| --------- | ---------------------------------------- | ------------------------ |
| `rain`    | Forces Rain weather                      | Until next weather cycle |
| `snow`    | Forces Snow weather                      | Until next weather cycle |
| `wind`    | Forces Wind weather                      | Until next weather cycle |
| `fog`     | Forces Fog weather                       | Until next weather cycle |
| `rainbow` | Forces Rainbow weather (Narwhal spawns!) | One-time use only        |
| `normal`  | Resets to Clear weather                  | Instant                  |

**Note:** `rainbow` code can only be used once per save file!

### 🐟 Fishing Bonuses

| Code     | Effect                                     | Duration   |
| -------- | ------------------------------------------ | ---------- |
| `fish`   | Activates "Fish Frenzy" - rapid spawn rate | 30 seconds |
| `unlock` | Unlocks all fish in Encyclopedia           | Permanent  |

### ✈️ Special Events

| Code       | Effect                       | Notes                   |
| ---------- | ---------------------------- | ----------------------- |
| `plane`    | Summons Supply Drop airplane | Can also use `airplane` |
| `airplane` | Summons Supply Drop airplane | Alternative code        |

---

## Weather-Specific Fish

Each weather condition spawns unique fish:

- **Rain** → Thunder Eel
- **Snow** → Ice Fin
- **Wind** → Wind Ray
- **Fog** → Sea Turtle
- **Rainbow** → Narwhal (Legendary!)

---

## Tips for Using Codes

1. **Rainbow Code Strategy**: Save the `rainbow` code for when you really need a Narwhal catch!
2. **Fish Frenzy**: Combine `fish` code with `superBait` powerup for maximum efficiency
3. **Weather Cycling**: Use weather codes to complete weather-specific achievements faster
4. **Supply Drops**: Worth $2000 each - great for quick money boost
5. **Unlock All**: The `unlock` code fills your encyclopedia but doesn't give money for the catches

---

## Code Implementation Notes

All codes are:

- **Case-insensitive** (MONEY = money = MoNeY)
- Processed in `App.tsx` in the promo code handler
- Display feedback messages in current language
- Some codes can be used unlimited times, others are one-time only

### One-Time Use Codes:

- `rainbow` - Tracked in save file

### Unlimited Use Codes:

- All other codes can be used repeatedly

---

## Developer Testing

These codes are useful for:

- Testing different weather conditions quickly
- Verifying fish spawn mechanics
- Testing achievement triggers
- Debugging powerup interactions
- Quick money for costume/upgrade testing
