class Option {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    toString(): String {
        return this.key + ": " + this.value;
    }
}

export default Option;