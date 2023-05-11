class Nodes {
    static hasNeighbour(node, targetNeighbour): Boolean {
        let edges = node.connectedEdges();
        for (let edge of edges) {
            let target = edge.target();

            if (target === targetNeighbour) {
                return true;
            }
        }

        return false;
    }
}

export default Nodes;