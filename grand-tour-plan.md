0. High-level goals (what changes, what doesn’t)
   New features

Pregame menu becomes two parallel sections:

Sprinter setup

Rouleur setup
Each section supports:

Optional Specialist selection by name (or “None / Standard deck”)

Add starting Exhaustion (existing dropdown stays, but per-rider section)

Remove specific cards from that rider (existing “remove comma list” stays, but per-rider section)

Card model supports optional symbols:

symbols: string[] (paths to PNGs)

Render on card: first symbol top-left, second symbol top-right

Recovery symbol rule:

After both riders have locked in their cards (i.e., when you currently transition to boost scene / move phase), if the played card has Recovery, attempt to remove one Exhaustion from that rider’s recycle pile and return it to that rider’s exhaustion deck (you currently don’t have a separate exhaustion deck; see implementation detail below).

Display a simple status line above Next Turn:

Include rider name (or “Sprinter/Rouleur” if you don’t have custom rider names) and whether Exhaustion was removed.

Not changing

Your current draw/recycle behavior stays.

Steroid mode / boost UI stays (but must work with specialist cards and symbol rendering).

LocalStorage “continue game” stays (but needs to store the specialist choices and card symbols).

1. Data model + constants
   1.1 Add a symbol system (paths to PNGs)

Create a single source of truth for symbol image paths. Example structure:

const SYMBOLS = {

RECOVERY: "/symbols/recovery.png",

RELENTLESS: "/symbols/relentless.png",

BREAKAWAY: "/symbols/breakaway.png",

CHASE: "/symbols/chase.png",

NIMBLE: "/symbols/nimble.png",

etc…

};

Vercel note: put these PNGs in a public/symbols/ folder so they’re served at /symbols/<file>.png. No special config needed.

1.2 Update Card class

Right now:

class Card {
constructor(value, type) {
this.value = value;
this.type = type || "MOVEMENT";
}
}

Update to:

Accept an optional symbols array:

constructor(value, type, symbols = [])

this.symbols = symbols

(Optional but helpful) give each card a stable ID so selection is not ambiguous when duplicates exist:

this.id = crypto.randomUUID?.() ?? String(Date.now()) + Math.random()

This avoids your current select() bug where you match by value only (duplicate values can pick the wrong card). This bug will become more noticeable with specialist cards.

1.3 Define Specialists

Create a config object with:

name

riderType (SPRINTER or ROULEUR)

cardsRemoved / cardsAdded relative to the base deck

specialCards (optional) for cards that need symbols attached (or new values if that exists)

(Optional) displayName if you want nice UI

Example shape (agent can fill from your expansion chart):

const SPECIALISTS = {
// key should be stable for storage
"baroudeur": {
name: "Baroudeur",
riderType: "ROULEUR",
remove: [3,5,6,6,7], // or [{value:3,count:1}, ...] if you prefer
add: [
{ value: 5, type: "MOVEMENT", symbols: ["BREAKAWAY"] },
{ value: 6, type: "MOVEMENT", symbols: [] },
{ value: 6, type: "MOVEMENT", symbols: [] },
{ value: 7, type: "MOVEMENT", symbols: ["RELENTLESS"] }
]
},
...
};

Important: store symbols as symbol keys (like "RECOVERY") rather than direct paths. Then on card creation, map them to actual paths using SYMBOLS[KEY]. That keeps storage stable and makes asset renames easier.

2. Pregame menu UI restructure
   2.1 Replace current single “Deck Setup” with two rider sections

Current pregame has:

Game mode radio

Add Sprinter Exhaustion dropdown

Add Rouleur Exhaustion dropdown

Remove from Sprinter input

Remove from Rouleur input

Start New Game button

Change layout to:

Game Mode (same)

Sprinter Setup

Specialist dropdown:

default option: “Standard Sprinter”

then list all sprinter-eligible specialists by name

Add starting Exhaustion dropdown (same as now but inside sprinter section)

Remove cards input (comma list)

(Optional) a tiny preview line showing the resulting deck size after applying changes

Rouleur Setup

Specialist dropdown (default “Standard Rouleur”)

Add starting Exhaustion dropdown

Remove cards input

Start New Game (same)

2.2 Wire the form fields

Instead of reading:

addSprinterExhaustion, removeFromSprinter, etc.

Also read:

sprinterSpecialistKey

rouleurSpecialistKey

If using <select name="sprinterSpecialist">, you’ll get value via formData.get("sprinterSpecialist").

3. Deck construction changes
   3.1 Keep base deck functions, add a “build deck” function

Keep:

getSprinterDeck()

getRollerDeck()

Add:

buildDeckForRider({ riderType, specialistKey }) -> Card[]

Algorithm:

Start with base deck cards for that riderType.

If specialistKey is not empty:

Look up specialist config.

Apply remove:

Remove exact counts (e.g., remove two 6’s, not “all 6’s”).

