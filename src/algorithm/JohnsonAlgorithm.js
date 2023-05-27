import Edge from "../cytoscape/Edge";
import Elements from "../cytoscape/Elements";
import Cycles from "../cytoscape/Cycles";
import Cycle from "../cytoscape/Cycle";
import logger from "../utils/Logger";
import Arrays from "../utils/Arrays";

class JohnsonAlgorithm {
    constructor(elements: Elements) {
        this.nodes = new Map();
        this.edges = [];

        elements.nodes.forEach(node => {
            this.nodes.set(node.id, node);
        });
        elements.edges.forEach(edge => {
            this.edges.push(edge);
        });
    }

    findElementaryCycles(): Cycles {
        let cycles: Cycles = new Cycles();

        for (let [_, node] of this.nodes) {
            let stack = [];
            let visited = new Set();

            this.dfs(node, stack, visited, cycles);
        }

        logger.debug("Found {} elementary cycles", cycles.cycles.length);
        return cycles;
    }

    dfs(node, stack, visited, cycles): void {
        stack.push(node);
        visited.add(node);

        for (let edge: Edge of node.getOutcomes()) {
            if (!edge.hasTarget()) {
                continue;
            }

            let target: Node = edge.getTarget();
            if (stack.includes(target)) {
                let cycle: Cycle = new Cycle();
                Arrays.pushAll(cycle, stack.slice(stack.indexOf(target)));
                cycles.addCycle(cycle);
            } else if (!visited.has(target)) {
                this.dfs(target, stack, visited, cycles);
            }
        }

        stack.pop();
        visited.delete(node);
    }
}

export default JohnsonAlgorithm;
