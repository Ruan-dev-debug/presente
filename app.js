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
  "Meu amor por você se inciou de uma forma inesperada.",
  "Foi tomando proporção na mesma medida.",
  "Hoje eu me encontro em completo êxtase quando te vejo.",
  "Mesmo que seja so pelo o celular.",
  "Mesmo que seja por uma foto antiga eu sempre me sinto.",
  "A pessoa mais especial do mundo quando te vejo.",
  "Me sinto a pessoa mais especial do mundo quando vejo.",
  "Você sorrinto so pelo fato de me ver.",
  "Eu vejo o tempo passar e mesmo longe.",
  "Me sinto cada vez mais ao seu lado.",
  "Pois cada dia que passa meus pensamentos.",
  "Em você so aumenta.",
  "Eu tento me segurar para não gritar.",
  "Que te amo de uma forma tão grande.",
  "Que os 7 cantos do mundo iria escutar o meu grito.",
  "De amor por você.",
  "E até estranho falar isso.",
  "Que o grande amor da minha vida.",
  "Estava tão perto de mim.",
  "Hoje faz total sentido todo sofrimento que ja tive.",
  "Você veio e so torno a melhor parte do meu dia.",
  "A melhor parte da minha noite.",
  "A melhor parte dos meus sonhos.",
  "Chega a ser ate clichê eu fala isso.",
  "Mas eu parei de ter meus pesâdelos dia 29 de janeiro.",
  "Quando escutei sair da sua boca um eu te amo.",
  "Apartir deste dia tudo se tornou melhor em minha vida.",
  "E literalmente você e meu grande amor.",
  "Você me faz querer ser melhor cada dia.",
  "Me doi so de pensar que eu te decpcionei em algo.",
  "Eu hoje me encontro em um otimo lugar.",
  "Que e nos seus braços me sinto uma criança de 24 anos kkk.",
  "Sempre que começo a me cobrar muito lembro de você.",
  "E sei que nunca me deixaria perder a mente por nada.",
  "Eu acho que ja percebeu que não consigo esconder nada.",
  "Por isso sinto a necessidade de falar que te amo.",
  "Diariamente não quero nem sonhar.",
  "Que você pense que eu te ame.",
  "A mesma quantidade que eu te amava ontem.",
  "Pois cada dia que passa eu te ama mais que o dia anterior.",
  "Eu te desejo cada vez mais.",
  "Hoje eu digo que te amo incodicionalmente.",
  "Sempre que fecho o olho seu rosto vem na minha frente.",
  "Como uma projeção divina de deus.",
  "Chega a ser ate clichê eu fala isso 2 kkk.",
  "Que quem eu amaria se você não existisse.",
  "Mas mesmo antes de eu namorar você.",
  "Eu ja idealizava uma mulher que era exatamente igual você.",
  "Com seu humor sua beleza seu cheiro sua risada.",
  "Seu ciúme seus gostos seu jeito de amar.",
  "Hoje meu dia so começa quando recebo sua mensagem de bom dia amor.",
  "E meu dia so acaba quando tem sua mensagem de boa noite amor.",
  "Como você viu tem 64 partes.",
  "E isso tem um significado.",
  "Pareço ser esquecido.",
  "Mas apecesar de tudo.",
  "Eu lembro de muitos.",
  "Momentos nosso.",
  "Do barulho que faz quando dorme.",
  "da forma do seu labio.",
  "Todos esses detalhes.",
  "Estão gravados.",
  "Em toda minha mente.",
  "A 64 dia atraz eu comecei a sentir algo tão forte por você que ali eu percebi que não ia demora muito para você tomar conta do meu pensamento e graças a deus você teve reciprocidade e tambem quis viver uma vida comigo sei que você não gosta mas ISABELLA VOCÊ E O GRANDE AMOR DA MINHA VIDA SEMPRE VOU TENTAR DEIXA BEM CLARO TODO ESSE AMOR QUE SINTO POR VOCÊ TE AMO MEU AMOR ❤️❤️❤️.",
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