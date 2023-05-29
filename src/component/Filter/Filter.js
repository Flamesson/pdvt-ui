import React, {Component} from "react";
import Objects from "../../utils/Objects";
import debounce from 'lodash.debounce';
import memoize from 'lodash.memoize';
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Optional from "../../utils/Optional";
import Strings from "../../utils/Strings";
import AppEvents from "../../AppEvents";
import {withTranslation} from "react-i18next";

import "./Filter.css";
import FilterNodeInfo from "../FilterNodeInfo/FilterNodeInfo";
import logger from "../../utils/Logger";
import Nodes from "../../utils/Nodes";

class Filter extends Component {
    constructor(props) {
        super(props);

        this.debouncedUpdateFilter = this.debouncedUpdateFilter.bind(this);
        this.getStoredFilterQuery = this.getStoredFilterQuery.bind(this);
        this.getFilterQuery = this.getFilterQuery.bind(this);
        this.updateFilter = this.updateFilter.bind(this);
        this.updateFilterFromField = this.updateFilterFromField.bind(this);
        this.updateFilter_ = this.updateFilter_.bind(this);
        this.getFilteredNodes = this.getFilteredNodes.bind(this);
    }

    componentDidMount(): void {
        this.setState({
            filteredNodes: [],
        });
        document.getElementById("parameters-filter").value = this.getStoredFilterQuery();

        this.props.hub.on(AppEvents.CY_UPDATE, this.onCyUpdate);
        this.props.hub.once(AppEvents.CY_UPDATE, ignored => {this.updateFilter()});
        this.props.hub.on(AppEvents.ELEMENTS_UPDATE, this.onElementsUpdate);
    }

    componentWillUnmount() {
        this.props.hub.removeListener(AppEvents.CY_UPDATE, this.onCyUpdate);
        this.props.hub.removeListener(AppEvents.ELEMENTS_UPDATE, this.onElementsUpdate);
    }

    onCyUpdate = (cy): void => {
        this.cy = cy;
    }

    onElementsUpdate = (ignored): void => {
        this.updateFilter();
    }

    debouncedUpdateFilter() {
        debounce(this.updateFilterFromField, 1000)();
    }

    getStoredFilterQuery(): undefined | String {
        if (extLocalStorage.isAbsent(AppStorage.FILTER_QUERY)) {
            return Strings.EMPTY;
        }

        return extLocalStorage.getItem(AppStorage.FILTER_QUERY);
    }

    getFilterQuery(): undefined | String {
        return document.getElementById('parameters-filter').value;
    }

    updateFilter(): void {
        let filterQuery = this.getFilterQuery();
        Optional.ofNullable(filterQuery).ifPresent(query => {
            if (Strings.isBlank(query)) {
                this.updateFilter_(null);
            } else {
                this.updateFilter_(query);
            }
        });
    }

    updateFilterFromField(): void {
        let input = document.getElementById('parameters-filter');
        let results = document.getElementById('parameters-filter-results');
        let queryString = input.value;
        extLocalStorage.setItem(AppStorage.FILTER_QUERY, queryString);

        results.scrollTo(0, 0);

        if (Strings.isBlank(queryString)) {
            this.updateFilter_(null);
        } else {
            this.updateFilter_(queryString);
        }
    }

    updateFilter_(queryString): void {
        if (Objects.isNotCorrect(this.cy)) {
            logger.warn("Failed to updateFilter_ cause cy is undefined");
            return;
        }

        let nodes = this.cy.nodes();
        if (Objects.isNotCorrect(queryString)) {
            Nodes.show(this.cy, nodes);
            this.props.hub.emit(AppEvents.GRAPH_ITEMS_HIDE_CHANGED, this.cy);
            this.setState({
                filteredNodes: nodes
            });
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
        }, () => {
            this.cy.fit(10);
            this.props.hub.emit(AppEvents.GRAPH_ITEMS_HIDE_CHANGED, this.cy);
        });
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
            return <div key={node.id()} className={"parameter-node-info"}>
                <FilterNodeInfo node={node}/>
            </div>
        });

        const t = this.props.t;
        return <div>
            <input id={"parameters-filter"} type={"text"} className={"parameters-filter"}
                   placeholder={t("placeholder.begin-input.message")}
                   onKeyDown={this.debouncedUpdateFilter}/>
            <div id={"parameters-filter-results"} className={"parameters-filter-results"}>
                { filterResult }
            </div>
        </div>;
    }
}

export default withTranslation()(Filter);