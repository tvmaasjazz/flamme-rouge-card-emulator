// Symbol paths
const SYMBOLS = {
  RECOVERY: "public/symbols/recovery.png",
  RELENTLESS: "public/symbols/relentless.png",
  BREAKAWAY: "public/symbols/breakaway.png",
  CHASE: "public/symbols/chase.png",
  NIMBLE: "public/symbols/nimble.png",
  STRONG_DESCENTS: "public/symbols/strong_descents.png",
  STRONG_ASCENTS_6: "public/symbols/strong_ascents_6.png",
  STRONG_ASCENTS_7: "public/symbols/strong_ascents_7.png",
};

// Specialist configurations
const SPECIALISTS = {
  baroudeur: {
    name: "Baroudeur",
    riderType: "ROULEUR",
    remove: [3, 5, 6, 6, 7],
    add: [
      { value: 5, type: "MOVEMENT", symbols: ["BREAKAWAY", "RELENTLESS"] },
      { value: 6, type: "MOVEMENT", symbols: ["BREAKAWAY", "RELENTLESS"] },
      { value: 6, type: "MOVEMENT", symbols: ["BREAKAWAY", "RELENTLESS"] },
      { value: 7, type: "MOVEMENT", symbols: ["BREAKAWAY", "RELENTLESS"] },
    ],
  },
  flandrien: {
    name: "Flandrien",
    riderType: "ROULEUR",
    remove: [3, 4, 5, 6, 7],
    add: [
      { value: 3, type: "MOVEMENT", symbols: ["CHASE"] },
      { value: 4, type: "MOVEMENT", symbols: ["CHASE"] },
      { value: 5, type: "MOVEMENT", symbols: ["CHASE"] },
      { value: 6, type: "MOVEMENT", symbols: ["CHASE"] },
      { value: 7, type: "MOVEMENT", symbols: ["CHASE"] },
    ],
  },
  grimpeur: {
    name: "Grimpeur",
    riderType: "ROULEUR",
    remove: [3, 3, 3, 6, 6, 6],
    add: [
      { value: 7, type: "MOVEMENT", symbols: ["STRONG_DESCENTS"] },
      { value: 7, type: "MOVEMENT", symbols: ["STRONG_DESCENTS"] },
      { value: 7, type: "MOVEMENT", symbols: ["STRONG_DESCENTS"] },
      { value: 6, type: "MOVEMENT", symbols: ["STRONG_ASCENTS_6"] },
      { value: 6, type: "MOVEMENT", symbols: ["STRONG_ASCENTS_6"] },
      { value: 6, type: "MOVEMENT", symbols: ["STRONG_ASCENTS_6"] },
    ],
  },
  domestique: {
    name: "Domestique",
    riderType: "ROULEUR",
    remove: [4, 4, 4],
    add: [
      { value: 4, type: "MOVEMENT", symbols: ["RECOVERY"] },
      { value: 4, type: "MOVEMENT", symbols: ["RECOVERY"] },
      { value: 4, type: "MOVEMENT", symbols: ["RECOVERY"] },
    ],
  },
  superRouleur: {
    name: "Super Rouleur",
    riderType: "ROULEUR",
    remove: [5, 5, 6, 6],
    add: [
      { value: 5, type: "MOVEMENT", symbols: ["NIMBLE"] },
      { value: 5, type: "MOVEMENT", symbols: ["NIMBLE"] },
      { value: 6, type: "MOVEMENT", symbols: ["NIMBLE"] },
      { value: 6, type: "MOVEMENT", symbols: ["NIMBLE"] },
    ],
  },
  puncheur: {
    name: "Puncheur",
    riderType: "ROULEUR",
    remove: [4, 6],
    add: [{ value: 8, type: "MOVEMENT", symbols: ["RELENTLESS"] }],
  },
  descender: {
    name: "Descender",
    riderType: "SPRINTER",
    remove: [3, 3, 3],
    add: [
      { value: 7, type: "MOVEMENT", symbols: ["STRONG_DESCENTS", "RECOVERY"] },
      { value: 7, type: "MOVEMENT", symbols: ["STRONG_DESCENTS", "RECOVERY"] },
      { value: 7, type: "MOVEMENT", symbols: ["STRONG_DESCENTS", "RECOVERY"] },
    ],
  },
  polyvalent: {
    name: "Polyvalent",
    riderType: "SPRINTER",
    remove: [4, 4, 4],
    add: [
      { value: 3, type: "MOVEMENT", symbols: [] },
      { value: 6, type: "MOVEMENT", symbols: [] },
      { value: 6, type: "MOVEMENT", symbols: [] },
    ],
  },
  mountaineer: {
    name: "Mountaineer",
    riderType: "SPRINTER",
    remove: [2, 3, 5, 9],
    add: [
      { value: 4, type: "MOVEMENT", symbols: [] },
      { value: 7, type: "MOVEMENT", symbols: ["STRONG_ASCENTS_7"] },
      { value: 7, type: "MOVEMENT", symbols: ["STRONG_ASCENTS_7"] },
    ],
  },
  squirrel: {
    name: "Squirrel",
    riderType: "SPRINTER",
    remove: [2, 9],
    add: [
      { value: 7, type: "MOVEMENT", symbols: ["BREAKAWAY", "CHASE"] },
      { value: 7, type: "MOVEMENT", symbols: ["BREAKAWAY", "CHASE"] },
    ],
  },
  superSprinteur: {
    name: "Super Sprinteur",
    riderType: "SPRINTER",
    remove: [5, 9, 9],
    add: [
      { value: 4, type: "MOVEMENT", symbols: [] },
      { value: 10, type: "MOVEMENT", symbols: [] },
      { value: 11, type: "MOVEMENT", symbols: [] },
    ],
  },
  flahute: {
    name: "Flahute",
    riderType: "SPRINTER",
    remove: [4, 9, 9],
    add: [
      { value: 5, type: "MOVEMENT", symbols: [] },
      { value: 9, type: "MOVEMENT", symbols: ["NIMBLE"] },
      { value: 9, type: "MOVEMENT", symbols: ["NIMBLE"] },
    ],
  },
};

let sprinterDeck = {};
let rollerDeck = {};

let selectedSprinterCard = null;
let selectedRollerCard = null;

let sprinterSpecialistKey = "";
let rollerSpecialistKey = "";

let gameMode = "standard"; // Track current game mode: "standard" or "steroid"

// LocalStorage functions
const GAME_STATE_KEY = "flammeRougeGameState";

