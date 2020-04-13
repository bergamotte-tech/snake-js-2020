const EMPTY = 0;
const SNAKE = 10;
const FOOD = 20;
const WALL = 30;

class GameState {
    constructor(dimensions, delay, wallsLocations, foodsLocations, snakeLocations) {
        this.dimensions = [...dimensions];
        this.delay = delay;
        this.wallsLocations = wallsLocations.map(([x, y]) => [x, y]);
        this.foodsLocations = foodsLocations.map(([x, y]) => [x, y]);
        this.snakeLocations = snakeLocations.map(([x, y]) => [x, y]);

        this.world = [];
    }

    initWorld(rows, columns) {
        let tempWorld = [];
        for (let index = 0; index < rows; index++) {
            const line = [];

            for (let index = 0; index < columns; index++) {
                line.push(EMPTY);
            }
            tempWorld.push(line);
        }
        this.world = tempWorld;
    }

    updateWorld() {
        this.world.forEach(row => {
            row.forEach(block => {
                block = EMPTY;
            });
        });
    }
}

export { GameState as default };
