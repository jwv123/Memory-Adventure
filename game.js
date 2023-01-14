//Get all Elements
const mainScreenEl = document.querySelector("main");
const introScreenEl = document.querySelector("#intro");

const settingsEl = document.querySelector("#settings");
const boardEl = document.querySelector("#board");

const difficultyEl = document.querySelector("#difficulty");
const correctEl = document.querySelector("#correct");
const scoreEl = document.querySelector("#score");
const multiplyerEl = document.querySelector("#multiplyer");

const resetBtn = document.querySelector("#reset");
const restartBtn = document.querySelector("#restart");

const gameState = {
    "currentDifficulty": "",
    "totalTiles": "",
    "correct": 0,
    "score": 0,
    "multiplyer": 0,
    "tileType": "waterlife",
    "board": {}
}

//Setup Scoreboard
const difficulty = {
    "easy": 12,
    "medium": 24,
    "hard": 36
}

const setScore = function(increaseScore=true) {
    if(increaseScore) {
        gameState.score = gameState.score + (1 * gameState.multiplyer);
        
    } else {
        gameState.score = 0;
    }

    scoreEl.innerText = `Score: ${gameState.score}`;
    
}

const setMultiplyer = function(increaseMultiplyer=true) {
    if(increaseMultiplyer) {
        gameState.multiplyer++;
    } else {
        gameState.multiplyer = 1;
    }

    multiplyerEl.innerText = `Multiplyer: ${gameState.multiplyer}`;
}

const setCorrect = function(increaseCorrect=true) {
    if(increaseCorrect) {
        gameState.correct++;
    } else {
        gameState.correct = 0;
    }
    
    
    correctEl.innerText = `Correct: ${gameState.correct}/${gameState.totalTiles / 2}`;
}

//Setup board
const generateBoardTiles = function(amount) {
    const tileNumbers = [];
    const tilesDivisable = amount / 6;
    let currentNum = 1;
    
    for(let i = 1; i <= amount; i++) {
        tileNumbers.push(currentNum);
        
        if(i % tilesDivisable === 0) currentNum++;
    }
    
    const randomizeBoard = function() {
        let rand = Math.floor(Math.random() * 10) + 1;
        
        if(rand > 5) {
            return -1;
        } else {
            return 1;
        }
        
        return 0;
    }
    return tileNumbers.sort(randomizeBoard);
}

const clearBoard = function() {
    gameState.board = {}
    boardEl.innerHTML = "";
}

//Populate on Screen board
const populateBoard = function(currentDif, previousDif="") {
    clearBoard();
    
    const tiles = generateBoardTiles(difficulty[currentDif]);
    
    for(let i = 1; i <= tiles.length; i++) {
        gameState.board[`tile${i}`] = tiles[i-1];
    }
    
    for (let tileNum of Object.keys(gameState.board)) {
        const tileEl = document.createElement("button");
        const tileClasses = ["tile", tileNum, "blank"];
        tileEl.classList.add(...tileClasses);

        boardEl.appendChild(tileEl);
    }

    if(previousDif === "") {
        boardEl.classList.add(currentDif);
    } else {
        boardEl.classList.replace(previousDif, currentDif);
    }

    difficultyEl.innerText = `Difficulty: ${currentDif}`;
}

//Flip Tile 
const flipTile = function(tile, allowReverseFlip = false) {
    const tilePic = `${gameState.tileType}${gameState.board[tile.classList[1]]}`
    if(tile.classList.contains("blank")) {
        tile.classList.remove("blank");
        tile.classList.add(tilePic);
    } else if(!tile.classList.contains("blank") && allowReverseFlip) {
        tile.classList.remove(tilePic);
        tile.classList.add("blank");
    }
}

//Match two tiles
const matchPairs = function(tile1, tile2) {

    if(tile1.classList[2] === tile2.classList[2]) {
        tile1.disabled = true;
        tile2.disabled = true;
        setMultiplyer();
        setScore();
        setCorrect();
    } else {
        setMultiplyer(false);
        setTimeout(function() {
            flipTile(tile1, true);
            flipTile(tile2, true);
        }, 1500);
    }
}

const restartBoard = function(resetScore=true) {
    setCorrect(false);
    if(resetScore) {
        setScore(false);
    }
    populateBoard(gameState.currentDifficulty);

}

//Run Game Logic
const runGameLogic = function() {
    const tileEls = document.querySelectorAll(".tile");
    let tilesClicked = [];
    for(let tileEl of tileEls) {
        tileEl.addEventListener("click", function() {
            flipTile(this);
            tilesClicked.push(this);

            if(tilesClicked.length === 2) {
                matchPairs(tilesClicked[0], tilesClicked[1]);
                tilesClicked.splice(0, 2);
            }

            if(gameState.correct === (gameState.totalTiles / 2)) {
                setTimeout(function() {
                    alert("You Win!!!");
                    restartBoard(false);
                    runGameLogic();
                }, 1000);
            }
        });
    } 
}

const changeScreenState = function() {
    introScreenEl.classList.toggle("hidden");
    mainScreenEl.classList.toggle("hidden");
}

const setTiles = function() {

}

const getSettings = function(e) {
    e.preventDefault();

    const previousDifficulty = gameState.currentDifficulty;
    gameState.currentDifficulty = e.target.elements.difficulty.value;
    gameState.tileType = e.target.elements.edition.value;

    gameState.totalTiles = difficulty[gameState.currentDifficulty];
    changeScreenState(true);
    populateBoard(gameState.currentDifficulty, previousDifficulty);

    runGameLogic();
}

settingsEl.addEventListener("submit", getSettings);

restartBtn.addEventListener("click", function() {
    restartBoard();
    runGameLogic();
});

resetBtn.addEventListener("click", function() {
    changeScreenState();
});