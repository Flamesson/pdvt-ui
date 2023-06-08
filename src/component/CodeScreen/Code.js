import Objects from "../../utils/Objects";
import Base64 from "../../utils/Base64";

class Code {
    constructor(raw) {
        this.raw = raw;
        this.initiated = false;

        this.codeword = null;
        this.address = null;
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

    _init(): void {
        if (Objects.isNotCorrect(this.raw)) {
            this.codeword = null;
            this.address = null;
            return;
        }

        let decoded = Base64.decodeText(this.raw);

        let firstLengthFrom = 0;
        let lengthFirstString = decoded.substring(firstLengthFrom, decoded.indexOf('.', firstLengthFrom));
        let secondLengthFrom = lengthFirstString.length + 1;
        let lengthSecondString = decoded.substring(secondLengthFrom, decoded.indexOf('.', secondLengthFrom));

        let encodedFrom = lengthFirstString.length + lengthSecondString.length + 2;

        let lengthFirst = parseInt(lengthFirstString);
        let lengthSecond = parseInt(lengthSecondString);

        let firstFrom = encodedFrom;
        let secondFrom = encodedFrom + lengthFirst;

        this.codeword = decoded.substring(firstFrom, firstFrom + lengthFirst);
        this.address = decoded.substring(secondFrom, secondFrom + lengthSecond);

        this.initiated = true;
    }

}

export default Code;