//
function saveGameState() {
  const gameState = {
    gameMode,
    sprinterDeck: {
      drawPile: sprinterDeck.drawPile.map((c) => ({
        value: c.value,
        type: c.type,
        symbols: c.symbols,
      })),
      recyclePile: sprinterDeck.recyclePile.map((c) => ({
        value: c.value,
        type: c.type,
        symbols: c.symbols,
      })),
      discardPile: sprinterDeck.discardPile.map((c) => ({
        value: c.value,
        type: c.type,
        symbols: c.symbols,
      })),
      type: sprinterDeck.type,
    },
    rollerDeck: {
      drawPile: rollerDeck.drawPile.map((c) => ({
        value: c.value,
        type: c.type,
        symbols: c.symbols,
      })),
      recyclePile: rollerDeck.recyclePile.map((c) => ({
        value: c.value,
        type: c.type,
        symbols: c.symbols,
      })),
      discardPile: rollerDeck.discardPile.map((c) => ({
        value: c.value,
        type: c.type,
        symbols: c.symbols,
      })),
      type: rollerDeck.type,
    },
    sprinterSteroidPointsUsed,
    rollerSteroidPointsUsed,
    sprinterSpecialistKey,
    rollerSpecialistKey,
    gameActive: true,
  };
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
}

function loadGameState() {
  const savedState = localStorage.getItem(GAME_STATE_KEY);
  if (savedState) {
    return JSON.parse(savedState);
  }
  return null;
}

function clearGameState() {
  localStorage.removeItem(GAME_STATE_KEY);
}

function hasSavedGame() {
  const savedState = loadGameState();
  return savedState && savedState.gameActive;
}

// html elements
const mainGame = document.getElementById("mainGame");
const pregameMenu = document.getElementById("pregameMenu");
const setupForm = document.getElementById("setupForm");
const drawCardPhase = document.getElementById("drawCardPhase");
const moveRacersPhase = document.getElementById("moveRacersPhase");
const sprinterDeckInfo = document.getElementById("sprinterDeckInfo");
const rollerDeckInfo = document.getElementById("rollerDeckInfo");
const sprinterExhaustInfo = document.getElementById("sprinterExhaustInfo");
const rollerExhaustInfo = document.getElementById("rollerExhaustInfo");
const drawSprinterButton = document.getElementById("drawSprinter");
const drawRollerButton = document.getElementById("drawRoller");
const exhaustSprinterButton = document.getElementById("exhaustSprinter");
const exhaustRollerButton = document.getElementById("exhaustRoller");
const nextTurnButtons = document.querySelectorAll(".nextTurnButton");

const resetButtons = document.querySelectorAll(".resetButton");
const exhaustSprinter2 = document.getElementById("exhaustSprinter2");
const exhaustRoller2 = document.getElementById("exhaustRoller2");

const sprinterSelection = document.getElementById("sprinterSelection");
const rollerSelection = document.getElementById("rollerSelection");
const gameStatusText = document.getElementById("gameStatus");
const gameStatus2Text = document.getElementById("gameStatus2");
const cardSelectionDiv = document.getElementById("cardSelection");

/** NEW STEROID STUFF */
const cheatScene = document.getElementById("cheatScene");
const sprinterNoBoost = document.getElementById("sprinterNoBoost");
const sprinterBoost1 = document.getElementById("sprinterBoost1");
const sprinterBoost2 = document.getElementById("sprinterBoost2");
const sprinterBoost3 = document.getElementById("sprinterBoost3");
const rollerNoBoost = document.getElementById("rollerNoBoost");
const rollerBoost1 = document.getElementById("rollerBoost1");
const rollerBoost2 = document.getElementById("rollerBoost2");
const rollerBoost3 = document.getElementById("rollerBoost3");
const confirmBoost = document.getElementById("confirmBoost");

let sprinterBoostValue = 0;
let rollerBoostValue = 0;
let sprinterSteroidPointsUsed = 0;
let rollerSteroidPointsUsed = 0;
const steroidPointsPerRider = 5;
function handleBoostSelection(card, rider) {
  const isExhaustion = card.value === 2 && card.type === "EXHAUSTION";

  if (rider === "sprinter") {
    const sprinterBoostSection = document.getElementById("sprinterBoost");

    if (sprinterSteroidPointsUsed >= steroidPointsPerRider) {
      sprinterBoostSection.style.display = "none"; // Hide if no points left
    } else {
      sprinterBoostSection.style.display = isExhaustion ? "block" : "none";
      // Update button states based on remaining points
      [sprinterBoost1, sprinterBoost2, sprinterBoost3].forEach(
        (button, index) => {
          const boostValue = index + 1;
          button.disabled =
            sprinterSteroidPointsUsed + boostValue > steroidPointsPerRider;
        }
      );

      sprinterNoBoost.classList.add("highlighted");
    }
  } else if (rider === "roller") {
    const rollerBoostSection = document.getElementById("rollerBoost");

    if (rollerSteroidPointsUsed >= steroidPointsPerRider) {
      rollerBoostSection.style.display = "none"; // Hide if no points left
    } else {
      rollerBoostSection.style.display = isExhaustion ? "block" : "none";
      // Update button states based on remaining points
      [rollerBoost1, rollerBoost2, rollerBoost3].forEach((button, index) => {
        const boostValue = index + 1;
        button.disabled =
          rollerSteroidPointsUsed + boostValue > steroidPointsPerRider;
      });

      rollerNoBoost.classList.add("highlighted");
    }
  }
}

// Handle confirmation of boosts
confirmBoost.addEventListener("click", () => {
  // Update steroid points used
  sprinterSteroidPointsUsed += sprinterBoostValue;
  rollerSteroidPointsUsed += rollerBoostValue;

  // Reset boost values for the next round
  sprinterBoostValue = 0;
  rollerBoostValue = 0;

  // Reset boost button highlights
  document.querySelectorAll(".boostButton").forEach((btn) => {
    btn.classList.remove("highlighted");
  });

  // Save state after boost selection
  saveGameState();

  // Proceed to the next phase
  proceedToMoveRiders();
});

[sprinterNoBoost, sprinterBoost1, sprinterBoost2, sprinterBoost3].forEach(
  (button, index) => {
    button.addEventListener("click", () => {
      sprinterBoostValue = index; // No Boost = 0, Boost 1 = 1, etc.

      // Highlight the selected button
      [sprinterNoBoost, sprinterBoost1, sprinterBoost2, sprinterBoost3].forEach(
        (btn) => btn.classList.remove("highlighted")
      );
      button.classList.add("highlighted");

      // Update the sprinter card display with a cardButton element
      const baseValue = selectedSprinterCard?.value || 0;
      const boostedValue = baseValue + sprinterBoostValue;

      // Create a new cardButton element
      const cardButton = document.createElement("BUTTON");
      cardButton.classList.add("cardButton");
      cardButton.innerText = boostedValue;
      cardButton.style.color = sprinterBoostValue > 0 ? "white" : "#aa0000"; // Highlight boost

      // Replace the content of sprinterSelection
      sprinterSelection.innerHTML = ""; // Clear previous content
      sprinterSelection.appendChild(cardButton);

      if (rollerBoostValue + sprinterBoostValue > 0) {
        confirmBoost.innerText = "Inject Roids";
      } else {
        confirmBoost.innerText = "Ride Clean";
      }
    });
  }
);

