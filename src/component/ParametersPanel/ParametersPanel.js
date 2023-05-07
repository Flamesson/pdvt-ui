import React, {Component} from "react";
import {withTranslation} from "react-i18next";
import debounce from 'lodash.debounce';
import memoize from 'lodash.memoize';
import Parameter from "../../cytoscape/parameter/Parameter";
import Params from "../../cytoscape/parameter/Params";
import Objects from "../../utils/Objects";
import type Elements from "../../cytoscape/Elements";
import {Tab, Tabs} from "react-bootstrap";
import PickField from "../PickField/PickField";
import "./ParametersPanel.css";
import NodeInfo from "../NodeInfo/NodeInfo";
import Strings from "../../utils/Strings";
import logger from "../../utils/Logger";
import AppEvents from "../../AppEvents";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Optional from "../../utils/Optional";

class ParametersPanel extends Component {
    static DEFAULT_LAYOUT = "grid";
    static DEFAULT_LAYOUT_VALUE = {
        name: ParametersPanel.DEFAULT_LAYOUT
    };

    constructor(props) {
        super(props);
        this.elementsSupplier = props.elementsSupplier;
        this.modified = false;

        this.initLayout = this.initLayout.bind(this);
        this.onParameterChange = this.onParameterChange.bind(this);
        this.changeLayout = this.changeLayout.bind(this);
        this.layout = this.layout.bind(this);
        this.getLayoutName = this.getLayoutName.bind(this);
        this.getParameters = this.getParameters.bind(this);
        this.adjustParameters = this.adjustParameters.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.toOption = this.toOption.bind(this);
        this.getLayoutOption = this.getLayoutOption.bind(this);
        this.isOpen = this.isOpen.bind(this);
        this.toggle = this.toggle.bind(this);
        this.debouncedUpdateSearch = this.debouncedUpdateSearch.bind(this);
        this.updateFilterFromField = this.updateFilterFromField.bind(this);
        this.updateFilter_ = this.updateFilter_.bind(this);
        this.getFilteredNodes = this.getFilteredNodes.bind(this);
        this.selectNode = this.selectNode.bind(this);
    }

    componentDidMount(): void {
        let open = extLocalStorage.isPresent(AppStorage.PARAMETERS_OPENED)
            && extLocalStorage.getItem(AppStorage.PARAMETERS_OPENED) === "true";
        this.setState({
            filteredNodes: [],
            open: open
        });
        this.initLayout();
        document.getElementById("parameters-search").value = this.getStoredFilterQuery();
        if (extLocalStorage.isPresent(AppStorage.PARAMETERS_ACTIVE_TAB)) {
            this.activeTab = extLocalStorage.getItem(AppStorage.PARAMETERS_ACTIVE_TAB);
        } else {
            this.activeTab = "parameters";
        }

        this.props.hub.on(AppEvents.ELEMENTS_UPDATE, () => {
            this.adjustParameters();
        });
        this.props.hub.on(AppEvents.CY_UPDATE, cy => this.cy = cy);
        this.props.hub.once(AppEvents.CY_UPDATE, ignored => {this.updateFilter()});
        this.props.hub.on(AppEvents.ELEMENTS_UPDATE, ignored => {this.updateFilter()});
    }

    initLayout(): void {
        if (extLocalStorage.anyAbsent(AppStorage.GRAPH_LAYOUT, AppStorage.GRAPH_PARAMETERS_MODIFIED, AppStorage.GRAPH_PARAMS)) {
            this.changeLayout("breadthfirst");
            return;
        }

        this.layoutName = extLocalStorage.getItem(AppStorage.GRAPH_LAYOUT);
        this.modified = extLocalStorage.getParsedJson(AppStorage.GRAPH_PARAMETERS_MODIFIED);
        this.params = this.loadParams();

        this.params.parameters.forEach((parameter: Parameter) => {
            parameter.subscribeOnChange(this.onParameterChange);
        });

        let layout = this.params.toLayout();
        this.setState({
            _layout: layout
        }, () => {
            this.props.hub.emit(AppEvents.LAYOUT_CHANGE, layout);
        });
    }

