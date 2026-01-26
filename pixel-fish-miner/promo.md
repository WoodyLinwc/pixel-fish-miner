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

### ⚠️ Dangerous Codes

| Code    | Effect                   | Notes                                                             |
| ------- | ------------------------ | ----------------------------------------------------------------- |
| `reset` | **DELETES ALL PROGRESS** | ⚠️ Irreversible! Clears save and restarts game. Use with caution! |

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
6. **⚠️ Reset Warning**: The `reset` code is permanent! Export your save first if you might want to restore it later.

---

## Code Implementation Notes

All codes are:

- **Case-insensitive** (MONEY = money = MoNeY)
- Processed in `App.tsx` in the promo code handler
- Display feedback messages in current language
- Some codes can be used unlimited times, others are one-time only

### One-Time Use Codes:

- `rainbow` - Tracked in save file

### Dangerous Codes:

- `reset` - Shows confirmation dialog before executing

### Unlimited Use Codes:

- All other codes can be used repeatedly

---

## Safety Features

### Reset Code Protection

The `reset` code includes multiple safety measures:

1. **Confirmation Dialog**: Shows a warning popup before executing
2. **Clear Warning**: Explains that the action is irreversible
3. **Must Confirm**: User must click "OK" in the dialog to proceed
4. **No Undo**: Once confirmed, there is no way to recover the deleted progress

**Before using `reset`:**

- Use the Export feature in Settings to save your progress
- Make sure you really want to start over
- Remember: this cannot be undone!

---

## Developer Testing

These codes are useful for:

- Testing different weather conditions quickly
- Verifying fish spawn mechanics
- Testing achievement triggers
- Debugging powerup interactions
- Quick money for costume/upgrade testing
- **Reset code**: Starting fresh for testing new game experience

---

## Code Categories

### Safe Codes (Use Anytime)

- `money`, `fish`, `unlock`
- All weather codes (`rain`, `snow`, `wind`, `fog`, `normal`)
- `plane` / `airplane`

### Limited Use Codes

- `rainbow` (one-time only per save)

### Secret Codes

- `woody` (debug/testing)

### Dangerous Codes (⚠️ Use with Caution)

- `reset` (deletes everything!)

---

## Quick Reference Card

```
WEATHER:  rain | snow | wind | fog | rainbow | normal
MONEY:    money | woody
FISHING:  fish | unlock
EVENTS:   plane | airplane
DANGER:   reset (⚠️ DELETES ALL!)
```

---

## Version History

- **v1.0**: Initial promo codes (money, weather, fish, unlock, woody)
- **v1.1**: Added airplane/plane codes for supply drops
- **v1.2**: Added rainbow one-time use restriction
- **v1.3**: Added `reset` code with safety confirmation

---

## Troubleshooting

**Code not working?**

- Check spelling (codes are case-insensitive)
- Some codes have already been used (e.g., `rainbow`)
- Press Enter or click "APPLY" after typing

**Reset code not deleting everything?**

- Make sure you clicked "OK" on the confirmation dialog
- Page should reload automatically after reset
- If issues persist, manually clear browser data

**Want to undo a reset?**

- Not possible unless you exported your save beforehand
- Use Settings → Import to restore from a `.fishsave` file
- No backup = permanent loss

---

## Related Features

- **Export/Import**: Use Settings → Save Data to backup before using dangerous codes
- **Achievements**: Many codes contribute to achievement progress
- **Weather System**: Some codes interact with the natural weather cycle
- **One-Time Codes**: Track usage in save file to prevent re-use
