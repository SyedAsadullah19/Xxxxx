document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');
    const finalScoreDisplay = document.getElementById('finalScore');
    const gameOverScreen = document.getElementById('gameOver');
    const restartButton = document.getElementById('restartButton');

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Game variables
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let snake = [
        { x: 10, y: 10 }
    ];
    let food = { x: 15, y: 15 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameSpeed = 100;
    let gameLoop;
    
    highScoreDisplay.textContent = highScore;

    function drawGame() {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
    }

    function clearCanvas() {
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        ctx.fillStyle = '#2ecc71';
        snake.forEach((segment, index) => {
            if (index === 0) {
                ctx.fillStyle = '#27ae60'; // Head color
            } else {
                ctx.fillStyle = '#2ecc71'; // Body color
            }
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    function drawFood() {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            generateFood();
            increaseSpeed();
        } else {
            snake.pop();
        }
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Check if food spawned on snake
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            generateFood();
        }
    }

    function checkCollision() {
        const head = snake[0];

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
        }

        // Self collision
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
            }
        }
    }

    function gameOver() {
        clearInterval(gameLoop);
        gameOverScreen.classList.remove('hidden');
        finalScoreDisplay.textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreDisplay.textContent = highScore;
        }
    }

    function increaseSpeed() {
        if (gameSpeed > 50) {
            clearInterval(gameLoop);
            gameSpeed -= 2;
            gameLoop = setInterval(drawGame, gameSpeed);
        }
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        food = { x: 15, y: 15 };
        dx = 0;
        dy = 0;
        score = 0;
        gameSpeed = 100;
        scoreDisplay.textContent = '0';
        gameOverScreen.classList.add('hidden');
        clearInterval(gameLoop);
        gameLoop = setInterval(drawGame, gameSpeed);
    }

    // Add mobile control buttons
    const upButton = document.getElementById('upButton');
    const downButton = document.getElementById('downButton');
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');

    // Add touch controls
    upButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (dy !== 1) { dx = 0; dy = -1; }
    });

    downButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (dy !== -1) { dx = 0; dy = 1; }
    });

    leftButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (dx !== 1) { dx = -1; dy = 0; }
    });

    rightButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (dx !== -1) { dx = 1; dy = 0; }
    });

    // Add click controls for testing on desktop
    upButton.addEventListener('click', () => {
        if (dy !== 1) { dx = 0; dy = -1; }
    });

    downButton.addEventListener('click', () => {
        if (dy !== -1) { dx = 0; dy = 1; }
    });

    leftButton.addEventListener('click', () => {
        if (dx !== 1) { dx = -1; dy = 0; }
    });

    rightButton.addEventListener('click', () => {
        if (dx !== -1) { dx = 1; dy = 0; }
    });

    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    });

    // Prevent default touch behavior to avoid scrolling
    document.querySelectorAll('.mobile-controls button').forEach(button => {
        button.addEventListener('touchstart', e => e.preventDefault());
        button.addEventListener('touchmove', e => e.preventDefault());
        button.addEventListener('touchend', e => e.preventDefault());
    });

    restartButton.addEventListener('click', resetGame);
    gameLoop = setInterval(drawGame, gameSpeed);
});
