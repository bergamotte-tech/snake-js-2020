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

    let scale;
    const widthRatio = (canvas.parentNode.clientWidth / level.dimensions[0]).toFixed(0);
    const heightRatio = (canvas.parentNode.clientHeight / level.dimensions[1]).toFixed(0);

    if (widthRatio < heightRatio) {
      scale = (widthRatio * 0.95).toFixed(0);
    }
    else {
      scale = (heightRatio * 0.95).toFixed(0);
    }

    // CREATE ELEMENTS
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
    startLoop(canvas, ctx, gameSupervisor, gameSnakes, levelNumber);
  } else console.error("Mode " + mode + " does not exist");
  return 0;
}
/*------------------------------------------------------------------------------------------*/

// FUNCTIONS
/*------------------------------------------------------------------------------------------*/
function startLoop(canvas, ctx, gameSupervisor, gameSnakes, levelNumber) {
  var music = new Audio(`assets/sounds/level${levelNumber}.mp3`);
  music.loop = true;
  music.volume = 0.5;
  const originalPlayBackRate = 0.65;
  let newPlayBackRate;
  // var gameOver = new Audio(`assets/sounds/gameOver.mp3`);
  // gameOver.loop = false;
  // gameOver.volume = 0.4;

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
      gameSnakes.forEach(snake => {
        snake.reset();
      });
    }
    else if (over) {
      if (!alreadyTriggered) {
        // gameOver.play();
        music.volume = 0.2;
        music.playbackRate = 1;
        const title = document.getElementsByClassName("arcade-title")[0];
        const winningTeams = getWinningTeams(gameSnakes);
        title.innerHTML = winningTeams;
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
    canvas.style.border = "solid #5F6A73 0.5rem"
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
    `./config/levels/level${levelNumber}.json`
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

function getWinningTeams(gameSnakes) {
  const teamTotals = [0, 0, 0, 0];
  gameSnakes.forEach(snake => {
    const index = snake.getTeam() - 1;
    teamTotals[index] += snake.getScore();
  });

  let maxIndexes = [0];
  for (let index = 1; index < teamTotals.length; index++) {
    if (teamTotals[index] > teamTotals[maxIndexes[0]]) maxIndexes = [index];
    else if (teamTotals[index] === teamTotals[maxIndexes[0]]) maxIndexes.push(index);
  }

  let sentence;
  let teams = [];
  console.log(maxIndexes);

  maxIndexes.forEach(index => {
    switch (index) {
      case 0:
        teams.push(" Blue");
        break;
      case 1:
        teams.push(" Green");
        break;
      case 2:
        teams.push(" Red");
        break;
      case 3:
        teams.push(" Yellow");
        break;
      default:
        break;
    }
  });
  if (maxIndexes.length > 1) {
    sentence = "It's a draw between" + teams.toString() + " !";
  }
  else {
    sentence = teams[0] + " team wins !";
  }
  //   const teamNames=[, "Blue", "Green", "Red", "Yellow"];
  // console.log(`It's a draw between teams ${teams.map(t => teamNames[t]).join(', ')}`);
  return sentence;
}


export { runGame as default };
