import Elements from "../cytoscape/Elements";
import Node from "../cytoscape/Node";
import Edge from "../cytoscape/Edge";
import Cycles from "../cytoscape/Cycles";
import Cycle from "../cytoscape/Cycle";

class TarjanAlgorithm2 {
    constructor(elements: Elements) {
        this.elements = elements;
    }

    findElementaryCycles(): Cycles {
        let cycles: Cycles = new Cycles();
        for (let node: Node of this.elements.nodes) {
            node.data.index = -1;
        }

        this.elements.nodes.forEach((node: Node) => {
            if (node.data.index === -1) {
                this.tarjan(node, cycles);
            }
        });

        return cycles;
    }

    tarjan(startNode: Node, cycles: Cycles): void {
        let stack = [];
        let visited = new Set();
        let index = 0;

        let strongConnect = (node: Node): void => {
            node.data.index = index;
            node.data.lowLink = index;
            index++;
            stack.push(node);
            node.data.onStack = true;
            visited.add(node);

            let outgoingEdges: Edge[] = node.getOutcomes();
            outgoingEdges.forEach((edge: Edge) => {
                let target: Node = edge.getTarget();
                if (!visited.has(target)) {
                    strongConnect(target);
                    node.data.lowLink = Math.min(node.data.lowLink, target.data.lowLink);
                } else if (target.data.onStack) {
                    node.data.lowLink = Math.min(node.data.lowLink, target.data.index);
                }
            });

            if (node.data.lowLink === node.data.index) {
                let cycle: Cycle = new Cycle();
                let w: Node;
                do {
                    w = stack.pop();
                    w.data.onStack = false;
                    cycle.push(w);
                } while (w !== node);
                cycles.addCycle(cycle);
            }
        };

        strongConnect(startNode);
    }
}

export default TarjanAlgorithm2;
