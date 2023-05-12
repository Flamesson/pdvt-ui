import React, {Component} from "react";
import {withTranslation} from "react-i18next";
import AppEvents from "../../AppEvents";
import {ChangeEvent} from "react";
import Optional from "../../utils/Optional";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Strings from "../../utils/Strings";
import Nodes from "../../utils/Nodes";

class GraphParameters extends Component {
    constructor(props) {
        super(props);

        this.applyParameters = this.applyParameters.bind(this);
        this.onToggleUnlinkedNodesVisibility = this.onToggleUnlinkedNodesVisibility.bind(this);
        this.showHiddenNodes = this.showHiddenNodes.bind(this);
        this.hideNodes = this.hideNodes.bind(this);
        this.onToggleCircularDependenciesHighlighting = this.onToggleCircularDependenciesHighlighting.bind(this);
        this.highlightCircularDependencies = this.highlightCircularDependencies.bind(this);
        this.unhighlightCircularDependencies = this.unhighlightCircularDependencies.bind(this);
    }

    componentDidMount() {
        this.props.hub.on(AppEvents.CY_UPDATE, cy => {
            this.cy = cy;
            this.applyParameters();
        });
        this.hideUnconnectedNodes = Optional.ofNullable(extLocalStorage.getItem(AppStorage.PARAMETER_TOGGLE_UNLINKED_NODES_VISIBILITY))
            .map(Strings.asBoolean)
            .getOrElse(() => false);
        this.showCircularDependencies = Optional.ofNullable(extLocalStorage.getItem(AppStorage.PARAMETER_TOGGLE_CIRCULAR_DEPENDENCIES_HIGHLIGHTING))
            .map(Strings.asBoolean)
            .getOrElse(() => true);
    }

    applyParameters() {
        if (this.hideUnconnectedNodes) {
            this.hideNodes();
        } else {
            this.showHiddenNodes();
        }
        document.getElementById("toggle-unlinked-nodes-visibility-input").checked = this.hideUnconnectedNodes;
        if (this.showCircularDependencies) {
            this.highlightCircularDependencies();
        } else {
            this.unhighlightCircularDependencies();
        }
        document.getElementById("toggle-circular-dependencies-highlighting").checked = this.showCircularDependencies;
    }

    onToggleUnlinkedNodesVisibility(event: ChangeEvent<HTMLInputElement>): void {
        let newValue = event.target.checked;
        this.hideUnconnectedNodes = newValue;
        extLocalStorage.setItem(AppStorage.PARAMETER_TOGGLE_UNLINKED_NODES_VISIBILITY, newValue);
        if (!newValue) {
            this.showHiddenNodes();
        } else {
            this.hideNodes();
        }

        this.props.hub.emit(AppEvents.GRAPH_ITEMS_HIDE_CHANGED, this.cy);
    }

    showHiddenNodes(): void {
        let nodes = this.cy.nodes();
        let hidden = nodes.filter(".hidden");
        this.cy.batch(() => {
            hidden.removeClass("hidden");
        });
    }

    hideNodes(): void {
        let nodes = this.cy.nodes();
        let unconnected = nodes.filter(node => {
            let neighborhood = node.openNeighborhood();
            return neighborhood.length === 0;
        });

        this.cy.batch(() => {
            unconnected.addClass("hidden");
        });
    }

    onToggleCircularDependenciesHighlighting(event: ChangeEvent<HTMLInputElement>) {
        let newValue = event.target.checked;
        this.showCircularDependencies = newValue;
        extLocalStorage.setItem(AppStorage.PARAMETER_TOGGLE_CIRCULAR_DEPENDENCIES_HIGHLIGHTING, newValue);
        if (!newValue) {
            this.unhighlightCircularDependencies();
        } else {
            this.highlightCircularDependencies();
        }
    }

    highlightCircularDependencies() {
        let nodes = this.cy.nodes();
        let circular = nodes.filter(node => {
            let edges = node.connectedEdges();
            for (let edge of edges) {
                let target = edge.target();
                if (target === node) {
                    continue;
                }

                if (Nodes.hasNeighbour(target, node)) {
                    return true;
                }
            }

            return false;
        });

        this.cy.batch(() => {
            circular.addClass("circular");
        });
    }

    unhighlightCircularDependencies() {
        let nodes = this.cy.nodes();
        let circular = nodes.filter(".circular");
        this.cy.batch(() => {
            circular.removeClass("circular");
        });
    }

    render() {
        const t = this.props.t;
        return <div>
            <h4>{t("parameters.graph.caption")}</h4>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.toggle-unlinked-nodes-visibility.caption")}:</label>
                <input id={"toggle-unlinked-nodes-visibility-input"}
                       type={"checkbox"}
                       onChange={this.onToggleUnlinkedNodesVisibility}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.toggle-circular-dependencies-highlighting.caption")}:</label>
                <input id={"toggle-circular-dependencies-highlighting"}
                       type={"checkbox"}
                       onChange={this.onToggleCircularDependenciesHighlighting}/>
            </div>
        </div>;
    }
}

export default withTranslation()(GraphParameters);