    onParameterChange(parameter: Parameter, userOriginated: Boolean): void {
        if (userOriginated) {
            this.modified = true;
            extLocalStorage.setAsJson(AppStorage.GRAPH_PARAMETERS_MODIFIED, this.modified);
            this.saveParams();
        }

        let layout = this.params.toLayout();
        this.setState({
            _layout: layout
        }, () => {
            this.props.hub.emit(AppEvents.LAYOUT_CHANGE, layout);
        });
    }

    saveParams(): void {
        let values = this.params.parameters.map((parameter: Parameter) => {
            return { code: parameter.code, value: parameter.getValue() }
        });
        extLocalStorage.setAsJson(AppStorage.GRAPH_PARAMS, values);
    }

    loadParams(): Params {
        let values = extLocalStorage.getParsedJson(AppStorage.GRAPH_PARAMS);
        let layoutName: String = extLocalStorage.getItem(AppStorage.GRAPH_LAYOUT);
        let params: Params = Params.find(layoutName).getOrThrow();
        values.forEach(value => {
            params.findByCode(value.code).ifPresent((parameter: Parameter) => {
                parameter.setValue(value.value);
            });
        })

        return params;
    }

    changeLayout(newLayout: String): void {
        this.layoutName = newLayout;
        this.modified = false;
        let params: Params = Params.find(newLayout).getOrThrow();
        this.params = params;

        extLocalStorage.setItem(AppStorage.GRAPH_LAYOUT, newLayout);
        extLocalStorage.setAsJson(AppStorage.GRAPH_PARAMETERS_MODIFIED, this.modified);

        params.parameters.forEach((parameter: Parameter) => {
            parameter.subscribeOnChange(this.onParameterChange);
        });

        let layout = params.toLayout();
        this.setState({
            _layout: layout
        }, () => {
            this.props.hub.emit(AppEvents.LAYOUT_CHANGE, layout);
            this.adjustParameters();
            this.saveParams();
        });
    }

    layout() {
        let state = this.state;
        if (Objects.isNotCorrect(state) || Objects.isNotCorrect(state._layout)) {
            return ParametersPanel.DEFAULT_LAYOUT_VALUE;
        }

        return state._layout;
    }

    getLayoutName(): String {
        if (Objects.isCorrect(this.layoutName)) {
            return this.layoutName;
        }

        return ParametersPanel.DEFAULT_LAYOUT;
    }

    getParameters(): Parameter[] {
        let params: Params = this.params;
        if (Objects.isNotCorrect(params)) {
            return [];
        }

        return params.parameters;
    }

    adjustParameters(): void {
        let params: Params = this.params;
        if (Objects.isNotCorrect(params) || Objects.isNotCorrect(this.modified)) {
            return;
        }

        if (this.modified) {
            return;
        }

        let elements: Elements = this.elementsSupplier();
        params.parameters.forEach(parameter => {
            parameter.adjustIfSupported(elements, true);
        });
    }

    getOptions(): Array {
        return Array.from(Params.VALUES.keys()).map(layoutName => {
            return this.toOption(layoutName);
        });
    }

    toOption(layoutName) {
        if (Objects.isNotCorrect(layoutName)) {
            return undefined;
        }

        const t = this.props.t;
        return { value: layoutName, label: t(`layout.${layoutName}.label`) }
    }

    getLayoutOption() {
        return this.toOption(this.getLayoutName());
    }

    getStoredFilterQuery(): undefined | String {
        if (extLocalStorage.isAbsent(AppStorage.FILTER_QUERY)) {
            return undefined;
        }

        return extLocalStorage.getItem(AppStorage.FILTER_QUERY);
    }

    getFilterQuery(): undefined | String {
        return document.getElementById('parameters-search').value;
    }

    updateFilter(): void {
        let filterQuery = this.getFilterQuery();
        Optional.ofNullable(filterQuery).ifPresent(query => {
            this.updateFilter_(query);
        });
    }

    updateFilterFromField(): void {
        let input = document.getElementById('parameters-search');
        let results = document.getElementById('parameters-search-results');
        let queryString = input.value;
        extLocalStorage.setItem(AppStorage.FILTER_QUERY, queryString);

        results.scrollTo(0, 0);

        this.updateFilter_(queryString);
    }

