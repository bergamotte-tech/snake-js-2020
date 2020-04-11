import Snake from "./classes/game/Snake.js";

/*------------------------------------------------------------------------------------------*/
function initGame(canvas, mode, levelNumber) {
    if (mode === "solo" || mode === "multi") {
        const unit = 10;
        const ctx = canvas.getContext("2d");


        if (mode === "solo") {
            // GET LEVEL INFOS
            /* get (json corresponding to levelNumber) */
            const level = {
                "dimensions": [80, 40],
                "delay": 200,
                "walls": [
                    [5, 5], [5, 6], [5, 7], [5, 8], [70, 35], [71, 35], [72, 35]
                ],
                "food": [
                    [10, 10]
                ],
                "snake": [
                    [60, 60],
                    [60, 59],
                    [60, 58],
                ]
            }

            // SET CANVAS ACCORDINGLY
            resizeCanvas(canvas, level.dimensions[0] * unit, level.dimensions[1] * unit);

            // CREATE SNAKE
            const snake = new Snake(ctx);
            /* TODO get info from json */
            snake.x = 0 * unit;
            snake.y = 2 * unit;
            snake.color = "yellow";
            snake.draw();
        }
        else {
            const snake_1 = new Snake();
            const snake_2 = new Snake();
        }
    }
    else console.error("Mode " + mode + " does not exist");
}
/*------------------------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------------------*/
function resizeCanvas(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
}
/*------------------------------------------------------------------------------------------*/

export { initGame as default };
