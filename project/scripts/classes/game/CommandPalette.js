class CommandPalette {
    constructor(upKey, rightKey, downKey, leftKey, actionKey) {
        this.up = upKey;
        this.right = rightKey;
        this.down = downKey;
        this.left = leftKey;
        this.action = actionKey;

        this.currentDirection = [0, 0];
        this.isBiting = false;
    }

    checkKey(e) {
        const pressedKey = e.key;
        if (pressedKey === this.up) {
            this.setCurrentDirection([0, -1]);
        }
        else if (pressedKey === this.right) {
            this.setCurrentDirection([1, 0]);
        }
        else if (pressedKey === this.down) {
            this.setCurrentDirection([0, 1]);
        }
        else if (pressedKey === this.left) {
            this.setCurrentDirection([-1, 0]);
        }
        else if (pressedKey === this.action) {
            this.isBiting = true;
        }
    }

    setCurrentDirection(direction) {
        this.currentDirection = direction;
    }

    changeCommands(upKey, rightKey, downKey, leftKey, actionKey) {
        this.up = upKey;
        this.right = rightKey;
        this.down = downKey;
        this.left = leftKey;
        this.action = actionKey;
    }
}

export { CommandPalette as default };
