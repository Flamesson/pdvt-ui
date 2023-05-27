import Objects from "../utils/Objects";
import CytospaceComponent from "react-cytoscapejs";
import Edge from "./Edge";
import Node from "./Node";
import logger from "../utils/Logger";
import Maps from "../utils/Maps";
import Arrays from "../utils/Arrays";
import Nodes from "./Nodes";
import Optional from "../utils/Optional";
import Cycle from "./Cycle";
import JohnsonAlgorithm from "../algorithm/JohnsonAlgorithm";
import FloydWarshall from "../algorithm/FloydWarshall";
import BooleanUtils from "../utils/BooleanUtils";
import VersionsCollisions from "../algorithm/VersionsConflicts";
import Pair from "../utils/Pair";

class Elements {
    constructor(nodes, edges, versioned) {
        if (Objects.isCorrect(nodes)) {
            this.nodes = new Nodes();
            Arrays.pushAll(this.nodes, nodes);
        } else {
            this.nodes = new Nodes();
        }
        if (Objects.isCorrect(edges)) {
            this.edges = [];
            Arrays.pushAll(this.edges, edges);
        } else {
            this.edges = [];
        }
        this.versioned = Optional.ofNullable(versioned).getOrDefault(false);

        this.prepareAdditionalProps();
        this.lazy = new Map(); //<String, Boolean>
    }

    prepareAdditionalProps() {
        let idToIncomes: Map<String, Edge[]> = new Map();
        let idToOutcomes: Map<String, Edge[]> = new Map();
        for (let edge of this.edges) {
            Maps.computeIfAbsent(idToIncomes, edge.targetId, () => []).push(edge);
            Maps.computeIfAbsent(idToOutcomes, edge.sourceId, () => []).push(edge);
        }
        for (let node of this.nodes) {
            if (idToIncomes.has(node.id)) {
                let incomes: Edge[] = idToIncomes.get(node.id);
                Arrays.pushAll(node.incomes, incomes);
                incomes.forEach(income => income.target = node);
                idToIncomes.delete(node.id);
            }
            if (idToOutcomes.has(node.id)) {
                let outcomes: Edge[] = idToOutcomes.get(node.id);
                Arrays.pushAll(node.outcomes, outcomes);
                outcomes.forEach(outcome => outcome.source = node);
                idToOutcomes.delete(node.id);
            }
        }
    }

    isEmpty(): boolean {
        return Arrays.isEmpty(this.nodes);
    }

