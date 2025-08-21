const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');

const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;

const COLORS = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF'
];

const SHAPES = [
    [],
    [[1, 1, 1, 1]],
    [[2, 2], [2, 2]],
    [[0, 3, 0], [3, 3, 3]],
    [[4, 4, 0], [0, 4, 4]],
    [[0, 5, 5], [5, 5, 0]],
    [[6, 0, 0], [6, 6, 6]],
    [[0, 0, 7], [7, 7, 7]]
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let level = 1;
let gameOver = false;

let currentPiece;
let nextPiece;

function drawBlock(x, y, color, ctx = context) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                drawBlock(x, y, COLORS[value]);
            }
        });
    });
}

function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                drawBlock(piece.x + x, piece.y + y, COLORS[value]);
            }
        });
    });
}

function drawNextPiece() {
    nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    const piece = nextPiece;
    const x = piece.shape[0].length === 4 ? 0 : 1;
    const y = piece.shape.length === 4 ? 1 : 0;

    piece.shape.forEach((row, pieceY) => {
        row.forEach((value, pieceX) => {
            if (value > 0) {
                drawBlock(pieceX + x, pieceY + y, COLORS[value], nextContext);
            }
        });
    });
}

function gameLoop() {
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece(currentPiece);
    drawNextPiece();

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    level = 1;
    gameOver = false;
    scoreElement.innerText = score;
    levelElement.innerText = level;
    spawnPiece();
    gameLoop();
}

function spawnPiece() {
    const typeId = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
    const shape = SHAPES[typeId];
    currentPiece = {
        x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
        y: 0,
        shape: shape
    };

    const nextTypeId = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
    nextPiece = {
        shape: SHAPES[nextTypeId]
    };

    if (isCollision()) {
        gameOver = true;
    }
}

function isCollision(piece = currentPiece) {
    return piece.shape.some((row, y) => {
        return row.some((value, x) => {
            if (value === 0) {
                return false;
            }
            const newX = piece.x + x;
            const newY = piece.y + y;
            return newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY] && board[newY][newX] !== 0);
        });
    });
}

function lockPiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                board[currentPiece.y + y][currentPiece.x + x] = value;
            }
        });
    });
    clearLines();
    spawnPiece();
}

function clearLines() {
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(value => value > 0)) {
            linesCleared++;
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            y++;
        }
    }
    if (linesCleared > 0) {
        score += linesCleared * 100 * level;
        scoreElement.innerText = score;
        if (score > level * 500) {
            level++;
            levelElement.innerText = level;
        }
    }
}


document.addEventListener('keydown', event => {
    if (gameOver) {
        return;
    }

    if (event.key === 'ArrowLeft') {
        currentPiece.x--;
        if (isCollision()) {
            currentPiece.x++;
        }
    } else if (event.key === 'ArrowRight') {
        currentPiece.x++;
        if (isCollision()) {
            currentPiece.x--;
        }
    } else if (event.key === 'ArrowDown') {
        currentPiece.y++;
        if (isCollision()) {
            currentPiece.y--;
            lockPiece();
        }
    } else if (event.key === 'ArrowUp') {
        const rotated = [];
        for (let y = 0; y < currentPiece.shape[0].length; y++) {
            rotated.push([]);
            for (let x = 0; x < currentPiece.shape.length; x++) {
                rotated[y].unshift(currentPiece.shape[x][y]);
            }
        }
        const previousShape = currentPiece.shape;
        currentPiece.shape = rotated;
        if (isCollision()) {
            currentPiece.shape = previousShape;
        }
    }
});

setInterval(() => {
    if (!gameOver) {
        currentPiece.y++;
        if (isCollision()) {
            currentPiece.y--;
            lockPiece();
        }
    }
}, 1000 / level);

resetGame();