[rollerNoBoost, rollerBoost1, rollerBoost2, rollerBoost3].forEach(
  (button, index) => {
    button.addEventListener("click", () => {
      rollerBoostValue = index; // No Boost = 0, Boost 1 = 1, etc.

      // Highlight the selected button
      [rollerNoBoost, rollerBoost1, rollerBoost2, rollerBoost3].forEach((btn) =>
        btn.classList.remove("highlighted")
      );
      button.classList.add("highlighted");

      // Update the roller card display with a cardButton element
      const baseValue = selectedRollerCard?.value || 0;
      const boostedValue = baseValue + rollerBoostValue;

      // Create a new cardButton element
      const cardButton = document.createElement("BUTTON");
      cardButton.classList.add("cardButton");
      cardButton.innerText = boostedValue;
      cardButton.style.color = rollerBoostValue > 0 ? "white" : "#aa0000"; // Highlight boost

      // Replace the content of rollerSelection
      rollerSelection.innerHTML = ""; // Clear previous content
      rollerSelection.appendChild(cardButton);

      if (rollerBoostValue + sprinterBoostValue > 0) {
        confirmBoost.innerText = "Inject Roids";
      } else {
        confirmBoost.innerText = "Ride Clean";
      }
    });
  }
);

/** END STEROID STUFF */

/** STEROID TESTING STUFF */
// HTML elements for drug testing
const drugTestingScene = document.getElementById("drugTestingScene");
const checkSprinterTestButton = document.getElementById("checkSprinterTest");
const sprinterTestResultMessage = document.getElementById("sprinterTestResult");
const runSprinterTestButton = document.getElementById("runSprinterTest");
const checkRollerTestButton = document.getElementById("checkRollerTest");
const rollerTestResultMessage = document.getElementById("rollerTestResult");
const runRollerTestButton = document.getElementById("runRollerTest");
const endRaceButton = document.getElementById("endRace");

// Drug Testing logic
function calculateTestRequired(boostPoints) {
  const odds = [0.5, 0.5, 0.5, 0.7, 0.9, 1.0];
  return Math.random() < odds[boostPoints];
}

function calculateTestResult(boostPoints) {
  const odds = [0.0, 0.2, 0.5, 0.8, 0.9, 0.9];
  return Math.random() < odds[boostPoints];
}

// testing messages
const positiveMessages = [
  "Thanks for protecting the integrity of the sport!",
  "Your hard work and honesty are commendable!",
  "A true champion stays clean!",
  "Integrity is the foundation of your success!",
  "Clean racing is the best racing!",
  "Honesty wins more than races—it wins respect!",
  "Proof that skill beats shortcuts!",
  "Clean effort, clean results. Well done!",
  "Fair play isn’t just a rule; it’s a lifestyle!",
  "No roids, no regrets. Keep shining!",
];

const negativeMessages = [
  "This is a dark day for fair competition.",
  "Steroids have no place in this sport.",
  "Cheating never prospers—goodbye racer!",
  "The sport deserves better role models.",
  "Enjoy your podium... in the Hall of Shame.",
  "A performance enhanced by deceit isn’t a performance at all.",
  "Congratulations on the fastest trip to disqualification!",
  "Your legacy is now a cautionary tale.",
  "The only thing you’re leading in is bad decisions.",
];

// Sprinter Testing
checkSprinterTestButton.addEventListener("click", () => {
  checkSprinterTestButton.disabled = true; // Disable button after press
  const testRequired = calculateTestRequired(sprinterSteroidPointsUsed);

  if (testRequired) {
    sprinterTestResultMessage.textContent = "Test required.";
    runSprinterTestButton.style.display = "block"; // Show "Run Test" button
  } else {
    sprinterTestResultMessage.textContent = "No test required.";
  }
});

runSprinterTestButton.addEventListener("click", () => {
  runSprinterTestButton.disabled = true; // Disable button after press
  const testResult = calculateTestResult(sprinterSteroidPointsUsed);

  if (testResult) {
    const randomNegativeMessage =
      negativeMessages[Math.floor(Math.random() * negativeMessages.length)];
    sprinterTestResultMessage.textContent = `POSITIVE for Steroids - ${randomNegativeMessage}`;
  } else {
    const randomPositiveMessage =
      positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    sprinterTestResultMessage.textContent = `NEGATIVE for Steroids - ${randomPositiveMessage}`;
  }
});

// Rouleur Testing
checkRollerTestButton.addEventListener("click", () => {
  checkRollerTestButton.disabled = true; // Disable button after press
  const testRequired = calculateTestRequired(rollerSteroidPointsUsed);

  if (testRequired) {
    rollerTestResultMessage.textContent = "Test required.";
    runRollerTestButton.style.display = "block"; // Show "Run Test" button
  } else {
    rollerTestResultMessage.textContent = "No test required.";
  }
});

runRollerTestButton.addEventListener("click", () => {
  runRollerTestButton.disabled = true; // Disable button after press
  const testResult = calculateTestResult(rollerSteroidPointsUsed);

  if (testResult) {
    const randomNegativeMessage =
      negativeMessages[Math.floor(Math.random() * negativeMessages.length)];
    rollerTestResultMessage.textContent = `POSITIVE for Steroids - ${randomNegativeMessage}`;
  } else {
    const randomPositiveMessage =
      positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
    rollerTestResultMessage.textContent = `NEGATIVE for Steroids - ${randomPositiveMessage}`;
  }
});

/** END STEROID TESTING STUFF */

// Race Over Button with Confirmation
endRaceButton.addEventListener("click", () => {
  const confirmEndRace = confirm(
    "Are you sure you want to end the race and proceed to drug testing?"
  );
  if (confirmEndRace) {
    moveRacersPhase.style.display = "none";
    drugTestingScene.style.display = "flex";

    // Hide selected card containers
    sprinterSelection.parentElement.style.display = "none";
    rollerSelection.parentElement.style.display = "none";
  }
});

class Card {
  constructor(value, type, symbols = []) {
    this.value = value;
    this.type = type || "MOVEMENT";
    this.symbols = symbols;
  }
}

class RacerDeck {
  constructor(cards, type) {
    this.drawPile = cards;
    this.recyclePile = [];
    this.discardPile = [];
    this.type = type;
  }

  draw() {
    // if less than 4 cards and recycle pile has cards, reshuffle
    if (this.drawPile.length < 4 && this.recyclePile.length > 0) {
      // set draw pile equaal to current elements plus shuffled recycle pile
      this.drawPile = [...this.drawPile, ...this.shuffle(this.recyclePile)];

      // reset recycle pile to empty
      this.recyclePile = [];
    }

    // remove top 4 cards and return
    const hand = this.drawPile.splice(0, 4);
    return hand;
  }

  shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  select(selectedCard, drawnCards) {
    const selectedIndex = drawnCards.indexOf(selectedCard);
    this.recyclePile.push(
      ...drawnCards.filter((card, index) => index !== selectedIndex)
    );
  }

  addExhaustion() {
    this.recyclePile.push(new Card(2, "EXHAUSTION", []));
  }

  removeExhaustion() {
    const removeIndex = this.recyclePile.findIndex(
      (card) => card.type === "EXHAUSTION"
    );
    this.recyclePile = this.recyclePile.filter(
      (card, index) => index !== removeIndex
    );
  }

