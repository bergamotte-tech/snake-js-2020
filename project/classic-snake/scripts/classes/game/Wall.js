class Wall {
    constructor(ctx, scale, coordinates) {
        this.ctx = ctx;
        this.scale = scale;
        this.coordinates = [...coordinates];
        this.color = "magenta";
    }

    update() {

    }

    show() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.coordinates[0] * this.scale, this.coordinates[1] * this.scale, this.scale, this.scale);
    }
}

export { Wall as default };
