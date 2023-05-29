import React, {Component} from "react";
import {withTranslation} from "react-i18next";
import AppEvents from "../../AppEvents";
import {ChangeEvent} from "react";
import Optional from "../../utils/Optional";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Strings from "../../utils/Strings";
import LicenseDependency from "../../licenses/LicenseDependency";
import GraphStyle from "../../cytoscape/GraphStyle";
import {Button} from "react-bootstrap";
import Objects from "../../utils/Objects";

class GraphParameters extends Component {
    constructor(props) {
        super(props);

        this.fireStyleChanged = this.fireStyleChanged.bind(this);
        this.reset = this.reset.bind(this);
        this.applyParameters = this.applyParameters.bind(this);
        this.onToggleUnlinkedNodesVisibility = this.onToggleUnlinkedNodesVisibility.bind(this);
        this.showHiddenNodes = this.showHiddenNodes.bind(this);
        this.hideNodes = this.hideNodes.bind(this);
        this.onToggleCircularDependenciesHighlighting = this.onToggleCircularDependenciesHighlighting.bind(this);
        this.highlightCircularDependencies = this.highlightCircularDependencies.bind(this);
        this.unhighlightCircularDependencies = this.unhighlightCircularDependencies.bind(this);
        this.onToggleMostLongPathHighlighting = this.onToggleMostLongPathHighlighting.bind(this);
        this.hasLicensesData = this.hasLicensesData.bind(this);
        this.onToggleUseLicenses = this.onToggleUseLicenses.bind(this);
        this.stopUsingLicenses = this.stopUsingLicenses.bind(this);
        this.startUsingLicenses = this.startUsingLicenses.bind(this);
        this.getLicenses = this.getLicenses.bind(this);
        this.onToggleHighlightVersionsCollisions = this.onToggleHighlightVersionsCollisions.bind(this);
        this.unhighlightVersionsCollisions = this.unhighlightVersionsCollisions.bind(this);
        this.highlightVersionsCollisions = this.highlightVersionsCollisions.bind(this);
        this.onCircularColorChange = this.onCircularColorChange.bind(this);
        this.onMostLongPathStartColor = this.onMostLongPathStartColor.bind(this);
        this.onMostLongPathColor = this.onMostLongPathColor.bind(this);
        this.onMostLongPathEndColor = this.onMostLongPathEndColor.bind(this);
        this.onVersionsCollisionColor = this.onVersionsCollisionColor.bind(this);
        this.onVersionsCollisionEndNodeColor = this.onVersionsCollisionEndNodeColor.bind(this);
        this.onPotentiallyDangerousColor = this.onPotentiallyDangerousColor.bind(this);
        this.onPotentiallyDangerousInfectedColor = this.onPotentiallyDangerousInfectedColor.bind(this);
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
        this.useLicenses = Optional.ofNullable(extLocalStorage.getItem(AppStorage.PARAMETER_TOGGLE_USE_LICENSES))
            .map(Strings.asBoolean)
            .getOrElse(() => false);
        this.versionsCollisitions = Optional.ofNullable(extLocalStorage.getItem(AppStorage.PARAMETER_TOGGLE_VERSIONS_COLLISIONS))
            .map(Strings.asBoolean)
            .getOrElse(() => false);
    }

    fireStyleChanged(): void {
        this.props.hub.emit(AppEvents.CY_STYLE_CHANGED, this.props.cyStyle);
    }

    reset(): void {
        let style: GraphStyle = this.props.cyStyle.graphStyle;
        style.reset();
        document.getElementById("circular-color-input").value = style.circularColor;
        document.getElementById("most-long-path-start-color-input").value = style.mostLongPathStartColor;
        document.getElementById("most-long-path-color-input").value = style.mostLongPathColor;
        document.getElementById("most-long-path-end-color-input").value = style.mostLongPathEndColor;
        document.getElementById("versions-collision-color-input").value = style.versionsCollisionColor;
        document.getElementById("versions-collision-end-node-color-input").value = style.versionsCollisionEndNodeColor;
        document.getElementById("potentially-dangerous-color-input").value = style.potentiallyDangerousColor;
        document.getElementById("potentially-dangerous-infected-color-input").value = style.potentiallyDangerousInfectedColor;
        this.props.hub.emit(AppEvents.CY_STYLE_CHANGED, style);
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

        let toggleUseLicensesCheckbox = document.getElementById("toggle-use-licenses");
        if (Objects.isCorrect(toggleUseLicensesCheckbox)) {
            if (this.useLicenses) {
                this.startUsingLicenses();
            } else {
                this.stopUsingLicenses();
            }
            toggleUseLicensesCheckbox.checked = this.useLicenses;
        }

        let toggleVersionsCollisionsCheckbox = document.getElementById("toggle-highlight-versions-collisions");
        if (Objects.isCorrect(toggleVersionsCollisionsCheckbox)) {
            if (this.versionsCollisitions) {
                this.highlightVersionsCollisions();
            } else {
                this.unhighlightVersionsCollisions();
            }
            toggleVersionsCollisionsCheckbox.checked = this.versionsCollisitions;
        }
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
        let nodes = this.cy.nodes().filter(".unlinked.unlinked-hidden");
        this.cy.batch(() => {
            nodes.removeClass("unlinked-hidden");
        });
    }

