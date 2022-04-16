//Global Variables
const gridContainer = document.querySelector(".grid-container");
const attemptCount = document.querySelector("#attempts");
const subtitle = document.querySelector("#subtitle");
const startScreen = document.querySelector("#menu");
const startButton = document.querySelector("#btn-start");
const popup = document.querySelector("#popup-container");
const overlay = document.querySelector("#overlay");
const message = document.querySelector("#popup-message");
const restartButton = document.querySelector("#btn-restart");
const toMenuButton = document.querySelectorAll(".btn-to-menu");
const buttonOptions = document.querySelectorAll(".btn-option");
const boardSizeOptions = document.querySelectorAll(".btn-option");
const boardOptionSmall = document.querySelector("#btn-12");
const boardOptionMedium = document.querySelector("#btn-24");
const boardOptionLarge = document.querySelector("#btn-36");
const themeOptions = document.querySelectorAll(".btn-theme");
const pawPatrolThemeButton = document.querySelector("#pawpatroltheme");
const minecraftThemeButton = document.querySelector("#minecrafttheme");
const spongebobThemeButton = document.querySelector("#spongebobtheme");
const flipSound = new Audio("./sounds/card-flip.mp3");
const flipSuccessSound = new Audio("./sounds/card-match.mp3");
const flipFailSound = new Audio("./sounds/card-fail.mp3");
const soundButton = document.querySelector(".sound");
const sounds = [flipSound, flipFailSound, flipSuccessSound];

//Board Size Varibales
let smBoard = 12;
let mdBoard = 24;
let lgBoard = 36;

//Set Array to Empty
let numArray = [];
let cardID = [];
let selectedCards = [];

let matches = 0;

//Function Definitions

//Hides Menu
function hideMenu() {
  startScreen.classList.remove("menu-show");
  startScreen.classList.add("menu-hide");
}

//Shows Menu
function showMenu() {
  startScreen.classList.remove("menu-hide");
  startScreen.classList.add("menu-show");
}

//Hides Modal
function hidePopup() {
  popup.classList.add("popup-hidden");
  overlay.classList.add("overlay-hidden");
}

//Shows Modal
function showPopup() {
  popup.classList.remove("popup-hidden");
  overlay.classList.remove("overlay-hidden");
}

//Removes the cards from the grid
function removeCards() {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
}

//Removes the grid entirely
function removeGrid() {
  document.querySelector(".grid").remove();
}

//Back to menu restart logic
function backToMenu() {
  showMenu();

  //Unselect board size buttons
  buttonOptions.forEach((option) => {
    option.classList.remove("option-selected");
  });

  //Unselect theme buttons
  themeOptions.forEach((option) => {
    option.classList.remove("theme-selected");
    option.classList.replace("theme-active", "theme-inactive");
  });

  //Disable board size buttons
  boardSizeOptions.forEach((option) => {
    option.setAttribute("disabled", "");
  });

  //Disable Start button
  startButton.setAttribute("disabled", "");

  //after half a second, remove grid and reset variables
  setTimeout(() => {
    removeGrid();
    numArray = [];
    cardID = [];
    selectedCards = [];

    matches = 0;
  }, 500);
}

//Generates a number array half of the board size with 2 sets of each number
function generateNumArray(boardSize) {
  boardSize /= 2;
  for (i = 1; i < boardSize + 1; i++) {
    numArray.push(i);
    numArray.push(i);
  }
}

//Shuffles the numbers in the array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let k = array[i];
    array[i] = array[j];
    array[j] = k;
  }
}

