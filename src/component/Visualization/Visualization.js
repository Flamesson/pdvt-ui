import React, {Component} from "react";
import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from 'cytoscape';
import "./Visualization.css";
import Objects from "../../utils/Objects";
import Elements from "../../cytoscape/Elements";
import DataManager from "../../service/DataManager";
import COSEBilkent from "cytoscape-cose-bilkent";
import {withTranslation} from "react-i18next";
import ParametersPanel from "../ParametersPanel/ParametersPanel";
import Controller from "./Controller";
import logger from "../../utils/Logger";
import Tap from "./Tap";

Cytoscape.use(COSEBilkent);

class Visualization extends Component {
    static DEFAULT_LAYOUT = "grid";
    static DEFAULT_LAYOUT_VALUE = {
        name: Visualization.DEFAULT_LAYOUT
    };

    constructor(props) {
        super(props);
        this.controller = new Controller();

        this.onTap = this.onTap.bind(this);
        this.layout = this.layout.bind(this);
        this.getElements = this.getElements.bind(this);
        this.stylesheet = this.stylesheet.bind(this);
        this.cyCallback = this.cyCallback.bind(this);
        this.updateElements = this.updateElements.bind(this);
    }

    componentDidMount() {
        let dataManager: DataManager  = new DataManager();
        dataManager.getElements().then(this.updateElements);

        this.props.hub.on('layout change', layout => {
            this.setState({
                _layout: layout
            });
        });
    }

    componentWillUnmount() {
        this.cy.removeListener('tap', this.onTap);
    }

    getElements(): Elements {
        const state = this.state;
        if (Objects.isNotCorrect(state)) {
            return new Elements();
        } else {
            if (Objects.isCorrect(state.elements)) {
                return state.elements;
            } else {
                return new Elements();
            }
        }
    }

    layout() {
        let state = this.state;
        if (Objects.isNotCorrect(state) || Objects.isNotCorrect(state._layout)) {
            return Visualization.DEFAULT_LAYOUT_VALUE;
        }

        return state._layout;
    }

    onTap(e): void {
        //TODO: add highlighting for: most long path and so on
        //TODO: add highlighting for dangerous-license components (add license info input)
        //TODO: hide/show unlinked components
        if (Objects.isNotCorrect(this.tap)) {
            logger.warn("A field is undefined. The field - tap.");
            return;
        }

        this.tap.onTap(e);
    }

    updateElements(elements) {
        this.setState({
            elements: elements
        }, () => {
            this.props.hub.emit('elements update');
        });
    }

    render() {
        let elements: Elements = this.getElements();
        let normalized = elements.toNormalizedJson();

        return <div className={"visualization-container"}>
            <CytoscapeComponent className={"graph-container"}
                                elements={normalized}
                                stylesheet={this.stylesheet()}
                                cy={this.cyCallback}/>
            <ParametersPanel hub={this.props.hub} cy={this.cy} controller={this.controller}
                             tap={this.tap}
                             elementsSupplier={() => this.getElements()}/>
        </div>
    }

    cyCallback(cy) {
        this.cy = cy;
        this.controller.setCy(cy);
        this.tap = new Tap(cy, this.controller);

        cy.removeListener('tap', this.onTap);
        cy.on('tap', this.onTap);

        cy.layout(this.layout()).run();
    }

    stylesheet() {
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
                    'background-color': 'green',
                    'font-size': '12px',
                    width: '30px',
                    height: '30px',
                    color: 'blue',
                    'text-wrap': 'wrap',
                    'text-max-width': '100px',
                    'text-overflow-wrap': 'anywhere',
                    'border-color': 'black',
                    'border-width': '1px',
                    'text-valign': 'top',
                    'text-halign': 'center',
                    'label': 'data(label)'
                }
            },
            {
                selector: 'edge[EdgeType="default"]',
                style: {
                    width: '1px',
                    'line-color': 'black',
                    'text-max-width': '10px',
                    'target-arrow-fill': 'hollow',
                    'target-arrow-color': 'black',
                    'target-arrow-shape': 'triangle',
                    'target-distance-from-node': '5px'
                }
            }
        ];
    }
}

export default withTranslation()(Visualization);