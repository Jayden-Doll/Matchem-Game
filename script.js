const cardGrid = document.querySelectorAll(".card-inner");
const attempts = document.querySelectorAll(".circle");

let cardID = [];
let selectedCards = [];

function selectCard(card) {
  cardID.push(card.id);
  selectedCards.push(card);

  card.classList.add("active");
  card.classList.add("rotate");
}

cardGrid.forEach((card) => {
  card.addEventListener("click", () => {
    selectCard(card);

    if (cardID.length === 2) {
      if (cardID[0] === cardID[1]) {
        for (const cards of selectedCards) {
          cards.classList.add("matched");
          cards.classList.remove("active");

          cardID = [];
          selectedCards = [];
        }
      }
      {
        for (const cards of selectedCards) {
          cards.classList.remove("active");
          cards.classList.add("disabled");
          console.trace(cards);
          setTimeout(() => {
            cards.classList.remove("rotate");
            cards.classList.remove("disabled");
          }, 1000);
          cardID = [];
          selectedCards = [];
        }
      }
    }
  });
});