//Creates a grid based off the number array and theme selected
function createGrid(boardSize) {
  //Create Grid
  const gridContainer = document.createElement("div");

  //Create cards
  for (let i = 0; i < boardSize; i++) {
    const cardBody = document.createElement("div");
    const innerCard = document.createElement("div");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");
    const cardImage = document.createElement("img");

    //Apply needed classes
    document.body
      .appendChild(gridContainer)
      .classList.add("grid-container", "grid");
    boardSize === smBoard ? gridContainer.classList.add("grid-12") : false;
    boardSize === mdBoard ? gridContainer.classList.add("grid-24") : false;
    boardSize === lgBoard ? gridContainer.classList.add("grid-36") : false;
    gridContainer.appendChild(cardBody).classList.add("grid-card");
    cardBody.appendChild(innerCard).classList.add("card-inner");
    innerCard.appendChild(cardFront).classList.add("card-front");
    innerCard.appendChild(cardBack).classList.add("card-back");
    cardBack.appendChild(cardImage);

    //Get a random number from the array then remove it
    const randNum = numArray.pop();

    //Set the id of each card to a random number
    innerCard.id = randNum;

    //Styling when each themes are selected
    if (pawPatrolThemeButton.classList.contains("theme-active")) {
      cardImage.src = `./pawpatrol-imgs/${randNum}.png`;
      cardFront.style.backgroundImage =
        "url('../card-backs/pawpatrollogo.png'), radial-gradient(circle, rgba(255,214,185,1) 0%, rgba(220,86,0,1) 77%)";
      cardFront.style.backgroundSize = "140%";
      document.body.style.backgroundImage = "url('../bg-imgs/pawpatrolbg.png')";
    }

    if (minecraftThemeButton.classList.contains("theme-active")) {
      cardImage.src = `./minecraft-imgs/${randNum}.png`;
      cardFront.style.backgroundImage =
        "url('../card-backs/minecraft.png'), radial-gradient(circle, rgba(190,255,185,1) 0%, rgba(4,152,0,1) 77%)";
      cardFront.style.backgroundSize = "90%, cover";
      document.body.style.backgroundImage = "url('../bg-imgs/minecraftbg.png')";
    }

    if (spongebobThemeButton.classList.contains("theme-active")) {
      cardImage.src = `./spongebob-imgs/${randNum}.png`;
      cardFront.style.backgroundImage =
        "url('../card-backs/spongebob.png'), radial-gradient(circle, rgba(255,251,141,1) 0%, rgba(186,170,0,1) 77%)";
      cardFront.style.backgroundSize = "90%, cover";
      document.body.style.backgroundImage = "url('../bg-imgs/spongebobbg.png')";
    }
  }
}

