let currentRow = 0;
const maxRows = 6;
let secretPhrase = "";
let emojiHint = "";
let gameMode = "";
let guessed = false;
let scoreVisual = "";
let attempts = [];

function getDailyPuzzle() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % emojiPuzzles.length;
    return emojiPuzzles[index];
}

function startGame(mode) {
    gameMode = mode;
    document.getElementById("modeSelect").style.display = "none";
    document.getElementById("gameArea").style.display = "block";

    currentRow = 0;
    guessed = false;
    scoreVisual = "";
    attempts = [];
    document.getElementById("message").textContent = "";
    document.getElementById("shareBtn").style.display = "none";
    document.getElementById("guessInput").disabled = false;

    if (mode === "daily") {
        const puzzle = getDailyPuzzle();
        secretPhrase = puzzle.answer.toLowerCase();
        emojiHint = puzzle.hint;
        const saved = JSON.parse(localStorage.getItem(`emojidle-${secretPhrase}`));
        if (saved) {
            guessed = saved.guessed;
            attempts = saved.attempts;
            scoreVisual = saved.scoreVisual;
        }
    } else {
        const random = emojiPuzzles[Math.floor(Math.random() * emojiPuzzles.length)];
        secretPhrase = random.answer.toLowerCase();
        emojiHint = random.hint;
    }

    document.getElementById("emojiHint").textContent = `Hint: ${emojiHint}`;
    createBoard();

    if (attempts.length > 0) {
        attempts.forEach((guess, index) => renderGuess(guess, index));
        currentRow = attempts.length;
        if (guessed || currentRow >= maxRows) {
            document.getElementById("guessInput").disabled = true;
            document.getElementById("message").textContent = guessed
                ? "You already guessed it!"
                : `Out of attempts! Answer: ${secretPhrase}`;
            document.getElementById("shareBtn").style.display = "block";
        }
    }
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let i = 0; i < maxRows; i++) {
        const row = document.createElement("div");
        row.classList.add("tile");
        row.id = `row-${i}`;
        board.appendChild(row);
    }
}

function submitGuess() {
    const input = document.getElementById("guessInput");
    const guess = input.value.toLowerCase().trim();
    if (!guess) return;

    if (guessed || currentRow >= maxRows) return;

    const row = document.getElementById(`row-${currentRow}`);
    row.textContent = guess;

    attempts.push(guess);

    let feedback = getFeedback(guess, secretPhrase);
    scoreVisual += feedback + "\n";

    if (guess === secretPhrase) {
        guessed = true;
        document.getElementById("message").textContent = "Correct!";
        document.getElementById("shareBtn").style.display = "block";
    } else {
        currentRow++;
        if (currentRow >= maxRows) {
            document.getElementById("message").textContent = `Out of attempts! Answer: ${secretPhrase}`;
            document.getElementById("shareBtn").style.display = "block";
            guessed = true;
        }
    }

    if (gameMode === "daily") {
        localStorage.setItem(
            `emojidle-${secretPhrase}`,
            JSON.stringify({ guessed, attempts, scoreVisual })
        );
    }

    input.value = "";
    if (guessed || currentRow >= maxRows) {
        input.disabled = true;
    }
}

function getFeedback(guess, answer) {
    const guessWords = guess.split(" ");
    const answerWords = answer.split(" ");
    let emojiScore = "";

    for (let i = 0; i < answerWords.length; i++) {
        if (guessWords[i] === answerWords[i]) {
            emojiScore += "🟩";
        } else if (answerWords.includes(guessWords[i])) {
            emojiScore += "🟨";
        } else {
            emojiScore += "⬛";
        }
    }

    return emojiScore;
}

function shareResult() {
    const text = `Emojidle (${gameMode})\n${emojiHint}\n${scoreVisual.trim()}`;
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
