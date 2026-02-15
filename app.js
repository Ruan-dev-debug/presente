const GRID = 8;
const total = GRID * GRID;
const COOLDOWN_MS = 4000;
const RAIN_HEARTS_PER_CLICK = 500;   // <-- CONTROLE: aumenta/diminui a cascata
const RAIN_DURATION_MS = 2000;
const MAX_BG_HEARTS = 70;

const heartRain = document.getElementById("heartRain");
const tilesWrap = document.getElementById("tiles");
const counterEl = document.getElementById("counter");
const quoteEl = document.getElementById("quote");
const revealBtn = document.getElementById("revealBtn");
const resetBtn = document.getElementById("resetBtn");
const finalEl = document.getElementById("final");

const quotes = [
  "Você é minha parte favorita do dia.",
  "Seu sorriso é meu lugar seguro.",
  "Eu escolho você todos os dias.",
  "Com você, tudo fica melhor.",
  "Meu coração é seu.",
  "Obrigado por existir.",
  "Você é meu melhor acaso.",
  "Te amo mais do que ontem.",
  "Você me faz querer ser melhor.",
  "Você é meu lar."
];

let cooldown = false;
let closed = [];
let openedCount = 0;

function buildTiles(){
  tilesWrap.innerHTML = "";
  closed = [];
  openedCount = 0;

  for(let i=0;i<total;i++){
    const tile = document.createElement("div");
    tile.className = "tile";
    tilesWrap.appendChild(tile);
    closed.push(tile);
  }

  updateUI();
  finalEl.hidden = true;
  resetBtn.hidden = true;
  revealBtn.disabled = false;
}

function spawnBackgroundHeart(){
  const h = document.createElement("div");
  h.className = "bg-heart";
  h.textContent = "❤️";

  // posição aleatória no fundo
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  const size = 18 + Math.random() * 46;

  h.style.left = `${x}px`;
  h.style.top = `${y}px`;
  h.style.fontSize = `${size}px`;

  document.body.appendChild(h);
  const hearts = document.querySelectorAll(".bg-heart");
  if(hearts.length > MAX_BG_HEARTS){
    hearts[0].remove(); // remove o mais antigo
  }

}


function startCooldown(){
  cooldown = true;
  revealBtn.disabled = true;

  let left = Math.ceil(COOLDOWN_MS / 1000);
  const originalText = revealBtn.textContent;

  revealBtn.textContent = `Aguarde ${left}s...`;

  const t = setInterval(() => {
    left--;
    if(left <= 0){
      clearInterval(t);
      cooldown = false;
      revealBtn.disabled = (openedCount === total); // se acabou, continua desativado
      revealBtn.textContent = originalText;
    } else {
      revealBtn.textContent = `Aguarde ${left}s...`;
    }
  }, 1000);
}

function spawnHeartRain(){
  const now = Date.now();

  for(let i=0;i<RAIN_HEARTS_PER_CLICK;i++){
    const h = document.createElement("div");
    h.className = "rain-heart";
    h.textContent = "❤️";

    const left = Math.random() * 100; // %
    const size = 14 + Math.random() * 18; // px
    const duration = 1.6 + Math.random() * 1.6; // s
    const delay = Math.random() * 0.35; // s

    h.style.left = `${left}%`;
    h.style.fontSize = `${size}px`;
    h.style.animationDuration = `${duration}s`;
    h.style.animationDelay = `${delay}s`;

    heartRain.appendChild(h);

    // remove depois
    setTimeout(() => {
      h.remove();
    }, (duration + delay) * 1000 + 50);
  }
}

function updateUI(){
  counterEl.textContent = `Você já revelou ${openedCount}/${total}`;
}

function setQuoteByStep(stepIndex){
  // stepIndex vai de 0 a 35
  quoteEl.textContent = quotes[Math.min(stepIndex, quotes.length - 1)];
}

function revealOne(){
  if(closed.length === 0) return;

  const randomIndex = Math.floor(Math.random() * closed.length);
  const tile = closed.splice(randomIndex, 1)[0];

  tile.classList.add("open");
  openedCount++;
  updateUI();
  setQuoteByStep(openedCount - 1);
  spawnHeartRain();
  spawnBackgroundHeart();
  startCooldown();

  if(openedCount === total){
    revealBtn.disabled = true;
    finalEl.hidden = false;
    resetBtn.hidden = false;
    quoteEl.textContent = "Agora você viu tudo… igual eu vejo você ❤️";
  }
}

revealBtn.addEventListener("click", revealOne);
resetBtn.addEventListener("click", () => {
  buildTiles();
  setQuoteByStep(0); // primeira mensagem
});

// registra SW
if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

buildTiles();
setQuoteByStep(0);