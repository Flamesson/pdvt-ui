import React, {Component} from "react";
import {withTranslation} from "react-i18next";
import AppEvents from "../../AppEvents";
import {ChangeEvent} from "react";
import Optional from "../../utils/Optional";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Strings from "../../utils/Strings";
import Nodes from "../../utils/Nodes";
import Arrays from "../../utils/Arrays";

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
        this.onToggleMostLongPathHighlighting = this.onToggleMostLongPathHighlighting.bind(this);
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
        this.showMostLongPath = Optional.ofNullable(extLocalStorage.getItem(AppStorage.PARAMETER_TOGGLE_MOST_LONG_PATH_HIGHLIGHTING))
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
        if (this.showMostLongPath) {
            this.highlightMostLongPath();
        } else {
            this.unhighlightMostLongPath();
        }
        document.getElementById("toggle-most-long-path-highlighting").checked = this.showMostLongPath;
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
        Nodes.show(this.cy, hidden);
    }

    hideNodes(): void {
        let nodes = this.cy.nodes();
        let unconnected = nodes.filter(node => {
            let neighborhood = node.openNeighborhood();
            return neighborhood.length === 0;
        });

        Nodes.hide(this.cy, unconnected);
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

    onToggleMostLongPathHighlighting(event: ChangeEvent<HTMLInputElement>): void {
        let newValue = event.target.checked;
        this.showMostLongPath = newValue;
        extLocalStorage.setItem(AppStorage.PARAMETER_TOGGLE_MOST_LONG_PATH_HIGHLIGHTING, newValue);
        if (!newValue) {
            this.unhighlightMostLongPath();
        } else {
            this.highlightMostLongPath();
        }
    }

    highlightMostLongPath(): void {
        let elements = this.cy.elements();
        let roots = elements.roots();
        let deepestPathLength = 0;
        let dfses = roots
            .map(root => {
                return this.cy.elements().dfs({
                    root: root,
                    directed: false,
                    visit: function (node, edge, previousNode, index, depth) {
                        let edges = node.connectedEdges()
                        if (edges.length < 2) {
                            if (depth === deepestPathLength) {
                                return true;
                            } else if (depth > deepestPathLength) {
                                deepestPathLength = depth;
                                return true;
                            } else if (depth < deepestPathLength) {
                                return false;
                            }
                        }
                    }
                });
            })
            .filter(dfs => Arrays.isNotEmpty(dfs.found));

        let maxDfses = [];
        let maxPathLength = 0;
        for (let dfs of dfses) {
            let length = dfs.path.length;
            if (length > maxPathLength) {
                maxPathLength = dfs.path.length;
                maxDfses = [];
                maxDfses.push(dfs);
            } else if (length === maxPathLength) {
                maxDfses.push(dfs);
            }
        }

        this.cy.batch(() => {
            let paths = maxDfses.map(dfs => dfs.path);
            for (let path of paths) {
                let nodes = path.filter(element => element.isNode());
                if (nodes.length === 0) {
                    continue;
                }

                nodes[0].addClass("most-long-path-start visible");
                for (let i = 1; i < nodes.length - 1; i++) {
                    nodes[i].addClass("most-long-path visible");
                }
                if (nodes.length > 1) {
                    nodes[nodes.length - 1].addClass("most-long-path-end visible");
                }
            }
        });
    }

    unhighlightMostLongPath(): void {
        let pathStartNodes = this.cy.nodes(".most-long-path-start.visible");
        let pathNodes = this.cy.nodes(".most-long-path.visible");
        let pathEndNodes = this.cy.nodes(".most-long-path-end.visible");
        this.cy.batch(() => {
            pathStartNodes.removeClass("most-long-path-start visible");
            pathNodes.removeClass("most-long-path visible");
            pathEndNodes.removeClass("most-long-path-end visible");
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
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.toggle-most-long-path-highlighting.caption")}:</label>
                <input id={"toggle-most-long-path-highlighting"}
                       type={"checkbox"}
                       onChange={this.onToggleMostLongPathHighlighting}/>
            </div>
        </div>;
    }
}

export default withTranslation()(GraphParameters);