class Food {
    constructor(ctx, unit, coordinates) {
        this.ctx = ctx;
        this.unit = unit;
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
        this.ctx.fillRect(coordinates[0] * this.unit, coordinates[1] * this.unit, this.unit, this.unit);
    }
}

export { Food as default };