    hideNodes(): void {
        let nodes = this.cy.nodes().filter(".unlinked");
        this.cy.batch(() => {
            nodes.addClass("unlinked-hidden");
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
        let nodes = this.cy.nodes().filter(".cycle");
        this.cy.batch(() => {
            nodes.addClass("cycle-visible");
        });
    }

    unhighlightCircularDependencies() {
        let nodes = this.cy.nodes();
        let cycle = nodes.filter(".cycle.cycle-visible");
        this.cy.batch(() => {
            cycle.removeClass("cycle-visible");
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
        let nodes = this.cy.nodes();
        let startNodes = nodes.filter(".most-long-path-start");
        let intermediateNodes = nodes.filter(".most-long-path");
        let endNodes = nodes.filter(".most-long-path-end");
        this.cy.batch(() => {
            startNodes.addClass("path-visible");
            intermediateNodes.addClass("path-visible");
            endNodes.addClass("path-visible");
        });
    }

    unhighlightMostLongPath(): void {
        let startNodes = this.cy.nodes(".most-long-path-start.path-visible");
        let intermediateNode = this.cy.nodes(".most-long-path.path-visible");
        let endNodes = this.cy.nodes(".most-long-path-end.path-visible");
        this.cy.batch(() => {
            startNodes.removeClass("path-visible");
            intermediateNode.removeClass("path-visible");
            endNodes.removeClass("path-visible");
        });
    }

    hasLicensesData(): boolean {
        return extLocalStorage.isPresent(AppStorage.DEPENDENCIES_LICENSES);
    }

    onToggleUseLicenses(event: ChangeEvent<HTMLInputElement>): void {
        let newValue = event.target.checked;
        this.useLicenses = newValue;
        extLocalStorage.setItem(AppStorage.PARAMETER_TOGGLE_USE_LICENSES, newValue);
        if (!newValue) {
            this.stopUsingLicenses();
        } else {
            this.startUsingLicenses();
        }
    }

    stopUsingLicenses(): void {
        let nodes = this.cy.nodes();
        let infections = nodes.filter(".potentially-dangerous.infection-source.infection-visible");
        let infected = nodes.filter(".potentially-dangerous.infected.infection-visible");
        this.cy.batch(() => {
            infections.removeClass("infection-visible");
            infected.removeClass("infection-visible");
        });
    }

    startUsingLicenses(): void {
        let nodes = this.cy.nodes();
        let infections = nodes.filter(".potentially-dangerous.infection-source");
        let infected = nodes.filter(".potentially-dangerous.infected");
        this.cy.batch(() => {
            infections.addClass("infection-visible");
            infected.addClass("infection-visible");
        });
    }

    getLicenses(): LicenseDependency[] {
        let plain = extLocalStorage.getParsedJson(AppStorage.DEPENDENCIES_LICENSES);
        return plain.map(singlePlain => {
            return new LicenseDependency(singlePlain.key, singlePlain.value);
        });
    }

    hasVersions(): boolean {
        return extLocalStorage.isPresent(AppStorage.HAS_VERSIONS)
            && Strings.asBoolean(extLocalStorage.getItem(AppStorage.HAS_VERSIONS));
    }

    onToggleHighlightVersionsCollisions(event: ChangeEvent<HTMLInputElement>): void {
        let newValue = event.target.checked;
        this.versionsCollisitions = newValue;
        extLocalStorage.setItem(AppStorage.PARAMETER_TOGGLE_VERSIONS_COLLISIONS, newValue);
        if (!newValue) {
            this.unhighlightVersionsCollisions();
        } else {
            this.highlightVersionsCollisions();
        }
    }

    unhighlightVersionsCollisions(): void {
        let nodes = this.cy.nodes();
        let intermediate = nodes.filter(".version-collision.intermediate-node.versions-visible");
        let endNodes = nodes.filter(".version-collision.end-node.versions-visible");
        this.cy.batch(() => {
            intermediate.removeClass("versions-visible");
            endNodes.removeClass("versions-visible");
        });
    }

    highlightVersionsCollisions(): void {
        let nodes = this.cy.nodes();
        let intermediate = nodes.filter(".version-collision.intermediate-node");
        let endNodes = nodes.filter(".version-collision.end-node");
        this.cy.batch(() => {
            intermediate.addClass("versions-visible");
            endNodes.addClass("versions-visible");
        });
    }

    onCircularColorChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.graphStyle.setCircularColor(event.target.value);
        this.fireStyleChanged();
    }

    onMostLongPathStartColor(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.graphStyle.withMostLongPathStartColor(event.target.value);
        this.fireStyleChanged();
    }

    onMostLongPathColor(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.graphStyle.withMostLongPathColor(event.target.value);
        this.fireStyleChanged();
    }

    onMostLongPathEndColor(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.graphStyle.withMostLongPathEndColor(event.target.value);
        this.fireStyleChanged();
    }

    onVersionsCollisionColor(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.graphStyle.withVersionsCollisionColor(event.target.value);
        this.fireStyleChanged();
    }

    onVersionsCollisionEndNodeColor(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.graphStyle.withVersionsCollisionEndNodeColor(event.target.value);
        this.fireStyleChanged();
    }

    onPotentiallyDangerousColor(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.graphStyle.withPotentiallyDangerousColor(event.target.value);
        this.fireStyleChanged();
    }

    onPotentiallyDangerousInfectedColor(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.graphStyle.withPotentiallyDangerousInfectedColor(event.target.value);
        this.fireStyleChanged();
    }

    render() {
        const t = this.props.t;
        let style = this.props.cyStyle.graphStyle;
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
            {
                this.hasLicensesData() && <div className={"graph-parameter-container"}>
                    <label className={"graph-parameter-caption"}>{t("parameter.graph.toggle-use-licenses.caption")}</label>
                    <input id={"toggle-use-licenses"}
                           type={"checkbox"}
                           onChange={this.onToggleUseLicenses}/>
                </div>
            }
            {
                this.hasVersions() && <div className={"graph-parameter-container"}>
                    <label className={"graph-parameter-caption"}>{t("parameter.graph.toggle-highlight-versions-collisions")}:</label>
                    <input id={"toggle-highlight-versions-collisions"}
                           type={"checkbox"}
                           onChange={this.onToggleHighlightVersionsCollisions}/>
                </div>
            }

            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.circular-dependency-color.caption")}:</label>
                <input id={"circular-color-input"}
                       type={"color"}
                       defaultValue={style.circularColor}
                       onChange={this.onCircularColorChange}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.most-long-path-start-color.caption")}:</label>
                <input id={"most-long-path-start-color-input"}
                       type={"color"}
                       defaultValue={style.mostLongPathStartColor}
                       onChange={this.onMostLongPathStartColor}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.most-long-path-color.caption")}:</label>
                <input id={"most-long-path-color-input"}
                       type={"color"}
                       defaultValue={style.mostLongPathColor}
                       onChange={this.onMostLongPathColor}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.most-long-path-end-color.caption")}:</label>
                <input id={"most-long-path-end-color-input"}
                       type={"color"}
                       defaultValue={style.mostLongPathEndColor}
                       onChange={this.onMostLongPathEndColor}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.versions-collision-color.caption")}:</label>
                <input id={"versions-collision-color-input"}
                       type={"color"}
                       defaultValue={style.versionsCollisionColor}
                       onChange={this.onVersionsCollisionColor}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.versions-collision-end-node-color.caption")}:</label>
                <input id={"versions-collision-end-node-color-input"}
                       type={"color"}
                       defaultValue={style.versionsCollisionEndNodeColor}
                       onChange={this.onVersionsCollisionEndNodeColor}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.potentially-dangerous-color.caption")}:</label>
                <input id={"potentially-dangerous-color-input"}
                       type={"color"}
                       defaultValue={style.potentiallyDangerousColor}
                       onChange={this.onPotentiallyDangerousColor}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.graph.potentially-dangerous-infected-color.caption")}:</label>
                <input id={"potentially-dangerous-infected-color-input"}
                       type={"color"}
                       defaultValue={style.potentiallyDangerousInfectedColor}
                       onChange={this.onPotentiallyDangerousInfectedColor}/>
            </div>

            <div className={"full-width-container flex-horizontal-center-center margin-top-10px"}>
                <Button onClick={ignored => this.reset()} variant={"outline-info"}>
                    {t("button.reset.caption")}
                </Button>
            </div>
        </div>;
    }
}

export default withTranslation()(GraphParameters);