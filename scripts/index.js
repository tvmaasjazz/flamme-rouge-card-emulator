let sprinterDeck = {};
let rollerDeck = {};

let selectedSprinterCard = null;
let selectedRollerCard = null;

let gameMode = "standard"; // Track current game mode: "standard" or "steroid"

// LocalStorage functions
const GAME_STATE_KEY = "flammeRougeGameState";

function saveGameState() {
  const gameState = {
    gameMode,
    sprinterDeck: {
      drawPile: sprinterDeck.drawPile,
      recyclePile: sprinterDeck.recyclePile,
      discardPile: sprinterDeck.discardPile,
      type: sprinterDeck.type
    },
    rollerDeck: {
      drawPile: rollerDeck.drawPile,
      recyclePile: rollerDeck.recyclePile,
      discardPile: rollerDeck.discardPile,
      type: rollerDeck.type
    },
    sprinterSteroidPointsUsed,
    rollerSteroidPointsUsed,
    gameActive: true
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
  constructor(value, type) {
    this.value = value;
    this.type = type || "MOVEMENT";
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
    const selectedIndex = drawnCards.findIndex(
      (card) => card.value === selectedCard.value
    );
    this.recyclePile.push(
      ...drawnCards.filter((card, index) => index !== selectedIndex)
    );
  }

  addExhaustion() {
    this.recyclePile.push(new Card(2, "EXHAUSTION"));
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
    (val) => new Card(val)
  );
}

function getRollerDeck() {
  return [3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7].map(
    (val) => new Card(val)
  );
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
  
  // Restore decks
  sprinterDeck = new RacerDeck([], "Sprinter");
  sprinterDeck.drawPile = savedState.sprinterDeck.drawPile.map(c => new Card(c.value, c.type));
  sprinterDeck.recyclePile = savedState.sprinterDeck.recyclePile.map(c => new Card(c.value, c.type));
  sprinterDeck.discardPile = savedState.sprinterDeck.discardPile.map(c => new Card(c.value, c.type));
  
  rollerDeck = new RacerDeck([], "Roller");
  rollerDeck.drawPile = savedState.rollerDeck.drawPile.map(c => new Card(c.value, c.type));
  rollerDeck.recyclePile = savedState.rollerDeck.recyclePile.map(c => new Card(c.value, c.type));
  rollerDeck.discardPile = savedState.rollerDeck.discardPile.map(c => new Card(c.value, c.type));
  
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
  
  // Show game, hide menu
  mainGame.style.display = "block";
  pregameMenu.style.display = "none";
}

// Initialize on page load
if (!hasSavedGame()) {
  // Only initialize fresh decks if no saved game exists
  sprinterDeck = new RacerDeck(getSprinterDeck(), "Sprinter");
  sprinterDeck.shuffle(sprinterDeck.drawPile);
  rollerDeck = new RacerDeck(getRollerDeck(), "Roller");
  rollerDeck.shuffle(rollerDeck.drawPile);
  
  sprinterDeck.setDeckInfo(sprinterDeckInfo, sprinterExhaustInfo);
  rollerDeck.setDeckInfo(rollerDeckInfo, rollerExhaustInfo);
}
updateMenuButtons();

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
    deck.setDeckInfo(deckInfo, exhaustInfo);
    const drawnCardButtons = [];

    for (const drawnCard of drawnCards) {
      const cardButton = document.createElement("BUTTON");
      cardButton.classList.add("cardButton");
      drawnCardButtons.push(cardButton);

      cardButton.innerText = drawnCard.value;
      if (drawnCard.type === "EXHAUSTION") {
        cardButton.style.color = "#aa0000";
      }

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
          selectionBox.appendChild(cardButton);

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

          // Save game state after card selection
          saveGameState();

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
  const selectedGameMode = document.querySelector('input[name="gameMode"]:checked');
  if (selectedGameMode) {
    gameMode = selectedGameMode.value;
  }

  // Show/hide Race Over button based on game mode
  if (gameMode === "steroid") {
    endRaceButton.style.display = "block";
  } else {
    endRaceButton.style.display = "none";
  }

  const addSprinterExhaustion = Number(formData.get("addSprinterExhaustion"));
  const addRollerExhaustion = Number(formData.get("addRollerExhaustion"));
  const removeFromSprinter = formData
    .get("removeFromSprinter")
    .split(",")
    .map((a) => Number(a));
  const removeFromRoller = formData
    .get("removeFromRoller")
    .split(",")
    .map((a) => Number(a));

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

  selectedSprinterCard = null;
  selectedRollerCard = null;
}
