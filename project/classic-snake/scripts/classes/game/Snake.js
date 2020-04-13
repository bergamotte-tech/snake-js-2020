class Snake {
  constructor(ctx, unit, body) {
    this.ctx = ctx;
    this.unit = unit;
    this.body = body.map(([x, y]) => [x, y]);
    this.xdir = 0;
    this.ydir = 0;
    this.color = "white";
    this.availableColors = ["blue", "white", "yellow", "green", "pink"];
  }

  setDirection(direction) {
    this.xdir = direction[0];
    this.ydir = direction[1];
  }

  update() {
    const oldHead = this.body[this.body.length - 1];
    const newHead = [
      oldHead[0] + this.xdir,
      oldHead[1] + this.ydir
    ];
    this.body.push(newHead);
    this.body.shift();
  }

  show() {
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = "grey";

    this.body.forEach(coordinates => {
      this.ctx.fillRect(coordinates[0] * this.unit, coordinates[1] * this.unit, this.unit, this.unit);
      this.ctx.strokeRect(coordinates[0] * this.unit, coordinates[1] * this.unit, this.unit, this.unit);
    });
  }

  randomColor() {
    this.color = this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
  }
}

export { Snake as default };
