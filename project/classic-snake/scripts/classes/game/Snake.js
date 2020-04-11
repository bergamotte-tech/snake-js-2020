//TODO temporary
const params = {
    BLOCK_SCALE: 10
}
//remove

class Snake {
    constructor(ctx) {
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.length = 1;
        this.color = '#FFFFFF';
    };

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, params.BLOCK_SCALE, params.BLOCK_SCALE);
    }
}

export { Snake as default };