  setDeckInfo(infoElement, exhaustElement) {
    infoElement.innerText = `Draw: ${this.drawPile.length}, Recycle: ${this.recyclePile.length}`;
    exhaustElement.innerText = `Exhaustion: ${this.getExhaustionCount()}`;
  }

  removeCards(cardValues) {
    for (const cardValue of cardValues) {
      const removeCardIndex = this.drawPile.findIndex(
        (card) => card.value === cardValue
      );
      this.drawPile = this.drawPile.filter(
        (card, index) => index !== removeCardIndex
      );
    }
  }

  getExhaustionCount() {
    const recycleExhaustCount = this.recyclePile.filter(
      (card) => card.type === "EXHAUSTION"
    ).length;
    const drawPileExhaustCount = this.drawPile.filter(
      (card) => card.type === "EXHAUSTION"
    ).length;
    return recycleExhaustCount + drawPileExhaustCount;
  }

  hasRecycledExhaustion() {
    return this.recyclePile.some((card) => card.type === "EXHAUSTION");
  }

  recoverOneExhaustion() {
    const exhaustionIndex = this.recyclePile.findIndex(
      (card) => card.type === "EXHAUSTION"
    );
    if (exhaustionIndex !== -1) {
      this.recyclePile.splice(exhaustionIndex, 1);
      return true;
    }
    return false;
  }
}

function reset() {
  // Clear localStorage
  clearGameState();

  gameStatus.style.color = "orange";
  sprinterSelection.innerHTML = "";
  rollerSelection.innerHTML = "";
  drawCardPhase.style.display = "flex"; // Update to 'flex'
  moveRacersPhase.style.display = "none";
  drugTestingScene.style.display = "none";

  // Clear recovery messages
  const recoveryMessagesDiv = document.getElementById("recoveryMessages");
  if (recoveryMessagesDiv) {
    recoveryMessagesDiv.innerHTML = "";
  }

  sprinterSelection.parentElement.style.display = "flex";
  rollerSelection.parentElement.style.display = "flex";

  // Enable all buttons
  drawSprinterButton.disabled = false;
  drawRollerButton.disabled = false;
  exhaustSprinterButton.disabled = false;
  exhaustRollerButton.disabled = false;
  exhaustSprinter2.disabled = false;
  exhaustRoller2.disabled = false;

  // resets drug scene
  rollerTestResultMessage.textContent = "";
  sprinterTestResultMessage.textContent = "";
  runSprinterTestButton.style.display = "none";
  runRollerTestButton.style.display = "none";
  checkSprinterTestButton.disabled = false;
  runSprinterTestButton.disabled = false;
  checkRollerTestButton.disabled = false;
  runRollerTestButton.disabled = false;
  sprinterSteroidPointsUsed = 0;
  rollerSteroidPointsUsed = 0;

  // Show menu and hide main game
  mainGame.style.display = "none";
  pregameMenu.style.display = "flex"; // Update to 'flex'

  sprinterDeck = new RacerDeck(getSprinterDeck(), "Sprinter");
  sprinterDeck.shuffle(sprinterDeck.drawPile);
  rollerDeck = new RacerDeck(getRollerDeck(), "Roller");
  rollerDeck.shuffle(rollerDeck.drawPile);

  sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
  rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);

  // Update menu to show/hide continue button
  updateMenuButtons();
}

function getFakeCard() {
  const cardButton = document.createElement("BUTTON");
  cardButton.classList.add("cardButton");
  cardButton.innerText = 2;
  cardButton.classList.add("hide");
  return cardButton;
}

function getSprinterDeck() {
  return [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 9, 9, 9].map(
    (val) => new Card(val, "MOVEMENT", [])
  );
}

function getRollerDeck() {
  return [3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7].map(
    (val) => new Card(val, "MOVEMENT", [])
  );
}

function buildDeckForRider(riderType, specialistKey) {
  let baseDeck = riderType === "SPRINTER" ? getSprinterDeck() : getRollerDeck();

  if (!specialistKey || specialistKey === "") {
    return baseDeck;
  }

  const specialist = SPECIALISTS[specialistKey];
  if (!specialist) {
    return baseDeck;
  }

  // Remove cards
  for (const valueToRemove of specialist.remove) {
    const removeIndex = baseDeck.findIndex(
      (card) => card.value === valueToRemove
    );
    if (removeIndex !== -1) {
      baseDeck.splice(removeIndex, 1);
    }
  }

  // Add cards with symbols
  for (const cardConfig of specialist.add) {
    const symbolPaths = cardConfig.symbols.map((key) => SYMBOLS[key]);
    baseDeck.push(new Card(cardConfig.value, cardConfig.type, symbolPaths));
  }

  return baseDeck;
}

function cardHasSymbol(card, symbolKey) {
  if (!card.symbols || card.symbols.length === 0) return false;
  const symbolPath = SYMBOLS[symbolKey];
  return card.symbols.includes(symbolPath);
}

function renderCardButton(card, overrideValue = null) {
  const cardButton = document.createElement("BUTTON");
  cardButton.classList.add("cardButton");

  const displayValue = overrideValue !== null ? overrideValue : card.value;

  const valueDiv = document.createElement("DIV");
  valueDiv.classList.add("cardValue");
  valueDiv.innerText = displayValue;

  if (card.type === "EXHAUSTION") {
    valueDiv.style.color = "#aa0000";
  }

  cardButton.appendChild(valueDiv);

  if (card.symbols && card.symbols.length > 0) {
    if (card.symbols[0]) {
      const leftImg = document.createElement("IMG");
      leftImg.classList.add("cardSymbol", "left");
      leftImg.src = card.symbols[0];
      leftImg.alt = "symbol";
      cardButton.appendChild(leftImg);
    }

    if (card.symbols[1]) {
      const rightImg = document.createElement("IMG");
      rightImg.classList.add("cardSymbol", "right");
      rightImg.src = card.symbols[1];
      rightImg.alt = "symbol";
      cardButton.appendChild(rightImg);
    }
  }

  return cardButton;
}

// Initialize menu buttons based on saved game
function updateMenuButtons() {
  const continueButton = document.getElementById("continueGameButton");
  if (hasSavedGame()) {
    continueButton.style.display = "block";
  } else {
    continueButton.style.display = "none";
  }
}

