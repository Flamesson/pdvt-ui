import React from "react";
import "./InfoPanel.css";

import AppEvents from "../../AppEvents";
import AbstractComponent from "../AbstractComponent";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Strings from "../../utils/Strings";

class InfoPanel extends AbstractComponent {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        this.props.hub.on(AppEvents.ELEMENTS_UPDATE, elements => {
            this.setState({
                nodes: elements.nodes.length,
                edges: elements.edges.length
            })
        });

        let open = extLocalStorage.isPresent(AppStorage.INFO_OPENED)
            && Strings.asBoolean(extLocalStorage.getItem(AppStorage.INFO_OPENED));
        this.setState({
            open: open
        });
    }

    toggle(){
        if (this.getOrElse(state => state.open, false)) {
            this.setState({
                open: false
            }, () => {
                extLocalStorage.setItem(AppStorage.INFO_OPENED, false);
            });
        } else {
            this.setState({
                open: true
            }, () => {
                extLocalStorage.setItem(AppStorage.INFO_OPENED, true);
            });
        }
    }

    render() {
        let open = this.getOrElse(state => state.open, false);
        return <div id={"info-panel-container"}>
            <div id={"info-panel"}>
                <div className={"toggle chevron" + (open ? " open" : "")} onClick={this.toggle}/>
                <div id={"info"} className={"info" + (!open ? " closed" : "")}>
                    <h5>Всего</h5>
                    <label>Узлов: {this.getOrElse(state => state.nodes, 0)}</label><br/>
                    <label>Ребер: {this.getOrElse(state => state.edges, 0)}</label>
                </div>
            </div>
        </div>;
    }
}

export default InfoPanel;