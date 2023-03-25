const gameCanvas = document.querySelector('.game-canvas');
const scoreText = document.querySelector('.score');
const highScoreText = document.querySelector('.highs');
const phoneControls = document.querySelectorAll('.phone-controls i');

let foodY;
let foodX;

let snakeY = 10;
let snakeX = 5;

let snakeBody = [];

let velocityY = 0;
let velocityX = 0;

let gameOver = false;
let setIntervalId;

let score = 0;
let highScore = localStorage.getItem('high-score') || 0;
highScore.innerText = `High Score: ${highScore}`;

const randomFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const snakeMovement = (e) => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

phoneControls.forEach(key => {
    key.addEventListener('click', () => snakeMovement({ key: key.dataset.key }));
});

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("It is Game Over! Press OK to play  again.");
    location.reload();
}

const handleGame = () => {
    if(gameOver) return handleGameOver();
    let html = 
    `
        <div class="food" style="grid-area: ${foodY} / ${foodX} "></div>
    `;

    if(snakeX === foodX && snakeY === foodY) {
        randomFoodPosition();
        snakeBody.push([foodX, foodY]);

        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem('high-score', highScore);
        scoreText.innerText = `Score: ${score}`;
        highScoreText.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length -1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += 
    `
        <div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]} "></div>
    `

    if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
        gameOver = true;
    }
    }

    gameCanvas.innerHTML = html;
};

randomFoodPosition();
setIntervalId = setInterval(handleGame, 125);

document.addEventListener("keydown", snakeMovement);