import Objects from "../../utils/Objects";

class Code {
    constructor(raw) {
        this.raw = raw;
        this.initiated = false;

        this.codeword = null;
        this.address = null;
        this.password = null;
    }

    static empty() {
        return new Code(null);
    }

    getRaw(): String {
        return this.raw;
    }

    notEmpty(): Boolean {
        return Objects.isCorrect(this.raw);
    }

    getCodeword(): String {
        if (!this.initiated) {
            this._init();
        }

        return this.codeword;
    }

    hasCodeword(): Boolean {
        if (!this.initiated) {
            this._init();
        }

        return Objects.isCorrect(this.codeword);
    }

    getAddress(): String {
        if (!this.initiated) {
            this._init();
        }

        return this.address;
    }

    hasAddress(): Boolean {
        if (!this.initiated) {
            this._init();
        }

        return Objects.isCorrect(this.address);
    }

    getPassword(): String {
        if (!this.initiated) {
            this._init();
        }

        return this.password;
    }

    hasPassword(): Boolean {
        if (!this.initiated) {
            this._init();
        }

        return Objects.isCorrect(this.password);
    }

    _init(): void {
        if (Objects.isNotCorrect(this.raw)) {
            this.codeword = null;
            this.address = null;
            this.password = null;
            return;
        }

        let decoded = atob(this.raw);

        let firstLengthFrom = 0;
        let lengthFirstString = decoded.substring(firstLengthFrom, decoded.indexOf('.', firstLengthFrom));
        let secondLengthFrom = lengthFirstString.length + 1;
        let lengthSecondString = decoded.substring(secondLengthFrom, decoded.indexOf('.', secondLengthFrom));
        let thirdLengthFrom = secondLengthFrom + lengthSecondString.length + 1;
        let lengthThirdString = decoded.substring(thirdLengthFrom, decoded.indexOf('.', thirdLengthFrom));

        let encodedFrom = lengthFirstString.length + lengthSecondString.length + lengthThirdString.length + 3;

        let lengthFirst = parseInt(lengthFirstString);
        let lengthSecond = parseInt(lengthSecondString);
        let lengthThird = parseInt(lengthThirdString);

        let firstFrom = encodedFrom;
        let secondFrom = encodedFrom + lengthFirst;
        let thirdFrom = encodedFrom + lengthFirst + lengthSecond;

        this.codeword = decoded.substring(firstFrom, firstFrom + lengthFirst);
        this.address = decoded.substring(secondFrom, secondFrom + lengthSecond);
        this.password = decoded.substring(thirdFrom, thirdFrom + lengthThird);

        this.initiated = true;
    }

}

export default Code;