Implementation: for each value to remove, findIndex and splice one occurrence.

Apply add:

Create new Card(value, type, symbolsResolved)

Return deck cards.

3.2 Ensure remove logic handles blank input

Right now you do:

formData.get("removeFromSprinter").split(",").map(Number)

This breaks on empty string, resulting in [0] or [NaN].

Fix pattern:

Read string

If blank, treat as empty array

Filter out NaN

Same for both riders.

4. Rendering cards with symbols (top-left/top-right)
   4.1 Stop using a plain <button> with innerText

You currently create:

const cardButton = document.createElement("BUTTON");
cardButton.classList.add("cardButton");
cardButton.innerText = drawnCard.value;

Change to a card container that can host:

value text centered

optional two <img> icons in corners

Recommended DOM structure:

button.cardButton

div.cardValue (text)

img.cardSymbol.left

img.cardSymbol.right

CSS (agent should implement):

.cardButton { position: relative; }

.cardSymbol { position: absolute; top: 6px; width: 18px; height: 18px; }

.cardSymbol.left { left: 6px; }

.cardSymbol.right { right: 6px; }

keep your current sizing/spacing

4.2 Make a helper: renderCardButton(card)

Create a function that returns a fully built card button element given a Card instance:

sets value text

sets exhaustion red styling if needed

reads card.symbols:

if symbols[0] exists: add left img

if symbols[1] exists: add right img

Use this helper in:

handleCardDraw when displaying drawn cards

boost scene “selected card display” (you currently rebuild a new button with boostedValue)

selection boxes (sprinterSelection / rollerSelection)

4.3 Boost scene compatibility

Right now boost selection replaces the selection box with a new button that only shows a number.

Change it so boosted rendering:

Starts from the selected card’s symbol list

Displays the boosted value in the center

Keeps the two icons if present

Implementation detail:

The “boosted view” should not mutate the original card value (unless you want it to). It can just visually show boosted value.

Store boost separately as you already do.

5. Recovery rule implementation
   5.1 Clarify the “Exhaustion deck” in your current model

You currently have:

drawPile

recyclePile

discardPile (unused)
And exhaustion is represented as new Card(2, "EXHAUSTION") placed into recycle pile.

The Grand Tour text says: return 1 recycled Exhaustion card from their Energy deck to the respective Exhaustion deck.

In your app’s simplification, the closest interpretation is:

“Remove one Exhaustion from recyclePile, and put it… somewhere that means it won’t be drawn again soon.”

Two workable interpretations:

Option A (simple, matches your structure): remove it from recyclePile and put it into discardPile (or a new exhaustionPile) so it’s effectively “out” unless you have a rule for reintroducing it.

This is the cleanest mapping to “goes back to exhaustion deck”.

Option B (minimal change): remove it from recyclePile and do nothing else (card is removed from game).

Easiest, but slightly less faithful.

Recommendation: implement Option A:

Create exhaustionPile on RacerDeck (or repurpose discardPile but rename is clearer).

Recovery moves an Exhaustion card from recyclePile → exhaustionPile.

addExhaustion() should add to recyclePile (as you already do).

getExhaustionCount() should include exhaustionPile too (so totals remain correct).

5.2 Detecting Recovery

Decide how you represent the Recovery symbol:

In Card.symbols, include "RECOVERY" (symbol key).

Add helper:

cardHasSymbol(card, "RECOVERY")

5.3 When Recovery triggers

Trigger timing per your request:

“after that player has locked in both cards”

In your code, that’s when:

both selectedSprinterCard and selectedRollerCard exist

and you’re about to checkForBoostScene() (or inside it)

So implement Recovery resolution right before you show boost scene / proceed to move phase.

Concretely:

In checkForBoostScene(), after you confirm both are selected and before showing cheatScene or calling proceedToMoveRiders(), run:

For each rider:

If that rider’s selected card has Recovery:

Attempt: deck.removeOneExhaustionFromRecycleToExhaustionPile()

Record a message describing success/failure for that rider.

5.4 Add methods on RacerDeck

Add:

hasRecycledExhaustion(): check recyclePile contains type EXHAUSTION

recoverOneExhaustion():

find index of first exhaustion in recyclePile

if found:

remove that card from recyclePile

push it into exhaustionPile (or discardPile)

return true

else return false

5.5 Display messages above Next Turn

Add an element in your move phase UI, above the Next Turn button(s), like:

<div id="specialistResolutionMessages"></div>

When Recovery resolves, set it to one or two lines:

Sprinter (Baroudeur): Recovery removed 1 Exhaustion from recycle.

Rouleur (Flandrien): Recovery found no Exhaustion to remove.

Implementation detail:

If you don’t have the specialist name, use Sprinter / Rouleur.

If you do, store the selected specialist name in state.

Also clear this message:

At start of each new turn (when Next Turn is clicked)

On reset / new game

On continue game load (set to empty)

