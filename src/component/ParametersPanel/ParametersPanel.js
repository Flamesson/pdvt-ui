import React, {Component} from "react";
import "./ParametersPanel.css";

import {withTranslation} from "react-i18next";
import Objects from "../../utils/Objects";
import {Tab, Tabs} from "react-bootstrap";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Filter from "../Filter/Filter";
import Parameters from "../Parameters/Parameters";
import Search from "../Search/Search";
import Strings from "../../utils/Strings";

class ParametersPanel extends Component {
    static DEFAULT_LAYOUT = "grid";
    static DEFAULT_LAYOUT_VALUE = {
        name: ParametersPanel.DEFAULT_LAYOUT
    };

    constructor(props) {
        super(props);

        this.isOpen = this.isOpen.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount(): void {
        let open = extLocalStorage.isPresent(AppStorage.PARAMETERS_OPENED)
            && Strings.asBoolean(extLocalStorage.getItem(AppStorage.PARAMETERS_OPENED));
        this.setState({
            open: open
        });
        if (extLocalStorage.isPresent(AppStorage.PARAMETERS_ACTIVE_TAB)) {
            this.activeTab = extLocalStorage.getItem(AppStorage.PARAMETERS_ACTIVE_TAB);
        } else {
            this.activeTab = "parameters";
        }
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

        const t = this.props.t;
        return <div className={"parameters-panel"}>
            <div className={"toggle"} onClick={this.toggle}/>
            <div className={"parameters vertical-scrollable" + (!open ? " parameters-closed" : "")}>
                <Tabs activeKey={this.getActiveKey()}
                      defaultActiveKey={"parameters"}
                      onSelect={(key) => {
                          this.activeTab = key;
                          extLocalStorage.setItem(AppStorage.PARAMETERS_ACTIVE_TAB, key);
                          this.forceUpdate();
                      }}>
                    <Tab eventKey={"parameters"} title={t("tab.parameters.caption")} className={"parameters-tab"}>
                        <Parameters hub={this.props.hub}
                                    elementsSupplier={this.props.elementsSupplier}
                                    cyStyle={this.props.cyStyle}/>
                    </Tab>
                    <Tab eventKey={"filtration"} title={t("tab.filtration.caption")} className={"filtration-tab"}>
                        <Filter hub={this.props.hub} controller={this.props.controller}/>
                    </Tab>
                    <Tab eventKey={"search"} title={t("tab.search.caption")} className={"search-tab"}>
                        <Search hub={this.props.hub} tap={this.props.tap}/>
                    </Tab>
                </Tabs>
            </div>
        </div>;
    }
}

export default withTranslation()(ParametersPanel);