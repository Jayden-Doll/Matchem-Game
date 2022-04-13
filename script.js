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

let smBoard = 12;
let mdBoard = 24;
let lgBoard = 36;

let numArray = [];
let cardID = [];
let selectedCards = [];

let matches = 0;

function generateNumArray(boardSize) {
  boardSize /= 2;
  for (i = 1; i < boardSize + 1; i++) {
    numArray.push(i);
    numArray.push(i);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let k = array[i];
    array[i] = array[j];
    array[j] = k;
  }
}

function createGrid(boardSize) {
  const gridContainer = document.createElement("div");
  for (let i = 0; i < boardSize; i++) {
    const cardBody = document.createElement("div");
    const innerCard = document.createElement("div");
    const cardFront = document.createElement("div");
    const cardBack = document.createElement("div");
    const cardImage = document.createElement("img");

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

    const randNum = numArray.pop();

    innerCard.id = randNum;

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

function hideMenu() {
  startScreen.classList.remove("menu-show");
  startScreen.classList.add("menu-hide");
}

function showMenu() {
  startScreen.classList.remove("menu-hide");
  startScreen.classList.add("menu-show");
}

function hidePopup() {
  popup.classList.add("popup-hidden");
  overlay.classList.add("overlay-hidden");
}

function showPopup() {
  popup.classList.remove("popup-hidden");
  overlay.classList.remove("overlay-hidden");
}

function removeCards() {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
}

function removeGrid() {
  document.querySelector(".grid").remove();
}

function backToMenu() {
  showMenu();
  buttonOptions.forEach((option) => {
    option.classList.remove("option-selected");
  });

  themeOptions.forEach((option) => {
    option.classList.remove("theme-selected");
    option.classList.replace("theme-active", "theme-inactive");
  });

  boardSizeOptions.forEach((option) => {
    option.setAttribute("disabled", "");
  });

  startButton.setAttribute("disabled", "");

  setTimeout(() => {
    removeGrid();
    numArray = [];
    cardID = [];
    selectedCards = [];

    matches = 0;
  }, 500);
}

function newGame(boardSize) {
  hidePopup();
  const cards = document.querySelectorAll(".card-inner");
  setTimeout(() => {
    cards.forEach((card) => {
      card.classList.remove("rotate", "active", "matched", "disabled");
      card.classList.add("noclick");
    });
  }, 500);

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

function runGameLogic(grid, boardSize) {
  let attempts;
  boardSize === smBoard ? (attempts = 5) : false;
  boardSize === mdBoard ? (attempts = 16) : false;
  boardSize === lgBoard ? (attempts = 30) : false;
  attemptCount.innerText = attempts;

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
          attemptCount.innerText = `${attempts}`;

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

boardSizeOptions.forEach((option) => {
  option.setAttribute("disabled", "");
});

startButton.setAttribute("disabled", "");

pawPatrolThemeButton.addEventListener("click", () => {
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

  pawPatrolThemeButton.classList.add("theme-selected");
  pawPatrolThemeButton.classList.replace("theme-inactive", "theme-active");

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

boardOptionSmall.addEventListener("click", () => {
  const gridContainer = document.querySelector(".grid");
  if (gridContainer) {
    gridContainer.remove();
  }
  buttonOptions.forEach((option) => {
    option.classList.remove("option-selected");
  });

  boardOptionSmall.classList.add("option-selected");

  generateNumArray(smBoard);
  shuffleArray(numArray);
  createGrid(smBoard);
  const activeGrid = document.querySelectorAll(".card-inner");
  runGameLogic(activeGrid, smBoard);
  console.log(matches);

  startButton.addEventListener("click", () => {
    const grid = document.querySelector(".grid");
    if (
      (grid && pawPatrolThemeButton.classList.contains("theme-active")) ||
      minecraftThemeButton.classList.contains("theme-active") ||
      spongebobThemeButton.classList.contains("theme-active")
    ) {
      hideMenu();
    }
  });

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