5.6 Persist Recovery outcome?

No need to persist the message in localStorage; it’s ephemeral.
But you must persist:

cards in piles including their symbols

exhaustionPile/discardPile if you add it

6. LocalStorage save/restore updates
   6.1 Save symbols and specialist selection

Your save state stores each pile with card value/type. Extend to include:

symbols (array)

(Optional) id
Also store:

sprinterSpecialistKey

rollerSpecialistKey

Example stored card shape:

{ id, value, type, symbols }

6.2 Update load/continue to recreate Card objects

When restoring:

new Card(c.value, c.type, c.symbols ?? [])

plus assign id if you add it (either pass it or set after)

6.3 Update deck info counts

If you add exhaustionPile, update:

setDeckInfo() to show it if you want (optional)

getExhaustionCount() include it

7. Fix the selection bug (strongly recommended)

Right now in select() you match by value:

const selectedIndex = drawnCards.findIndex((card) => card.value === selectedCard.value);

If a hand contains duplicates (common), selecting a 4 could recycle the wrong copy.

When you introduce specialist cards with symbols, duplicates become meaningfully different.

Fix:

Compare by id instead of value.

Your click handler already has drawnCard in scope; pass that exact object to select() and remove by reference:

const selectedIndex = drawnCards.indexOf(selectedCard)
This is the simplest, since they’re the same objects from draw().

8. Asset placement for Vercel

To make PNG symbols available:

Put files in: public/symbols/\*.png

Refer to them in code as:

/symbols/recovery.png
No import/bundler needed in vanilla JS.

9. Testing checklist (agent should run through)
   Base behavior

Standard mode, no specialist: everything behaves exactly as before.

Steroid mode: boost scene still appears only for exhaustion cards, and boosted display still shows icons if present.

Specialist deck building

Selecting a specialist changes starting deck size appropriately.

“Remove cards” input still works on top of specialist modifications.

Removing cards with duplicates removes correct counts.

Rendering

Drawn cards show 0, 1, or 2 symbols in corners.

Selected card display shows symbols.

Boost scene display shows symbols.

Recovery

If Recovery card chosen and recycle has Exhaustion: one Exhaustion moves out of recycle (and into exhaustionPile/discardPile).

If none in recycle: no change.

Status message appears with rider name and success/failure.

Message clears on Next Turn and reset.

State persists correctly if you refresh mid-turn (localStorage restore).

10. Quick “where to edit” map in your current file

Card class: add symbols, optionally id

RacerDeck:

add exhaustionPile (or repurpose discardPile)

add recoverOneExhaustion()

update getExhaustionCount()

saveGameState / continueGame: include card symbols + specialist keys + exhaustionPile if added

Pregame HTML: restructure into Sprinter Setup and Rouleur Setup, add <select> controls

setupForm submit handler:

read specialist keys

call buildDeckForRider for each rider before shuffling

then apply exhaustion additions/removals as you do now

Card rendering:

implement renderCardButton(card, {overrideValue?})

replace all places you create .cardButton with this helper

Recovery trigger:

in checkForBoostScene() after both selected:

resolve recovery for each rider

set status message element

then proceed to boost/move as normal

If you want, paste your current HTML for the pregame menu and I’ll specify the exact markup edits (IDs/names) so your agent can implement it without guessing.

list all specialists in these instructions with cards removed and added

Here are all Grand Tour specialists from your table, with cards removed and cards added (counts × value). Where the table shows an icon on the added card(s), I’ve noted it in parentheses.

Rouleurs

1. Baroudeur

Removed: 1×3, 1×5, 2×6, 1×7

Added: 1×5, 2×6, 1×7 (Breakaway, Relentless)

2. Flandrien

Removed: 1×3, 1×4, 1×5, 1×6, 1×7

Added: 1×3, 1×4, 1×5, 1×6, 1×7 (Chase)

3. Grimpeur

Removed: 3×3, 3×6

Added: 3×7 (Strong Descents), 3×6 (Strong Ascents)

4. Domestique

Removed: 3×4

Added: 3×4 (Recovery)

5. Super Rouleur

Removed: 2×5, 2×6

Added: 2×5, 2×6 (Nimble)

6. Puncheur

Removed: 1×4, 1×6

Added: 1×8 (Relentless)

Sprinteurs

1. Descender

Removed: 3×3

Added: 3×7 (Strong Descents, Recovery)

2. Polyvalent

Removed: 3×4

Added: 1×3, 2×6

3. Mountaineer

Removed: 1×2, 1×3, 1×5, 1×9

Added: 1×4, 2×7 (Strong Ascents)

4. Squirrel

Removed: 1×2, 1×9

Added: 2×7 (Breakaway, Chase)

5. Super Sprinteur

Removed: 1×5, 2×9

Added: 1×4, 1×10, 1×11

6. Flahute

Removed: 1×4, 2×9

Added: 1×5, 2×9 (Nimble)
