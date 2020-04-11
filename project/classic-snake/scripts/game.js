import Snake from './classes/game/Snake.js';

function runGame(canvas, mode, scale) {
    if (mode === "solo" || mode === "multi") {
        const ctx = canvas.getContext("2d");
        const rows = canvas.height / scale;
        const columns = canvas.width / scale;

        if (mode === "solo") {
            // CREATE SNAKE
            const snake = new Snake(ctx);
            snake.length = 1;
            snake.x = rows / 2 * scale;
            snake.y = columns / 2 * scale;
            snake.color = "white";
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