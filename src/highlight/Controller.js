import Objects from "../utils/Objects";
import AppEvents from "../AppEvents";
import Nodes from "../utils/Nodes";
import Item from "./Item";
import Node from"../utils/Node";
import Arrays from "../utils/Arrays";

const layoutPadding = 10;
const animationDuration = 500;
const easing = 'ease';

const delayPromise = duration => new Promise(resolve => setTimeout(resolve, duration));

class Controller {
    constructor(hub) {
        this.highlightPath = [];
        hub.on(AppEvents.CY_UPDATE, cy => {
            this.setCy(cy);
        });

        this.highlight = this.highlight.bind(this);
        this.highlight_ = this.highlight_.bind(this);
        this.hasHighlight = this.hasHighlight.bind(this);
        this.unhighlight = this.unhighlight.bind(this);
        this.unhighlightSingle = this.unhighlightSingle.bind(this);
        this.unhighlightAll = this.unhighlightAll.bind(this);
        this.hide = this.hide.bind(this);
    }

    setCy(cy) {
        this.cy = cy;
        if (Objects.isCorrect(cy) && Objects.isNotCorrect(this.nodes)) {
            this.nodes = cy.nodes();
        }
    }

    hasHighlight() {
        return this.highlightPath.length > 0;
    }

    highlight(node): Promise {
        let neighborhood = node.closedNeighborhood();
        return this.highlight_(ignored => neighborhood, cy => cy.elements().not(neighborhood));
    }

    highlight_(neighborhoodFunction, othersFunction): Promise {
        const { cy } = this;

        if (this.highlightInProgress) {
            return Promise.resolve();
        }

        this.highlightInProgress = true;

        const neighborhood = neighborhoodFunction(cy);
        if (Arrays.isEmpty(neighborhood)) {
            return Promise.resolve();
        }
        const others = othersFunction(cy);
        let node = neighborhood[0];

        this.highlightPath.push(new Item(node, neighborhood, others));

        const allElements = cy.elements();
        const showOverview = () => {
            cy.batch(() => {
                allElements.removeClass('faded highlighted hidden');

                neighborhood.addClass('highlighted');
                others.addClass('hidden');

                others.positions(Node.getOrgPosition);
            });

            const layout = neighborhood.layout({
                name: 'preset',
                positions: Node.getOrgPosition,
                fit: true,
                animate: true,
                animationDuration: animationDuration,
                animationEasing: easing,
                padding: layoutPadding
            });

            layout.run();
            return layout.promiseOn('layoutstop');
        };

        const runLayout = () => {
            const position = Node.getOrgPosition(node);

            const layout = neighborhood.layout({
                name: 'concentric',
                fit: true,
                animate: true,
                animationDuration: animationDuration,
                animationEasing: easing,
                boundingBox: {
                    x1: position.x - 5,
                    x2: position.x + 5,
                    y1: position.y - 5,
                    y2: position.y + 5
                },
                avoidOverlap: true,
                concentric: function(ele) {
                    if (ele.same(node)) {
                        return 2;
                    } else {
                        return 1;
                    }
                },
                levelWidth: () => { return 1; },
                padding: layoutPadding,
                nodeDimensionsIncludeLabels: true
            });

            layout.run();
            return layout.promiseOn('layoutstop');
        };

        const showOthersFaded = () => {
            cy.batch(() => {
                others.removeClass('hidden').addClass('faded');
            });
        };

        return (
            Promise.resolve()
                .then(showOverview)
                .then(() => delayPromise(animationDuration))
                .then(runLayout)
                .then(showOthersFaded)
                .then(() => {
                    this.highlightInProgress = false;
                })
        );
    }

    unhighlightSingle() {
        if (!this.hasHighlight()) {
            return Promise.resolve();
        }

        let cy = this.cy;
        let allNodes = cy.nodes();

        cy.stop();
        allNodes.stop();

        let item = this.highlightPath.pop();
        return this.unhighlight(item);
    }

    unhighlightAll() {
        if (!this.hasHighlight()) {
            return Promise.resolve();
        }

        let cy = this.cy;
        let allElements = cy.elements();
        let allNodes = cy.nodes();

        cy.stop();
        allNodes.stop();

        let promises = this.highlightPath
            .map(this.unhighlight)
            .flat(1);

        this.highlightPath = [];
        return (
            Promise.all(promises)
                .then(() => this.removeClass(cy, allElements, 'hidden faded highlighted'))
        );
    }

    unhighlight(item: Item): Promise {
        let neighborhood = item.neighborhood;
        let others = item.others;
        if (Objects.isNotCorrect(others)) {
            return Promise.resolve();
        }

        const restorePositions = () => {
            this.cy.batch(() => {
                others.nodes().positions(Node.getOrgPosition);
            });

            return Nodes.animateToOrgPositions(neighborhood.nodes(), animationDuration, easing);
        };

        return [this.hide(this.cy, others), restorePositions()];
    }

    hide(cy, value): Promise {
        Nodes.hide(cy, value);
        return Promise.resolve();
    }

    removeClass(cy, target, clazz): Promise {
        Nodes.batchRemoveClass(cy, target, clazz);
        return Promise.resolve();
    }
}

export default Controller;