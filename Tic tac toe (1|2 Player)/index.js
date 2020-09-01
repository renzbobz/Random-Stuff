/* 
  github.com/renzbobz
  Coded on phone - 8/31/20
*/
const Game = {
  playerActive: 1, // p1 is default (1=player1 - 2=player2)
  currentRound: 1,
  playerToChoose: 1, // p1 is default
  player1: {
    item: null, // X or O
    el: document.querySelector("#player1")
  },
  player2: {
    item: null, // X or O
    el: document.querySelector("#player2")
  },
  gameMode: 0, // 1= 1 player - 2= 2 players
  boxes: document.querySelectorAll(".box")
};


document.body.onload = () => Game.mode();


// Choose game mode
Game.mode = function(mode) {
  
  const el = document.querySelector("#game-mode");
  
  // if no mode passed in then show el
  if (!mode) return el.style.display = "block";
  
  // show players nav
  this.togglePlayers();
  
  // if game mode is 1 player then
  if (mode == 1) {
    // change player1 name to You
    this.player1.el.innerHTML = "You > <span></span>";
    // and change player2 name to Bot
    this.player2.el.innerHTML = "<span></span> < Bot";
    // update game mode
    this.gameMode = 1;
  } else {
    this.gameMode = 2;
    // default text
    this.player1.el.innerHTML = "Player 1 > <span></span>";
    this.player2.el.innerHTML = "<span></span> < Player 2";
  }
  
  // proceed to game
  this.main();
 
  // after setting game mode then hide el
  el.style.display = null;
  
};

// Handling game process
Game.main = function(doneChoosing) {
  
  // if player did not choose yet then show the el
  if (!doneChoosing) return this.toggleChoose();
  
  // player done choosing then hide the choose el
  this.toggleChoose(_ => {
    // show and hide round title
    this.toggleRound(_ => {
      // and then proceed to game
      // show game el
      this.toggleGame();
      // generate boxes
      this.generateBoxes();
    });
  });

};

// Show / hide choose container
Game.toggleChoose = function(div) {
  
  const el = document.querySelector("#choose");
  const playerNum = document.querySelector("#player-num");
  
  // call callback if callable
  if (typeof div == "function") return div();
  
  let playerToChooseText;
  // if gameMode == 1 player
  if (this.gameMode == 1) {
    // if it is player 1
    playerToChooseText = this.playerToChoose == 1 ? "You" : "Bot";
  } else {
    playerToChooseText = `Player ${this.playerToChoose}`;
  }
  // show player number to choose an item
  playerNum.textContent = playerToChooseText;
  
  
  // Hide el if player done choosing
  if (div) {
    
    const choosen = div.textContent;
    const choosen2 = choosen  == "X" ? "O" : "X";
    
    el.style.display = "none";
    // player 1 is active
    if (this.playerToChoose == 1) {
      this.player1.item = choosen;
      this.player1.el.children[0].textContent = choosen;
      this.player2.item = choosen2;
      this.player2.el.children[0].textContent = choosen2;
    // else player 2
    } else {
      this.player2.item = choosen;
      this.player2.el.children[0].textContent = choosen;
      this.player1.item = choosen2;
      this.player1.el.children[0].textContent = choosen2;
    }
    
    // true = player done choosing an item
    this.main(true);
    
  } else {
    // show indication for active player
    this.showActivePlayer();
    // else show el
    el.style.display = "block";
  }
  
}

// Show / hide players nav
Game.togglePlayers = function() {
  
  const players = document.querySelector(".player-container");
  
  !players.style.display ? players.style.display = "block" : players.style.display = null;

};

// Show indication for active player
Game.showActivePlayer = function() {
  
  const p1 = this.player1.el;
  const p2 = this.player2.el;
  
  // toggle active class
  if (this.playerActive == 1) {
    p1.classList.add("active");
    if (p2.classList.contains("active")) p2.classList.remove("active");
  } else {
    p2.classList.add("active");
    if (p1.classList.contains("active")) p1.classList.remove("active");
  }
  
};

// Show & hide round banner
Game.toggleRound = function(callback) {
  
  const el = document.querySelector("#round");
  const num = document.querySelector("#round-num");
  
  // show current round
  num.textContent = this.currentRound;
  el.style.display = "block";
  setTimeout(_ => {
    el.style.display = "none";
    // call callback on hide round
    callback();
  }, 1500);
  
};

// Show / hide game container
Game.toggleGame = function() {
  
  const el = document.querySelector(".game");
  
  // toggle game container
  !el.style.display ? el.style.display = "grid" : el.style.display = null;
  
  // clear boxes
  this.clearBoxes();
  
};

