import Objects from "./Objects";
import logger from "./Logger";

class Strings {
    static FORMAT_KEYWORD = "{}";
    static EMPTY = "";

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
        let result: String = _format;
        let bracketIndex = 0;

        while (result.includes("{}")) {
            result = result.replace(/{}/g, () => {
                let arg = args[bracketIndex];
                bracketIndex++;
                return arg;
            });
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

    static countCommonLength(s1, s2): Number {
        let common: Number = 0;
        let until: Number = Math.min(s1.length, s2.length);
        for (let i = 0; i < until; i++) {
            let char1 = s1.charAt(i);
            let char2 = s2.charAt(i);
            if (char1 !== char2) {
                return common;
            }

            common += 1;
        }

        return common;
    }

    static asBoolean(s: String): Boolean {
        return s === "true";
    }
}

export default Strings;