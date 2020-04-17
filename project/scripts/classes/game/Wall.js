class Wall {
    static count = 0;

    constructor(ctx, scale, coordinates) {
        this.id = Wall.generateId();

        this.ctx = ctx;
        this.scale = scale;
        this.coordinates = [...coordinates];
        this.color = "#ffffff";
    }

    static generateId() {
        this.count++;
        return this.count;
    }

    // FOR SUPERVISOR
    /*------------------------------------------------------------------------------------------*/
    show() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.coordinates[0] * this.scale, this.coordinates[1] * this.scale, this.scale, this.scale);
    }
    /*------------------------------------------------------------------------------------------*/
}

export { Wall as default };
