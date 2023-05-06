import Objects from "../../utils/Objects";
import AppEvents from "../../utils/AppEvents";

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

    highlight(node) {
        const { cy } = this;

        if (this.highlightInProgress) {
            return Promise.resolve();
        }

        this.highlightInProgress = true;

        const allElements = cy.elements();
        const neighborhood = node.closedNeighborhood();
        const others = allElements.not(neighborhood);
        this.highlightPath.push(node);

        const showOverview = () => {
            cy.batch(() => {
                allElements.removeClass('faded highlighted hidden');

                neighborhood.addClass('highlighted');
                others.addClass('hidden');

                others.positions(this.getOrgPosition);
            });

            const layout = neighborhood.layout({
                name: 'preset',
                positions: this.getOrgPosition,
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
            const position = this.getOrgPosition(node);

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

    unhighlight() {
        if (!this.hasHighlight()) {
            return Promise.resolve();
        }

        let cy = this.cy;
        let allElements = cy.elements();
        let allNodes = cy.nodes();

        cy.stop();
        allNodes.stop();

        let promises = this.highlightPath
            .map(node => {
                let neighborhood = node.closedNeighborhood();
                let others = allElements.not(neighborhood);

                const restorePositions = () => {
                    cy.batch(() => {
                        others.nodes().positions(this.getOrgPosition);
                    });

                    return this.animateToOrgPosition(neighborhood.nodes());
                };

                return [this.hide(cy, others), restorePositions()];
            })
            .flat(1);

        this.highlightPath = [];
        return (
            Promise.all(promises)
                .then(() => this.removeClass(cy, allElements, 'hidden faded highlighted'))
        );
    }

    getOrgPosition(node) {
        return node.data('orgPos');
    }

    animateToOrgPosition(neighborhood): Promise {
        return Promise.all(neighborhood.nodes().map(node => {
            return node.animation({
                position: this.getOrgPosition(node),
                duration: animationDuration,
                easing: easing
            }).play().promise();
        }));
    }

    hide(cy, value): Promise {
        cy.batch(() => {
           value.addClass('hidden');
        });

        return Promise.resolve();
    }

    removeClass(cy, value, clazz): Promise {
        cy.batch(() => {
            value.removeClass(clazz);
        });

        return Promise.resolve();
    }
}

export default Controller;