import Snake from './classes/game/Snake.js';

function runGame(canvas, mode) {

    //TODO temporary
    const params = {
        BLOCK_SCALE: canvas.height / 60
    }
    //remove

    if (mode === "solo" || mode === "multi") {
        const ctx = canvas.getContext("2d");
        const rows = canvas.height / params.BLOCK_SCALE;
        const columns = canvas.width / params.BLOCK_SCALE;

        if (mode === "solo") {
            // CREATE SNAKE
            const snake = new Snake(ctx);
            snake.x = rows / 2 * params.BLOCK_SCALE;
            snake.y = columns / 2 * params.BLOCK_SCALE;
            snake.color = "yellow";
            // DRAW SNAKE
            snake.draw();
        }
        else {
            const snake_1 = new Snake();
            const snake_2 = new Snake();
        }
    }
    else console.error("Mode " + mode + " does not exist");
}

export { runGame as default };