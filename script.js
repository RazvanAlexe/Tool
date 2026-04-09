let currentRow = 0;
const maxRows = 6;
let secretWord = "";
let gameMode = "";
let guessed = false;
let scoreVisual = "";

function getDailyWord() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % wordList.length;
    return wordList[index].toUpperCase();
}

function startGame(mode) {
    gameMode = mode;
    document.getElementById("modeSelect").style.display = "none";
    document.getElementById("gameArea").style.display = "block";

    currentRow = 0;
    guessed = false;
    scoreVisual = "";
    document.getElementById("message").textContent = "";
    document.getElementById("shareBtn").style.display = "none";
    document.getElementById("guessInput").disabled = false;

    if (mode === "daily") {
        secretWord = getDailyWord();
        const savedData = JSON.parse(localStorage.getItem(`daily-${secretWord}`));
        if (savedData) {
            guessed = savedData.guessed;
            scoreVisual = savedData.scoreVisual;
            currentRow = savedData.attempts.length;
            createBoard();
            savedData.attempts.forEach((guess, rowIndex) => renderGuess(guess, rowIndex));
            if (guessed || currentRow >= maxRows) {
                document.getElementById("guessInput").disabled = true;
                document.getElementById("message").textContent = guessed
                    ? "You've already guessed it!"
                    : `Out of attempts! The word was: ${secretWord}`;
                document.getElementById("shareBtn").style.display = "block";
            }
        } else {
            createBoard();
        }
    } else {
        secretWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
        createBoard();
    }
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let i = 0; i < maxRows; i++) {
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = `row-${i}-tile-${j}`;
            board.appendChild(tile);
        }
    }
}

function submitGuess() {
    const input = document.getElementById("guessInput");
    const guess = input.value.toUpperCase();
    if (guess.length !== 5) {
        alert("Enter a 5-letter word.");
        return;
    }
    if (guessed || currentRow >= maxRows) return;

    renderGuess(guess, currentRow);
    scoreVisual += evaluateGuess(guess) + "\n";

    if (guess === secretWord) {
        guessed = true;
        document.getElementById("message").textContent = "You guessed it!";
        document.getElementById("shareBtn").style.display = "block";
    } else {
        currentRow++;
        if (currentRow >= maxRows) {
            document.getElementById("message").textContent = `Out of attempts! The word was: ${secretWord}`;
            guessed = true;
            document.getElementById("shareBtn").style.display = "block";
        }
    }

    if (gameMode === "daily") {
        const existing = JSON.parse(localStorage.getItem(`daily-${secretWord}`)) || {
            attempts: [],
            guessed: false,
            scoreVisual: ""
        };
        existing.attempts.push(guess);
        existing.guessed = guessed;
        existing.scoreVisual = scoreVisual;
        localStorage.setItem(`daily-${secretWord}`, JSON.stringify(existing));
    }

    input.value = "";
    if (guessed || currentRow >= maxRows) {
        input.disabled = true;
    }
}

function renderGuess(guess, rowIndex) {
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(`row-${rowIndex}-tile-${i}`);
        tile.textContent = guess[i];

        if (guess[i] === secretWord[i]) {
            tile.classList.add("correct");
        } else if (secretWord.includes(guess[i])) {
            tile.classList.add("present");
        } else {
            tile.classList.add("absent");
        }
    }
}

function evaluateGuess(guess) {
    let result = "";
    for (let i = 0; i < 5; i++) {
        if (guess[i] === secretWord[i]) {
            result += "🟩";
        } else if (secretWord.includes(guess[i])) {
            result += "🟨";
        } else {
            result += "⬛";
        }
    }
    return result;
}

function shareResult() {
    const text = `Wordle (${gameMode})\n${scoreVisual.trim()}`;
    navigator.clipboard.writeText(text).then(() => {
        alert("Result copied to clipboard!");
    });
}

function returnToMenu() {
    document.getElementById("gameArea").style.display = "none";
    document.getElementById("modeSelect").style.display = "block";
    document.getElementById("board").innerHTML = "";
    document.getElementById("guessInput").value = "";
}
