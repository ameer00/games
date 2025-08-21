const canvas = document.getElementById('tetris-canvas');

const app = new PIXI.Application({
    view: canvas,
    width: 300,
    height: 600,
    backgroundColor: 0x000000,
});

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const grid = new PIXI.Graphics();
grid.lineStyle(1, 0xffffff, 0.2);

for (let i = 0; i < COLS; i++) {
    grid.moveTo(i * BLOCK_SIZE, 0);
    grid.lineTo(i * BLOCK_SIZE, ROWS * BLOCK_SIZE);
}

for (let i = 0; i < ROWS; i++) {
    grid.moveTo(0, i * BLOCK_SIZE);
    grid.lineTo(COLS * BLOCK_SIZE, i * BLOCK_SIZE);
}

app.stage.addChild(grid);

const TETROMINOES = {
    'I': [[1, 1, 1, 1]],
    'J': [[1, 0, 0], [1, 1, 1]],
    'L': [[0, 0, 1], [1, 1, 1]],
    'O': [[1, 1], [1, 1]],
    'S': [[0, 1, 1], [1, 1, 0]],
    'T': [[0, 1, 0], [1, 1, 1]],
    'Z': [[1, 1, 0], [0, 1, 1]]
};

const COLORS = {
    'I': 0x00ffff,
    'J': 0x0000ff,
    'L': 0xffa500,
    'O': 0xffff00,
    'S': 0x00ff00,
    'T': 0x800080,
    'Z': 0xff0000
};

function newTetromino() {
    const shapes = 'IOTSZJL';
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const tetromino = TETROMINOES[shape];
    const color = COLORS[shape];
    const x = Math.floor(COLS / 2) - Math.floor(tetromino[0].length / 2);
    const y = 0;

    return { shape, tetromino, color, x, y };
}

let currentTetromino = newTetromino();
let currentTetrominoContainer = new PIXI.Container();
app.stage.addChild(currentTetrominoContainer);

function drawTetromino() {
    currentTetrominoContainer.removeChildren();
    const shape = currentTetromino.tetromino;
    const color = currentTetromino.color;
    const x = currentTetromino.x;
    const y = currentTetromino.y;

    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const block = new PIXI.Graphics();
                block.beginFill(color);
                block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
                block.endFill();
                block.x = (x + col) * BLOCK_SIZE;
                block.y = (y + row) * BLOCK_SIZE;
                currentTetrominoContainer.addChild(block);
            }
        }
    }
}

function isValidMove(tetromino, x, y) {
    for (let row = 0; row < tetromino.length; row++) {
        for (let col = 0; col < tetromino[row].length; col++) {
            if (tetromino[row][col]) {
                const newX = x + col;
                const newY = y + row;
                if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function handleKeyDown(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (isValidMove(currentTetromino.tetromino, currentTetromino.x - 1, currentTetromino.y)) {
                currentTetromino.x--;
            }
            break;
        case 'ArrowRight':
            if (isValidMove(currentTetromino.tetromino, currentTetromino.x + 1, currentTetromino.y)) {
                currentTetromino.x++;
            }
            break;
        case 'ArrowDown':
            if (isValidMove(currentTetromino.tetromino, currentTetromino.x, currentTetromino.y + 1)) {
                currentTetromino.y++;
            }
            break;
        case 'ArrowUp':
            const rotated = rotate(currentTetromino.tetromino);
            if (isValidMove(rotated, currentTetromino.x, currentTetromino.y)) {
                currentTetromino.tetromino = rotated;
            }
            break;
    }
    drawTetromino();
}

function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    return result;
}

document.addEventListener('keydown', handleKeyDown);

let score = 0;
let level = 1;
let linesCleared = 0;

const scoreText = new PIXI.Text('Score: 0', { fill: 0xffffff });
scoreText.x = 10;
scoreText.y = 10;
app.stage.addChild(scoreText);

const levelText = new PIXI.Text('Level: 1', { fill: 0xffffff });
levelText.x = 200;
levelText.y = 10;
app.stage.addChild(levelText);

function gameLoop() {
    if (isValidMove(currentTetromino.tetromino, currentTetromino.x, currentTetromino.y + 1)) {
        currentTetromino.y++;
    } else {
        // lock tetromino
        const shape = currentTetromino.tetromino;
        const x = currentTetromino.x;
        const y = currentTetromino.y;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    board[y + row][x + col] = currentTetromino.color;
                }
            }
        }

        // clear lines
        let cleared = 0;
        for (let row = 0; row < ROWS; row++) {
            if (board[row].every(cell => cell !== 0)) {
                cleared++;
                board.splice(row, 1);
                board.unshift(Array(COLS).fill(0));
            }
        }

        // update score
        if (cleared > 0) {
            score += cleared * 10 * level;
            linesCleared += cleared;
            scoreText.text = `Score: ${score}`;
        }

        // update level
        if (linesCleared >= 10) {
            level++;
            linesCleared -= 10;
            levelText.text = `Level: ${level}`;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, 1000 / level);
        }

        currentTetromino = newTetromino();

        if (!isValidMove(currentTetromino.tetromino, currentTetromino.x, currentTetromino.y)) {
            gameOver();
        }
    }

    app.stage.removeChild(grid);
    drawBoard();
    app.stage.addChild(grid);
    drawTetromino();
}

function gameOver() {
    clearInterval(gameInterval);
    const gameOverText = new PIXI.Text('Game Over', { fill: 0xffffff, fontSize: 40 });
    gameOverText.anchor.set(0.5);
    gameOverText.x = app.screen.width / 2;
    gameOverText.y = app.screen.height / 2;
    app.stage.addChild(gameOverText);
}

function drawBoard() {
    // Clear the stage before redrawing the board
    for (let i = app.stage.children.length - 1; i >= 0; i--) {
        if (app.stage.children[i] instanceof PIXI.Graphics && app.stage.children[i] !== grid) {
            app.stage.removeChild(app.stage.children[i]);
        }
    }

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                const block = new PIXI.Graphics();
                block.beginFill(board[row][col]);
                block.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
                block.endFill();
                block.x = col * BLOCK_SIZE;
                block.y = row * BLOCK_SIZE;
                app.stage.addChild(block);
            }
        }
    }
}

let gameInterval = setInterval(gameLoop, 1000);

drawTetromino();
