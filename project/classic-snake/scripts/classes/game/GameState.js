const EMPTY = 0;
const SNAKE = 10;
const FOOD = 20;
const WALL = 30;

class GameState {
    constructor(unit, dimensions, delay, wallsLocations, gameSnakes, gameFoods) {
        this.unit = unit;
        this.dimensions = [...dimensions];
        this.delay = delay;
        this.wallsLocations = wallsLocations.map(([x, y]) => [x, y]);
        this.gameSnakes = [...gameSnakes];
        this.gameFoods = [...gameFoods];

        this.rows = Math.floor(this.dimensions[0] / unit);
        this.columns = Math.floor(this.dimensions[1] / unit);
        this.world = this.initWorld(this.rows, this.columns);
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
        return tempWorld;
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
