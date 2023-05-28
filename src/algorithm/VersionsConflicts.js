import Elements from "../cytoscape/Elements";
import Arrays from "../utils/Arrays";
import Node from "../cytoscape/Node";
import Conflict from "../cytoscape/Conflict";

class VersionsConflicts {
    constructor(elements: Elements) {
        this.elements = elements;
    }

    findConflicts(): Conflict[] {
        let conflicts = [];
        for (let node: Node of this.elements.nodes) {
            let outgoers: Node[] = node.getOutgoers();
            this.elements.dfs(node, (visited: Node): void => {
                let sameIgnoreVersion: Node[] = this.getSameIgnoreVersion(outgoers, visited.getOutgoers());
                if (Arrays.isNotEmpty(sameIgnoreVersion)) {
                    let intermediate: Node[] = this.elements.findPath(node, visited);
                    this.pushConflict(conflicts, new Conflict(intermediate, sameIgnoreVersion));
                }
            });
        }

        return conflicts;
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

    pushConflict(conflicts: Conflict[], conflict: Conflict): boolean {
        for (let item: Conflict of conflicts) {
            if (Arrays.areEquals(item.endNodes, conflict.endNodes)) {
                for (let node: Node of conflict.intermediateNodes) {
                    if (!item.intermediateNodes.includes(node)) {
                        item.intermediateNodes.push(node);
                    }
                }

                return;
            }
        }

        conflicts.push(conflict);
    }
}

export default VersionsConflicts;