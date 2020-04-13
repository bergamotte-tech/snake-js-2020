import Snake from "./classes/game/Snake.js";
import Food from "./classes/game/Food.js";
import GameState from "./classes/game/GameState.js";

/*------------------------------------------------------------------------------------------*/
function runGame(canvas, mode, levelNumber) {
    if (mode === "solo" || mode === "multi") {
        const scale = 10;
        const ctx = canvas.getContext("2d");

        // GET LEVEL INFOS
        const level = getLevelObject(mode, levelNumber);

        // CREATE ELEMENTS
        /* SNAKES AND COMMANDS */
        const snakesCoordinates = level.snakes;
        const gameSnakes = [];
        snakesCoordinates.forEach(snakeCoordinates => {
            const commandPalette = new CommandPalette("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", document);
            const newSnake = new Snake(ctx, scale, snakeCoordinates, commandPalette);
            i++;
            newSnake.randomColor();
            gameSnakes.push(newSnake);
        });
        /* FOODS */
        const foodsCoordinates = level.foods;
        const gameFoods = [];
        foodsCoordinates.forEach(foodCoordinates => {
            const newFood = new Food(ctx, scale, foodCoordinates);
            gameFoods.push(newFood);
        });

        // CREATE THE GAME STATE
        const gameState = new GameState(level.dimensions, level.delay, level.walls, gameSnakes, gameFoods);

        // PREPARE CANVAS
        resizeCanvas(canvas, gameState.dimensions[0] * scale, gameState.dimensions[1] * scale);

        // LAUNCH
        var interval;
        var loopFunction = function () {
            interval = gameState.delay;
            clearCanvas(canvas, ctx);
            update(gameState, commandPalettes);
            setTimeout(loopFunction, interval);
        }
        loopFunction();
    }
    else console.error("Mode " + mode + " does not exist");
}
/*------------------------------------------------------------------------------------------*/



// FUNCTIONS
/*------------------------------------------------------------------------------------------*/
function update(gameState, commandPalettes) {
    // SNAKES
    gameSnakes = gameState.gameSnakes;
    gameSnakes.forEach(snake => {
        snake.setDirection(commandPalette.currentDirection);
        snake.update();
        snake.show();
    });

    // FOODS
    food.update();
    food.show();
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
function getLevelObject(mode, levelNumber) {
    // const response = await fetch(url);
    // const data = await response.json();

    const data = {
        "dimensions": [80, 40],
        "delay": 500,
        "walls": [
            [5, 5], [5, 6], [5, 7], [5, 8], [70, 35], [71, 35], [72, 35]
        ],
        "foods": [
            [10, 10], [14, 15]
        ],
        "snakes": [
            [[60, 20], [60, 19], [60, 18]], [[70, 20], [70, 19], [70, 18]], [[50, 20], [50, 19], [50, 18]]
        ]
    };
    return data;
}
/*------------------------------------------------------------------------------------------*/

export { runGame as default };
