import Snake from "./classes/game/Snake.js";
import CommandPalette from "./classes/game/CommandPalette.js";
import GameState from "./classes/game/GameState.js";

/*------------------------------------------------------------------------------------------*/
function runGame(canvas, mode, levelNumber) {
    // SETUP
    if (mode === "solo" || mode === "multi") {
        const unit = 10;
        const ctx = canvas.getContext("2d");

        /*------------------------------------------------------------------------------------------*/
        if (mode === "solo") {
            // GET LEVEL INFOS
            let level = getLevelObject(levelNumber);

            // CREATE THE GAME STATE
            const gameState = new GameState(level.dimensions, level.delay, level.walls, level.food, level.snake);
            const rows = gameState.dimensions[0] / unit;
            const columns = gameState.dimensions[1] / unit;
            gameState.initWorld(rows, columns);


            // PREPARE CANVAS
            resizeCanvas(canvas, gameState.dimensions[0] * unit, gameState.dimensions[1] * unit);

            // CREATE ELEMENTS
            const snake = new Snake(ctx, unit, gameState.snakeLocations);
            const food = null;

            // LISTEN
            const commandPalette = new CommandPalette("z", "d", "s", "q", document);

            // LAUNCH
            draw(gameState, snake, food, commandPalette);
            setInterval(function () {
                clearCanvas(canvas, ctx);
                draw(gameState, snake, food, commandPalette);
            }, gameState.delay);
        }
        /*------------------------------------------------------------------------------------------*/
        /*------------------------------------------------------------------------------------------*/
        else {
            /* TODO multi */
        }
        /*------------------------------------------------------------------------------------------*/
    }
    else console.error("Mode " + mode + " does not exist");
}
/*------------------------------------------------------------------------------------------*/



// FUNCTIONS
/*------------------------------------------------------------------------------------------*/
function draw(gameState, snake, food, commandPalette) {
    snake.setDirection(commandPalette.currentDirection);
    snake.update();
    snake.show();
}
/*------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------*/
function resizeCanvas(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
}
/*------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------*/
function clearCanvas(canvas, ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
/*------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------*/
function getLevelObject(levelNumber) {
    const result = {
        "dimensions": [80, 40],
        "delay": 200,
        "walls": [
            [5, 5], [5, 6], [5, 7], [5, 8], [70, 35], [71, 35], [72, 35]
        ],
        "food": [
            [10, 10]
        ],
        "snake": [
            [60, 20], [60, 19], [60, 18]
        ]
    };
    return result;
}
/*------------------------------------------------------------------------------------------*/

export { runGame as default };
