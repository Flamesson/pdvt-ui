import React, {Component} from "react";
import NodeInfo from "../NodeInfo/NodeInfo";
import Objects from "../../utils/Objects";
import debounce from 'lodash.debounce';
import memoize from 'lodash.memoize';
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Optional from "../../utils/Optional";
import Strings from "../../utils/Strings";
import logger from "../../utils/Logger";
import AppEvents from "../../AppEvents";
import {withTranslation} from "react-i18next";

class Filtration extends Component {
    constructor(props) {
        super(props);

        this.debouncedUpdateFilter = this.debouncedUpdateFilter.bind(this);
        this.getStoredFilterQuery = this.getStoredFilterQuery.bind(this);
        this.getFilterQuery = this.getFilterQuery.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.updateFilterFromField = this.updateFilterFromField.bind(this);
        this.updateFilter_ = this.updateFilter_.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.getFilteredNodes = this.getFilteredNodes.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            filteredNodes: [],
        });
        document.getElementById("parameters-search").value = this.getStoredFilterQuery();
        if (extLocalStorage.isPresent(AppStorage.PARAMETERS_ACTIVE_TAB)) {
            this.activeTab = extLocalStorage.getItem(AppStorage.PARAMETERS_ACTIVE_TAB);
        } else {
            this.activeTab = "parameters";
        }

        this.props.hub.on(AppEvents.CY_UPDATE, cy => this.cy = cy);
        this.props.hub.once(AppEvents.CY_UPDATE, ignored => {this.updateFilter()});
        this.props.hub.on(AppEvents.ELEMENTS_UPDATE, ignored => {this.updateFilter()});
    }

    debouncedUpdateFilter() {
        debounce(this.updateFilterFromField, 1000)();
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

        let hidden = nodes.not(filteredNodes);
        this.cy.batch(() => {
            filteredNodes.removeClass('hidden');
            hidden.addClass('hidden');
        });

        this.setState({
            filteredNodes: filteredNodes
        });
    }

    selectNode(node): void {
        if (Objects.isNotCorrect(this.props.tap)) {
            logger.warn("A field is undefined. The field - tap.");
            return;
        }

        this.props.tap.onTapNode(node);
    }

    getFilteredNodes(): Array {
        let state = this.state;
        if (Objects.isNotCorrect(state)) {
            return [];
        }

        return this.state.filteredNodes;
    }

    render() {
        let filterResult = this.getFilteredNodes().map(node => {
            return <div key={node.id()} className={"parameter-node-info"} onClick={() => this.selectNode(node)}>
                <NodeInfo node={node}/>
            </div>
        });

        const t = this.props.t;
        return <div>
            <input id={"parameters-search"} type={"text"} className={"parameters-search"}
                   placeholder={t("placeholder.begin-input.message")}
                   onKeyDown={this.debouncedUpdateFilter}/>
            <div id={"parameters-search-results"} className={"parameters-search-results"}>
                { filterResult }
            </div>
        </div>;
    }
}

export default withTranslation()(Filtration);