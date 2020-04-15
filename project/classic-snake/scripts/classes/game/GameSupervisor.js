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
    this.grid = this.initGrid(this.rows, this.columns);
  }

  initGrid(rows, columns) {
    let tempGrid = [];
    for (let i = 0; i < rows; i++) {
      const line = [];
      for (let j = 0; j < columns; j++) {
        const elementsHere = this.initCell(j, i); //i is row (y axis), j is column (x axis)
        line[j] = elementsHere;
      }
      tempGrid[i] = line;
    }
    return tempGrid;
  }

  /*------------------------------------------------------------------------------------------*/
  refreshGame() {
    this.moveSnakes();
    this.handleEvents();
    this.updateGrid();
    this.showGame();
  }
  /*------------------------------------------------------------------------------------------*/


  /*------------------------------------------------------------------------------------------*/
  moveSnakes() {
    this.gameSnakes.forEach(snake => {
      // REMOVE OLD TAIL FROM GRID
      const snakeTail = snake.getBody()[0];
      this.removeElementFromCell(snakeTail[0], snakeTail[1], snake.getId());

      snake.move();

      // ADD "SNAKE" WHERE THE NEW HEAD IS
      const snakeHead = snake.getHead();
      this.addElementToCell(snakeHead[0], snakeHead[1], [SNAKE, snake.getId()]);
    });
  }
  /*------------------------------------------------------------------------------------------*/


  /*------------------------------------------------------------------------------------------*/
  handleEvents() {
    this.gameSnakes.forEach(snake => {
      const headCoordinates = snake.getHead();
      const elementsHere = this.getCellElements(headCoordinates[0], headCoordinates[1]);

      let selfEncounter = 0; // if the snake bites itself, selfEncounter will be = 2

      elementsHere.forEach(element => {
        const elementCode = element[0];
        const elementId = element[1];

        switch (elementCode) {
          case WALL:
            console.log("wall encountered by snake n° " + snake.getId());
            snake.die();
            this.removeGameSnake(snake.getId());
            break;

          case SNAKE:
            if (snake.getId() != elementId) {
              console.log("other snake encountered by snake n° " + snake.getId());
            }
            // else {
            //   if (selfEncounter < 1) {
            //     selfEncounter++;
            //   }
            //   else { // bites itself
            //     snake.die();
            //     this.removeGameSnake(snake.getId());
            //   }
            // }
            break;

          case FOOD:
            console.log("food encountered by snake n° " + snake.getId());
            snake.grow(1);
            // food.respawn()
            if (this.delay > 40) this.delay -= 10;
            break;

          default:
            break;
        }
      });

    });
  }
  /*------------------------------------------------------------------------------------------*/


  /*------------------------------------------------------------------------------------------*/
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
  /*------------------------------------------------------------------------------------------*/


  /*------------------------------------------------------------------------------------------*/
  updateGrid() {
    this.grid = this.initGrid(this.rows, this.columns);
  }
  /*------------------------------------------------------------------------------------------*/


  // FUNCTIONS
  /*------------------------------------------------------------------------------------------*/
  initCell(x, y) {
    let elementsHere = [];

    this.gameWalls.forEach(wall => {
      if (wall.coordinates[0] === x && wall.coordinates[1] === y) {
        elementsHere.push([WALL, wall.id]);
      }
    });
    this.gameFoods.forEach(food => {
      if (food.coordinates[0] === x && food.coordinates[1] === y) {
        elementsHere.push([FOOD, food.id]);
      }
    });
    this.gameSnakes.forEach(snake => {
      snake.body.forEach(coordinates => {
        if (coordinates[0] === x && coordinates[1] === y) {
          elementsHere.push([SNAKE, snake.id]);
        }
      });
    });
    return elementsHere;
  }

  getCellElements(x, y) {
    return this.grid[y][x]; //1st is row (y axis), 2nd is column (x axis)
  }
  /*------------------------------------------------------------------------------------------*/

  /*------------------------------------------------------------------------------------------*/
  removeElementFromCell(x, y, id) {
    const elementsHere = this.getCellElements(x, y);
    for (let index = 0; index < elementsHere.length; index++) {
      const element = elementsHere[index];
      if (element[1] === id) {
        elementsHere.splice(index);
      }
    }
  }

  addElementToCell(x, y, element) {
    this.grid[y][x].push(element);
  }
  /*------------------------------------------------------------------------------------------*/


  /*------------------------------------------------------------------------------------------*/
  removeGameSnake(id) {
    for (let index = 0; index < this.gameSnakes.length; index++) {
      const snake = this.gameSnakes[index];
      if (snake.getId() === id) {
        const del = this.gameSnakes.splice(index, 1);
        // console.log("snake " + id + " removed");
        // console.log(JSON.parse(JSON.stringify(this.gameSnakes)));
      }
    }
  }

  /*------------------------------------------------------------------------------------------*/


}

export { GameSupervisor as default };
