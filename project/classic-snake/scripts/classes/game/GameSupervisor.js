const EMPTY = 0;
const SNAKE = 10;
const FOOD = 20;
const WALL = 30;

/* 
WORLD = [
            1                   2                   3
1  [  [[CODE, ID], ...], [[CODE, ID], ...], [[CODE, ID], ...]  ]

]
*/

class GameSupervisor {
  constructor(dimensions, delay, gameWalls, gameSnakes, gameFoods) {
    this.dimensions = [...dimensions];
    this.delay = delay;
    this.gameWalls = [...gameWalls];
    this.gameSnakes = [...gameSnakes];
    this.gameFoods = [...gameFoods];

    this.columns = this.dimensions[0];
    this.rows = this.dimensions[1];
    this.world = this.initWorld(this.rows, this.columns);
  }

  initWorld(rows, columns) {
    let tempWorld = [];
    for (let i = 0; i < rows; i++) {
      const line = [];
      for (let j = 0; j < columns; j++) {
        const elementsHere = this.initCell(j, i); //i is row (y axis), j is column (x axis)
        line[j] = elementsHere;
      }
      tempWorld[i] = line;
    }
    return tempWorld;
  }

  refreshGame() {
    this.moveSnakes();
    this.handleEvents();
    this.showGame();
  }

  moveSnakes() {
    this.gameSnakes.forEach(snake => {
      // REMOVE "SNAKE" WHERE THE SNAKE IS NO MORE
      const snakeBody = snake.getBody();
      this.removeElementFromCell(snakeBody[0][0], snakeBody[0][1], snake.getId());
      // ADD "SNAKE" WHERE THE NEW HEAD IS
      const snakeHead = snake.getHead();
      this.addElementToCell(snakeHead[0], snakeHead[1], [SNAKE, snake.getId()]);
      // MOVE
      snake.move();
    });
  }

  handleEvents() {
    this.gameSnakes.forEach(snake => {
      const headCoordinates = snake.getHead();
      const elementsHere = this.getCellElements(headCoordinates[0], headCoordinates[1]);

      elementsHere.forEach(element => {
        const elementCode = element[0];
        const elementId = element[1];
        switch (elementCode) {
          case WALL:
            console.log("wall encountered");
            break;
          case SNAKE:
            if (snake.getId() != elementId) {
              console.log("other snake encountered");
            }
            break;
          case FOOD:
            console.log("food encountered");
            break;
          default:
            break;
        }
      });

    });
  }

  updateWorld() {
  }

  showGame() {
    this.gameSnakes.forEach(snake => {
      snake.show();
    });
    this.gameFoods.forEach(food => {
      food.show();
    });
    this.gameWalls.forEach(wall => {
      wall.show();
    });
  }

  // FUNCTIONS
  /*------------------------------------------------------------------------------------------*/
  // only used for initialisation
  initCell(x, y) {
    let elementsHere = [];
    let foundSomething = false;

    this.gameWalls.forEach(wall => {
      if (wall.coordinates[0] === x && wall.coordinates[1] === y) {
        elementsHere.push([WALL, wall.id]); foundSomething = true;
      }
    });
    this.gameFoods.forEach(food => {
      if (food.coordinates[0] === x && food.coordinates[1] === y) {
        elementsHere.push([FOOD, food.id]); foundSomething = true;
      }
    });
    this.gameSnakes.forEach(snake => {
      snake.body.forEach(coordinates => {
        if (coordinates[0] === x && coordinates[1] === y) {
          elementsHere.push([SNAKE, snake.id]); foundSomething = true;
        }
      });
    });

    if (!foundSomething) elementsHere.push([EMPTY, null]);
    return elementsHere;
  }

  getCellElements(x, y) {
    return this.world[y][x]; //1st is row (y axis), 2nd is column (x axis)
  }
  /*------------------------------------------------------------------------------------------*/

  /*------------------------------------------------------------------------------------------*/
  removeElementFromCell(x, y, id) {
    const elementsHere = this.getCellElements(x, y);
    for (let index = 0; index < elementsHere.length; index++) {
      const codeAndId = elementsHere[index];
      if (codeAndId[1] === id) {
        elementsHere.splice(index);
      }
    }
  }

  addElementToCell(x, y, element) {
    this.world[y][x].push(element);
  }
  /*------------------------------------------------------------------------------------------*/
}

export { GameSupervisor as default };