function runGameLogic(grid, boardSize) {
  //Create attempts variable with no value
  let attempts;
  //Board size conditions
  boardSize === smBoard ? (attempts = 5) : false;
  boardSize === mdBoard ? (attempts = 16) : false;
  boardSize === lgBoard ? (attempts = 30) : false;
  attemptCount.innerText = attempts;

  //For each card, select it, and push it to an array, then rotate it
  grid.forEach((card) => {
    function selectCard(card) {
      cardID.push(card.id);
      selectedCards.push(card);

      card.classList.add("active");
      card.classList.add("rotate");
    }

    card.addEventListener("click", () => {
      selectCard(card);

      //If 2 cards are selected
      if (cardID.length === 2) {
        //If both card's ids match
        if (cardID[0] === cardID[1]) {
          matches++;
          flipSuccessSound.play();

          //If all cards are matched
          if (matches === boardSize / 2) {
            message.innerText = "You Win!";
            message.style.color = "rgb(86, 232, 86)";
            showPopup();
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
          flipFailSound.play();
          attemptCount.innerText = `${attempts}`;

          //If you run out of attempts, flip all cards over and set border color to red
          if (attempts === 0) {
            message.innerText = "Game over";
            message.style.color = "var(--secondary-color)";
            showPopup();

            //Show every card and disable them
            grid.forEach((card) => {
              card.classList.add("disabled", "rotate");
              setTimeout(() => {
                card.classList.add("disabled", "rotate");
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

function newGame(boardSize) {
  hidePopup();

  //select all cards
  const cards = document.querySelectorAll(".card-inner");

  //after half a second, flip cards over and play sound
  setTimeout(() => {
    flipSound.play();
    cards.forEach((card) => {
      card.classList.remove("rotate", "active", "matched", "disabled");
      card.classList.add("noclick");
    });
  }, 500);

  //after 200 more miliseconds, generate all logic required to set up another board
  setTimeout(() => {
    generateNumArray(boardSize);
    shuffleArray(numArray);
    removeGrid();
    createGrid(boardSize);
    const activeGrid = document.querySelectorAll(".card-inner");
    matches = 0;
    runGameLogic(activeGrid, boardSize);
  }, 700);
}

//Mute sounds on startup
sounds.forEach((sound) => {
  sound.muted = true;
});

//If user clicks on the speaker icon, enable or disable sounds
soundButton.addEventListener("click", () => {
  if (soundButton.classList.contains("muted")) {
    sounds.forEach((sound) => {
      sound.muted = false;
    });
    soundButton.classList.remove("muted");
  } else {
    if (!soundButton.classList.contains("muted")) {
      sounds.forEach((sound) => {
        sound.muted = true;
      });
      soundButton.classList.add("muted");
    }
  }
});

//Disable board size buttons
boardSizeOptions.forEach((option) => {
  option.setAttribute("disabled", "");
});

//Disable start button
startButton.setAttribute("disabled", "");

//Theme selector logic
pawPatrolThemeButton.addEventListener("click", () => {
  //If there is a grid, remove it
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }

  //If a board size option is pressed, deselect other buttons
  buttonOptions.forEach((option) => {
    if (option.classList.contains("option-selected"))
      option.classList.remove("option-selected");
  });

  //If the start button isn't disabled, make sure to disable it
  !startButton.hasAttribute("disabled")
    ? startButton.setAttribute("disabled", "")
    : false;

  //If a theme option is pressed, deselect other theme buttons
  themeOptions.forEach((option) => {
    option.classList.remove("theme-selected");
    option.classList.replace("theme-active", "theme-inactive");
  });

  //Add necessary classes
  pawPatrolThemeButton.classList.add("theme-selected");
  pawPatrolThemeButton.classList.replace("theme-inactive", "theme-active");

  //Enable board size buttons to be selected
  boardSizeOptions.forEach((option) => {
    option.removeAttribute("disabled", "");
  });
});

minecraftThemeButton.addEventListener("click", () => {
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }

  buttonOptions.forEach((option) => {
    if (option.classList.contains("option-selected"))
      option.classList.remove("option-selected");
  });

  !startButton.hasAttribute("disabled")
    ? startButton.setAttribute("disabled", "")
    : false;

  themeOptions.forEach((option) => {
    option.classList.remove("theme-selected");
    option.classList.replace("theme-active", "theme-inactive");
  });

  minecraftThemeButton.classList.add("theme-selected");
  minecraftThemeButton.classList.replace("theme-inactive", "theme-active");

  boardSizeOptions.forEach((option) => {
    option.removeAttribute("disabled", "");
  });
});

spongebobThemeButton.addEventListener("click", () => {
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }

  buttonOptions.forEach((option) => {
    if (option.classList.contains("option-selected"))
      option.classList.remove("option-selected");
  });

  !startButton.hasAttribute("disabled")
    ? startButton.setAttribute("disabled", "")
    : false;

  themeOptions.forEach((option) => {
    option.classList.remove("theme-selected");
    option.classList.replace("theme-active", "theme-inactive");
  });

  spongebobThemeButton.classList.add("theme-selected");
  spongebobThemeButton.classList.replace("theme-inactive", "theme-active");

  boardSizeOptions.forEach((option) => {
    option.removeAttribute("disabled", "");
  });
});

//Logic for board size buttons
boardOptionSmall.addEventListener("click", () => {
  //If there is a container, remove it
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }

  //If a board size option is pressed, deselect other buttons
  buttonOptions.forEach((option) => {
    option.classList.remove("option-selected");
  });

  //Select button
  boardOptionSmall.classList.add("option-selected");

  //Create game board based on card count
  generateNumArray(smBoard);
  shuffleArray(numArray);
  createGrid(smBoard);
  const activeGrid = document.querySelectorAll(".card-inner");
  runGameLogic(activeGrid, smBoard);

  startButton.addEventListener("click", () => {
    const grid = document.querySelector(".grid");

    //When the start button is clicked and a theme has been selected, hide the menu
    if (
      (grid && pawPatrolThemeButton.classList.contains("theme-active")) ||
      minecraftThemeButton.classList.contains("theme-active") ||
      spongebobThemeButton.classList.contains("theme-active")
    ) {
      hideMenu();
    }
  });

  //when a board size has been selected, enable the start button
  startButton.removeAttribute("disabled", "");

  restartButton.addEventListener("click", () => {
    newGame(smBoard);
    matches = 0;
  });
});

boardOptionMedium.addEventListener("click", () => {
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }
  buttonOptions.forEach((option) => {
    option.classList.remove("option-selected");
  });

  boardOptionMedium.classList.add("option-selected");

  generateNumArray(mdBoard);
  shuffleArray(numArray);
  createGrid(mdBoard);
  const activeGrid = document.querySelectorAll(".card-inner");
  runGameLogic(activeGrid, mdBoard);

  startButton.addEventListener("click", () => {
    const grid = document.querySelector(".grid");
    if (grid) {
      hideMenu();
    }
  });

  startButton.removeAttribute("disabled", "");

  restartButton.addEventListener("click", () => {
    newGame(mdBoard);
    matches = 0;
  });
});

boardOptionLarge.addEventListener("click", () => {
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }
  buttonOptions.forEach((option) => {
    option.classList.remove("option-selected");
  });

  boardOptionLarge.classList.add("option-selected");

  generateNumArray(lgBoard);
  shuffleArray(numArray);
  createGrid(lgBoard);
  const activeGrid = document.querySelectorAll(".card-inner");
  runGameLogic(activeGrid, lgBoard);

  startButton.addEventListener("click", () => {
    const grid = document.querySelector(".grid");
    if (grid) {
      hideMenu();
    }
  });

  startButton.removeAttribute("disabled", "");

  restartButton.addEventListener("click", () => {
    newGame(lgBoard);
    matches = 0;
  });
});

toMenuButton.forEach((button) => {
  button.addEventListener("click", () => {
    hidePopup();
    backToMenu();
  });
});
