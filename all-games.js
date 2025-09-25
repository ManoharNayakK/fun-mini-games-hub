// --- Load Game ---
function loadGame(gameName) {
    const container = document.getElementById('game-container');
    switch (gameName) {
        case 'ticTacToe':
            showTicTacToe(container);
            break;
        case 'snake':
            snakeAndLadderGame(container);
            break;
        case 'memory':
            memoryGame(container);
            break;
        case 'pong':
            pongGame(container);
            break;
        case 'handCricket':
            handCricketGame(container);
            break;
        case 'hangman':
            hangmanGame(container);
            break;
        case 'ludo':
            showLudoGame(container);
            break;
        default:
            container.innerHTML = '<p>Select a game to play!</p>';
    }
}


function showTicTacToe(container) {
    container.innerHTML = `
        <h1>Tic Tac Toe</h1>
        <div class="menu" style="margin-bottom:16px;">
            <button class="button" id="ttt-user">2 Players</button>
            <button class="button" id="ttt-ai">Vs Computer</button>
        </div>
        <div class="status-bar" id="ttt-status">Choose a mode above</div>
        <div class="game-board" id="ttt-board"></div>
        <div class="menu" style="margin-top:16px;">
            <button class="button" id="ttt-restart">Restart Game</button>
            <button class="button" id="ttt-menu">Back to Menu</button>
        </div>
    `;

    const btnUser = container.querySelector("#ttt-user");
    const btnAI = container.querySelector("#ttt-ai");
    const btnMenu = container.querySelector("#ttt-menu");
    const btnRestart = container.querySelector("#ttt-restart");

    btnMenu.onclick = () => loadGame('');
    btnUser.onclick = () => startTicTacToe(container, "pvp");
    btnAI.onclick = () => startTicTacToe(container, "ai");
    btnRestart.onclick = () => {
        const currentMode = container.dataset.mode || "pvp";
        startTicTacToe(container, currentMode);
    };
}

function startTicTacToe(container, mode) {
    container.dataset.mode = mode; 
    const boardDiv = container.querySelector("#ttt-board");
    const status = container.querySelector("#ttt-status");
    const board = Array.from({ length: 3 }, () => Array(3).fill(""));
    let player = "X";
    let gameOver = false;

    function render() {
        boardDiv.innerHTML = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.textContent = board[i][j];
                cell.onclick = () => playerMove(i, j);
                if (board[i][j] !== "" || gameOver) cell.style.pointerEvents = "none";
                boardDiv.appendChild(cell);
            }
        }
    }

    function playerMove(i, j) {
        if (gameOver || board[i][j] !== "") return;
        board[i][j] = player;
        render();

        if (checkWin(player)) { 
            status.textContent = `${player} wins! 🎉`; 
            gameOver = true; 
            return; 
        }
        if (board.flat().every(c => c !== "")) { 
            status.textContent = "It's a draw!"; 
            gameOver = true; 
            return; 
        }

        if (mode === "ai" && player === "X") {
            status.textContent = "Computer's turn (O)";
            setTimeout(computerMove, 400);
        } else {
            player = (player === "X") ? "O" : "X";
            status.textContent = `${player}'s turn`;
        }
    }

    function computerMove() {
        if (gameOver) return;
        let bestScore = -Infinity, movePos = null;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    board[i][j] = "O";
                    let score = minimax(board, 0, false);
                    board[i][j] = "";
                    if (score > bestScore) { bestScore = score; movePos = [i, j]; }
                }
            }
        }
        if (movePos) {
            board[movePos[0]][movePos[1]] = "O";
            render();
            if (checkWin("O")) { status.textContent = "Computer wins! 😔"; gameOver = true; return; }
            if (board.flat().every(c => c !== "")) { status.textContent = "It's a draw!"; gameOver = true; return; }
            if (!gameOver) { status.textContent = "Your turn (X)"; player = "X"; }
        }
    }

    function minimax(b, depth, isMax) {
        if (checkWin("O")) return 1;
        if (checkWin("X")) return -1;
        if (b.flat().every(c => c !== "")) return 0;

        let best = isMax ? -Infinity : Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (b[i][j] === "") {
                    b[i][j] = isMax ? "O" : "X";
                    let score = minimax(b, depth + 1, !isMax);
                    b[i][j] = "";
                    best = isMax ? Math.max(score, best) : Math.min(score, best);
                }
            }
        }
        return best;
    }

    function checkWin(p) {
        for (let i = 0; i < 3; i++)
            if (board[i][0] === p && board[i][1] === p && board[i][2] === p) return true;
        for (let j = 0; j < 3; j++)
            if (board[0][j] === p && board[1][j] === p && board[2][j] === p) return true;
        if (board[0][0] === p && board[1][1] === p && board[2][2] === p) return true;
        if (board[0][2] === p && board[1][1] === p && board[2][0] === p) return true;
        return false;
    }

    render();
    status.textContent = mode === "ai" ? "Your turn (X)" : "X's turn";
}

