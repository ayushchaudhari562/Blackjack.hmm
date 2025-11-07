let player = {
  Name: "Ayush",
  prize: 20000,
};

const cardImgs = [];
["S", "H", "D", "C"].forEach(suit => {
  ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"].forEach(value => {
    const img = new Image();
    img.src = `https://deckofcardsapi.com/static/img/${value}${suit}.png`;
    cardImgs.push(img);
  });
});

let currentBet = 0;
let cards = [];
let sum = 0;
let has_blackjack = false;
let isAlive = false;
let message = "";
let msgEl = document.getElementById("msg");
let sumEl = document.querySelector("#sumEEl");
let cardEl = document.querySelector(".card1");
let BET = document.getElementById("bet-amount");
let playerEL = document.getElementById("player_name");


let popup = document.getElementById("popup");
let popupText = document.getElementById("popupText");
let closeBtn = document.getElementById("closeBtn");

playerEL.textContent = player.Name + ": ₹" + player.prize;

function getRandomCard() {
  const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
  const suits = ["S", "H", "D", "C"];
  const value = values[Math.floor(Math.random() * values.length)];
  const suit = suits[Math.floor(Math.random() * suits.length)];

  let cardValue;
  if (value === "A") cardValue = 11;
  else if (["J", "Q", "K"].includes(value)) cardValue = 10;
  else cardValue = value;

  return {
    name: `${value}${suit}`,
    value: cardValue,
    image: `https://deckofcardsapi.com/static/img/${value}${suit}.png`,
  };
}

function showPopup(text) {
  popupText.textContent = text;
  popup.style.display = "flex";
}

function start() {
  if (currentBet === 0) {
    alert("Place a bet first!");
    return;
  }

  if (isAlive) {
    alert("Finish this round first!");
    return;
  }

  player.prize -= currentBet;
  updatePlayer();

  let firstCard = getRandomCard();
  let secondCard = getRandomCard();
  cards = [firstCard, secondCard];
  sum = firstCard.value + secondCard.value;

  has_blackjack = false;
  isAlive = true;

  render_();
}

function render_() {
  cardEl.innerHTML = "";

  cards.forEach(card => {
    if (!card.imgElement) {
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.name;
      img.classList.add("card-img");
      card.imgElement = img;
    }
    cardEl.appendChild(card.imgElement);
  });

  sumEl.textContent = "Sum: " + sum;

  if (sum < 21) {
    message = "Do you want to draw a new card?";
  } else if (sum === 21) {
    message = "You've got Blackjack!";
    has_blackjack = true;
    player.prize += currentBet * 2;
    updatePlayer();
    isAlive = false;
   

    showPopup("🎉 You Won! Blackjack! You earned ₹" + (currentBet * 2));
  } else {
    message = "You're out of the game!";
    isAlive = false;
  

    showPopup("😞 You Lost! You went over 21. Lost ₹" + currentBet);
  }

  msgEl.textContent = message;
}

function new_card() {
  if (isAlive && !has_blackjack) {
    let card_M = getRandomCard();
    cards.push(card_M);
    sum += card_M.value;
    render_();
  }
}

function restart() {
  cards = [];
  sum = 0;
  isAlive = false;
  has_blackjack = false;
  message = "Want to play a round?";
  msgEl.textContent = message;
  cardEl.textContent = "Cards:";
  sumEl.textContent = "Sum:";
  currentBet = 0;
  BET.textContent = 0;
}

function bet(amount) {
  if (player.prize >= amount) {
    currentBet = amount;
    BET.textContent = amount;
  } else {
    alert("Not enough money!");
  }
}

function updatePlayer() {
  playerEL.textContent = player.Name + ": ₹" + player.prize;
}

closeBtn.addEventListener("click", function() {
  popup.style.display = "none";
});
