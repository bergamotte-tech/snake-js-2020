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
        line[j] = EMPTY;
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
  wallCollision(gameWalls, gameSnakes) {
    gameSnakes.forEach((snake) => {
      gameWalls.forEach((wall) => {
        wall.coordinates.forEach((coord) => {
          if (coord[0] === snake.xdir && coord[1] === snake.ydir) {
            snake.die();
            console.log(`${snake.color} snake is dead`);
          }
        });
      });
    });
  }
}

export { GameSupervisor as default };