// ================== SNAKE AND LADDER ==================
function snakeAndLadderGame(container=document.getElementById('game-container')) {
    container.innerHTML = `
        <h1>Snake and Ladder</h1>
        <div class="status-bar" id="snl-status">Your turn! Click 'Roll Dice'</div>
        <canvas id="snl-canvas" width="340" height="340" style="display:block;margin:24px auto;background:#eee;border-radius:12px;"></canvas>
        <div class="menu" style="margin-top:24px;">
            <button class="button" id="snl-roll">Roll Dice</button>
            <button class="button" id="snl-menu">Back to Menu</button>
            <button class="button" id="snl-exit">Exit</button>
        </div>
    `;
    document.getElementById("snl-menu").onclick = ()=>loadGame('snake');
    document.getElementById("snl-exit").onclick = ()=>window.close();

    const size = 10, cell = 34;
    let positions = [1,1]; // player, opponent
    let turn = 0; // 0=player,1=opponent
    const snakes={16:6,48:30,62:19,64:60,93:68,95:24,97:76,98:78};
    const ladders={1:38,4:14,9:31,21:42,28:84,36:44,51:67,71:91,80:100};
    const canvas = document.getElementById("snl-canvas");
    const ctx = canvas.getContext("2d");
    const rollBtn = document.getElementById("snl-roll");
    const status = document.getElementById("snl-status");

    function getCoords(pos) {
        pos-=1;
        let row=Math.floor(pos/size);
        let col=row%2===0?pos%size:size-1-(pos%size);
        let x=col*cell+cell/2, y=(size-1-row)*cell+cell/2;
        return [x,y];
    }

    function drawBoard() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        for(let i=0;i<size;i++){
            for(let j=0;j<size;j++){
                let x=j*cell, y=(size-1-i)*cell;
                ctx.fillStyle=(i+j)%2===0?"#FFD369":"#00ADB5";
                ctx.fillRect(x,y,cell,cell);
                ctx.strokeStyle="#222831";
                ctx.strokeRect(x,y,cell,cell);
                let num=i%2===0?i*size+(j+1):i*size+(size-j);
                ctx.fillStyle="#222831"; ctx.font="bold 10px Segoe UI";
                ctx.fillText(num,x+4,y+14);
            }
        }
        for(let start in ladders) drawLine(+start,ladders[start],"#8B5E3C");
        for(let start in snakes) drawLine(+start,snakes[start],"#B22222");
    }

    function drawLine(start,end,color){
        let [x1,y1]=getCoords(start), [x2,y2]=getCoords(end);
        ctx.strokeStyle=color; ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    }

    function drawPlayers(){
        const icons=["🧑","🤖"];
        const colors=["#FF2E2E","#FFD369"];
        positions.forEach((pos,i)=>{
            let [x,y]=getCoords(pos);
            ctx.beginPath(); ctx.arc(x,y,12,0,2*Math.PI);
            ctx.fillStyle=colors[i]; ctx.fill(); ctx.strokeStyle="#222831"; ctx.stroke();
            ctx.font="16px Segoe UI Emoji"; ctx.textAlign="center"; ctx.textBaseline="middle";
            ctx.fillText(icons[i],x,y);
        });
    }

    function render(){drawBoard(); drawPlayers();}

    function move(turnIndex,roll){
        positions[turnIndex]+=roll;
        if(positions[turnIndex]>100) positions[turnIndex]-=roll;
        if(snakes[positions[turnIndex]]) positions[turnIndex]=snakes[positions[turnIndex]];
        if(ladders[positions[turnIndex]]) positions[turnIndex]=ladders[positions[turnIndex]];
        render();
        if(positions[turnIndex]===100){
            status.textContent=(turnIndex===0?"You":"Computer")+" wins!";
            rollBtn.disabled=true;
        } else {
            nextTurn();
        }
    }

    function nextTurn(){
        turn=(turn+1)%2;
        if(turn===0){status.textContent="Your turn! Click 'Roll Dice'"; rollBtn.disabled=false;}
        else {status.textContent="Computer rolling..."; rollBtn.disabled=true;
            setTimeout(()=>move(1,Math.floor(Math.random()*6)+1),1000);}
    }

    rollBtn.onclick=()=>{
        let roll=Math.floor(Math.random()*6)+1;
        status.textContent=`You rolled a ${roll}!`;
        rollBtn.disabled=true;
        setTimeout(()=>move(0,roll),700);
    };

    render();
}


