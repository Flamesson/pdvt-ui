import logger from "../../utils/Logger";
import Position from "../../cytoscape/Position";

class Tap {
    constructor(cy, controller) {
        this.cy = cy;
        this.controller = controller;
    }

    onTapLayout(): void {
        this.controller.unhighlight().then(ignored => {
            this.cy.fit();
        });
    }

    onTapNode(target): void {
        if (!this.controller.hasHighlight()) {
            logger.debug("Saving original positions");
            this.cy.elements().nodes().forEach((node) => {
                let position = node.position();
                node.data('orgPos', new Position(position.x, position.y));
            });
        }

        this.controller.highlight(target).then(ignored => {});
    }

    onTap(event): void {
        if (event.target === this.cy) {
            this.onTapLayout();
        } else if (event.target.isNode()) {
            this.onTapNode(event.target);
        }
    }
}

export default Tap;
