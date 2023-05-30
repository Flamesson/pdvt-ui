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

    filterByClassName(className: String): Nodes {
        let nodes: Nodes = new Nodes();
        for (let node: Node of this) {
            if (node.classNames.includes(className)) {
                nodes.push(node);
            }
        }

        return nodes;
    }

    filterByClassNames(classNames: String[]): Nodes {
        let nodes: Nodes = new Nodes();
        for (let node: Node of this) {
            if (node.hasClassNames(classNames)) {
                nodes.push(node);
            }
        }

        return nodes;
    }

    containsById(id): boolean {
        for (let node: Node of this) {
            if (node.getId() === id) {
                return true;
            }
        }

        return false;
    }
}

export default Nodes;