class Food {
    constructor(ctx, scale, coordinates) {
        this.ctx = ctx;
        this.scale = scale;
        this.coordinates = [...coordinates];
        this.color = "red";
    }

    update() {

    }

    respawn(coordinates) {
        this.coordinates = [...coordinates];
    }

    show() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(coordinates[0] * this.scale, coordinates[1] * this.scale, this.scale, this.scale);
    }
}

export { Food as default };
