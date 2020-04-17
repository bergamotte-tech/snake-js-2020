import Snake from "./classes/game/Snake.js";
import Food from "./classes/game/Food.js";
import Wall from "./classes/game/Wall.js";
import GameSupervisor from "./classes/game/GameSupervisor.js";

/*------------------------------------------------------------------------------------------*/
let globalInstanceNumber = 0;
async function runGame(canvas, ctx, scale, mode, levelNumber, gameSnakes) {
  if (mode === "solo" || mode === "multi") {

    globalInstanceNumber++;

    // GET LEVEL INFOS
    const level = await getLevelObject(mode, levelNumber);

    // CREATE ELEMENTS
    placeSnakes(gameSnakes, level.snakes);
    const gameFoods = createFoods(ctx, scale, level.foods);
    const gameWalls = createWalls(ctx, scale, level.walls);

    // CREATE THE GAME STATE
    const gameSupervisor = new GameSupervisor(
      level.dimensions,
      level.minimumDelay,
      (level.borders == "true"),
      level.delay,
      gameWalls,
      gameSnakes,
      gameFoods
    );

    // PREPARE CANVAS
    resizeCanvas(
      canvas,
      gameSupervisor.dimensions[0] * scale,
      gameSupervisor.dimensions[1] * scale
    );

    // LAUNCH
    startLoop(canvas, ctx, gameSupervisor, levelNumber);
  } else console.error("Mode " + mode + " does not exist"); return 0;
}
/*------------------------------------------------------------------------------------------*/


// FUNCTIONS
/*------------------------------------------------------------------------------------------*/
function startLoop(canvas, ctx, gameSupervisor, levelNumber) {
  const instanceNumber = globalInstanceNumber;

  var music = new Audio('../assets/sounds/music.mp3');
  var gameOver = new Audio('../assets/sounds/gameOver.mp3');
  const originalPlayBackRate = 0.6;
  let newPlayBackRate;
  music.loop = true;
  music.volume = 0.2;
  gameOver.loop = false;
  gameOver.volume = 0.18;


  var interval;
  let over = false;
  var loopFunction = function () {
    if (!over && instanceNumber >= globalInstanceNumber && (window.location.hash.substr(0, window.location.hash.length) === "#level" + levelNumber)) {

      let increase = (gameSupervisor.originalDelay / gameSupervisor.delay) - 1;
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
    else if (over) {
      gameOver.play();
      music.pause();
    }
    else {
      music.pause();
      gameSupervisor.scoreList.forEach(element => {
        const div = element[1];
        div.remove();
      });
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
function placeSnakes(snakes, snakesCoordinates) {
  for (let index = 0; index < snakes.length; index++) {
    const snake = snakes[index];
    const coordinates = snakesCoordinates[index];
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
