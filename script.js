const gridContainer = document.querySelector(".grid-container");
const attemptCount = document.querySelector("#attempts");
const subtitle = document.querySelector("#subtitle");
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

createCard(cardCount, numArray);

const cardGrid = document.querySelectorAll(".card-inner");

//Card ID and selected cards arrays
let cardID = [];
let selectedCards = [];

let attempts = 5;
let matches = 0;

//Pushes selected card object and it's id into the arrays
function selectCard(card) {
  cardID.push(card.id);
  selectedCards.push(card);

  card.classList.add("active");
  card.classList.add("rotate");
}

cardGrid.forEach((card) => {
  card.addEventListener("click", () => {
    selectCard(card);

    //If 2 cards are selected
    if (cardID.length === 2) {
      //If both card's ids match
      if (cardID[0] === cardID[1]) {
        matches++;
        console.log(`${matches} cards matched!`);
        if (matches === cardCount / 2) {
          subtitle.innerText = "You win!";
          subtitle.style.color = "rgb(153, 255, 162)";
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
          subtitle.innerText = "You lose!";
          subtitle.style.color = "rgb(255, 109, 109)";

          //Show every card and disable them
          cardGrid.forEach((poop) => {
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
