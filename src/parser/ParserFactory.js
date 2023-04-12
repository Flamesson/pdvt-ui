import AbstractParser from "./AbstractParser";
import UnversionedParserV1 from "./UnversionedParserV1";

class ParserFactory {
    static PARSERS = Array.of(
        new UnversionedParserV1()
    );

    create(input: String): AbstractParser {
        let firstClosingBracked: Number = input.indexOf("]");
        let signature: String = input.substring(0, input.indexOf("]", firstClosingBracked + 1) + 1);
        let signatureParts: String[] = signature.split("]").map(parameter => parameter.replace("[", ""));
        if (signatureParts.length !== 3) {
            throw new Error("Signature must be in format [tag][version] at the start of input");
        }

        let tag: String = signatureParts[0];
        let version: Number = Number.parseInt(signatureParts[1]);
        for (let parser of ParserFactory.PARSERS) {
            if (parser.doesSupportTag(tag) && parser.doesSupportVersion(version)) {
                return parser;
            }
        }

        throw new Error("No parser for given signature was detected. Given: " + signature);
    }

    isValid(input: String): Boolean {
        let firstClosingBracked: Number = input.indexOf("]");
        let signature: String = input.substring(0, input.indexOf("]", firstClosingBracked + 1) + 1);
        let signatureParts: String[] = signature.split("]").map(parameter => parameter.replace("[", ""));
        return signatureParts.length === 3;
    }

    isNotValid(input: String): Boolean {
        return !this.isValid(input);
    }
}

export default ParserFactory;