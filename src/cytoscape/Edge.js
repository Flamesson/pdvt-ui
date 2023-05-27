import Objects from "../utils/Objects";
import Item from "./Item";

class Edge extends Item {
    static DEFAULT_LINE_COLOR = "black";
    static DEFAULT_LINE_WIDTH = "1px";
    static DEFAULT_TARGET_ARROW_SHAPE = "triangle";
    static DEFAULT_TARGET_ARROW_COLOR = Edge.DEFAULT_LINE_COLOR;
    static DEFAULT_EDGE_TYPE = "default";

    constructor(sourceId, targetId, label, edgeType) {
        super();
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.label = label;
        this.lineWidth = Edge.DEFAULT_LINE_WIDTH;
        this.lineColor = Edge.DEFAULT_LINE_COLOR;
        this.targetArrowShape = Edge.DEFAULT_TARGET_ARROW_SHAPE;
        this.targetArrowColor = Edge.DEFAULT_TARGET_ARROW_COLOR;
        if (Objects.isNotCorrect(edgeType)) {
            this.edgeType = Edge.DEFAULT_EDGE_TYPE;
        } else {
            this.edgeType = edgeType;
        }
        this.target = null;
        this.source = null;
    }

    getTarget(): Node {
        if (!this.hasTarget()) {
            throw new Error("Don't have target");
        }

        return this.target;
    }

    hasTarget(): boolean {
        return Objects.isCorrect(this.target);
    }

    getSource(): Node {
        if (!this.hasSource()) {
            throw new Error("Don't have source");
        }

        return this.source;
    }

    getWeight(): Number {
        return 1;
    }

    hasSource(): boolean {
        return Objects.isCorrect(this.source);
    }

    isEdge(): boolean {
        return true;
    }

    isNode(): boolean {
        return false;
    }

    toJson() {
        return {
            data: {
                source: this.sourceId,
                target: this.targetId,
                label: this.label,
                EdgeType: this.edgeType
            }
        }
    }

    toString() {
        return "[Edge. Source id: " + this.sourceId + ", target id: " + this.targetId + ", label: " + this.label + "]";
    }
}

export default Edge;