function showTicTacToe(container) {
    container.innerHTML = `
        <h1>Tic Tac Toe</h1>
        <div class="menu" style="margin-bottom:16px;">
            <button class="button" id="ttt-user">2 Players</button>
            <button class="button" id="ttt-ai">Vs Computer</button>
        </div>
        <div class="status-bar" id="ttt-status">Choose a mode above</div>
        <div class="game-board" id="ttt-board"></div>
        <div class="menu" style="margin-top:16px;">
            <button class="button" id="ttt-restart">Restart Game</button>
            <button class="button" id="ttt-menu">Back to Menu</button>
        </div>
    `;

    const btnUser = container.querySelector("#ttt-user");
    const btnAI = container.querySelector("#ttt-ai");
    const btnMenu = container.querySelector("#ttt-menu");
    const btnRestart = container.querySelector("#ttt-restart");

    btnMenu.onclick = () => loadGame('');
    btnUser.onclick = () => startTicTacToe(container, "pvp");
    btnAI.onclick = () => startTicTacToe(container, "ai");
    btnRestart.onclick = () => {
        const currentMode = container.dataset.mode || "pvp";
        startTicTacToe(container, currentMode);
    };
}

// --- Ludo Game ---
function showLudoGame(container) {
    container.innerHTML = `
        <h1>Ludo Game</h1>
        <div class="menu">
            <button class="button" id="ludo-1p">1 Player</button>
            <button class="button" id="ludo-2p">2 Players</button>
            <button class="button" id="ludo-3p">3 Players</button>
            <button class="button" id="ludo-4p">4 Players</button>
        </div>
        <canvas id="ludo-canvas" width="480" height="480"></canvas>
        <div id="ludo-status">Select number of human players above</div>
        <button class="button" id="ludo-roll" disabled>Roll Dice</button>
        <div class="menu">
            <button class="button" id="ludo-menu">Back to Menu</button>
        </div>
    `;

    document.getElementById("ludo-menu").onclick = () => loadGame('');

    document.getElementById("ludo-1p").onclick = () => ludoGame(1);
    document.getElementById("ludo-2p").onclick = () => ludoGame(2);
    document.getElementById("ludo-3p").onclick = () => ludoGame(3);
    document.getElementById("ludo-4p").onclick = () => ludoGame(4);
}

