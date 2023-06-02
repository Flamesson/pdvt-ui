import React, {Component} from "react";
import "./Search.css";

import SearchNodeInfo from "../SearchNodeInfo/SearchNodeInfo";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import AppEvents from "../../AppEvents";
import debounce from "lodash.debounce";
import Optional from "../../utils/Optional";
import Objects from "../../utils/Objects";
import memoize from "lodash.memoize";
import logger from "../../utils/Logger";
import {withTranslation} from "react-i18next";
import Strings from "../../utils/Strings";

const minMetricValue = 0.25;
const minSimilarityValue = 0;

class Search extends Component {
    constructor(props) {
        super(props);
        this.cachedNodeWords = false;

        this.state = {
            searchMatchNodes: []
        };

        this.debouncedUpdateSearch = this.debouncedUpdateSearch.bind(this);
        this.getStoredSearchQuery = this.getStoredSearchQuery.bind(this);
        this.getSearchQuery = this.getSearchQuery.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.updateSearchFromField = this.updateSearchFromField.bind(this);
        this.updateSearch_ = this.updateSearch_.bind(this);
        this.selectNode = this.selectNode.bind(this);
        this.getSearchMatchNodes = this.getSearchMatchNodes.bind(this);
    }

    componentDidMount(): void {
        document.getElementById("parameters-search").value = this.getStoredSearchQuery();

        this.props.hub.on(AppEvents.CY_UPDATE, this.onCyUpdate);
        this.props.hub.once(AppEvents.CY_UPDATE, cy => {
            this.cy = cy;
            this.cachedNodeWords = false;
            this.updateSearch();
        });
        this.props.hub.on(AppEvents.ELEMENTS_UPDATE, this.onElementsUpdate);
    }

    componentWillUnmount() {
        this.props.hub.removeListener(AppEvents.CY_UPDATE, this.onCyUpdate);
        this.props.hub.removeListener(AppEvents.ELEMENTS_UPDATE, this.onElementsUpdate);
    }

    onElementsUpdate = (ignored): void => {
        this.cachedNodeWords = false;
        this.updateSearch();
    }

    onCyUpdate = (cy): void => {
        this.cy = cy;
    }

    debouncedUpdateSearch() {
        debounce(this.updateSearchFromField, 1000)();
    }

    getStoredSearchQuery(): undefined | String {
        if (extLocalStorage.isAbsent(AppStorage.SEARCH_QUERY)) {
            return Strings.EMPTY;
        }

        return extLocalStorage.getItem(AppStorage.SEARCH_QUERY);
    }

    getSearchQuery(): undefined | String {
        return document.getElementById('parameters-search').value;
    }

    updateSearch(): void {
        let searchQuery = this.getSearchQuery();
        Optional.ofNullable(searchQuery).ifPresent(query => {
            if (Objects.isNotCorrect(query)) {
                this.updateSearch_(null);
            } else {
                this.updateSearch_(query);
            }
        });
    }

    updateSearchFromField(): void {
        let input = document.getElementById('parameters-search');
        let results = document.getElementById('parameters-search-results');
        let queryString = input.value;
        extLocalStorage.setItem(AppStorage.SEARCH_QUERY, queryString);

        results.scrollTo(0, 0);

        if (Objects.isNotCorrect(queryString)) {
            this.updateSearch_(null);
        } else {
            this.updateSearch_(queryString);
        }
    }

    updateSearch_(queryString): void {
        if (Objects.isNotCorrect(this.cy)) {
            logger.warn("Failed to updateSearch_ cause cy is undefined");
            return;
        }
        if (Objects.isNotCorrect(queryString)) {
            return;
        }

        let normalize = str => str.toLowerCase().trim();
        let getWords = str => str.replaceAll(".", " ").replaceAll(":", " ").split(" ");
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

        let getStringSimilarity = (queryWord, nodeWord) => {
            let index = nodeWord.indexOf(queryWord);

            if (index === 0) {
                let diff = Math.abs(nodeWord.length - queryWord.length);
                let maxLength = Math.max(nodeWord.length, queryWord.length);

                return 1 - (diff / maxLength);
            } else {
                return 0;
            }
        };

        let getMetric = (node, queryWords) => {
            let nodeWords = node.data('words');
            if (Objects.isNotCorrect(nodeWords)) {
                nodeWords = [];
            }

            let score = 0;

            for (let i = 0; i < nodeWords.length; i++) {
                let nodeWord = nodeWords[i];

                for (let j = 0; j < queryWords.length; j++) {
                    let queryWord = queryWords[j];
                    let similarity = getStringSimilarity(queryWord, nodeWord);

                    if (similarity > minSimilarityValue) {
                        score += similarity;
                    }
                }
            }

            return score;
        };

        let getNodeMetric = memoize(node => getMetric(node, queryWords), node => node.id());
        let nodes = this.cy.nodes();

        if (!this.cachedNodeWords) {
            this.cy.batch(() => {
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

        logger.debug("Searched {} nodes", searchMatchNodes.length);

        this.setState({
            searchMatchNodes: searchMatchNodes
        });
    }

    selectNode(node): void {
        if (Objects.isNotCorrect(this.props.tap)) {
            logger.warn("A field is undefined. The field - tap.");
            return;
        }

        this.props.tap.onTapNode(node);
    }

    getSearchMatchNodes(): Array {
        let state = this.state;
        if (Objects.isNotCorrect(state)) {
            return [];
        }

        return this.state.searchMatchNodes;
    }

    render() {
        let searchResult: *[] = this.getSearchMatchNodes().map(node => {
            return <div key={node.id()} className={"parameter-node-info"} onClick={() => this.selectNode(node)}>
                <SearchNodeInfo node={node}/>
            </div>
        });

        const t = this.props.t;
        return <div>
            <input id={"parameters-search"} type={"text"} className={"parameters-search"}
                   placeholder={t("placeholder.begin-input.message")}
                   onKeyDown={this.debouncedUpdateSearch}/>
            <div id={"parameters-search-results"} className={"parameters-search-results"}>
                { searchResult }
            </div>
        </div>;
    }
}

export default withTranslation()(Search);