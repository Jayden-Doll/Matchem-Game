const gridContainer = document.querySelector(".grid-container");
const attemptCount = document.querySelector("#attempts");
const subtitle = document.querySelector("#subtitle");
const startScreen = document.querySelector("#menu");
const startButton = document.querySelector("#btn-start");
const popup = document.querySelector("#popup-container");
const overlay = document.querySelector("#overlay");
const message = document.querySelector("#popup-message");
const restartButton = document.querySelector("#btn-restart");
const toMenuButton = document.querySelector("#btn-to-menu");

startButton.addEventListener("click", () => {
  startScreen.classList.remove("menu-show");
  startScreen.classList.add("menu-hide");
});

attemptCount.innerText = 5;

//Amount of cards to be created
let cardCount = 12;
//Array of possible id numbers for matching the cards
let numArray = [];

//Generates 2 sets of matching numbers depending on the cardCount
function generateNumArray(cardCount) {
  cardCount /= 2;
  for (i = 1; i < cardCount + 1; i++) {
    numArray.push(i);
    numArray.push(i);
  }
}

generateNumArray(cardCount);

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let k = array[i];
    array[i] = array[j];
    array[j] = k;
  }
}

shuffleArray(numArray);

console.log("Initial Num Array", numArray);

function createCard(cardCount) {
  for (let i = 0; i < cardCount; i++) {
    const cardBody = document.createElement("div");
    const innerCard = document.createElement("div");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");
    const cardImage = document.createElement("img");

    gridContainer.appendChild(cardBody).classList.add("grid-card");
    cardBody.appendChild(innerCard).classList.add("card-inner");
    innerCard.appendChild(cardFront).classList.add("card-front");
    innerCard.appendChild(cardBack).classList.add("card-back");
    cardBack.appendChild(cardImage);

    const randNum = numArray.pop();

    innerCard.id = randNum;
    cardImage.src = `./imgs/${randNum}.png`;
  }
}

createCard(cardCount);

console.log("Initial Num Array", numArray);

const cardGrid = document.querySelectorAll(".card-inner");

//Card ID and selected cards arrays
let cardID = [];
let selectedCards = [];

let attempts = 5;
let matches = 0;

function removeCards() {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
}

function resetGame() {
  const newCardGrid = document.querySelectorAll(".card-inner");
  if (newCardGrid) {
    newCardGrid.forEach((card) => {
      card.classList.remove("rotate", "active", "matched", "disabled");
    });
  }

  popup.classList.add("popup-hidden");
  overlay.classList.add("overlay-hidden");

  cardGrid.forEach((card) => {
    card.classList.remove("rotate", "active", "matched", "disabled");
  });

  setTimeout(() => {
    attemptCount.innerText = 5;
    attempts = 5;
    matches = 0;

    removeCards();

    generateNumArray(cardCount);
    shuffleArray(numArray);
    console.log(
      "Try again num array",
      numArray,
      cardCount,
      cardID,
      attempts,
      matches
    );

    createCard(cardCount);
    const newCardGrid = document.querySelectorAll(".card-inner");
    runGameLogic(newCardGrid);
  }, 400);
}

restartButton.addEventListener("click", () => {
  resetGame();
});

toMenuButton.addEventListener("click", () => {
  resetGame();
  startScreen.classList.remove("menu-hide");
  startScreen.classList.add("menu-show");
});

//Pushes selected card object and it's id into the arrays

function runGameLogic(grid) {
  function selectCard(card) {
    cardID.push(card.id);
    selectedCards.push(card);

    card.classList.add("active");
    card.classList.add("rotate");
  }

  grid.forEach((card) => {
    card.addEventListener("click", () => {
      console.log(true);
      selectCard(card);

      //If 2 cards are selected
      if (cardID.length === 2) {
        //If both card's ids match
        if (cardID[0] === cardID[1]) {
          matches++;
          console.log(`${matches} cards matched!`);
          if (matches === cardCount / 2) {
            message.innerText = "You Win!";
            message.style.color = "rgb(52, 193, 63)";
            popup.classList.remove("popup-hidden");
            overlay.classList.remove("overlay-hidden");
          }

          for (const cards of selectedCards) {
            cards.classList.add("matched");
            cards.classList.remove("active");

            //Empty both arrays
            cardID = [];
            selectedCards = [];
          }
        } else {
          attempts--;
          attemptCount.innerText = `${attempts}`;

          if (attempts === 0) {
            message.innerText = "You Lose.";
            message.style.color = "rgb(193, 52, 52)";
            popup.classList.remove("popup-hidden");
            overlay.classList.remove("overlay-hidden");

            //Show every card and disable them
            grid.forEach((poop) => {
              poop.classList.add("disabled", "rotate");
              setTimeout(() => {
                poop.classList.add("disabled", "rotate");
              }, 1001);
            });
          }

          //Add disabled class, and rotate cards back after a second
          for (const cards of selectedCards) {
            cards.classList.remove("active");
            cards.classList.add("disabled");

            setTimeout(() => {
              cards.classList.remove("rotate");
              cards.classList.remove("disabled");
            }, 1000);

            //Empty both arrays
            cardID = [];
            selectedCards = [];
          }
        }
      }
    });
  });
}

runGameLogic(cardGrid);