    updateFilter_(queryString): void {
        if (Objects.isNotCorrect(this.cy)) {
            return;
        }

        let normalizedQuery = queryString.toLowerCase().trim();
        let getMetric = (node, query) => {
            let label: String = node.data().label;
            if (!label.startsWith(query)) {
                return 0;
            }

            return Strings.countCommonLength(label, query);
        };
        let getNodeMetric = memoize(node => getMetric(node, normalizedQuery), node => node.id());
        let nodes = this.cy.nodes();
        let filteredNodes = nodes
            .filter(node => {
                return getNodeMetric(node) > 0;
            })
            .sort((nodeA, nodeB) => {
                return getNodeMetric(nodeB) - getNodeMetric(nodeA);
            });

        this.setState({
            filteredNodes: filteredNodes
        });
    }

    selectNode(node): void {
        if (Objects.isNotCorrect(this.props.controller)) {
            logger.warn("A field is undefined. The field - controller.");
            return;
        }
        if (Objects.isNotCorrect(this.props.tap)) {
            logger.warn("A field is undefined. The field - tap.");
            return;
        }

        this.props.tap.onTapNode(node);
    }

    debouncedUpdateSearch() {
        debounce(this.updateFilterFromField, 1000)();
    }

    getFilteredNodes(): Array {
        let state = this.state;
        if (Objects.isNotCorrect(state)) {
            return [];
        }

        return this.state.filteredNodes;
    }

    isOpen(): boolean {
        let state = this.state;
        if (Objects.isNotCorrect(state)) {
            return false;
        }

        return this.state.open;
    }

    toggle(){
        if (this.isOpen()) {
            this.setState({
                open: false
            }, () => {
                extLocalStorage.setItem(AppStorage.PARAMETERS_OPENED, false);
            });
        } else {
            this.setState({
                open: true
            }, () => {
                extLocalStorage.setItem(AppStorage.PARAMETERS_OPENED, true);
            });
        }
    }

    getActiveKey(): String {
        if (Objects.isNotCorrect(this.activeTab)) {
            return "parameters";
        }

        return this.activeTab;
    }

    render() {
        let open = this.isOpen();
        let filteredNodes = this.getFilteredNodes();

        let filterResult = filteredNodes.map(node => {
            return <div key={node.id()} className={"parameter-node-info"} onClick={() => this.selectNode(node)}>
                <NodeInfo node={node}/>
            </div>
        });

        const t = this.props.t;
        return <div className={"parameters-panel"}>
            <div className={"parameters-toggle" + (open ? " parameters-open" : "")} onClick={this.toggle}/>
            <div className={"parameters" + (!open ? " parameters-closed" : "")}>
                <Tabs activeKey={this.getActiveKey()}
                      defaultActiveKey={"parameters"}
                      onSelect={(key) => {
                          this.activeTab = key;
                          extLocalStorage.setItem(AppStorage.PARAMETERS_ACTIVE_TAB, key);
                          this.forceUpdate();
                      }}>
                    <Tab eventKey={"parameters"} title={t("parameters.caption")} className={"parameters-tab"}>
                        <div className={"label-container"}>
                            <PickField hub={this.props.hub}
                                       optionsSupplier={() => this.getOptions()}
                                       options={this.getOptions()}
                                       onValueChanged={picked => {
                                           this.changeLayout(picked);
                                       }}
                                       reference={ref => ref.pick(this.getLayoutOption())} />
                        </div>

                        { this.getParameters().map(parameter => {
                            if (parameter.hasCompleteUi()) {
                                return parameter.toCompleteUi(t);
                            } else {
                                return <div className={"graph-parameter-container"} key={parameter.nameKey}>
                                    <label className={"graph-parameter-caption"}>{t(parameter.nameKey)}:</label>
                                    { parameter.toUi() }
                                </div>
                            }
                        })}
                    </Tab>
                    <Tab eventKey={"filtration"} title={t("filtration.caption")} className={"filtration-tab"}>
                        <div>
                            <input id={"parameters-search"} type={"text"} className={"parameters-search"}
                                   placeholder={t("placeholder.begin-input.message")}
                                   onKeyDown={this.debouncedUpdateSearch}/>
                            <div id={"parameters-search-results"} className={"parameters-search-results"}>
                                { filterResult }
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>;
    }
}

export default withTranslation()(ParametersPanel);