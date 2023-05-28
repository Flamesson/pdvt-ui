import CyStyle from "./CyStyle";

class Stylesheet {
    constructor(cyStyle: CyStyle) {
        this.cyStyle = cyStyle;
    }

    get(): * {
        return [
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier'
                }
            },
            {
                selector: 'node.selected',
                style: {
                    'min-zoomed-font-size': 0,
                    'z-index': 9999
                }
            },
            {
                selector: 'edge.selected',
                style: {
                    opacity: 0.8,
                    width: 4,
                    'z-index': 9999
                }
            },
            {
                selector: '.faded',
                style: {
                    events: 'no'
                }
            },
            {
                selector: 'node.faded',
                style: {
                    opacity: 0.08
                }
            },
            {
                selector: 'edge.faded',
                style: {
                    opacity: 0.06
                }
            },
            {
                selector: '.hidden',
                style: {
                    display: 'none'
                }
            },
            {
                selector: 'node[NodeType="default"]',
                style: {
                    'background-color': this.cyStyle.nodeColor,
                    'font-size': this.cyStyle.labelFontSize + "px",
                    width: this.cyStyle.nodeSize + "px",
                    height: this.cyStyle.nodeSize + "px",
                    color: this.cyStyle.labelColor,
                    'text-wrap': 'wrap',
                    'text-max-width': this.cyStyle.labelMaxWidth + "px",
                    'text-overflow-wrap': 'anywhere',
                    'border-color': this.cyStyle.nodeBorderColor,
                    'border-width': '1px',
                    'text-valign': 'top',
                    'text-halign': 'center',
                    'label': 'data(label)'
                }
            },
            {
                selector: 'edge[EdgeType="default"]',
                style: {
                    width: this.cyStyle.edgeWidth + "px",
                    'line-color': this.cyStyle.edgeColor,
                    'text-max-width': '10px',
                    'target-arrow-fill': 'hollow',
                    'target-arrow-color': 'black',
                    'target-arrow-shape': 'triangle',
                    'target-distance-from-node': '5px'
                }
            },
            {
                selector: '.hidden',
                style: {
                    "display": "none"
                }
            },
            {
                selector: '.unlinked-hidden',
                style: {
                    "display": "none"
                }
            },
            {
                selector: "node.cycle.cycle-visible",
                style: {
                    'background-color': this.cyStyle.graphStyle.circularColor
                }
            },
            {
                selector: "node.most-long-path-start.path-visible",
                style: {
                    "background-color": this.cyStyle.graphStyle.mostLongPathStartColor
                }
            },
            {
                selector: "node.most-long-path.path-visible",
                style: {
                    "background-color": this.cyStyle.graphStyle.mostLongPathColor
                }
            },
            {
                selector: "node.most-long-path-end.path-visible",
                style: {
                    "background-color": this.cyStyle.graphStyle.mostLongPathEndColor
                }
            },
            {
                selector: "node.version-collision.intermediate-node.versions-visible",
                style: {
                    "background-color": this.cyStyle.graphStyle.versionsCollisionColor
                }
            },
            {
                selector: "node.version-collision.end-node.versions-visible",
                style: {
                    "background-color": this.cyStyle.graphStyle.versionsCollisionEndNodeColor
                }
            },
            {
                selector: ".potentially-dangerous.infected.infection-visible",
                style: {
                    "background-color": this.cyStyle.graphStyle.potentiallyDangerousInfectedColor
                }
            },
            {
                selector: ".potentially-dangerous.infection-source.infection-visible",
                style: {
                    "background-color": this.cyStyle.graphStyle.potentiallyDangerousColor
                }
            }
        ];
    }
}

export default Stylesheet;