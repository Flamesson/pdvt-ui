import AbstractParser from "./AbstractParser";
import Tag from "./Tag";
import Edge from "../cytoscape/Edge";
import Node from "../cytoscape/Node";
import Strings from "../utils/Strings";
import Elements from "../cytoscape/Elements";
import logger from "../utils/Logger";
import Position from "../cytoscape/Position";

class VersionedParserV1 extends AbstractParser {

    parse(input: String): Elements {
        let dictionaryBeginIndex: Number = input.indexOf(AbstractParser.DICTIONARY_SECTION)
            + AbstractParser.DICTIONARY_SECTION.length;
        let dictionaryEndIndex: Number = input.indexOf(AbstractParser.MAPPINGS_SECTION);
        let mappingsBeginIndex: Number = dictionaryEndIndex + AbstractParser.MAPPINGS_SECTION.length;

        let rawDictionary: String = input.substring(dictionaryBeginIndex, dictionaryEndIndex);
        let nodes: Node[] = this.parseNodes_(rawDictionary);
        let rawMappings: String = input.substring(mappingsBeginIndex);
        let edges: Edge[] = this.parseEdges_(rawMappings);

        return new Elements(nodes, edges);
    }

    doesSupportTag(tag: String): Boolean {
        return tag === Tag.VERSIONED;
    }

    doesSupportVersion(version: Number): Boolean {
        return version === 1;
    }

    parseNodes_(dictionary: String): Node[] {
        let nodes = [];
        let lines: String[] = dictionary.split(/\r?\n/);
        for (let line of lines) {
            if (Strings.isBlank(line)) {
                continue;
            }

            let definitions: String[] = line.split(";");
            for (let definition of definitions) {
                if (Strings.isBlank(definition)) {
                    continue;
                }

                let signIndex: Number = definition.lastIndexOf("=");
                let key: String = definition.substring(0, signIndex);
                let value: String = definition.substring(signIndex + 1);
                nodes.push(new Node(value, key, new Position(1, 1)));
            }
        }

        logger.debug("Parsed nodes: " + nodes);

        return nodes;
    }

    parseEdges_(mappings: String): Edge[] {
        let edges = [];
        let lines: String[] = mappings.split(/\r?\n/);
        for (let line of lines) {
            if (Strings.isBlank(line)) {
                continue;
            }

            let definitions: String[] = line.split(";");
            for (let definition of definitions) {
                if (Strings.isBlank(definition)) {
                    continue;
                }

                let signIndex: Number = definition.lastIndexOf("->");
                let source: String = definition.substring(0, signIndex);
                let target: String = definition.substring(signIndex + 2);
                edges.push(new Edge(source, target))
            }
        }

        logger.debug("Parsed edges: " + edges);
        return edges;
    }
}

export default VersionedParserV1;