import React, {Component} from "react";
import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from 'cytoscape';
import Objects from "../../utils/Objects";
import Elements from "../../cytoscape/Elements";
import DataManager from "../../datamanager/DataManager";
import COSEBilkent from "cytoscape-cose-bilkent";
import {withTranslation} from "react-i18next";
import ParametersPanel from "../ParametersPanel/ParametersPanel";
import Controller from "./Controller";
import logger from "../../utils/Logger";
import Tap from "./Tap";
import AppEvents from "../../AppEvents";
import Stylesheet from "../../cytoscape/Stylesheet";

import "./Visualization.css";
import CyStyle from "./CyStyle";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";

Cytoscape.use(COSEBilkent);

class Visualization extends Component {
    static DEFAULT_LAYOUT = "grid";
    static DEFAULT_LAYOUT_VALUE = {
        name: Visualization.DEFAULT_LAYOUT
    };

    constructor(props) {
        super(props);
        this.controller = new Controller(this.props.hub);

        this.loadCyStyle = this.loadCyStyle.bind(this);
        this.saveCyStyle = this.saveCyStyle.bind(this);
        this.onTap = this.onTap.bind(this);
        this.layout = this.layout.bind(this);
        this.getElements = this.getElements.bind(this);
        this.updateElements = this.updateElements.bind(this);
        this.emit = this.emit.bind(this);

        this.cyStyle = this.loadCyStyle();
    }

    componentDidMount() {
        let dataManager: DataManager  = new DataManager();
        dataManager.getElements().then(this.updateElements);

        let hub = this.props.hub;
        hub.on(AppEvents.LAYOUT_CHANGE, layout => {
            this.setState({
                _layout: layout
            });
        });
        hub.on(AppEvents.CY_UPDATE, cy => {
            this.cy = cy;
            this.tap = new Tap(cy, this.controller);

            cy.removeListener(AppEvents.TAP, this.onTap);
            cy.on(AppEvents.TAP, this.onTap);

            cy.layout(this.layout()).run();
        });
        hub.on(AppEvents.CY_STYLE_CHANGED, ignored => {
            this.forceUpdate();
            this.saveCyStyle();
        });
    }

    componentWillUnmount() {
        if (Objects.isCorrect(this.cy)) {
            this.cy.removeListener(AppEvents.TAP, this.onTap);
        }
    }

    loadCyStyle(): CyStyle {
        if (extLocalStorage.isAbsent(AppStorage.GENERAL_PARAMETERS)) {
            return new CyStyle();
        }

        let stored = extLocalStorage.getParsedJson(AppStorage.GENERAL_PARAMETERS);
        return new CyStyle()
            .withNodeColorIfValid(stored.nodeColor)
            .withNodeBorderColorIfValid(stored.nodeBorderColor)
            .withNodeSizeIfValid(stored.nodeSize)
            .withEdgeColorIfValid(stored.edgeColor)
            .withEdgeWidthIfValid(stored.edgeWidth)
            .withLabelColorIfValid(stored.labelColor)
            .withLabelMaxWidthIfValid(stored.labelMaxWidth)
            .withLabelFontSizeIfValid(stored.labelFontSize)
            .withCircularColor(stored.circularColor);
    }

    saveCyStyle(): void {
        extLocalStorage.setAsJson(AppStorage.GENERAL_PARAMETERS, this.cyStyle);
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
            this.props.hub.emit(AppEvents.ELEMENTS_UPDATE);
        });
    }

    emit(key: String, arg: *): void {
        if (Objects.isNotCorrect(this.props.hub)) {
            logger.warn("A field is undefined. The field - hub.");
            return;
        }

        this.props.hub.emit(key, arg);
    }

    render() {
        let elements: Elements = this.getElements();
        let normalized = elements.toNormalizedJson();

        return <div className={"visualization-container"}>
            <CytoscapeComponent className={"graph-container"}
                                elements={normalized}
                                stylesheet={new Stylesheet(this.cyStyle).get()}
                                cy={cy => this.emit(AppEvents.CY_UPDATE, cy)}/>
            <ParametersPanel hub={this.props.hub}
                             controller={this.controller}
                             tap={this.tap}
                             elementsSupplier={() => this.getElements()}
                             cyStyle={this.cyStyle}/>
        </div>
    }
}

export default withTranslation()(Visualization);