
class Snake {
    constructor(ctx) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.length = 1;
        this.color = 'white';
    };

    draw() {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.x, this.y, 1, 1);
    }
}

export { Snake as default };