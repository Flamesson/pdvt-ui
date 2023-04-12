import Elements from "../cytoscape/Elements";

class AbstractParser {
    static DICTIONARY_SECTION = "[dictionary]";
    static MAPPINGS_SECTION = "[mappings]";

    constructor() {
        if (this.constructor === AbstractParser) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    parse(input: String): Elements {
        throw new Error("Method 'parse(input)' must be implemented.");
    }

    doesSupportTag(tag: String): Boolean {
        throw new Error("Method 'doesSupportTag(tag)' must be implemented.");
    }

    doesSupportVersion(version: Number): Boolean {
        throw new Error("Method 'doesSupportVersion(version)' must be implemented.");
    }
}

export default AbstractParser;