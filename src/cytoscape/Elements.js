import Objects from "../utils/Objects";
import CytospaceComponent from "react-cytoscapejs";
import Edge from "./Edge";
import logger from "../utils/Logger";

class Elements {
    constructor(nodes, edges) {
        if (Objects.isCorrect(nodes)) {
            this.nodes = nodes;
        } else {
            this.nodes = [];
        }
        if (Objects.isCorrect(edges)) {
            this.edges = edges;
        } else {
            this.edges = [];
        }
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addEdge(edge) {
        this.edges.push(edge);
    }

    toJson() {
        this.nodes.forEach((node) => {
            node.data.orgPos = {
                x: node.position.x,
                y: node.position.y
            };
        });

        return {
            nodes: this.nodes.map(node => node.toJson()),
            edges: this.edges.map(edge => edge.toJson())
        };
    }

    toNormalizedJson() {
        let nonNormalized = this.toJson();
        return CytospaceComponent.normalizeElements(nonNormalized);
    }

    countMostTargetNode(): Number {
        let nodeCodeToTarget: Map<String, Number> = new Map();
        this.edges.forEach((edge: Edge) => {
            let value;
            if (!nodeCodeToTarget.has(edge.targetId)) {
                value = 0;
            } else {
                value = nodeCodeToTarget.get(edge.targetId);
            }

            nodeCodeToTarget.set(edge.targetId, value + 1);
        });

        let maxNumber = -1;
        nodeCodeToTarget.forEach((number: Number, code: String) => {
            if (number > maxNumber) {
                maxNumber = number;
            }
        });

        logger.debug("Most target node' number of references: {}", maxNumber);
        return maxNumber;
    }
}

export default Elements;