import Objects from "./Objects";

class Strings {
    static FORMAT_KEYWORD = "{}";

    static isBlank(string: String) {
        if (Objects.isNotCorrect(string)) {
            return false;
        }

        for (let i = 0; i < string.length; i++) {
            if (string.charAt(i) !== ' ') {
                return false;
            }
        }

        return true;
    }

    static isNotBlank(string: String) {
        return !this.isBlank(string);
    }

    static isEmpty(string: String) {
        if (Objects.isNotCorrect(string)) {
            return false;
        }

        return string === '';
    }

    static isNotEmpty(string: String) {
        return !this.isEmpty(string);
    }

    /**
     * @param _format Each {} will be replaced by an arg.toString() with same order number.
     * @param args List of arguments.
     */
    static format(_format: String, ...args: *): String {
        let result: String = "";
        let endIndex: Number = 0;

        let argNumber: Number = 0;
        let index = _format.indexOf(this.FORMAT_KEYWORD);
        if (index === -1) {
            return _format;
        }

        result += _format.substring(0, index);
        result += args[argNumber].toString();
        endIndex = index;
        argNumber += 1;

        while (true) {
            index = _format.indexOf(this.FORMAT_KEYWORD, endIndex + 1);
            if (index === -1) {
                break;
            }

            let arg: * = args[argNumber];
            result += _format.substring(endIndex + this.FORMAT_KEYWORD.length, index);
            if (Objects.isNotCorrect(arg)) {
                result += "undefined";
            } else {
                result += arg.toString();
            }
            endIndex = index;
            argNumber += 1;
        }

        return result;
    }

    static getSimilarity(queryWord, nodeWord) {
        let index = nodeWord.indexOf(queryWord);

        if (index === 0) {
            let diff = Math.abs(nodeWord.length - queryWord.length);
            let maxLength = Math.max(nodeWord.length, queryWord.length);

            return 1 - (diff / maxLength);
        } else {
            return 0;
        }
    }
}

export default Strings;