function ludoGame(humanCount = 1) {
    const COLORS = ["#FF2E2E", "#3EC300", "#0099FF", "#FFD369"];
    const PLAYER_TYPES = Array.from({ length: 4 }, (_, i) => i < humanCount ? "human" : "bot");
    const NAMES = PLAYER_TYPES.map((t, i) => t === "human" ? `Player ${i + 1}` : `Bot ${i + 1 - humanCount}`);

    const canvas = document.getElementById("ludo-canvas");
    const ctx = canvas.getContext("2d");
    const status = document.getElementById("ludo-status");
    const rollBtn = document.getElementById("ludo-roll");

    const size = 15, cell = 32;
    let token = [-1, -1, -1, -1]; // one pawn per player
    let finished = [false, false, false, false];
    let turn = 0;
    let dice = 1;

    const PATHS = [makePath(0), makePath(1), makePath(2), makePath(3)];

    function makePath(start) {
        let path = [];
        for (let i = 0; i < 56; i++) path.push((start * 14 + i) % 56);
        return path;
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#000";
        for (let i = 0; i <= size; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cell, 0);
            ctx.lineTo(i * cell, size * cell);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * cell);
            ctx.lineTo(size * cell, i * cell);
            ctx.stroke();
        }

        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let p = 0; p < 4; p++) {
            if (token[p] === -1) {
                ctx.fillStyle = COLORS[p];
                ctx.beginPath();
                ctx.arc((p * 3 + 2) * cell, 2 * cell, cell / 2, 0, 2 * Math.PI);
                ctx.fill();
            } else if (!finished[p]) {
                const idx = PATHS[p][token[p]];
                const x = (idx % size) * cell + cell / 2;
                const y = Math.floor(idx / size) * cell + cell / 2;
                ctx.fillStyle = COLORS[p];
                ctx.beginPath();
                ctx.arc(x, y, cell / 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    function updateStatus() {
        if (finished[turn]) {
            status.textContent = `${NAMES[turn]} has finished! 🎉`;
        } else if (token[turn] === -1) {
            status.textContent = `${NAMES[turn]} rolled a ${dice}. Pawn is at start.`;
        } else {
            status.textContent = `${NAMES[turn]} rolled a ${dice}. Current position: ${token[turn]}`;
        }
    }

    function rollDice() {
        dice = Math.floor(Math.random() * 6) + 1;
        updateStatus();
        if (PLAYER_TYPES[turn] === "human") playTurnHuman();
        else setTimeout(botTurn, 800);
    }

    function playTurnHuman() {
        if (token[turn] === -1 && dice === 6) token[turn] = 0;
        else if (token[turn] >= 0) token[turn] += dice;
        else status.textContent = `${NAMES[turn]} cannot move.`;

        if (token[turn] >= 56) finished[turn] = true;

        drawBoard();
        setTimeout(nextTurn, 300);
    }

    function botTurn() {
        if (token[turn] === -1 && dice === 6) token[turn] = 0;
        else if (token[turn] >= 0) token[turn] += dice;
        else status.textContent = `${NAMES[turn]} cannot move.`;

        if (token[turn] >= 56) finished[turn] = true;

        drawBoard();
        setTimeout(nextTurn, 800);
    }

    function nextTurn() {
        if (finished.every(f => f)) {
            status.textContent = "Game Over!";
            rollBtn.disabled = true;
            return;
        }

        turn = (turn + 1) % 4;
        if (finished[turn]) return nextTurn();

        if (PLAYER_TYPES[turn] === "human") {
            status.textContent = `${NAMES[turn]}'s turn! Click 'Roll Dice'`;
            rollBtn.disabled = false;
        } else {
            rollBtn.disabled = true;
            status.textContent = `${NAMES[turn]}'s turn...`;
            setTimeout(() => {
                dice = Math.floor(Math.random() * 6) + 1;
                updateStatus();
                botTurn();
            }, 1000);
        }
    }

    rollBtn.disabled = false;
    rollBtn.onclick = () => {
        rollBtn.disabled = true;
        rollDice();
    };

    drawBoard();
    status.textContent = `${NAMES[turn]}'s turn! Click 'Roll Dice'`;
}







// ================== HANGMAN PLACEHOLDER ==================
// ================== HANGMAN ==================

function hangmanGame(container) {
  const movies = [
    "THE GODFATHER", "THE DARK KNIGHT", "INCEPTION", "FIGHT CLUB",
    "FORREST GUMP", "PULP FICTION", "SCHINDLERS LIST", "STAR WARS",
    "THE LORD OF THE RINGS", "AVATAR", "TITANIC", "GLADIATOR",
    "THE SHAWSHANK REDEMPTION", "THE MATRIX", "INTERSTELLAR",
    "THE SILENCE OF THE LAMBS", "SAVING PRIVATE RYAN", "SE7EN",
    "THE USUAL SUSPECTS", "DJANGO UNCHAINED", "THE GREEN MILE",
    "THE WOLF OF WALL STREET", "BRAVEHEART", "CASABLANCA",
    "THE SOCIAL NETWORK", "GOODFELLAS", "JURASSIC PARK",
    "A BEAUTIFUL MIND", "AVENGERS ENDGAME", "IRON MAN",
    "BLACK PANTHER", "DOCTOR STRANGE", "THE LION KING",
    "TOY STORY", "COCO", "INSIDE OUT", "RATATOUILLE",
    "WALL-E", "FINDING NEMO", "UP", "MONSTERS INC",
    "SHREK", "HOW TO TRAIN YOUR DRAGON", "FROZEN",
    "THE INCREDIBLES", "ZOOTOPIA", "TANGLED", "CARS",
    "THE HUNGER GAMES", "TWILIGHT", "HARRY POTTER"
  ];

  const maxAttempts = 7;
  let attempts = 0;
  let score = 0;
  let selectedMovie = "";
  let guessedWord = "";

  container.innerHTML = `
    <canvas id="hangman" width="200" height="250" style="border:1px solid #ffcc00;background:#1e1e2f;"></canvas>
    <div id="word" style="font-size:24px;margin:10px 0;color:#fff;"></div>
    <div class="letters" style="display:flex;flex-wrap:wrap;gap:5px;"></div>
    <p style="color:#fff;">Score: <span id="score">0</span></p>
    <button id="backMenu" style="margin-top:10px;padding:6px 12px;background:#ffcc00;color:#1e1e2f;border:none;border-radius:5px;cursor:pointer;">Back to Menu</button>
  `;

  const hangmanCanvas = document.getElementById("hangman");
  const wordDiv = document.getElementById("word");
  const lettersDiv = container.querySelector(".letters");
  const scoreSpan = document.getElementById("score");
  const ctx = hangmanCanvas.getContext("2d");

  // Hangman drawing steps
  const hangmanParts = [
    () => { ctx.lineWidth=4; ctx.strokeStyle="#fff"; ctx.beginPath(); ctx.moveTo(10,240); ctx.lineTo(150,240); ctx.stroke(); }, // base
    () => { ctx.beginPath(); ctx.moveTo(40,240); ctx.lineTo(40,20); ctx.stroke(); }, // pole
    () => { ctx.beginPath(); ctx.moveTo(40,20); ctx.lineTo(120,20); ctx.stroke(); }, // top beam
    () => { ctx.beginPath(); ctx.moveTo(120,20); ctx.lineTo(120,50); ctx.stroke(); }, // rope
    () => { ctx.beginPath(); ctx.arc(120,70,20,0,Math.PI*2); ctx.stroke(); }, // head
    () => { ctx.beginPath(); ctx.moveTo(120,90); ctx.lineTo(120,150); ctx.stroke(); }, // body
    () => { ctx.beginPath(); ctx.moveTo(120,110); ctx.lineTo(90,130); ctx.stroke(); }, // left arm
    () => { ctx.beginPath(); ctx.moveTo(120,110); ctx.lineTo(150,130); ctx.stroke(); }, // right arm
    () => { ctx.beginPath(); ctx.moveTo(120,150); ctx.lineTo(90,180); ctx.stroke(); }, // left leg
    () => { ctx.beginPath(); ctx.moveTo(120,150); ctx.lineTo(150,180); ctx.stroke(); } // right leg
  ];

  // Initialize game
  function initGame() {
    selectedMovie = movies[Math.floor(Math.random() * movies.length)];
    guessedWord = selectedMovie.replace(/[A-Z]/g, "_");

    // Reveal a random letter (all occurrences of it)
    revealRandomLetter();

    attempts = 0;
    ctx.clearRect(0, 0, hangmanCanvas.width, hangmanCanvas.height);
    updateWordDisplay();
    generateLetterButtons();
  }

  // Reveal random letter (all positions)
  function revealRandomLetter() {
    const unrevealedIndices = [...guessedWord].map((c, i) => c === "_" ? i : -1).filter(i => i !== -1);
    if (unrevealedIndices.length > 0) {
      const idx = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
      const letterToReveal = selectedMovie[idx];

      let newWord = "";
      for (let i = 0; i < selectedMovie.length; i++) {
        newWord += selectedMovie[i] === letterToReveal ? letterToReveal : guessedWord[i];
      }
      guessedWord = newWord;
    }
  }

  function updateWordDisplay() {
    wordDiv.textContent = guessedWord.split("").join(" ");
  }

  function generateLetterButtons() {
    lettersDiv.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
      const btn = document.createElement("div");
      btn.textContent = String.fromCharCode(i);
      btn.className = "letter";
      btn.style.cursor = "pointer";
      btn.style.padding = "6px 10px";
      btn.style.background = "#ffcc00";
      btn.style.color = "#1e1e2f";
      btn.style.borderRadius = "4px";
      btn.style.fontWeight = "bold";
      btn.addEventListener("click", handleGuess);
      lettersDiv.appendChild(btn);
    }
  }

  function handleGuess(event) {
    const letter = event.target.textContent;
    event.target.classList.add("disabled");
    event.target.style.background = "#555";
    event.target.style.color = "#999";
    event.target.removeEventListener("click", handleGuess);

    if (selectedMovie.includes(letter)) {
      let newWord = "";
      for (let i = 0; i < selectedMovie.length; i++) {
        newWord += selectedMovie[i] === letter ? letter : guessedWord[i];
      }
      guessedWord = newWord;
      updateWordDisplay();

      if (guessedWord === selectedMovie) {
        score += maxAttempts - attempts;
        scoreSpan.textContent = score;
        alert("You win! Starting a new game.");
        initGame();
      }
    } else {
      attempts++;
      if (attempts <= hangmanParts.length) hangmanParts[attempts - 1]();
      if (attempts === maxAttempts) {
        alert(`You lose! The movie was: ${selectedMovie}. Starting a new game.`);
        initGame();
      }
    }
  }

  // Back to menu button
  document.getElementById("backMenu").onclick = () => loadGame("");

  initGame();
}


// ================== MEMORY MATCH ==================
function memoryGame(container) {
  const icons = ["🍎","🍌","🍇","🍒","🥝","🍍","🍉","🍑"];
  let cards = [...icons, ...icons]; // duplicate
  cards.sort(() => Math.random() - 0.5);

  container.innerHTML = `
    <h1>Memory Match</h1>
    <div id="memory-board" style="display:grid;grid-template-columns:repeat(4,80px);gap:10px;margin:20px auto;"></div>
    <p>Attempts: <span id="memory-attempts">0</span></p>
    <button id="memory-menu">Back to Menu</button>
  `;
  document.getElementById("memory-menu").onclick = ()=>loadGame('memory');

  const board = document.getElementById("memory-board");
  const attemptsSpan = document.getElementById("memory-attempts");
  let flipped = [], matched = [], attempts = 0;

  cards.forEach((icon,i)=>{
    const card = document.createElement("div");
    card.textContent = ""; card.dataset.icon = icon; card.dataset.index = i;
    card.style.width="80px"; card.style.height="80px"; card.style.background="#FFD369";
    card.style.display="flex"; card.style.justifyContent="center"; card.style.alignItems="center";
    card.style.fontSize="36px"; card.style.cursor="pointer"; card.style.borderRadius="10px";
    card.addEventListener("click", ()=>flipCard(card));
    board.appendChild(card);
  });

  function flipCard(card){
    if(flipped.includes(card) || matched.includes(card)) return;
    card.textContent = card.dataset.icon; flipped.push(card);

    if(flipped.length === 2){
      attempts++; attemptsSpan.textContent = attempts;
      if(flipped[0].dataset.icon === flipped[1].dataset.icon){
        matched.push(...flipped); flipped=[]; if(matched.length===cards.length) alert(`You won in ${attempts} attempts!`);
      } else {
        setTimeout(()=>{flipped.forEach(c=>c.textContent=""); flipped=[];},800);
      }
    }
  }
}

// ================== PONG ==================
function pongGame(container) {
  container.innerHTML = `
    <h1>Pong</h1>
    <canvas id="pong-canvas" width="480" height="320" style="background:#222831;display:block;margin:20px auto;border-radius:12px;"></canvas>
    <p id="pong-score" style="text-align:center;color:#FFD369;font-size:18px;">Player: 0 | Computer: 0</p>
    <p id="pong-winner" style="text-align:center;color:#00FF00;font-size:20px;"></p>
    <button id="pong-menu">Back to Menu</button>
  `;

  document.getElementById("pong-menu").onclick = () => loadGame('');

  const canvas = document.getElementById("pong-canvas");
  const ctx = canvas.getContext("2d");

  const paddleWidth = 10, paddleHeight = 60;
  let playerY = canvas.height/2 - paddleHeight/2;
  let compY = canvas.height/2 - paddleHeight/2;

  const ballRadius = 8;
  let ballX = canvas.width/2, ballY = canvas.height/2;
  let ballSpeedX = 3, ballSpeedY = 3;

  let playerScore = 0, compScore = 0;
  const winningScore = 10;
  let gameOver = false;

  document.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - paddleHeight/2;
    if(playerY < 0) playerY = 0;
    if(playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
  });

  function draw() {
    if(gameOver) return;

    ctx.fillStyle = "#222831";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // paddles
    ctx.fillStyle = "#FFD369";
    ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - 20, compY, paddleWidth, paddleHeight);

    // ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#FF2E2E";
    ctx.fill();

    // net
    ctx.fillStyle = "#FFD369";
    for(let i = 0; i < canvas.height; i += 20) {
      ctx.fillRect(canvas.width/2-1, i, 2, 10);
    }

    // move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // wall collision
    if(ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) ballSpeedY *= -1;

    // paddle collision
    if(ballX - ballRadius <= 20 && ballY >= playerY && ballY <= playerY + paddleHeight) {
      ballSpeedX = Math.abs(ballSpeedX);
    }
    if(ballX + ballRadius >= canvas.width - 20 && ballY >= compY && ballY <= compY + paddleHeight) {
      ballSpeedX = -Math.abs(ballSpeedX);
    }

    // scoring
    if(ballX - ballRadius < 0) {
      compScore++;
      updateScore();
      if(checkWinner()) return;
      resetBall(-1);
    }
    if(ballX + ballRadius > canvas.width) {
      playerScore++;
      updateScore();
      if(checkWinner()) return;
      resetBall(1);
    }

    // fair AI (slightly imperfect)
    const aiSpeed = 2.5; // slower for fairness
    if(compY + paddleHeight/2 < ballY - 5) compY += aiSpeed;
    else if(compY + paddleHeight/2 > ballY + 5) compY -= aiSpeed;

    if(compY < 0) compY = 0;
    if(compY > canvas.height - paddleHeight) compY = canvas.height - paddleHeight;

    requestAnimationFrame(draw);
  }

  function updateScore() {
    document.getElementById("pong-score").textContent = `Player: ${playerScore} | Computer: ${compScore}`;
  }

  function resetBall(direction) {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = 3 * direction;
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
  }

  function checkWinner() {
    if(playerScore >= winningScore) {
      document.getElementById("pong-winner").textContent = "🎉 Player Wins!";
      gameOver = true;
      return true;
    } else if(compScore >= winningScore) {
      document.getElementById("pong-winner").textContent = "💻 Computer Wins!";
      gameOver = true;
      return true;
    }
    return false;
  }

  draw();
}

