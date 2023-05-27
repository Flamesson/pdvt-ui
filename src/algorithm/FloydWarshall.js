import Elements from "../cytoscape/Elements";
import Edge from "../cytoscape/Edge";
import Node from "../cytoscape/Node";

class FloydWarshall {
    constructor(elements: Elements) {
        this.nodes = elements.nodes;
        this.edges = elements.edges;
        this.numNodes = this.nodes.length;
    }

    init() {
        this.distances = this.initializeDistanceMatrix();
        this.next = this.initializeNextMatrix();
        this.calculateShortestPaths();
    }

    initializeDistanceMatrix() {
        let distances = Array(this.numNodes).fill(null).map(() => Array(this.numNodes).fill(Infinity));

        for (let i = 0; i < this.numNodes; i++) {
            distances[i][i] = 0;
        }

        this.edges.forEach((edge: Edge) => {
            let sourceIndex = this.nodes.indexOf(edge.getSource());
            let targetIndex = this.nodes.indexOf(edge.getTarget());
            distances[sourceIndex][targetIndex] = 1;
        });

        return distances;
    }

    initializeNextMatrix() {
        let next = Array(this.numNodes).fill(null).map(() => Array(this.numNodes).fill(null));

        for (let i = 0; i < this.numNodes; i++) {
            for (let j = 0; j < this.numNodes; j++) {
                if (i !== j && this.distances[i][j] !== Infinity) {
                    next[i][j] = j;
                }
            }
        }

        return next;
    }

    calculateShortestPaths() {
        for (let k = 0; k < this.numNodes; k++) {
            for (let i = 0; i < this.numNodes; i++) {
                for (let j = 0; j < this.numNodes; j++) {
                    let throughKDistance = this.distances[i][k] + this.distances[k][j];
                    if (throughKDistance < this.distances[i][j]) {
                        this.distances[i][j] = throughKDistance;
                        this.next[i][j] = this.next[i][k];
                    }
                }
            }
        }
    }

    getDistanceMatrix() {
        return this.distances;
    }

    getLongestPath(): Node[] {
        let longestPath = [];

        for (let i = 0; i < this.numNodes; i++) {
            for (let j = 0; j < this.numNodes; j++) {
                if (i !== j) {
                    let path: Node[] = this.reconstructPath(i, j);
                    if (path.length > longestPath.length) {
                        longestPath.length = 0;
                        longestPath.push(...path);
                    }
                }
            }
        }

        return longestPath;
    }

    reconstructPath(startIndex, endIndex): Node[] {
        if (this.distances[startIndex][endIndex] === Infinity) {
            return []; // Путь не найден
        }

        let path = [this.nodes[startIndex]];
        let currentIndex = startIndex;

        while (currentIndex !== endIndex) {
            currentIndex = this.next[currentIndex][endIndex];
            path.push(this.nodes[currentIndex]);
        }

        return path;
    }
}

export default FloydWarshall;