// Generate boxes
Game.generateBoxes = function() {
  
  const boxes = this.boxes;
  
  // loop through boxes and add event on click
  boxes.forEach((box, i)=> {
    
    // show box
    if (!box.style.display) setTimeout(_ => setTimeout(_ => box.style.display = "block", i*50), 500);
   
    // box on click event (adding value to box)
    box.onclick = () => {
      
      let item;
      
      // Return if content already set
      if (box.textContent) return;
      
      // change item of active player
      this.playerActive == 1 ? item = this.player1.item : item = this.player2.item;
      
      // display item in box
      box.textContent = item;
      
      // check if there's a winner
      this.checkWinner();
      
      // change active player
      this.playerActive == 1 ? this.playerActive = 2 : this.playerActive = 1;
      
      // and then show who is active player
      this.showActivePlayer();
      
      // Bot turn
      if (this.gameMode == 1 && this.playerActive == 2) this.botResponse();

    };
    
  });

};

// Check if there's already winner
Game.checkWinner = function() {
  
  const boxAry = [];
  
  const boxes = this.boxes;
  
  // push boxes to array
  boxes.forEach(box => boxAry.push(box));
  // map all box text content (if empty use box index)
  const boxVals = boxAry.map((box, i) => box.textContent || i);
  
  // Check winner by looping the boxes
  let winner;
  const bL = boxVals.length;
  for (i = 0; i < bL; i++) {

    if (i == 0 || i == 3 || i == 6) {
      // Checks x
      if (boxVals[i] == boxVals[i+1] && boxVals[i+1] == boxVals[i+2]) winner = boxVals[i];
    }
    
    if (i < 3) {
      // Checks y
      if (boxVals[i] == boxVals[i+3] && boxVals[i+3] == boxVals[i+6]) {
        winner = boxVals[i];
      
      // Checks cross 
      } else {
        const v4 = boxVals[4];
        if (boxVals[2] == v4 && v4 == boxVals[6]) winner = v4;
        if (boxVals[0] == v4 && v4 == boxVals[8]) winner = v4;
      }
      
    }
    
  }
  
  // Proceed to next round if boxes already set and there's no winner
  if (boxVals.every(box => isNaN(box)) && !winner) {
    return this.nextRound();
  }
  
  if (!winner) return;
  
  // if gameMode == 1 player
  if (this.gameMode == 1) {
    winner = this.player1.item == winner ? "You" : "Bot";
  } else {
    winner = this.player1.item == winner ? "Player 1" : "Player 2";
  }
  
  // show winner el
  this.toggleWinner(winner);

  // hide game el
  this.toggleGame();
  
};

// Show / hide winners div
Game.toggleWinner = function(winner) {
  
  const el = document.querySelector("#winner");
  const text = document.querySelector("#winner-text");
  
  // write winner
  text.textContent = winner == "You" ? `${winner} win !` : `${winner} wins !`;
  
  !el.style.display ? el.style.display = "block" : el.style.display = null;
  
};

// Hide and clear boxes
Game.clearBoxes = function() {
  
  const boxes = this.boxes;

  boxes.forEach(box => {
    box.style.display = null;
    box.textContent = null;
  });

};

// Next round
Game.nextRound = function() {
  
  // hide game container
  this.toggleGame();
  
  // update current round
  this.currentRound += 1;
  
  // then show round banner
  this.toggleRound(_ => {
    // and then show game 
    this.toggleGame();
    this.generateBoxes();
  });
  
};

// Back to home(game mode choose)
Game.backHome = function(btn) {
  
  // Back to default all instance
  this.player1.item = null;
  this.player2.item = null;
  this.currentRound = 1;
  this.playerActive = 1;
  this.playerToChoose = 1;

  // hide players nav
  this.togglePlayers();
  
  // hide el
  btn.parentNode.style.display = "none";
  
  this.mode();
  
};

// Play again
Game.again = function() {
  
  // change player to choose
  // if gameMode == 1 then player1 is always to choose
  // because it's player vs bot
  if (this.gameMode == 1) {
    this.playerToChoose = 1;
  } else {
    // Change player to choose on next game
    if (this.playerToChoose == 1) {
      this.playerToChoose = 2;
      this.playerActive = 2;
    } else {
      this.playerToChoose = 1;
      this.playerActive = 1;
    }
  }
  
  // hides winner el
  this.toggleWinner();
  
  // show choose item el
  this.toggleChoose();

};

// Player 1 vs Bot
// Randomize turn
Game.botResponse = function() {
  
  const boxAry = [];
  
  const boxes = this.boxes;
  
  // push boxes to array
  boxes.forEach(box => boxAry.push(box));
  
  // list of available box index
  const indexs = [];
  
  // push box index that doesn't have value
  boxAry.map((box, i) => {
    if (!box.textContent) indexs.push(i);
  });
  
  // pick a box index
  const index = Math.floor(Math.random() * indexs.length);
  
  // get box el
  const box = boxes[indexs[index]];
  
  // click box if exist
  if (box) setTimeout(_ => box.click(), index*100); // click speed
  
};


