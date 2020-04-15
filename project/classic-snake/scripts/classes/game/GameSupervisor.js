import Food from "./Food.js";

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
      const row = [];
      for (let j = 0; j < columns; j++) {
        const elementsHere = this.initCell(j, i); //i is row (y axis), j is column (x axis)
        row[j] = elementsHere;
      }
      tempGrid[i] = row;
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
      this.removeElementInCell(snakeTail[0], snakeTail[1], snake.getId());

      snake.move();

      // ADD "SNAKE" WHERE THE NEW HEAD IS
      const snakeHead = snake.getHead(); const x = snakeHead[0]; const y = snakeHead[1];
      if (x < 0 || x >= this.grid[0].length || y < 0 || y >= this.grid.length) { // out of borders
        snake.die();
        this.removeGameSnake(snake.getId());
      }
      else {
        this.addElementInCell(x, y, [SNAKE, snake.getId()]);
      }
    });
  }
  /*------------------------------------------------------------------------------------------*/


  /*------------------------------------------------------------------------------------------*/
  handleEvents() {
    this.gameSnakes.forEach(snake => {
      const headCoordinates = snake.getHead();
      const x = headCoordinates[0];
      const y = headCoordinates[1];
      const elementsInContact = this.getElementsInCell(x, y);
      let selfEncounter = 0; // if the snake bites itself

      elementsInContact.forEach(element => {
        const elementCode = element[0];
        const elementId = element[1];

        switch (elementCode) {
          //_____________________________________________________________________
          case WALL:
            snake.die();
            this.removeGameSnake(snake.getId());
            break;
          //_____________________________________________________________________

          //_____________________________________________________________________
          case SNAKE:
            if (snake.getId() != elementId) {
              console.log("other snake encountered by snake n° " + snake.getId());
            }
            else {
              selfEncounter++;
              if (selfEncounter > 1) { //bites itself
                snake.die();
                this.removeGameSnake(snake.getId());
              }
            }
            break;
          //_____________________________________________________________________

          //_____________________________________________________________________
          case FOOD:
            snake.grow(1);
            if (this.delay > 40) this.delay -= 10;
            this.respawnFood(elementId);
            break;
          //_____________________________________________________________________

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
  /*------------------------------------------------------------------------------------------*/

  /*------------------------------------------------------------------------------------------*/
  getElementsInCell(x, y) {
    return this.grid[y][x]; //1st is row (y axis), 2nd is column (x axis)
  }

  removeElementInCell(x, y, id) {
    const elementsHere = this.getElementsInCell(x, y);
    for (let index = 0; index < elementsHere.length; index++) {
      const element = elementsHere[index];
      if (element[1] === id) {
        elementsHere.splice(index);
      }
    }
  }

  // getElementInCell(x, y, id) {
  //   const result;
  //   const elementsHere = this.getElementsInCell(x, y);
  //   for (let index = 0; index < elementsHere.length; index++) {
  //     const element = elementsHere[index];
  //     if (element[1] === id) {
  //       result = element;
  //       index = elementsHere.length;
  //     }
  //   }
  //   return result;
  // }

  addElementInCell(x, y, element) {
    this.grid[y][x].push(element);
  }

  getRandomEmptyCoordinates() {
    const emptyCells = [];
    for (let i = 0; i < this.grid.length; i++) {
      const row = this.grid[i];
      for (let j = 0; j < row.length; j++) {
        const elementsHere = this.grid[i][j];
        if (elementsHere.length < 1) emptyCells.push([i, j]);
      }
    }

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return randomCell;
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

  respawnFood(id) {
    // GET FOOD BY ID
    let food;
    for (let index = 0; index < this.gameFoods.length; index++) {
      food = this.gameFoods[index];
      if (food.getId() === id) {
        index = this.gameFoods.length;
      }
    }

    // FIND EMPTY CELL
    const coordinates = this.getRandomEmptyCoordinates();

    // RESPAWN IT
    food.respawn([coordinates[1], coordinates[0]]);
  }
  /*------------------------------------------------------------------------------------------*/


}

export { GameSupervisor as default };
