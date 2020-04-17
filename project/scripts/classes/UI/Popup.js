class Popup {
    constructor(title, message) {
        this.title = title;
        this.message = message;
    }

    prompt(message) {
        return prompt(message);
    }
}

export { Popup as default };