// Continue game from saved state
function continueGame() {
  const savedState = loadGameState();
  if (!savedState) return;

  // Restore game mode
  gameMode = savedState.gameMode;

  // Restore specialist selections
  sprinterSpecialistKey = savedState.sprinterSpecialistKey || "";
  rollerSpecialistKey = savedState.rollerSpecialistKey || "";

  // Restore decks
  sprinterDeck = new RacerDeck([], "Sprinter");
  sprinterDeck.drawPile = savedState.sprinterDeck.drawPile.map(
    (c) => new Card(c.value, c.type, c.symbols || [])
  );
  sprinterDeck.recyclePile = savedState.sprinterDeck.recyclePile.map(
    (c) => new Card(c.value, c.type, c.symbols || [])
  );
  sprinterDeck.discardPile = savedState.sprinterDeck.discardPile.map(
    (c) => new Card(c.value, c.type, c.symbols || [])
  );

  rollerDeck = new RacerDeck([], "Roller");
  rollerDeck.drawPile = savedState.rollerDeck.drawPile.map(
    (c) => new Card(c.value, c.type, c.symbols || [])
  );
  rollerDeck.recyclePile = savedState.rollerDeck.recyclePile.map(
    (c) => new Card(c.value, c.type, c.symbols || [])
  );
  rollerDeck.discardPile = savedState.rollerDeck.discardPile.map(
    (c) => new Card(c.value, c.type, c.symbols || [])
  );

  // Restore steroid points
  sprinterSteroidPointsUsed = savedState.sprinterSteroidPointsUsed;
  rollerSteroidPointsUsed = savedState.rollerSteroidPointsUsed;

  // Show/hide Race Over button based on game mode
  if (gameMode === "steroid") {
    endRaceButton.style.display = "block";
  } else {
    endRaceButton.style.display = "none";
  }

  // Update UI
  sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
  rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);

  // Reset to draw card phase (card selection step)
  drawCardPhase.style.display = "flex";
  moveRacersPhase.style.display = "none";
  cheatScene.style.display = "none";
  drugTestingScene.style.display = "none";

  // Reset card selections
  sprinterSelection.innerHTML = "";
  rollerSelection.innerHTML = "";
  sprinterSelection.parentElement.style.display = "flex";
  rollerSelection.parentElement.style.display = "flex";

  // Enable draw buttons
  drawSprinterButton.disabled = false;
  drawRollerButton.disabled = false;

  // Clear any card selection in progress
  cardSelectionDiv.innerHTML = "";

  // Reset selected cards
  selectedSprinterCard = null;
  selectedRollerCard = null;

  // Reset exhaustion button states for this turn
  exhaustSprinterButton.classList.remove("exhaustionAdded");
  exhaustRollerButton.classList.remove("exhaustionAdded");
  exhaustSprinter2.classList.remove("exhaustionAdded");
  exhaustRoller2.classList.remove("exhaustionAdded");

  // Clear recovery messages
  const recoveryMessagesDiv = document.getElementById("recoveryMessages");
  if (recoveryMessagesDiv) {
    recoveryMessagesDiv.innerHTML = "";
  }

  gameStatus.style.color = "orange";

  // Show game, hide menu
  mainGame.style.display = "block";
  pregameMenu.style.display = "none";
}

// Initialize on page load
function initializeFreshDecks() {
  sprinterDeck = new RacerDeck(getSprinterDeck(), "Sprinter");
  sprinterDeck.shuffle(sprinterDeck.drawPile);
  rollerDeck = new RacerDeck(getRollerDeck(), "Roller");
  rollerDeck.shuffle(rollerDeck.drawPile);

  sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
  rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);
}

// Check for saved game on page load and prompt user
window.addEventListener("DOMContentLoaded", () => {
  if (hasSavedGame()) {
    const continuePrompt = confirm(
      "You have an active game in progress.\n\n" +
        "OK = Continue your game\n" +
        "Cancel = Start fresh"
    );

    if (continuePrompt) {
      // Continue game - restore to draw card phase
      continueGame();
    } else {
      // Start fresh - clear storage and show menu
      clearGameState();
      initializeFreshDecks();
      updateMenuButtons();
    }
  } else {
    initializeFreshDecks();
    updateMenuButtons();
  }
});

// Shared function for card drawing and selection
function handleCardDraw(
  deck,
  deckInfo,
  exhaustInfo,
  selectionBox,
  selectedCardRef,
  drawButton,
  riderType
) {
  if (cardSelectionDiv.childElementCount === 0) {
    drawButton.classList.add("highlighted");

    const drawnCards = deck.draw();
    // Don't update deck info yet - wait until card is selected
    const drawnCardButtons = [];

    for (const drawnCard of drawnCards) {
      const cardButton = renderCardButton(drawnCard);
      drawnCardButtons.push(cardButton);

      cardButton.addEventListener("click", () => {
        if (!cardButton.classList.contains("highlightCard")) {
          // Remove highlight from all other buttons
          drawnCardButtons.forEach((button) =>
            button.classList.remove("highlightCard")
          );

          // Highlight the clicked button
          cardButton.classList.add("highlightCard");
        } else {
          // Deselect the button and finalize the selection
          cardButton.classList.remove("highlightCard");
          cardButton.disabled = true;

          // Update selection box
          selectionBox.innerHTML = "";
          const selectedCardDisplay = renderCardButton(drawnCard);
          selectedCardDisplay.disabled = true;
          selectionBox.appendChild(selectedCardDisplay);

          // Update the selected card reference
          if (riderType === "sprinter") {
            selectedSprinterCard = drawnCard;
          } else if (riderType === "roller") {
            selectedRollerCard = drawnCard;
          }

          // Recycle the unselected cards
          deck.select(drawnCard, drawnCards);
          deck.setDeckInfo(deckInfo, exhaustInfo);

          // Clear the selection area
          cardSelectionDiv.innerHTML = "";

          // Disable the draw button
          drawButton.classList.remove("highlighted");
          drawButton.disabled = true;

          // Don't save state yet - wait until both cards selected and move phase reached

          // Check if both cards are selected and advance
          if (selectedSprinterCard && selectedRollerCard) {
            checkForBoostScene();
          }
        }
      });

      cardSelectionDiv.appendChild(cardButton);
    }
  } else {
    alert("Illegal draw attempt!");
  }
}

// Setup listeners
drawSprinterButton.addEventListener("click", () => {
  handleCardDraw(
    sprinterDeck,
    sprinterDeckInfo,
    sprinterExhaustInfo,
    sprinterSelection,
    { value: selectedSprinterCard },
    drawSprinterButton,
    "sprinter"
  );
});

drawRollerButton.addEventListener("click", () => {
  handleCardDraw(
    rollerDeck,
    rollerDeckInfo,
    rollerExhaustInfo,
    rollerSelection,
    { value: selectedRollerCard },
    drawRollerButton,
    "roller"
  );
});

nextTurnButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (
      sprinterSelection.innerHTML !== "" &&
      rollerSelection.innerHTML !== ""
    ) {
      sprinterSelection.innerHTML = "";
      rollerSelection.innerHTML = "";
      sprinterSelection.parentElement.style.display = "flex";
      rollerSelection.parentElement.style.display = "flex";
      drawCardPhase.style.display = "flex"; // Update to 'flex'
      exhaustSprinterButton.classList.remove("exhaustionAdded");
      exhaustRollerButton.classList.remove("exhaustionAdded");
      exhaustSprinter2.classList.remove("exhaustionAdded");
      exhaustRoller2.classList.remove("exhaustionAdded");
      drawSprinterButton.disabled = false;
      drawRollerButton.disabled = false;

      // Clear recovery messages
      const recoveryMessagesDiv = document.getElementById("recoveryMessages");
      if (recoveryMessagesDiv) {
        recoveryMessagesDiv.innerHTML = "";
      }

      // resets drug scene
      rollerTestResultMessage.textContent = "";
      sprinterTestResultMessage.textContent = "";
      runSprinterTestButton.style.display = "none";
      runRollerTestButton.style.display = "none";
      checkSprinterTestButton.disabled = false;
      runSprinterTestButton.disabled = false;
      checkRollerTestButton.disabled = false;
      runRollerTestButton.disabled = false;

      gameStatus.style.color = "orange";
      moveRacersPhase.style.display = "none";
      drugTestingScene.style.display = "none";
    } else {
      alert("Select a card for both riders!");
    }
  });
});

