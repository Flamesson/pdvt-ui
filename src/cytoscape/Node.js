import Objects from "../utils/Objects";
import position from "./Position";
import Arrays from "../utils/Arrays";
import Item from "./Item";
import Edge from "./Edge";

class Node extends Item {
    static DEFAULT_NODE_TYPE = "default";

    constructor(id, label, position, nodeType) {
        super();
        this.id = id;
        this.label = label;
        this.position = position;
        if (Objects.isNotCorrect(nodeType)) {
            this.nodeType = Node.DEFAULT_NODE_TYPE;
        } else {
            this.nodeType = nodeType;
        }
        this.data = {};
        this.outcomes = [];
        this.incomes = [];
        this.classNames = [];
    }

    getId() {
        return this.id;
    }

    getLabel() {
        return this.label;
    }

    getOutgoers(): Node[] {
        let set: Set<Node> = new Set();
        this.getOutcomes().forEach(edge => {
            set.add(edge.getTarget());
        });

        return [...set];
    }

    getIncomers(): Node[] {
        let set: Set<Node> = new Set();
        this.getIncomes().forEach(edge => {
            set.add(edge.getSource());
        });

        return [...set];
    }

    getOutcomes(): Edge[] {
        return this.outcomes;
    }

    getIncomes(): Edge[] {
        return this.incomes;
    }

    addOutgoingEdge(edge: Edge): void {
        this.outcomes.push(edge);
    }

    addIncomingEdge(edge: Edge): void {
        this.incomes.push(edge);
    }

    isEdge(): boolean {
        return false;
    }

    isNode(): boolean {
        return true;
    }

    addClassName(className: String): Node {
        if (!this.classNames.includes(className)) {
            this.classNames.push(className);
        }

        return this;
    }

    removeClassName(className: String): Node {
        if (this.classNames.includes(className)) {
            Arrays.remove(this.classNames, className);
        }

        return this;
    }

    isUnlinked(): Boolean {
        return Arrays.isEmpty(this.outcomes) && Arrays.isEmpty(this.incomes);
    }

    setColor(color: String) {
        this.color = color;
    }

    setFontSize(size: String) {
        this.fontSize = size;
    }

    setWidth(width: String) {
        this.width = width;
    }

    setHeight(height: String) {
        this.height = height;
    }

    toJson() {
        return {
            data: this.getData(),
            position: {
                x: position.x,
                y: position.y
            },
            classes: this.classNames
        };
    }

    toString(): String {
        return "[Node. id: " + this.id + ", label: " + this.label + ", position: " + this.position + "]";
    }

    getData() {
        this.data.id = this.id;
        this.data.label = this.label;
        this.data.NodeType = this.nodeType;
        return this.data;
    }
}

export default Node;