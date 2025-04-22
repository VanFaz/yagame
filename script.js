const clickBtn = document.getElementById("clickBtn");
const clickCount = document.getElementById("clickCount");
const charImg = document.getElementById("charImg");
const levelUpBtn = document.getElementById("levelUpBtn");
const upgradeBtn = document.getElementById("upgradeBtn");

let clicks = Number(localStorage.getItem("clicks")) || 0;
let currentCharIndex = Number(localStorage.getItem("charIndex")) || 0;
let clickPower = Number(localStorage.getItem("clickPower")) || 1;
let upgradeLevel = Number(localStorage.getItem("upgradeLevel")) || 0;
let autoClickerActive = localStorage.getItem("autoClicker") === "true";

const characters = [
  { name: "Фриго камелло", sound: "0_tralalero.mp3", image: "0_frigo camello.jpeg", clicksNeeded: 50 },
  { name: "Бонека амбалабу", sound: "1_bombardino.mp3", image: "1_Boneca ambalabu.jpeg", clicksNeeded: 100 },
  { name: "Капибарелло кокоссини", sound: "2_capibara.mp3", image: "2_Capibarello cocossini.jpeg", clicksNeeded: 300 },
  { name: "Триппи троппи", sound: "3_gigachad.mp3", image: "3_trippi troppi.jpeg", clicksNeeded: 800 },
  { name: "Бомбардиро крокодило", sound: "4_drip.mp3", image: "4_Bombardiro Crocodilo.jpeg", clicksNeeded: 2000 },
  { name: "Лирили ларила", sound: "5_sigma.mp3", image: "5_Lirililarila.webp", clicksNeeded: 5000 },
  { name: "Тунг Тунг Тунг Сахур", sound: "6_trollface.mp3", image: "6_Tung Tung Tung Sahur.webp", clicksNeeded: 10000 },
  { name: "Баллерина каппучина", sound: "7_shrek.mp3", image: "7_ballerina cappuchina.jpeg", clicksNeeded: 20000 },
  { name: "Тралалеро Тралала", sound: "8_pepe.mp3", image: "8_Trallalero Trallala.jpeg", clicksNeeded: 30000 },
  { name: "Боберито Бондито", sound: "9_ultimate.mp3", image: "9_Boberito bondito.webp", clicksNeeded: 50000 }
];

function updateUI() {
  clickCount.innerText = clicks;
  clickBtn.innerText = `+${clickPower}`;
  levelUpBtn.innerText = `Эволюция (${nextCost()} кликов)`;
  upgradeBtn.innerText = `Улучшение (${upgradeCost()} кликов)`;
}

function nextCost() {
  if (currentCharIndex >= characters.length - 1) return Infinity;
  return characters[currentCharIndex].clicksNeeded;
}

function upgradeCost() {
  return 100 * Math.pow(2, upgradeLevel);
}

function updateCharacter() {
  const char = characters[currentCharIndex];
  charImg.src = `assets/imgs/${char.image}`;
  localStorage.setItem("charIndex", currentCharIndex);
}

function saveProgress() {
  localStorage.setItem("clicks", clicks);
  localStorage.setItem("clickPower", clickPower);
  localStorage.setItem("upgradeLevel", upgradeLevel);
  localStorage.setItem("autoClicker", autoClickerActive);
}

function playSound(name) {
  const audio = new Audio(`assets/sounds/${name}`);
  audio.play();
}

clickBtn.addEventListener("click", () => {
    clicks += clickPower;
    updateUI();
    saveProgress();
    checkEndGame();
});

levelUpBtn.addEventListener("click", () => {
  const cost = nextCost();
  if (clicks >= cost) {
    clicks -= cost;
    playSound(characters[currentCharIndex].sound);

    if (currentCharIndex < characters.length - 1) {
      currentCharIndex++;
      updateCharacter();
      updateUI();
      saveProgress();
    }

    checkEndGame();
  }
});


upgradeBtn.addEventListener("click", () => {
  const cost = upgradeCost();
  if (clicks >= cost) {
    clicks -= cost;
    upgradeLevel++;
    clickPower++;
    updateUI();
    saveProgress();
    if (upgradeLevel >= 5 && !autoClickerActive) activateAutoClicker();
  }
});

function activateAutoClicker() {
  autoClickerActive = true;
  setInterval(() => {
    clicks += clickPower;
    updateUI();
    saveProgress();
  }, 1000);
}

function checkEndGame() {
    const lastChar = characters[characters.length - 1];
    if (currentCharIndex === characters.length - 1 && clicks >= lastChar.clicksNeeded) {
      showEndScreen();
  }
}

function showEndScreen() {
  const container = document.querySelector(".container");
  container.innerHTML = `
    <h1>🎉 Победа! 🎉</h1>
    <p>Ты прошёл путь итальянских мемов теперь ты легенда!</p>
    <p>Спасибо за игру 😄</p>
    <button onclick="resetGame()">Начать заново</button>
  `;

  const winSound = new Audio("assets/sounds/sound_win.mp3");
  winSound.play();
}


function resetGame() {
  clicks = 0;
  clickPower = 1;
  upgradeLevel = 0;
  autoClickerActive = false;
  currentCharIndex = 0;
  updateCharacter();
  updateUI();
  localStorage.clear();
  location.reload();
}


updateCharacter();
updateUI();
if (autoClickerActive) activateAutoClicker();
