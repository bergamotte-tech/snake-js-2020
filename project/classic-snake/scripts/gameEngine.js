import Snake from "./classes/game/Snake.js";
import Food from "./classes/game/Food.js";
import CommandPalette from "./classes/game/CommandPalette.js";
import GameState from "./classes/game/GameState.js";

/*------------------------------------------------------------------------------------------*/
function runGame(canvas, mode, levelNumber) {
    if (mode === "solo" || mode === "multi") {
        const unit = 15;
        const ctx = canvas.getContext("2d");

        // GET LEVEL INFOS
        const level = getLevelObject(mode, levelNumber).catch(error => {
            console.error(error);
        });

        // CREATE ELEMENTS
        const snakesCoordinates = level.snakes;
        const gameSnakes = [];
        snakesCoordinates.forEach(snakeCoordinates => {
            const newSnake = new Snake(ctx, unit, snakeCoordinates);
            newSnake.randomColor();
            gameSnakes.push(newSnake);
        });
        const foodsCoordinates = level.foods;
        const gameFoods = [];
        foodsCoordinates.forEach(foodCoordinates => {
            const newFood = new Food(ctx, unit, foodCoordinates);
            gameFoods.push(newFood);
        });

        // CREATE THE GAME STATE
        const gameState = new GameState(unit, level.dimensions, level.delay, level.walls, gameSnakes, gameFoods);

        // PREPARE CANVAS
        resizeCanvas(canvas, gameState.dimensions[0] * unit, gameState.dimensions[1] * unit);

        // LISTEN
        const commandPalette = new CommandPalette("z", "d", "s", "q", document);
        const commandPalette2 = new CommandPalette("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", document);

        // LAUNCH
        var interval;
        var loopFunction = function () {
            interval = gameState.delay;
            clearCanvas(canvas, ctx);
            draw(gameState, snake, food, commandPalette2);
            setTimeout(loopFunction, interval);
        }
        loopFunction();
    }
    else console.error("Mode " + mode + " does not exist");
}
/*------------------------------------------------------------------------------------------*/



// FUNCTIONS
/*------------------------------------------------------------------------------------------*/
function draw(gameState, snake, food, commandPalette) {
    // SNAKE
    snake.setDirection(commandPalette.currentDirection);
    snake.update();
    snake.show();

    // FOOD
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
async function getLevelObject(mode, levelNumber) {
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
