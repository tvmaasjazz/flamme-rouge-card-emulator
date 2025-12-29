# Grand Tour Implementation Summary

## What Was Implemented

### 1. Symbol System

- Created `/public/symbols/` folder for PNG assets
- Defined 8 symbol types with path constants
- Symbols render at 18x18px in top-left and top-right corners of cards

### 2. Specialist Configurations

All 12 specialists from Grand Tour expansion:

**Rouleurs:**

- Baroudeur (Breakaway + Relentless on all cards)
- Flandrien (Chase on all cards)
- Grimpeur (Strong Descents on 7s, Strong Ascents on 6s)
- Domestique (Recovery on all 4s)
- Super Rouleur (Nimble on 5s and 6s)
- Puncheur (Relentless on single 8)

**Sprinters:**

- Descender (Strong Descents + Recovery on all 7s)
- Polyvalent (no symbols, just card swaps)
- Mountaineer (Strong Ascents on 7s)
- Squirrel (Breakaway + Chase on all 7s)
- Super Sprinteur (no symbols, adds 10 and 11)
- Flahute (Nimble on 9s)

### 3. Pregame Menu Restructure

- Separated into "Sprinter Setup" and "Rouleur Setup" sections
- Each section has:
  - Specialist dropdown (defaults to "Standard")
  - Add Exhaustion dropdown
  - Remove cards input (comma-separated)

### 4. Card Class Updates

- Added `symbols` parameter (array of image paths)
- Fixed selection bug using `indexOf()` instead of value matching

### 5. Deck Building

- `buildDeckForRider()` function applies specialist modifications
- Manual card removal happens AFTER specialist deck building
- Proper handling of empty removal inputs

### 6. Card Rendering

- `renderCardButton()` helper creates cards with:
  - Centered value text
  - Up to 2 symbol images in corners
  - Proper exhaustion card styling
- All card displays now use this helper

### 7. Recovery Rule

- Triggers after both riders select cards, before move phase
- Checks each selected card for Recovery symbol
- Removes one Exhaustion from recyclePile if present
- Displays status message on move phase screen
- Messages clear on Next Turn and Reset

### 8. LocalStorage Persistence

- Saves/loads card symbols for all piles
- Saves/loads specialist selections
- Properly reconstructs Card objects with symbols

### 9. Bug Fixes

- Fixed duplicate card selection bug using object reference
- Fixed empty string handling in card removal inputs

## Testing Checklist

- [ ] Standard mode with no specialists works as before
- [ ] Specialist selection changes deck composition
- [ ] Symbols display correctly on cards (1 or 2 per card)
- [ ] Recovery removes exhaustion when present in recycle pile
- [ ] Recovery message displays correctly
- [ ] Manual card removal works after specialist selection
- [ ] LocalStorage saves and restores specialist games
- [ ] Steroid mode works with specialists
- [ ] All 12 specialists have correct card modifications

## Files Modified

1. `/scripts/index.js` - All game logic
2. `/index.html` - Pregame menu restructure, recovery message div
3. `/styles/index.processed.css` - Card symbol positioning
4. `/public/symbols/README.md` - Asset documentation (created)

## Next Steps

1. Add PNG symbol images to `/public/symbols/`
2. Test each specialist thoroughly
3. Verify Recovery works in all scenarios
4. Test localStorage persistence with specialists
