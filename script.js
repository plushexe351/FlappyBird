var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var bird = new Image();
bird.src = 'images/bird.png';

var birdX = canvas.width / 2 - 30; // Adjusted for centering horizontally
var birdY = canvas.height / 2 - 22.5; // Adjusted for centering vertically
var birdWidth = 40 * 1.1;
var birdHeight = 30 * 1.1;
var gravity = 0.5;
var jump = 8.5;
var velocity = 0;
var gameStarted = false;
var gameOver = false;
var stopObstacles = false;

var obstacles = [];
var gap = 150;
var obstacleSpeed = 2;

var pipeTop = new Image();
pipeTop.src = 'images/pipe_top.png';
var pipeBottom = new Image();
pipeBottom.src = 'images/pipe_bottom.png';

var groundHeight = 30; // Adjust ground height as needed



document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        if (gameOver) {
            reset();
        } else if (!gameStarted) {
            gameStarted = true;
        } else {
            velocity = -jump;
        }
    }
});

document.addEventListener('click', () => {
    if (gameOver) {
        reset();
    } else if (!gameStarted) {
        gameStarted = true;
    } else {
        velocity = -jump;
    }
})

bird.onload = function () {
    drawBird();
    draw();
};

function reset() {
    birdY = canvas.height / 2 - 22.5; // Adjusted for centering vertically
    velocity = 0;
    obstacles = [];
    gameStarted = false;
    gameOver = false;
    stopObstacles = false;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    birdX = canvas.width / 2 - 30; // Adjusted for centering horizontally during window resize
    birdY = canvas.height / 2 - 22.5; // Adjusted for centering vertically during window resize


}

window.addEventListener('resize', function () {
    resizeCanvas();
    draw();
    reset();


});

function checkCollision(birdX, birdY, birdWidth, birdHeight, obstacle) {
    if (
        birdX < obstacle.x + obstacle.width &&
        birdX + birdWidth > obstacle.x &&
        (birdY < obstacle.top || birdY + birdHeight > obstacle.top + gap || birdY + birdHeight > canvas.height - groundHeight)
    ) {
        return true; // Collision detected
    }
    return false; // No collision
}

function drawObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        var obs = obstacles[i];
        ctx.drawImage(pipeTop, obs.x, 0, 50, obs.top);
        ctx.drawImage(pipeBottom, obs.x, obs.top + gap, 50, canvas.height - (obs.top + gap + groundHeight));
        if (!stopObstacles) {
            obs.x -= obstacleSpeed;
        }

        if (checkCollision(birdX, birdY, birdWidth, birdHeight, obs) && !gameOver) {
            // Collision detected
            gameOver = true;
            stopObstacles = true;
        }

        if (obs.x + 50 <= 0) {
            obstacles.shift();
        }
    }
}

function generateObstacle() {
    var min = 50;
    var max = canvas.height - gap - groundHeight - 50;
    var topHeight = Math.floor(Math.random() * (max - min + 1)) + min;
    obstacles.push({ x: canvas.width, top: topHeight, width: 50 });
}

function drawBird() {
    ctx.drawImage(bird, birdX, birdY, birdWidth, birdHeight);
}



function draw() {
    if (gameStarted) {
        velocity += gravity;
        birdY += velocity;

        if (birdY > canvas.height - birdHeight - groundHeight) {
            birdY = canvas.height - birdHeight - groundHeight;
            velocity = 0;
            if (!gameOver) {
                gameOver = true;
                stopObstacles = true;
            }
        } else if (birdY < 0) {
            birdY = 0;
            velocity = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();



        drawObstacles();
        if (!gameOver && (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 300)) {
            generateObstacle();
        }
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        ctx.fillStyle = "lightgreen";
        ctx.font = "30px Arial";


        ctx.fillText("Tap or Spacebar to start", canvas.width / 2 - 150, 40);
    }

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 80, 80);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Tap or Spacebar to restart", canvas.width / 2 - 120, 120);
    }

    requestAnimationFrame(draw);
}

resizeCanvas();