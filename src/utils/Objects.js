class Objects {
    static isNull(obj) {
        return obj == null;
    }

    static nonNull(obj) {
        return obj != null;
    }

    static nonDefined(obj) {
        return obj === undefined;
    }

    static isDefined(obj) {
        return obj !== undefined;
    }

    static isCorrect(obj) {
        return this.isDefined(obj) && this.nonNull(obj);
    }

    static isNotCorrect(obj) {
        return !this.isCorrect(obj);
    }

    static equals(o1, o2) {
        return o1 === o2;
    }
}

export default Objects;