exhaustSprinterButton.addEventListener("click", () => {
  if (exhaustSprinterButton.classList.contains("exhaustionAdded")) {
    exhaustSprinterButton.classList.remove("exhaustionAdded");
    sprinterDeck.removeExhaustion();
    sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
    saveGameState();
    return;
  }

  // add exhaustion
  sprinterDeck.addExhaustion();
  sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
  // hide button
  exhaustSprinterButton.classList.add("exhaustionAdded");
  saveGameState();
});

exhaustRollerButton.addEventListener("click", () => {
  if (exhaustRollerButton.classList.contains("exhaustionAdded")) {
    exhaustRollerButton.classList.remove("exhaustionAdded");
    rollerDeck.removeExhaustion();
    rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);
    saveGameState();
    return;
  }
  // add exhaustion
  rollerDeck.addExhaustion();
  rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);
  // hide button
  exhaustRollerButton.classList.add("exhaustionAdded");
  saveGameState();
});

// Reset Race Button with Confirmation
resetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const confirmReset = confirm(
      "Are you sure you want to reset the race? This will erase all progress."
    );
    if (confirmReset) {
      reset(); // Use existing reset function
    }
  });
});

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(setupForm);

  // Get selected game mode from radio buttons
  const selectedGameMode = document.querySelector(
    'input[name="gameMode"]:checked'
  );
  if (selectedGameMode) {
    gameMode = selectedGameMode.value;
  }

  // Show/hide Race Over button based on game mode
  if (gameMode === "steroid") {
    endRaceButton.style.display = "block";
  } else {
    endRaceButton.style.display = "none";
  }

  // Get specialist selections
  sprinterSpecialistKey = formData.get("sprinterSpecialist") || "";
  rollerSpecialistKey = formData.get("rouleurSpecialist") || "";

  // Build decks with specialists
  const sprinterCards = buildDeckForRider("SPRINTER", sprinterSpecialistKey);
  const rollerCards = buildDeckForRider("ROULEUR", rollerSpecialistKey);

  sprinterDeck = new RacerDeck(sprinterCards, "Sprinter");
  rollerDeck = new RacerDeck(rollerCards, "Roller");

  // Shuffle decks
  sprinterDeck.shuffle(sprinterDeck.drawPile);
  rollerDeck.shuffle(rollerDeck.drawPile);

  const addSprinterExhaustion = Number(formData.get("addSprinterExhaustion"));
  const addRollerExhaustion = Number(formData.get("addRollerExhaustion"));

  // Handle manual card removal (after specialist deck building)
  const removeFromSprinterStr = formData.get("removeFromSprinter").trim();
  const removeFromRollerStr = formData.get("removeFromRoller").trim();

  const removeFromSprinter = removeFromSprinterStr
    ? removeFromSprinterStr
        .split(",")
        .map((a) => Number(a))
        .filter((n) => !isNaN(n))
    : [];
  const removeFromRoller = removeFromRollerStr
    ? removeFromRollerStr
        .split(",")
        .map((a) => Number(a))
        .filter((n) => !isNaN(n))
    : [];

  for (let i = 0; i < addSprinterExhaustion; i++) sprinterDeck.addExhaustion();
  for (let i = 0; i < addRollerExhaustion; i++) rollerDeck.addExhaustion();

  sprinterDeck.removeCards(removeFromSprinter);
  rollerDeck.removeCards(removeFromRoller);

  sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
  rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);

  mainGame.style.display = "block";
  pregameMenu.style.display = "none";

  // Save initial game state
  saveGameState();
});

// Continue game button
const continueGameButton = document.getElementById("continueGameButton");
continueGameButton.addEventListener("click", () => {
  continueGame();
});

exhaustRoller2.addEventListener("click", () => {
  if (exhaustRoller2.classList.contains("exhaustionAdded")) {
    exhaustRoller2.classList.remove("exhaustionAdded");
    rollerDeck.removeExhaustion();
    rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);
    saveGameState();
    return;
  }
  // add exhaustion
  rollerDeck.addExhaustion();
  rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);
  // hide button
  exhaustRoller2.classList.add("exhaustionAdded");
  saveGameState();
});

exhaustSprinter2.addEventListener("click", () => {
  if (exhaustSprinter2.classList.contains("exhaustionAdded")) {
    exhaustSprinter2.classList.remove("exhaustionAdded");
    sprinterDeck.removeExhaustion();
    sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
    saveGameState();
    return;
  }
  // add exhaustion
  sprinterDeck.addExhaustion();
  sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
  // hide button
  exhaustSprinter2.classList.add("exhaustionAdded");
  saveGameState();
});

function checkForBoostScene() {
  if (
    selectedSprinterCard &&
    selectedRollerCard &&
    !sprinterSelection.firstChild.classList.contains("hide") &&
    !rollerSelection.firstChild.classList.contains("hide")
  ) {
    // Process Recovery before showing boost scene or moving to move phase
    processRecovery();

    // Only show boost scene if game mode is "steroid"
    if (gameMode === "steroid") {
      const sprinterIsExhaustion =
        selectedSprinterCard.value === 2 &&
        selectedSprinterCard.type === "EXHAUSTION" &&
        sprinterSteroidPointsUsed < steroidPointsPerRider;

      const rollerIsExhaustion =
        selectedRollerCard.value === 2 &&
        selectedRollerCard.type === "EXHAUSTION" &&
        rollerSteroidPointsUsed < steroidPointsPerRider;

      if (sprinterIsExhaustion || rollerIsExhaustion) {
        handleBoostSelection(selectedSprinterCard, "sprinter");
        handleBoostSelection(selectedRollerCard, "roller");
        cheatScene.style.display = "flex"; // Update to 'flex'
        drawCardPhase.style.display = "none";
      } else {
        proceedToMoveRiders();
      }
    } else {
      // In standard mode, skip boost scene entirely
      proceedToMoveRiders();
    }
  }
}

function processRecovery() {
  const recoveryMessagesDiv = document.getElementById("recoveryMessages");
  const messages = [];

  // Check Sprinter for Recovery
  if (cardHasSymbol(selectedSprinterCard, "RECOVERY")) {
    if (sprinterDeck.recoverOneExhaustion()) {
      messages.push("Sprinter: Recovery removed 1 Exhaustion from recycle.");
      sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
    } else {
      messages.push("Sprinter: Recovery found no Exhaustion to remove.");
    }
  }

  // Check Rouleur for Recovery
  if (cardHasSymbol(selectedRollerCard, "RECOVERY")) {
    if (rollerDeck.recoverOneExhaustion()) {
      messages.push("Rouleur: Recovery removed 1 Exhaustion from recycle.");
      rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);
    } else {
      messages.push("Rouleur: Recovery found no Exhaustion to remove.");
    }
  }

  // Display messages
  if (messages.length > 0) {
    recoveryMessagesDiv.innerHTML = messages.join("<br>");
  } else {
    recoveryMessagesDiv.innerHTML = "";
  }

  // Don't save state here - will save when reaching move phase
}

