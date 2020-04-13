import Snake from "./classes/game/Snake.js";
import Food from "./classes/game/Food.js";
import Wall from "./classes/game/Wall.js";
import GameSupervisor from "./classes/game/GameSupervisor.js";
import Popup from "./classes/UI/Popup.js";

/*------------------------------------------------------------------------------------------*/
function runGame(canvas, mode, levelNumber) {
    if (mode === "solo" || mode === "multi") {
        const scale = 10;
        const ctx = canvas.getContext("2d");

        // GET LEVEL INFOS
        const level = getLevelObject(mode, levelNumber);

        // CREATE ELEMENTS
        const gameSnakes = createSnakes(ctx, scale, level.snakes);
        const gameFoods = createFoods(ctx, scale, level.foods);
        const gameWalls = createWalls(ctx, scale, level.walls);

        // CREATE THE GAME STATE
        const gameSupervisor = new GameSupervisor(level.dimensions, level.delay, gameWalls, gameSnakes, gameFoods);

        // PREPARE CANVAS
        resizeCanvas(canvas, gameSupervisor.dimensions[0] * scale, gameSupervisor.dimensions[1] * scale);

        // ASK FOR COMMANDS
        promptCommandPalettes(gameSnakes);

        // LAUNCH
        startLoop(canvas, ctx, gameSupervisor);
    }
    else console.error("Mode " + mode + " does not exist");
}
/*------------------------------------------------------------------------------------------*/



// FUNCTIONS

/*------------------------------------------------------------------------------------------*/
function startLoop(canvas, ctx, gameSupervisor) {
    var interval;
    var loopFunction = function () {
        interval = gameSupervisor.delay;
        clearCanvas(canvas, ctx);
        refreshGame(gameSupervisor);
        setTimeout(loopFunction, interval);
    }
    loopFunction();
}
/*------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------*/
function refreshGame(gameSupervisor) {
    refreshSnakes(gameSupervisor);
    refreshFoods(gameSupervisor);
    refreshWalls(gameSupervisor);
}
function refreshSnakes(gameSupervisor) {
    gameSupervisor.gameSnakes.forEach(snake => {
        snake.update();
        snake.show();
    });
}
function refreshFoods(gameSupervisor) {
}
function refreshWalls(gameSupervisor) {
    gameSupervisor.gameWalls.forEach(wall => {
        wall.show();
    });
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
            [[60, 20], [60, 19], [60, 18]], [[70, 20], [70, 19], [70, 18]]
        ]
    };
    return data;
}
/*------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------*/
function createSnakes(ctx, scale, snakesCoordinates) {
    const gameSnakes = [];
    snakesCoordinates.forEach(snakeCoordinates => {
        const newSnake = new Snake(ctx, scale, snakeCoordinates);
        newSnake.randomColor();
        gameSnakes.push(newSnake);
    });
    return gameSnakes;
}
/*------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------*/
function createFoods(ctx, scale, foodsCoordinates) {
    const gameFoods = [];
    foodsCoordinates.forEach(foodCoordinates => {
        const newFood = new Food(ctx, scale, foodCoordinates);
        gameFoods.push(newFood);
    });
    return gameFoods;
}
/*------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------*/
function createWalls(ctx, scale, wallsCoordinates) {
    const gameWalls = [];
    wallsCoordinates.forEach(wallCoordinates => {
        const newWall = new Wall(ctx, scale, wallCoordinates);
        gameWalls.push(newWall);
    });
    return gameWalls;
}
/*------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------*/
function promptCommandPalettes(gameSnakes) {
    gameSnakes.forEach(snake => {
        const popup = new Popup("title", "msg");
        const rs = popup.prompt("type in your commands Up Right Down Left");
        const commands = rs.split(" "); // TODO fix is null when prompt does not block execution
        console.log(commands);
        console.log(snake);

        snake.setCommandPalette(commands[0], commands[1], commands[2], commands[3]);
    });
}
/*------------------------------------------------------------------------------------------*/

export { runGame as default };
