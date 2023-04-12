import Objects from "../utils/Objects";
import position from "./Position";

class Node {
    static DEFAULT_NODE_TYPE = "default";

    constructor(id, label, position, nodeType) {
        this.id = id;
        this.label = label;
        this.position = position;
        if (Objects.isNotCorrect(nodeType)) {
            this.nodeType = Node.DEFAULT_NODE_TYPE;
        } else {
            this.nodeType = nodeType;
        }
        this.data = {};
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
            }
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