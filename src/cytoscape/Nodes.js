class Nodes extends Array<Node> {
    addClassName(className: String): Nodes {
        for (let node: Node of this) {
            node.addClassName(className);
        }

        return this;
    }

    removeClassName(className: String): Nodes {
        for (let node: Node of this) {
            node.removeClassName(className);
        }

        return this;
    }
}

export default Nodes;