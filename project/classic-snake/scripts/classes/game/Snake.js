import CommandPalette from "./CommandPalette.js";

class Snake {
  static count = 0;

  constructor(ctx, scale, body) {
    this.id = Snake.generateId();
    this.ctx = ctx;
    this.scale = scale;
    this.body = body.map(([x, y]) => [x, y]);
    this.commandPalette = new CommandPalette("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", document);
    this.setPaletteInitialDirection();
    this.xdir = 0;
    this.ydir = 0;

    this.color = "white";
    this.availableColors = ["blue", "white", "yellow", "green", "pink",
      "purple", "cyan", "aquablue", "gray", "orange"];
  }

  static generateId() {
    this.count++;
    return this.count;
  }

  // FOR SUPERVISOR
  /*------------------------------------------------------------------------------------------*/
  move() {
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

  die() {
    console.log("I just died");
  }
  /*------------------------------------------------------------------------------------------*/


  // SETTERS
  /*------------------------------------------------------------------------------------------*/
  setDirection(direction) {
    this.xdir = direction[0];
    this.ydir = direction[1];
  }

  setCommandPalette(upKey, rightKey, downKey, leftKey) {
    this.commandPalette.changeCommands(upKey, rightKey, downKey, leftKey);
  }

  setPaletteInitialDirection() {
    if (this.body.length > 1) {
      if (this.body[this.body.length - 1][1] > this.body[this.body.length - 2][1]) {
        this.commandPalette.setCurrentDirection([0, 1]); //down
      }
      else if (this.body[this.body.length - 1][1] < this.body[this.body.length - 2][1]) {
        this.commandPalette.setCurrentDirection([0, -1]); //up
      }
      else if (this.body[this.body.length - 1][0] < this.body[this.body.length - 2][0]) {
        this.commandPalette.setCurrentDirection([-1, 0]); //left
      }
    }
    else this.commandPalette.setCurrentDirection([1, 0]); //right
  }

  setRandomColor() {
    this.color = this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
  }
  /*------------------------------------------------------------------------------------------*/


  // GETTERS
  /*------------------------------------------------------------------------------------------*/
  getBody() {
    return this.body;
  }
  getHead() {
    return this.body[this.body.length - 1];
  }
  getId() {
    return this.id;
  }
  /*------------------------------------------------------------------------------------------*/
}

export { Snake as default };
