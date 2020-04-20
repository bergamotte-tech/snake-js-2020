import CommandPalette from "./CommandPalette.js";

class Snake {
  static count = 0;

  constructor(ctx) {
    this.id = Snake.generateId();
    this.ctx = ctx;
    this.scale = 10;
    this.name = "New player";
    this.team = 1; //1 to 4
    this.color = "white";
    this.colorCopy = "white";
    this.score = 0;
    this.deathSound = new Audio(`assets/sounds/death.mp3`);
    this.bitingSound = new Audio(`assets/sounds/biting.mp3`);

    this.commandPalette = new CommandPalette("ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft", " ");
    document.addEventListener("keydown", (e) => {
      this.commandPalette.checkKey(e);
    });

    this.body = [];
    this.xdir = 0;
    this.ydir = 0;

    this.poisonAmmo = 0;
    this.poisoned = false;
    this.poisonLaps = 0;
  }

  static generateId() {
    this.count++;
    return this.count;
  }

  /*------------------------------------------------------------------------------------------*/
  setBody(body) {
    this.body = body.map(([x, y]) => [x, y]);
    this.setInitialDirection();
  }

  setName(name) {
    this.name = name;
  }

  setTeam(number) {
    this.team = number;
  }

  setColor(color) {
    this.color = color;
  }

  setScale(scale) {
    this.scale = scale;
  }

  setDirection(direction) {
    this.xdir = direction[0];
    this.ydir = direction[1];
  }

  setInitialDirection() {
    if (this.body.length > 1) {
      const head = this.getHead();
      const preHead = this.body[this.body.length - 2];

      if (head[1] > preHead[1]) {
        this.commandPalette.setCurrentDirection([0, 1]); //down
      } else if (head[1] < preHead[1]) {
        this.commandPalette.setCurrentDirection([0, -1]); //up
      } else if (head[0] < preHead[0]) {
        this.commandPalette.setCurrentDirection([-1, 0]); //left
      } else {
        this.commandPalette.setCurrentDirection([1, 0]); //right
      }
    } else {
      this.commandPalette.setCurrentDirection([1, 0]); //right
    }
    this.setDirection(this.commandPalette.currentDirection);
  }

  getBody() {
    return this.body.map(([x, y]) => [x, y]);
  }
  getHead() {
    return this.body[this.body.length - 1];
  }
  getId() {
    return this.id;
  }
  getName() {
    return this.name;
  }
  getScore() {
    return this.score;
  }
  getColor() {
    return this.color;
  }
  getIsPoisoned() {
    return this.poisoned;
  }
  getIsBiting() {
    return this.commandPalette.isBiting;
  }
  getPoisonAmmo() {
    return this.poisonAmmo;
  }
  getTeam() {
    return this.team;
  }

  /*------------------------------------------------------------------------------------------*/
  goingBackwards() {
    let isGoingBackwards = false;
    const requestedDirection = this.commandPalette.currentDirection;
    const requestedX = requestedDirection[0];
    const requestedY = requestedDirection[1];
    if (this.xdir === -requestedX || this.ydir === -requestedY) {
      isGoingBackwards = true;
    }
    return isGoingBackwards;
  }

  // FOR SUPERVISOR
  /*------------------------------------------------------------------------------------------*/
  move() {
    if (!this.poisoned) {
      const isGoingBackwards = this.goingBackwards();
      if (!isGoingBackwards) {
        this.setDirection(this.commandPalette.currentDirection);
      }
      const oldHead = this.body[this.body.length - 1];
      const newHead = [oldHead[0] + this.xdir, oldHead[1] + this.ydir];
      this.body.push(newHead);
      this.body.shift();
    }
    else {
      this.poisonLaps--;
      if (this.poisonLaps < 1) this.unpoisonSelf();
    }
  }

  bite() {
    if (this.poisonAmmo > 0) {
      this.poisonAmmo--;
      this.bitingSound.play();
    }
    this.commandPalette.isBiting = false;
  }

  poisonSelf(laps) {
    this.colorCopy = this.color;
    this.color = "#BBFF00";
    this.poisoned = true;
    this.poisonLaps = laps;
  }

  unpoisonSelf() {
    this.color = this.colorCopy;
    this.poisoned = false;
    this.poisonLaps = 0;
  }

  show() {
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = "#0D0126";

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

  grow(value) {
    let tail;
    if (value > 0) {
      if (this.body.length > 1) {
        tail = this.body[0];
        let preTail = this.body[1];
        let y = 0;
        let x = 0;

        if (tail[0] == preTail[0]) {
          //same x
          if (tail[1] > preTail[1]) {
            //tail is at the bottom
            y = 1;
          } else y = -1;
        } else {
          if (tail[0] < preTail[0]) {
            //tail is at the left
            x = -1;
          } else x = 1;
        }

        for (let index = 0; index < value; index++) {
          tail = this.body[0];
          this.body.unshift([tail[0] + x, tail[1] + y]);
        }
      } else {
        for (let index = 0; index < value; index++) {
          tail = this.body[0];
          this.body.unshift([tail[0] - this.xdir, tail[1] - this.ydir]);
        }
      }
      this.poisonAmmo++;
    } else {
      const iterations = -value;
      for (let index = 0; index < iterations; index++) {
        if (this.body.length > 0) this.body.shift();
      }
    }
    this.score += value;
  }

  die() {
    this.deathSound.play();
  }
  /*------------------------------------------------------------------------------------------*/
}

export { Snake as default };
