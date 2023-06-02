import React, {Component} from "react";
import "./Visualization.css";

import CytoscapeComponent from "react-cytoscapejs";
import Cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import COSEBilkent from "cytoscape-cose-bilkent";
import avsdf from 'cytoscape-avsdf';
import dagre from 'cytoscape-dagre';
import klay from 'cytoscape-klay';
import cola from 'cytoscape-cola';
import Objects from "../../utils/Objects";
import {withTranslation} from "react-i18next";
import ParametersPanel from "../ParametersPanel/ParametersPanel";
import Controller from "../../highlight/Controller";
import logger from "../../utils/Logger";
import Tap from "../../highlight/Tap";
import AppEvents from "../../AppEvents";
import Stylesheet from "../../cytoscape/Stylesheet";
import CyStyle from "../../cytoscape/CyStyle";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import InfoPanel from "../InfoPanel/InfoPanel";
import GraphStyle from "../../cytoscape/GraphStyle";
import cytoscape from "cytoscape";

Cytoscape.use(COSEBilkent);
Cytoscape.use(fcose);
Cytoscape.use(avsdf);
Cytoscape.use(dagre);
Cytoscape.use(klay);
Cytoscape.use(cola);

class Visualization extends Component {
    static DEFAULT_LAYOUT = AppStorage.DEFAULT_LAYOUT;
    static DEFAULT_LAYOUT_VALUE = {
        name: Visualization.DEFAULT_LAYOUT
    };

    constructor(props) {
        super(props);
        this.controller = new Controller(this.props.hub);

        this.state = {
            _layout: Visualization.DEFAULT_LAYOUT_VALUE
        };

        this.loadCyStyle = this.loadCyStyle.bind(this);
        this.saveCyStyle = this.saveCyStyle.bind(this);
        this.onTap = this.onTap.bind(this);
        this.emit = this.emit.bind(this);

        this.cyStyle = this.loadCyStyle();
    }

    componentDidMount() {
        this.onLayoutChange = layout => {
            this.setState({
                _layout: layout
            }, () => {
                this.cy.layout(this.state._layout).run();
            });
        };
        this.onRefreshLayoutRequest = () => {
            this.cy.layout(this.state._layout).run();
        };
        this.onElementsUpdate = () => {
            this.composeCytoscape();
        };
        this.props.hub.on(AppEvents.LAYOUT_CHANGE, this.onLayoutChange);
        this.props.hub.on(AppEvents.CY_STYLE_CHANGED, this.onCyStyleChanged);
        this.props.hub.on(AppEvents.REFRESH_LAYOUT_REQUEST, this.onRefreshLayoutRequest);
        this.props.hub.on(AppEvents.ELEMENTS_UPDATE, this.onElementsUpdate);

        this.composeCytoscape();
    }

    componentWillUnmount() {
        this.props.hub.removeListener(AppEvents.LAYOUT_CHANGE, this.onLayoutChange);
        this.props.hub.removeListener(AppEvents.CY_STYLE_CHANGED, this.onCyStyleChanged);
        this.props.hub.removeListener(AppEvents.REFRESH_LAYOUT_REQUEST, this.onRefreshLayoutRequest);
        this.props.hub.removeListener(AppEvents.ELEMENTS_UPDATE, this.onElementsUpdate);

        if (Objects.isCorrect(this.cy)) {
            this.cy.removeListener(AppEvents.TAP, this.onTap);
            this.cy.destroy();
        }
    }

    composeCytoscape() {
        this.cy = cytoscape({
            container: document.getElementById("cy-container"),
            elements: this.props.elementsSupplier().toNormalizedJson(),
            style: new Stylesheet(this.cyStyle).get()
        });

        this.tap = new Tap(this.cy, this.controller);

        this.cy.removeListener(AppEvents.TAP, this.onTap);
        this.cy.on(AppEvents.TAP, this.onTap);

        this.cy.layout(this.state._layout).run();

        this.props.hub.emit(AppEvents.CY_UPDATE, this.cy);
    }

    onCyStyleChanged = (ignored) => {
        this.saveCyStyle();
        this.cy.style(new Stylesheet(this.cyStyle).get());
    };

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
            .withGraphStyle(new GraphStyle()
                .withPotentiallyDangerousInfectedColorIfValid(stored.graphStyle.potentiallyDangerousInfectedColor)
                .withPotentiallyDangerousColorIfValid(stored.graphStyle.potentiallyDangerousColor)
                .withVersionsCollisionEndNodeColorIfValid(stored.graphStyle.versionsCollisionEndNodeColor)
                .withVersionsCollisionColorIfValid(stored.graphStyle.versionsCollisionColor)
                .withMostLongPathEndColorIfValid(stored.graphStyle.mostLongPathEndColor)
                .withMostLongPathColorIfValid(stored.graphStyle.mostLongPathColor)
                .withMostLongPathStartColorIfValid(stored.graphStyle.mostLongPathStartColor)
                .withCircularColorIfValid(stored.graphStyle.circularColor)
            );
    }

    saveCyStyle(): void {
        extLocalStorage.setAsJson(AppStorage.GENERAL_PARAMETERS, this.cyStyle);
    }

    onTap(e): void {
        if (Objects.isNotCorrect(this.tap)) {
            logger.warn("A field is undefined. The field - tap.");
            return;
        }

        this.tap.onTap(e);
    }

    emit(key: String, arg: *): void {
        if (Objects.isNotCorrect(this.props.hub)) {
            logger.warn("A field is undefined. The field - hub.");
            return;
        }

        this.props.hub.emit(key, arg);
    }

    render() {
        return <div className={"visualization-container"}>
            <InfoPanel hub={this.props.hub}/>
            <CytoscapeComponent id="cy-container" className={"w-100 h-100"}/>;
            <ParametersPanel hub={this.props.hub}
                             controller={this.controller}
                             tap={this.tap}
                             elementsSupplier={this.props.elementsSupplier}
                             cyStyle={this.cyStyle}/>
        </div>
    }
}

export default withTranslation()(Visualization);