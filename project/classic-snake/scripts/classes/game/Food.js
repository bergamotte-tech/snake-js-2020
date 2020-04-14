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
        const values = [-2, -1, 1, 2];
        return values[Math.floor(Math.random() * values.length)];
    }

    setColorByValue(value) {
        switch (value) {
            case -2:
                this.color = "red"
                break;
            case -1:
                this.color = "orange"
                break;
            case 1:
                this.color = "green"
                break;
            case 2:
                this.color = "yellow"
                break;
            default:
                this.color = "gray"
        }
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