// ================== HAND CRICKET ==================
function handCricketGame(container) {
    let userScore = 0, pcScore = 0, innings = 1;
    let userBatting = null; // true = user bats first
    let ballsLeft = 6;
    const totalBalls = 6;

    container.innerHTML = `
        <h1>Hand Cricket</h1>
        <div id="intro">
            <p>Choose Who Bats First:</p>
            <button class="button" id="user-bat">User Batting</button>
            <button class="button" id="pc-bat">PC Batting</button>
        </div>
        <div id="scoreboard">
            <h3>Scoreboard</h3>
            <p>User: <span id="userScore">0</span></p>
            <p>PC: <span id="pcScore">0</span></p>
            <p>Innings: <span id="innings">1</span>, Balls Left: <span id="ballsLeft">6</span></p>
        </div>
        <div id="action"></div>
        <div id="choices"></div>
    `;

    const introDiv = document.getElementById("intro");
    const actionDiv = document.getElementById("action");
    const choicesDiv = document.getElementById("choices");
    const userScoreSpan = document.getElementById("userScore");
    const pcScoreSpan = document.getElementById("pcScore");
    const ballsLeftSpan = document.getElementById("ballsLeft");
    const inningsSpan = document.getElementById("innings");

    function updateScoreboard() {
        userScoreSpan.textContent = userScore;
        pcScoreSpan.textContent = pcScore;
        ballsLeftSpan.textContent = ballsLeft;
        inningsSpan.textContent = innings;
    }

    function playTurn(userChoice) {
        const pcChoice = Math.floor(Math.random() * 6) + 1;
        let out = userChoice === pcChoice;

        if (userBatting) {
            if (!out) userScore += userChoice;
        } else {
            if (!out) pcScore += pcChoice;
        }

        ballsLeft--;
        actionDiv.innerHTML = `Ball ${totalBalls - ballsLeft}: User chose ${userChoice}, PC chose ${pcChoice}. ${out ? "OUT!" : `${userBatting ? userChoice : pcChoice} run(s) scored!`}`;

        if (ballsLeft === 0 || out) {
            if (innings === 1) {
                // Switch innings
                innings++;
                userBatting = !userBatting;
                ballsLeft = totalBalls;
                actionDiv.innerHTML += `<p>End of first innings. Second innings begins!</p>`;
            } else {
                // End of second innings, determine winner
                let winner = "Draw";
                if (userScore > pcScore) winner = "User Wins!";
                else if (pcScore > userScore) winner = "PC Wins!";
                actionDiv.innerHTML += `<h2>Game Over! ${winner} Final Score - User: ${userScore}, PC: ${pcScore}</h2>`;
                choicesDiv.innerHTML = ""; // remove buttons
            }
        }

        updateScoreboard();
    }

    function setupChoices() {
        choicesDiv.innerHTML = "<p>Select your run (1-6):</p>";
        for (let i = 1; i <= 6; i++) {
            const btn = document.createElement("button");
            btn.className = "button";
            btn.textContent = i;
            btn.onclick = () => playTurn(i);
            choicesDiv.appendChild(btn);
        }
    }

    document.getElementById("user-bat").onclick = () => {
        userBatting = true;
        introDiv.remove();
        setupChoices();
        updateScoreboard();
    };
    document.getElementById("pc-bat").onclick = () => {
        userBatting = false;
        introDiv.remove();
        setupChoices();
        updateScoreboard();
    };
}