    findEdge(source: Node, target: Node): Optional<Edge> {
        for (let edge of this.edges) {
            if (edge.targetId === target.id && edge.sourceId === source.id) {
                return Optional.of(edge);
            }
        }

        return Optional.empty();
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addEdge(edge) {
        this.edges.push(edge);
    }

    toJson() {
        this.nodes.forEach((node: Node) => {
            node.data.orgPos = {
                x: node.position.x,
                y: node.position.y
            };
        });

        return {
            nodes: this.nodes.map(node => node.toJson()),
            edges: this.edges.map(edge => edge.toJson())
        };
    }

    toNormalizedJson() {
        let nonNormalized = this.toJson();
        return CytospaceComponent.normalizeElements(nonNormalized);
    }

    countMostTargetNode(): Number {
        let maxNumber = -1;
        for (let node of this.nodes) {
            if (node.incomes.length > maxNumber) {
                maxNumber = node.incomes.length;
            }
        }

        logger.debug("Most target node' number of references: {}", maxNumber);
        return maxNumber;
    }

    handleNumberOfOutputs(limit: Number): void {
        let key = "too-much-outputs";
        if (this._initiated(key) || this.isEmpty()) {
            return;
        }

        this.getTooMuchOfOutputs(limit).forEach(node => node.addClassName("too-much-outputs"));

        this.lazy.set(key, true);
    }

    getTooMuchOfOutputs(limit: Number): Node[] {
        logger.error("Too much of outputs begin");
        let result = [];
        for (let node: Node of this.nodes) {
            let outputs = node.outcomes.length;
            if (outputs > limit) {
                result.push(node);
            }
        }

        logger.error("Too much of outputs end");

        return result;
    }

    handleUnlinkedNodes(): void {
        let key = "unlinked";
        if (this._initiated(key) || this.isEmpty()) {
            return;
        }

        logger.error("handleUnlinkedNodes start");

        this.getUnlinkedNodes().forEach(node => node.addClassName("unlinked"));

        logger.error("handleUnlinkedNodes end");

        this.lazy.set(key, true);
    }

    getUnlinkedNodes(): Node[] {
        let result = [];
        for (let node: Node of this.nodes) {
            if (node.isUnlinked()) {
                result.push(node);
            }
        }

        return result;
    }

    findCycles(): void {
        let key = "cycle";
        if (this._initiated(key) || this.isEmpty()) {
            return;
        }

        logger.error("findCycles start");

        let cycles: Cycle[] = this.getCycles();

        for (let i = 0; i < cycles.length; i++) {
            let cycle: Cycle = cycles[i];
            for (let node: Node of cycle) {
                node.addClassName("cycle");
                node.data.cycle = i;
            }
        }

        logger.error("findCycles end");

        this.lazy.set(key, true);
    }

    getCycles(): Cycle[] {
        return new JohnsonAlgorithm(this).findElementaryCycles().cycles;
    }

    findVersionsConflicts(): void {
        if (!this.versioned) {
            return;
        }

        let key = "versions-conflicts";
        if (this._initiated(key) || this.isEmpty()) {
            return;
        }

        logger.error("findVersionsConflicts start");

        let pair: Pair<Node[], Node[]> = new VersionsCollisions(this).findCollisions();
        let collisions = pair.first;
        let endNodes = pair.second;

        for (let node: Node of collisions) {
            node.addClassName("version-collision").addClassName("intermediate-node");
        }
        for (let endNode: Node of endNodes) {
            endNode.addClassName("version-collision").addClassName("end-node");
        }

        logger.error("findVersionsConflicts end");

        this.lazy.set(key, true);
    }

    handleLicenses(): void {
        let key = "licenses";
        if (this._initiated(key)) {
            return;
        }

        //TODO: подумать где лучше реализовать. Очевидно, что мне нужна будет подгрузка данных. Но каких размеров?
        this.lazy.set(key, true);
    }

    findMostLongPath(): void {
        let key = "most-long-path";
        if (this._initiated(key) || this.isEmpty()) {
            return;
        }

        logger.error("findMostLongPath start");

        let path: Node[] = this.getMostLongPath();

        if (path.length === 1) {
            let single: Node = path[0];
            single.addClassName("most-long-path-start").addClassName("most-long-path-end");
        } else {
            let first: Node = path[0];
            first.addClassName("most-long-path-start");

            for (let i = 1; i < path.length - 1; i++) {
                let intermediate: Node = path[i];
                intermediate.addClassName("most-long-path");
            }

            let last: Node = path[path.length - 1];
            last.addClassName("most-long-path-end");
        }

        logger.error("findMostLongPath end");

        this.lazy.set(key, true);
    }

    getMostLongPath(): Node[] {
        let floydWarshall: FloydWarshall = new FloydWarshall(this);
        floydWarshall.init();
        return floydWarshall.getLongestPath();
    }

    dfs(startNode: Node, visit: Function): void {
        if (Objects.isNotCorrect(visit)) {
            visit = () => {};
        }

        let stack: Node[] = [startNode];
        let visited: Map<Node, Number> = new Map();
        let index = 0;

        while (stack.length > 0) {
            let currentNode: Node = stack.pop();

            let outcomes: Edge[] = currentNode.getOutcomes();
            for (let edge: Edge of outcomes) {
                let targetNode: Node = edge.getTarget();
                if (!visited.has(targetNode)) {
                    stack.push(targetNode);
                }
            }

            visited.set(currentNode, index);

            let previous: Node = this.getByIndex(visited, index - 1).getOrDefault(null);
            visit(currentNode, previous, index);

            index += 1;
        }
    }

    getByIndex(map: Map<Node, Number>, index: Number): Optional<Node> {
        for (let [node, number]: [Node, Number] of map.entries()) {
            if (number === index) {
                return Optional.of(node);
            }
        }

        return Optional.empty();
    }

    _initiated(key): Boolean {
        return BooleanUtils.isTrue(this.lazy.get(key));
    }
}

export default Elements;