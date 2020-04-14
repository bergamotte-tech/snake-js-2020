import CommandPalette from "./CommandPalette.js";

class Snake {
  static count = 0;

  constructor(ctx, scale, body) {
    this.id = Snake.generateId();
    this.ctx = ctx;
    this.scale = scale;
    this.body = body.map(([x, y]) => [x, y]);
    this.xdir = 0;
    this.ydir = 0;

    this.commandPalette = new CommandPalette("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"); //associates keys to a direction
    this.setInitialDirection();
    document.addEventListener('keydown', e => {
      this.commandPalette.checkKey(e);
      this.setDirection(this.commandPalette.currentDirection);
    });

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
    const oldHead = this.body[this.body.length - 1];
    const newHead = [oldHead[0] + this.xdir, oldHead[1] + this.ydir];
    this.body.push(newHead);
    this.body.shift();
  }

  show() {
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = "grey";

    this.body.forEach((coordinates) => {
      this.ctx.fillRect(
        coordinates[0] * this.scale,
        coordinates[1] * this.scale,
        this.scale,
        this.scale
      );
      this.ctx.strokeRect(
        coordinates[0] * this.scale,
        coordinates[1] * this.scale,
        this.scale,
        this.scale
      );
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

  setInitialDirection() {
    if (this.body.length > 1) {
      const head = this.getHead();
      const preHead = this.body[this.body.length - 2];

      if (head[1] > preHead[1]) {
        this.commandPalette.setCurrentDirection([0, 1]); //down
      }
      else if (head[1] < preHead[1]) {
        this.commandPalette.setCurrentDirection([0, -1]); //up
      }
      else if (head[0] < preHead[0]) {
        this.commandPalette.setCurrentDirection([-1, 0]); //left
      }
      else {
        this.commandPalette.setCurrentDirection([1, 0]); //right
      }
    }
    else {
      this.commandPalette.setCurrentDirection([1, 0]); //right
    }
    this.setDirection(this.commandPalette.currentDirection);
  }

  setRandomColor() {
    this.color = this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
  }
  /*------------------------------------------------------------------------------------------*/


  // GETTERS
  /*------------------------------------------------------------------------------------------*/
  getBody() {
    return this.body.map(([x, y]) => [x, y]);
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
