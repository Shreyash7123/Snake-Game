const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highscore");
const timeEl = document.getElementById("time");
const pauseBtn = document.getElementById("pauseBtn");

const size = 25;

let cols, rows;

let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 };
let food;

let score = 0;
let highScore = 0;
let time = 0;

let paused = false;
let gameLoopInterval;


let timeInterval = setInterval(() => {
    if (!paused) {
        time++;
        timeEl.textContent = time;
    }
}, 1000);

function setupBoard() {
    const block = 25;

   
    cols = Math.floor(board.clientWidth / block);
    rows = Math.floor(board.clientHeight / block);

    board.innerHTML = "";

    board.style.gridTemplateColumns = `repeat(${cols}, ${block}px)`;
    board.style.gridTemplateRows = `repeat(${rows}, ${block}px)`;

    for (let i = 0; i < cols * rows; i++) {
        const div = document.createElement("div");
        div.classList.add("block");
        board.appendChild(div);
    }
}



function index(x, y) {
    return y * cols + x;
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
    };
}


function checkCollision(x, y) {
    if (x < 0 || x >= cols || y < 0 || y >= rows) return true;
    if (snake.some(s => s.x === x && s.y === y)) return true;
    return false;
}


function gameLoop() {
    if (paused) return;

    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    if (checkCollision(head.x, head.y)) {
        alert("Game Over!");
        highScore = Math.max(highScore, score);
        highScoreEl.textContent = highScore;
        reset();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = score;
        placeFood();
    } else {
        snake.pop();
    }

    draw();
}


function draw() {
    const blocks = document.querySelectorAll(".block");
    blocks.forEach(b => b.className = "block");

    snake.forEach(s => {
        blocks[index(s.x, s.y)].classList.add("snake");
    });

    blocks[index(food.x, food.y)].classList.add("food");
}


function reset() {
    snake = [{ x: 5, y: 5 }];
    direction = { x: 1, y: 0 };
    score = 0;
    time = 0;
    scoreEl.textContent = 0;
    timeEl.textContent = 0;
    placeFood();
}


document.addEventListener("keydown", e => {
    if (paused) return;

    if (e.key === "ArrowUp" && direction.y !== 1) direction = { x: 0, y: -1 };
    if (e.key === "ArrowDown" && direction.y !== -1) direction = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" && direction.x !== 1) direction = { x: -1, y: 0 };
    if (e.key === "ArrowRight" && direction.x !== -1) direction = { x: 1, y: 0 };
});


pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "Resume" : "Pause";
});


setupBoard();
placeFood();
draw();

gameLoopInterval = setInterval(gameLoop, 120);
