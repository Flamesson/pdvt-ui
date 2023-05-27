import Elements from "../cytoscape/Elements";
import Arrays from "../utils/Arrays";
import Node from "../cytoscape/Node";
import Pair from "../utils/Pair";

class VersionsConflicts {
    constructor(elements: Elements) {
        this.elements = elements;
    }

    findCollisions(): Pair<Node[], Node[]> {
        let collisions: Node[] = [];
        let endNodes: Node[] = [];
        let nodes = this.elements.nodes;
        for (let node: Node of nodes) {
            let outgoers: Node[] = node.getOutgoers();
            this.elements.dfs(node, (visited): void => {
                let nodeOutgoers: Node[] = visited.getOutgoers();
                let sameIgnoreVersion = this.getSameIgnoreVersion(outgoers, nodeOutgoers);
                if (Arrays.isNotEmpty(sameIgnoreVersion)) {
                    collisions.push(node);
                    endNodes.push.apply(endNodes, sameIgnoreVersion);
                }
            });
        }

        return new Pair(collisions, endNodes);
    }

    getSameIgnoreVersion(neighborhood1: Node[], neighborhood2: Node[]): *[] {
        let sameIgnoreVersion = [];
        for (let node1: Node of neighborhood1) {
            for (let node2: Node of neighborhood2) {
                if (this.isSameIgnoreVersion(node1, node2)) {
                    sameIgnoreVersion.push(node1);
                    sameIgnoreVersion.push(node2);
                }
            }
        }

        return sameIgnoreVersion;
    }

    isSameIgnoreVersion(node1: Node, node2: Node): boolean {
        let label1 = node1.getLabel();
        let label2 = node2.getLabel();
        let separate1: String[] = this.separateWithVersion(label1);
        let separate2: String[] = this.separateWithVersion(label2);
        return separate1[0] === separate2[0] && separate1[1] !== separate2[1];
    }

    separateWithVersion(label: String): String[] {
        let lastColonIndex = label.lastIndexOf(":");
        let withoutColon: String = label.substring(0, lastColonIndex);
        let version: String = label.substring(lastColonIndex + 1);
        return Array.of(withoutColon, version);
    }
}

export default VersionsConflicts;