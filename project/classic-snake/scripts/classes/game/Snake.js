class Snake {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.length = 1;
    this.color = "#FFFFFF";
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, 10, 10);
  }
}

export { Snake as default };