function proceedToMoveRiders() {
  cheatScene.style.display = "none";
  confirmBoost.innerText = "Ride Clean";
  document.querySelectorAll(".boostButton").forEach((btn) => {
    btn.classList.remove("highlighted");
  });

  document.getElementById("sprinterBoost").style.display = "none";
  document.getElementById("rollerBoost").style.display = "none";

  drawCardPhase.style.display = "none";
  moveRacersPhase.style.display = "flex";
  gameStatus2Text.style.display = "flex";
  gameStatus.style.color = "gray";

  // Move selected cards to discard pile before clearing
  if (selectedSprinterCard) {
    sprinterDeck.discardPile.push(selectedSprinterCard);
  }
  if (selectedRollerCard) {
    rollerDeck.discardPile.push(selectedRollerCard);
  }

  selectedSprinterCard = null;
  selectedRollerCard = null;

  // Save game state now that round is complete
  saveGameState();
}

// ============================================
// REFRESH PHASE FUNCTIONALITY
// ============================================

let refreshPhaseState = {
  currentRacer: null, // 'sprinter' or 'roller'
  sprinterDone: false,
  rollerDone: false,
  sprinterMaxEnergy: 24,
  rollerMaxEnergy: 24,
  sprinterSelectedCards: [],
  rollerSelectedCards: [],
  sprinterCurrentEnergy: 0,
  rollerCurrentEnergy: 0,
};

// Get HTML elements for Refresh Phase
const refreshPhaseButton = document.getElementById("refreshPhaseButton");
const refreshPhaseScreen = document.getElementById("refreshPhaseScreen");
const refreshSprinterButton = document.getElementById("refreshSprinterButton");
const refreshRollerButton = document.getElementById("refreshRollerButton");
const refreshCardInterface = document.getElementById("refreshCardInterface");
const refreshTokenQuestion = document.getElementById("refreshTokenQuestion");
const hasTokenYes = document.getElementById("hasTokenYes");
const hasTokenNo = document.getElementById("hasTokenNo");
const refreshEnergyCounter = document.getElementById("refreshEnergyCounter");
const refreshEnergyValue = document.getElementById("refreshEnergyValue");
const refreshEnergyMax = document.getElementById("refreshEnergyMax");
const refreshDiscardedSection = document.getElementById(
  "refreshDiscardedSection"
);
const refreshDiscardedCards = document.getElementById("refreshDiscardedCards");
const refreshSelectedSection = document.getElementById(
  "refreshSelectedSection"
);
const refreshSelectedCards = document.getElementById("refreshSelectedCards");
const refreshConfirmSection = document.getElementById("refreshConfirmSection");
const confirmRefreshRacer = document.getElementById("confirmRefreshRacer");
const refreshCompleteSection = document.getElementById(
  "refreshCompleteSection"
);
const returnToRaceButton = document.getElementById("returnToRaceButton");
const refreshCurrentRacer = document.getElementById("refreshCurrentRacer");
const refreshRacerSelection = document.getElementById("refreshRacerSelection");

// Initialize Refresh Phase
refreshPhaseButton.addEventListener("click", () => {
  const confirmed = confirm(
    "Start Refresh Phase? This allows you to retrieve discarded cards back to your draw pile (max 24 energy per racer, or 25 if they have the Refresh token)."
  );

  if (!confirmed) return;

  // Reset refresh phase state
  refreshPhaseState = {
    currentRacer: null,
    sprinterDone: false,
    rollerDone: false,
    sprinterMaxEnergy: 24,
    rollerMaxEnergy: 24,
    sprinterSelectedCards: [],
    rollerSelectedCards: [],
    sprinterCurrentEnergy: 0,
    rollerCurrentEnergy: 0,
  };

  // Hide move racers phase and chosen cards, show refresh phase screen
  moveRacersPhase.style.display = "none";
  document.querySelector(".chosenCards").style.display = "none";
  refreshPhaseScreen.style.display = "block";

  // Show racer selection, hide other sections
  refreshRacerSelection.style.display = "block";
  refreshCardInterface.style.display = "none";
  refreshCompleteSection.style.display = "none";

  // Update button states
  updateRefreshRacerButtons();
});

function updateRefreshRacerButtons() {
  if (refreshPhaseState.sprinterDone) {
    refreshSprinterButton.disabled = true;
    refreshSprinterButton.textContent = "Sprinter ✓";
  } else {
    refreshSprinterButton.disabled = false;
    refreshSprinterButton.textContent = "Refresh Sprinter";
  }

  if (refreshPhaseState.rollerDone) {
    refreshRollerButton.disabled = true;
    refreshRollerButton.textContent = "Rouleur ✓";
  } else {
    refreshRollerButton.disabled = false;
    refreshRollerButton.textContent = "Refresh Rouleur";
  }
}

// Start refreshing a specific racer
refreshSprinterButton.addEventListener("click", () => {
  startRefreshForRacer("sprinter");
});

refreshRollerButton.addEventListener("click", () => {
  startRefreshForRacer("roller");
});

function startRefreshForRacer(racer) {
  refreshPhaseState.currentRacer = racer;

  // Hide racer selection, show card interface
  refreshRacerSelection.style.display = "none";
  refreshCardInterface.style.display = "block";

  // Update header
  refreshCurrentRacer.textContent =
    racer === "sprinter" ? "Sprinter" : "Rouleur";

  // Show token question, hide other sections
  refreshTokenQuestion.style.display = "block";
  refreshEnergyCounter.style.display = "none";
  refreshDiscardedSection.style.display = "none";
  refreshSelectedSection.style.display = "none";
  refreshConfirmSection.style.display = "none";
}

// Handle token question
hasTokenYes.addEventListener("click", () => {
  setMaxEnergyAndShowCards(25);
});

hasTokenNo.addEventListener("click", () => {
  setMaxEnergyAndShowCards(24);
});

function setMaxEnergyAndShowCards(maxEnergy) {
  const racer = refreshPhaseState.currentRacer;

  if (racer === "sprinter") {
    refreshPhaseState.sprinterMaxEnergy = maxEnergy;
  } else {
    refreshPhaseState.rollerMaxEnergy = maxEnergy;
  }

  // Hide token question
  refreshTokenQuestion.style.display = "none";

  // Show energy counter and card sections
  refreshEnergyCounter.style.display = "block";
  refreshDiscardedSection.style.display = "block";
  refreshSelectedSection.style.display = "block";
  refreshConfirmSection.style.display = "block";

  // Update energy display
  refreshEnergyMax.textContent = maxEnergy;
  updateRefreshEnergyDisplay();

  // Display discarded cards
  displayRefreshDiscardedCards();
  displayRefreshSelectedCards();
}

