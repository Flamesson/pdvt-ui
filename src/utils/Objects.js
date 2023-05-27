class Objects {
    static isNull(obj): boolean {
        return obj == null;
    }

    static nonNull(obj): boolean {
        return obj != null;
    }

    static nonDefined(obj): boolean {
        return obj === undefined;
    }

    static isDefined(obj): boolean {
        return obj !== undefined;
    }

    static isCorrect(obj): boolean {
        return this.isDefined(obj) && this.nonNull(obj);
    }

    static isNotCorrect(obj): boolean {
        return !this.isCorrect(obj);
    }

    static allNotCorrect(...objects): boolean {
        for (let obj of objects) {
            if (this.isCorrect(obj)) {
                return false;
            }
        }

        return true;
    }

    static anyNotCorrect(...objects): boolean {
        for (let obj of objects) {
            if (this.isNotCorrect(obj)) {
                return true;
            }
        }

        return false;
    }

    static equals(o1, o2): boolean {
        return o1 === o2;
    }
}

export default Objects;