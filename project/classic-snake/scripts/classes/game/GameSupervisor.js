const EMPTY = 0;
const SNAKE = 10;
const FOOD = 20;
const WALL = 30;

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
        const code = this.getWhoIsHere(j, i);
        line[j] = code;
      }
      tempWorld[i] = line;
    }
    return tempWorld;
  }

  /**
   *
   * @param {array} gameWalls
   * @param {array} gameSnakes
   * @description Check if wall collision
   */
  wallCollision() {
    this.gameSnakes.forEach((snake) => {
      this.gameWalls.forEach((wall) => {
        if (
          wall.coordinates[0] === snake.body.slice(-1)[0][0] &&
          wall.coordinates[1] === snake.body.slice(-1)[0][1]
        ) {
          snake.die();
        }
      });
    });
  }

  getWhoIsHere(x, y) {
    let res = EMPTY;
    let found = false;
    if (!found) {
      this.gameWalls.forEach((wall) => {
        if (wall.coordinates[0] === x && wall.coordinates[1] === y) {
          res = WALL;
          found = true;
        }
      });
    }

    if (!found) {
      this.gameFoods.forEach((food) => {
        if (food.coordinates[0] === x && food.coordinates[1] === y) {
          res = FOOD;
          found = true;
        }
      });
    }

    if (!found) {
      this.gameSnakes.forEach((snake) => {
        snake.body.forEach((coordinates) => {
          if (coordinates[0] === x && coordinates[1] === y) {
            res = SNAKE;
            found = true;
          }
        });
      });
    }
    return res;
  }
}

export { GameSupervisor as default };
