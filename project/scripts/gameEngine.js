import Snake from "./classes/game/Snake.js";
import Food from "./classes/game/Food.js";
import Wall from "./classes/game/Wall.js";
import GameSupervisor from "./classes/game/GameSupervisor.js";

/*------------------------------------------------------------------------------------------*/
let globalInstanceNumber = 0;
async function runGame(canvas, ctx, mode, levelNumber, gameSnakes) {
  if (mode === "solo" || mode === "multi") {
    globalInstanceNumber++;

    // GET LEVEL INFOS
    const level = await getLevelObject(mode, levelNumber);

    // CREATE ELEMENTS
    const scale = ((canvas.parentNode.clientWidth / level.dimensions[0]) * 0.5).toFixed(0);

    placeSnakes(gameSnakes, scale, level.snakes);
    const gameFoods = createFoods(ctx, scale, level.foods);
    const gameWalls = createWalls(ctx, scale, level.walls);

    // CREATE THE GAME STATE
    const gameSupervisor = new GameSupervisor(
      level.dimensions,
      level.minimumDelay,
      level.borders == "true",
      level.delay,
      gameWalls,
      gameSnakes,
      gameFoods,
      levelNumber
    );

    // PREPARE CANVAS
    resizeCanvas(
      canvas,
      gameSupervisor.dimensions[0] * scale,
      gameSupervisor.dimensions[1] * scale,
      gameSupervisor.hasBorders
    );

    // LAUNCH
    startLoop(canvas, ctx, gameSupervisor, levelNumber);
  } else console.error("Mode " + mode + " does not exist");
  return 0;
}
/*------------------------------------------------------------------------------------------*/

// FUNCTIONS
/*------------------------------------------------------------------------------------------*/
function startLoop(canvas, ctx, gameSupervisor, levelNumber) {
  var music = new Audio(`assets/sounds/level${levelNumber}.mp3`);
  var gameOver = new Audio(`assets/sounds/gameOver.mp3`);
  const originalPlayBackRate = 0.6;
  let newPlayBackRate;
  music.loop = true;
  music.volume = 0.4;
  gameOver.loop = false;
  gameOver.volume = 0.4;

  const instanceNumber = globalInstanceNumber;
  var interval;
  let over = false;
  let alreadyTriggered = false;

  var loopFunction = function () {
    if (instanceNumber < globalInstanceNumber ||
      window.location.hash.substr(0, window.location.hash.length) != "#level" + levelNumber) {
      music.pause();
      gameSupervisor.scoreList.forEach((element) => {
        const div = element[1];
        div.remove();
      });
    }
    else if (over) {
      if (!alreadyTriggered) {
        gameOver.play();
        music.volume = 0.2;
        music.playbackRate = 1;
        alreadyTriggered = true;
      }
      setTimeout(loopFunction, 200);
    }
    else {
      let increase = gameSupervisor.originalDelay / gameSupervisor.delay - 1;
      newPlayBackRate = originalPlayBackRate + increase / 1.8;
      if (newPlayBackRate > 1.8) newPlayBackRate = 1.8;
      music.playbackRate = newPlayBackRate;

      if (gameSupervisor.gameSnakes.length < 1) {
        over = true;
      }

      interval = gameSupervisor.delay;
      clearCanvas(canvas, ctx);
      refreshGame(gameSupervisor);
      setTimeout(loopFunction, interval);
    }
  };
  music.play();
  loopFunction();
}
/*------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------*/
function refreshGame(gameSupervisor) {
  gameSupervisor.refreshGame();
}
/*------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------*/
function resizeCanvas(canvas, width, height, hasBorders) {
  canvas.width = width;
  canvas.height = height;
  if (hasBorders) {
    canvas.style.border = "solid #5F6A73 5px"
  }
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
  const response = await fetch(
    `./config/levels/${mode}/level${levelNumber}.json`
  ).then((response) => response.json());

  for (var i = 0; i < response.length; i++) {
    return response[i];
  }

  return null;
}
/*------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------*/
function placeSnakes(snakes, scale, snakesCoordinates) {
  for (let index = 0; index < snakes.length; index++) {
    const snake = snakes[index];
    const coordinates = snakesCoordinates[index];
    snake.setScale(scale);
    snake.setBody(coordinates);
  }
}
/*------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------*/
function createFoods(ctx, scale, foodsCoordinates) {
  const gameFoods = [];
  foodsCoordinates.forEach((foodCoordinates) => {
    const newFood = new Food(ctx, scale, foodCoordinates);
    gameFoods.push(newFood);
  });
  return gameFoods;
}
/*------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------*/
function createWalls(ctx, scale, wallsCoordinates) {
  const gameWalls = [];
  wallsCoordinates.forEach((wallCoordinates) => {
    const newWall = new Wall(ctx, scale, wallCoordinates);
    gameWalls.push(newWall);
  });
  return gameWalls;
}
/*------------------------------------------------------------------------------------------*/


export { runGame as default };
