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

const minMetricValue = 0.25;
const minSimilarityValue = 0;

class ParametersPanel extends Component {
    static DEFAULT_LAYOUT = "grid";
    static DEFAULT_LAYOUT_VALUE = {
        name: ParametersPanel.DEFAULT_LAYOUT
    };

    constructor(props) {
        super(props);
        this.elementsSupplier = props.elementsSupplier;
        this.modified = false;
        this.cachedNodeWords = false;

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
        this.updateSearch = this.updateSearch.bind(this);
        this.updateSearch_ = this.updateSearch_.bind(this);
        this.getSearchMatchNodes = this.getSearchMatchNodes.bind(this);
        this.selectNode = this.selectNode.bind(this);
    }

    componentDidMount() {
        this.setState({
            searchMatchNodes: [],
            open: false
        });
        this.changeLayout("breadthfirst");
        this.props.hub.on('elements update', () => {
            this.adjustParameters();
        });
    }

    changeLayout(newLayout: String) {
        this.layoutName = newLayout;
        this.modified = false;
        let params: Params = Params.find(newLayout).getOrThrow();
        this.params = params;
        params.parameters.forEach((parameter: Parameter) => {
            parameter.subscribeOnChange((changed: Parameter, userOriginated: Boolean) => {
                if (userOriginated) {
                    this.modified = true;
                }

                let layout = params.toLayout();
                this.setState({
                    _layout: layout
                }, () => {
                    this.props.hub.emit('layout change', layout);
                });
            });
        });

        let layout = params.toLayout();
        this.setState({
            _layout: layout
        }, () => {
            this.props.hub.emit('layout change', layout);
            this.adjustParameters();
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

    adjustParameters() {
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

    updateSearch(): void {
        let input = document.getElementById('parameters-search');
        let results = document.getElementById('parameters-search-results');
        let queryString = input.value;

        results.scrollTo(0, 0);

        this.updateSearch_(queryString);
    }

    updateSearch_(queryString): void {
        if (Objects.isNotCorrect(this.props.cy)) {
            return;
        }

        let normalize = str => str.toLowerCase();
        let getWords = str => str.split('.');
        let queryWords = getWords(normalize(queryString));

        let addWords = (wordList, wordsStr) => {
            if (wordsStr) {
                wordList.push(...getWords(normalize(wordsStr)));
            }
        };

        let cacheNodeWords = node => {
            let data = node.data();
            let wordList = [];

            addWords(wordList, data.label);

            node.data('words', wordList);
        };

        let getMetric = (node, queryWords) => {
            let nodeWords = node.data('words');
            let score = 0;

            for (let i = 0; i < nodeWords.length; i++) {
                let nodeWord = nodeWords[i];

                for (let j = 0; j < queryWords.length; j++) {
                    let queryWord = queryWords[j];
                    let similarity = Strings.getSimilarity(queryWord, nodeWord);

                    if (similarity > minSimilarityValue) {
                        score += similarity;
                    }
                }
            }

            return score;
        };

        let getNodeMetric = memoize(node => getMetric(node, queryWords), node => node.id());

        let nodes = this.props.cy.nodes();
        if (!this.cachedNodeWords) {
            this.props.cy.batch(() => {
                nodes.forEach(cacheNodeWords);
            });

            this.cachedNodeWords = true;
        }

        let searchMatchNodes = nodes
            .filter(node => {
                return getNodeMetric(node) > minMetricValue;
            })
            .sort((nodeA, nodeB) => {
                return getNodeMetric(nodeB) - getNodeMetric(nodeA);
            });

        this.setState({
            searchMatchNodes: searchMatchNodes
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
        debounce(this.updateSearch, 1000)();
    }

    getSearchMatchNodes(): Array {
        let state = this.state;
        if (Objects.isNotCorrect(state)) {
            return [];
        }

        return this.state.searchMatchNodes;
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
            });
        } else {
            this.setState({
                open: true
            });
        }
    }

    render() {
        let open = this.isOpen();
        let searchMatchNodes = this.getSearchMatchNodes();

        let searchResults = searchMatchNodes.map(node => {
            return <div key={node.id()} className={"parameter-node-info"} onClick={() => this.selectNode(node)}>
                <NodeInfo node={node}/>
            </div>
        });

        const t = this.props.t;
        return <div className={"parameters-panel"}>
            <div className={"parameters-toggle" + (open ? " parameters-open" : "")} onClick={this.toggle}/>
            <div className={"parameters" + (!open ? " parameters-closed" : "")}>
                <Tabs defaultActiveKey={"parameters"}>
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
                    <Tab eventKey={"filtration"} title={t("filtration.caption")}>
                        <div>
                            <input id={"parameters-search"} type={"text"} className={"parameters-search"}
                                   placeholder={t("placeholder.begin-input.message")}
                                   onKeyDown={this.debouncedUpdateSearch}/>
                            <div id={"parameters-search-results"} className={"parameters-search-results"}>
                                { searchResults }
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>;
    }
}

export default withTranslation()(ParametersPanel);