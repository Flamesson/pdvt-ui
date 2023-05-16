import Node from "./Node";

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

    static animateToOrgPositions(nodes, animationDuration: number, easing: String): Promise {
        return Promise.all(nodes.nodes().map(node => {
            let orgPosition = Node.getOrgPosition(node);
            return node.animation({
                position: orgPosition,
                duration: animationDuration,
                easing: easing
            }).play().promise();
        }));
    }

    static hide(cy, target): void {
        cy.batch(() => {
            target.addClass('hidden');
        });
    }

    static show(cy, target): void {
        cy.batch(() => {
            target.removeClass('hidden');
        });
    }

    static batchAddClass(cy, target, className: String): void {
        cy.batch(() => {
            target.addClass(className);
        });
    }

    static batchRemoveClass(cy, target, className: String): void {
        cy.batch(() => {
            target.removeClass(className);
        });
    }
}

export default Nodes;