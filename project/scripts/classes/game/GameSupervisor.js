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
  constructor(dimensions, minimumDelay, hasBorders, delay, gameWalls, gameSnakes, gameFoods) {
    this.dimensions = [...dimensions];
    this.minimumDelay = minimumDelay;
    this.hasBorders = hasBorders;
    this.originalDelay = delay;
    this.delay = delay;
    this.gameWalls = [...gameWalls];
    this.gameSnakes = [...gameSnakes];
    this.gameFoods = [...gameFoods];
    this.scoreWrapper = document.getElementsByClassName("game-scores")[0];
    this.scoreList = this.initScoreList();

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
      // CHECK IF NOT DEAD BY POISON
      if (snake.getBody().length < 1) {
        snake.die();
        this.removeGameSnake(snake.getId());
      }

      else {
        // REMOVE OLD TAIL FROM GRID
        const snakeTail = snake.getBody()[0];
        this.removeElementInCell(snakeTail[0], snakeTail[1], snake.getId());

        snake.move();

        // ADD "SNAKE" WHERE THE NEW HEAD IS
        const snakeHead = snake.getHead(); const x = snakeHead[0]; const y = snakeHead[1];

        if (this.hasBorders) {
          if (x < 0 || x >= this.grid[0].length || y < 0 || y >= this.grid.length) {
            snake.die();
            this.removeGameSnake(snake.getId());
          }
          else {
            this.addElementInCell(x, y, [SNAKE, snake.getId()]);
          }
        }

        else {
          if (x < 0) {
            snakeHead[0] = this.grid[0].length - 1;
          }
          else if (x >= this.grid[0].length) {
            snakeHead[0] = 0;
          }
          else if (y < 0) {
            snakeHead[1] = this.grid.length - 1;
          }
          else if (y >= this.grid.length) {
            snakeHead[1] = 0;
          }

          this.addElementInCell(snakeHead[0], snakeHead[1], [SNAKE, snake.getId()]);
        }
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
            const food = this.getGameFood(elementId);
            snake.grow(food.getValue());
            this.handleTailOutOfBorders(snake);
            food.playSound();
            this.createNewFood(food);
            if (this.delay > this.minimumDelay) this.delay -= this.delay / 20;
            break;
          //_____________________________________________________________________

          default:
            break;
        }
      });
      this.updateScore(snake);
    });
  }
  /*------------------------------------------------------------------------------------------*/


  /*------------------------------------------------------------------------------------------*/
  handleTailOutOfBorders(snake) {
    const body = snake.getBody();
    let detections = 0;

    for (let index = body.length - 1; index >= 0; index--) {
      const coordinates = body[index];
      const x = coordinates[0]; const y = coordinates[1];

      if (this.hasBorders) {
        if (x < 0 || x >= this.grid[0].length || y < 0 || y >= this.grid.length) {
          snake.body.splice(index, 1);
        }
      }

      else {
        if (x < 0) {
          snake.body[index][0] = this.grid[0].length - 1 - detections;
          detections++;
          console.log(snake.body);

        }
        else if (x >= this.grid[0].length) {
          snake.body[index][0] = 0 + detections;
          detections++;
          console.log(snake.body);

        }
        else if (y < 0) {
          snake.body[index][1] = this.grid.length - 1 - detections;
          detections++;
          console.log(snake.body);

        }
        else if (y >= this.grid.length) {
          snake.body[index][1] = 0 + detections;
          detections++;
          console.log(snake.body);

        }
        body[index] = [coordinates[0], coordinates[1]];
      };
    }
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

  /*------------------------------------------------------------------------------------------*/
  updateScore(snake) {
    this.scoreList.forEach(element => {
      if (element[0] === snake.getId()) {
        const score = element[2];
        score.innerHTML = snake.getScore();
      }
    });
    // this.scoreList.sort(sortFunction);
    // function sortFunction(a, b) {
    //   if (a[3] === b[3]) {
    //     return 0;
    //   }
    //   else {
    //     return (a[3] > b[3]) ? -1 : 1;
    //   }
    // }

    // for (let index = 0; index < this.scoreList.length; index++) {
    //   const element = this.scoreList[index];
    //   element[2].innerHTML = "rank :" + (index + 1).toString();
    // }
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
        elementsHere.splice(index, 1);
      }
    }
  }

  addElementInCell(x, y, element) {
    this.grid[y][x].push(element);
  }

  getEmptyCoordinates() {
    const emptyCoordinates = [];
    for (let i = 0; i < this.grid.length; i++) {
      const row = this.grid[i];
      for (let j = 0; j < row.length; j++) {
        const elementsHere = this.grid[i][j];
        if (elementsHere.length < 1) emptyCoordinates.push([i, j]);
      }
    }
    return emptyCoordinates;
  }
  /*------------------------------------------------------------------------------------------*/


  /*------------------------------------------------------------------------------------------*/
  removeGameSnake(id) {
    //DISPLAY DEAD ON GAMER TAG
    this.scoreList.forEach(element => {
      if (element[0] === id) {
        const name = element[3];
        name.innerHTML = "RIP " + name.innerHTML + " X_X"
      }
    });

    //REMOMVE FROM ARRAY
    for (let index = 0; index < this.gameSnakes.length; index++) {
      const snake = this.gameSnakes[index];
      if (snake.getId() === id) {
        const del = this.gameSnakes.splice(index, 1);
      }
    }
  }

  removeGameFood(id) {
    for (let index = 0; index < this.gameFoods.length; index++) {
      const food = this.gameFoods[index];
      if (food.getId() === id) {
        const del = this.gameFoods.splice(index, 1);
      }
    }
  }

  getGameFood(id) {
    let food;
    for (let index = 0; index < this.gameFoods.length; index++) {
      food = this.gameFoods[index];
      if (food.getId() === id) {
        index = this.gameFoods.length;
      }
    }
    return food;
  }

  createNewFood(food) {
    // FIND EMPTY CELLS
    const emptyCoordinates = this.getEmptyCoordinates();

    const ctx = food.getCtx();
    const scale = food.getScale();
    const probabilities = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3];
    const nbFoods = probabilities[(Math.floor(Math.random() * (probabilities.length)))];

    this.removeGameFood(food.getId());

    for (let index = 0; index < nbFoods; index++) {
      const coordinates = emptyCoordinates[Math.floor(Math.random() * emptyCoordinates.length)];
      const newFood = new Food(ctx, scale, [coordinates[1], coordinates[0]]);
      this.gameFoods.push(newFood);
    }
  }
  /*------------------------------------------------------------------------------------------*/

  /*------------------------------------------------------------------------------------------*/
  initScoreList() {
    const scoreWrapper = this.scoreWrapper;
    const scoreList = [];

    this.gameSnakes.forEach(snake => {
      const scoreDiv = document.createElement('div');
      scoreDiv.classList.add("score-row");

      const score = document.createElement('h1');
      score.classList.add("score-value");
      score.innerHTML = snake.getScore().toString();
      scoreDiv.appendChild(score);

      const name = document.createElement('h3');
      name.classList.add("score-name");
      name.innerHTML = snake.getName();
      scoreDiv.appendChild(name);

      scoreWrapper.appendChild(scoreDiv);
      scoreList.push([snake.getId(), scoreDiv, score, name]);
    });

    return scoreList;
  }
  /*------------------------------------------------------------------------------------------*/

}

export { GameSupervisor as default };
