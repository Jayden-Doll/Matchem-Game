const gridCard = document.querySelectorAll(".card-inner");

gridCard.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("rotate");
  });
});
