class Food {
    static count = 0;

    constructor(ctx, scale, coordinates) {
        this.id = Food.generateId();
        this.ctx = ctx;
        this.scale = scale;
        this.coordinates = [...coordinates];
        this.value = this.getRandomValue();
        this.color = this.setColorByValue(this.value);
    }

    static generateId() {
        this.count++;
        return this.count;
    }

    getRandomValue() {
        const values = [1, 2];
        return values[Math.floor(Math.random() * values.length)];
    }

    setColorByValue(value) {
        let color;
        switch (value) {
            case 1:
                color = "green"
                break;
            case 2:
                color = "yellow"
                break;
            default:
                color = "white"
        }
        return color;
    }

    // FOR SUPERVISOR
    /*------------------------------------------------------------------------------------------*/
    respawn(coordinates) {
        this.coordinates = [...coordinates];
    }

    show() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.coordinates[0] * this.scale, this.coordinates[1] * this.scale, this.scale, this.scale);
    }
    /*------------------------------------------------------------------------------------------*/

    // GETTERS
    /*------------------------------------------------------------------------------------------*/
    getId() {
        return this.id;
    }
    /*------------------------------------------------------------------------------------------*/
}

export { Food as default };
