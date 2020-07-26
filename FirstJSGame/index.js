const $ = el => document.querySelector(el);

const character = $("#character");
const dieblock = $("#dieblock");
const scoreEl = $("#score");
const hScoreEl = $("#hscore");
const helpStart = $("#helpStart");

let score = 0, started = false, died = false;

const highScore = localStorage.getItem("highScore") || 0;
hScoreEl.textContent = highScore;

window.addEventListener("click",_ => {
  if (!started) {
    helpStart.style.display = "none";
    dieblock.style.display = "block";
    started = true;
    dieblock.classList.add("start");
    setInterval(game, 100);
    died = false;
  } else {
    if (!character.classList.contains("jump")) character.classList.add("jump");
    setTimeout(_ => {
      character.classList.remove("jump");
    }, 400);
  }
});


function game() {
  const cTop = parseInt(getComputedStyle(character).getPropertyValue("top"));
  const bLeft = parseInt(getComputedStyle(dieblock).getPropertyValue("left"));
  
  /*
    if dieblockLeft > 0 (characterWidth) and dieblockLeft is < 50 (characterWidth) - In between characterWidth
    and characterTop >= 170 (gamecontainerHeight + dieblockHeight)
  */
  if (bLeft < 50 && bLeft > 0 && cTop >= 170) {
    if (score > highScore) {
      localStorage.setItem("highScore", score);
      hScoreEl.textContent = score;
    }
    score = 0;
    started = false;
    helpStart.style.display = "block";
    dieblock.style.display = "none";
    dieblock.classList.remove("start");
    died = true;
  }
  
  if (!died) score++;
  if (bLeft < -1) {
    const dieblockNum = Math.round(Math.random() * 3);
    dieblock.src = `dieblock${dieblockNum}.svg`;
    score+=3;
  }
  
  
  scoreEl.textContent = score;
}