function displayRefreshDiscardedCards() {
  const racer = refreshPhaseState.currentRacer;
  const deck = racer === "sprinter" ? sprinterDeck : rollerDeck;
  const selectedCards =
    racer === "sprinter"
      ? refreshPhaseState.sprinterSelectedCards
      : refreshPhaseState.rollerSelectedCards;

  // Get discarded cards (not in draw or recycle pile, and not exhaustion)
  const discardedCards = deck.discardPile.filter(
    (card) => card.type !== "EXHAUSTION" && !selectedCards.includes(card)
  );

  // Sort by value (highest to lowest)
  discardedCards.sort((a, b) => b.value - a.value);

  // Clear and populate
  refreshDiscardedCards.innerHTML = "";

  if (discardedCards.length === 0) {
    refreshDiscardedCards.innerHTML =
      "<p style='text-align: center; color: gray;'>No cards available to refresh</p>";
    return;
  }

  discardedCards.forEach((card) => {
    const cardDiv = renderCardButton(card);
    cardDiv.addEventListener("click", () => addCardToRefresh(card));
    refreshDiscardedCards.appendChild(cardDiv);
  });
}

function displayRefreshSelectedCards() {
  const racer = refreshPhaseState.currentRacer;
  const selectedCards =
    racer === "sprinter"
      ? refreshPhaseState.sprinterSelectedCards
      : refreshPhaseState.rollerSelectedCards;

  // Clear and populate
  refreshSelectedCards.innerHTML = "";

  if (selectedCards.length === 0) {
    refreshSelectedCards.innerHTML =
      "<p style='text-align: center; color: gray;'>No cards selected yet</p>";
    return;
  }

  selectedCards.forEach((card) => {
    const cardDiv = renderCardButton(card);
    cardDiv.addEventListener("click", () => removeCardFromRefresh(card));
    refreshSelectedCards.appendChild(cardDiv);
  });
}

function addCardToRefresh(card) {
  const racer = refreshPhaseState.currentRacer;
  const maxEnergy =
    racer === "sprinter"
      ? refreshPhaseState.sprinterMaxEnergy
      : refreshPhaseState.rollerMaxEnergy;
  const currentEnergy =
    racer === "sprinter"
      ? refreshPhaseState.sprinterCurrentEnergy
      : refreshPhaseState.rollerCurrentEnergy;

  // Check if adding this card would exceed max energy
  if (currentEnergy + card.value > maxEnergy) {
    alert(
      `Cannot add this card. It would exceed the maximum energy of ${maxEnergy}.`
    );
    return;
  }

  // Add card to selected
  if (racer === "sprinter") {
    refreshPhaseState.sprinterSelectedCards.push(card);
    refreshPhaseState.sprinterCurrentEnergy += card.value;
  } else {
    refreshPhaseState.rollerSelectedCards.push(card);
    refreshPhaseState.rollerCurrentEnergy += card.value;
  }

  // Update displays
  updateRefreshEnergyDisplay();
  displayRefreshDiscardedCards();
  displayRefreshSelectedCards();
}

function removeCardFromRefresh(card) {
  const racer = refreshPhaseState.currentRacer;

  // Remove card from selected
  if (racer === "sprinter") {
    const index = refreshPhaseState.sprinterSelectedCards.indexOf(card);
    if (index > -1) {
      refreshPhaseState.sprinterSelectedCards.splice(index, 1);
      refreshPhaseState.sprinterCurrentEnergy -= card.value;
    }
  } else {
    const index = refreshPhaseState.rollerSelectedCards.indexOf(card);
    if (index > -1) {
      refreshPhaseState.rollerSelectedCards.splice(index, 1);
      refreshPhaseState.rollerCurrentEnergy -= card.value;
    }
  }

  // Update displays
  updateRefreshEnergyDisplay();
  displayRefreshDiscardedCards();
  displayRefreshSelectedCards();
}

function updateRefreshEnergyDisplay() {
  const racer = refreshPhaseState.currentRacer;
  const currentEnergy =
    racer === "sprinter"
      ? refreshPhaseState.sprinterCurrentEnergy
      : refreshPhaseState.rollerCurrentEnergy;
  refreshEnergyValue.textContent = currentEnergy;
}

// Confirm cards for current racer
confirmRefreshRacer.addEventListener("click", () => {
  const racer = refreshPhaseState.currentRacer;

  // Mark this racer as done
  if (racer === "sprinter") {
    refreshPhaseState.sprinterDone = true;
  } else {
    refreshPhaseState.rollerDone = true;
  }

  // Check if both racers are done
  if (refreshPhaseState.sprinterDone && refreshPhaseState.rollerDone) {
    // Show complete section
    refreshCardInterface.style.display = "none";
    refreshCompleteSection.style.display = "block";
  } else {
    // Go back to racer selection
    refreshCardInterface.style.display = "none";
    refreshRacerSelection.style.display = "block";
    updateRefreshRacerButtons();
  }
});

// Return to race - apply the refresh
returnToRaceButton.addEventListener("click", () => {
  // Move selected cards from discard pile to draw pile for sprinter
  if (refreshPhaseState.sprinterSelectedCards.length > 0) {
    refreshPhaseState.sprinterSelectedCards.forEach((card) => {
      const index = sprinterDeck.discardPile.indexOf(card);
      if (index > -1) {
        sprinterDeck.discardPile.splice(index, 1);
        sprinterDeck.drawPile.push(card);
      }
    });
  }

  // Move selected cards from discard pile to draw pile for roller
  if (refreshPhaseState.rollerSelectedCards.length > 0) {
    refreshPhaseState.rollerSelectedCards.forEach((card) => {
      const index = rollerDeck.discardPile.indexOf(card);
      if (index > -1) {
        rollerDeck.discardPile.splice(index, 1);
        rollerDeck.drawPile.push(card);
      }
    });
  }

  // Move all recycle pile cards to draw pile and shuffle for both decks
  sprinterDeck.drawPile = sprinterDeck.drawPile.concat(
    sprinterDeck.recyclePile
  );
  sprinterDeck.recyclePile = [];
  sprinterDeck.shuffle(sprinterDeck.drawPile);

  rollerDeck.drawPile = rollerDeck.drawPile.concat(rollerDeck.recyclePile);
  rollerDeck.recyclePile = [];
  rollerDeck.shuffle(rollerDeck.drawPile);

  // Update deck info displays
  sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
  rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);

  // Save game state
  saveGameState();

  // Return to card selection phase (start next turn)
  refreshPhaseScreen.style.display = "none";
  moveRacersPhase.style.display = "none";
  drawCardPhase.style.display = "flex";
  gameStatus.style.color = "orange";

  // Clear any previous selections
  sprinterSelection.innerHTML = "";
  rollerSelection.innerHTML = "";
  sprinterSelection.parentElement.style.display = "flex";
  rollerSelection.parentElement.style.display = "flex";
  document.querySelector(".chosenCards").style.display = "flex";

  // Enable draw buttons
  drawSprinterButton.disabled = false;
  drawRollerButton.disabled = false;
});
