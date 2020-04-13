import CommandPalette from "./CommandPalette.js";

class Snake {
  constructor(ctx, scale, body) {
    this.ctx = ctx;
    this.scale = scale;
    this.body = body.map(([x, y]) => [x, y]);

    this.xdir = 0;
    this.ydir = 0;
    this.color = "white";
    this.availableColors = ["blue", "white", "yellow", "green", "pink",
      "purple", "cyan", "aquablue", "gray", "orange"];

    this.commandPalette = new CommandPalette("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", document);
  }

  setDirection(direction) {
    this.xdir = direction[0];
    this.ydir = direction[1];
  }

  update() {
    this.setDirection(this.commandPalette.currentDirection);
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
      this.ctx.fillRect(coordinates[0] * this.scale, coordinates[1] * this.scale, this.scale, this.scale);
      this.ctx.strokeRect(coordinates[0] * this.scale, coordinates[1] * this.scale, this.scale, this.scale);
    });
  }

  randomColor() {
    this.color = this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
  }

  setCommandPalette(upKey, rightKey, downKey, leftKey) {
    this.commandPalette.changeCommands(upKey, rightKey, downKey, leftKey);
  }
}

export { Snake as default };
