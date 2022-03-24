const gridCard = document.querySelectorAll(".card-inner");
const attempts = document.querySelectorAll(".circle");

gridCard.forEach((card) => {
  function checkCard() {
    cardArray.push(card.id, card);
    console.log(cardArray);
  }

  function matchCards(cardArray) {
    if (cardArray[0] === cardArray[2]) {
      console.log("It's a match!");
      cardArray[1].classList.add("matched");
      cardArray[3].classList.add("matched");
      cardArray[1].classList.remove("active");
      cardArray[3].classList.remove("active");
      cardArray.length = 0;
    } else {
      console.log("nope, not a match", cardArray[0], cardArray[2]);
      cardArray[1].classList.remove("active");
      cardArray[3].classList.remove("active");
      console.log(cardArray);
      setTimeout(() => {
        console.log(cardArray);
        cardArray[1].classList.toggle("rotate");
        cardArray[3].classList.toggle("rotate");
        cardArray.length = 0;
      }, 1000);
    }
  }

  cardArray = [];

  card.addEventListener("click", () => {
    card.classList.toggle("rotate");
    card.classList.add("active");

    checkCard();

    if (cardArray.length === 4) {
      matchCards(cardArray);
    }
  });
});
