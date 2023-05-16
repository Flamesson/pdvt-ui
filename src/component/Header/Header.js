import React from "react";
import "./Header.css";

import Menu from "../Menu/Menu";
import Flags from "../Flag/Flags";
import Export from "../Export/Export";
import AbstractComponent from "../AbstractComponent";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Strings from "../../utils/Strings";

class Header extends AbstractComponent {
    static DEFAULT_OPENED = true;

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
    }

    componentDidMount() {
        let open;
        if (extLocalStorage.isAbsent(AppStorage.HEADER_OPENED)) {
            open = Header.DEFAULT_OPENED;
        } else {
            open = Strings.asBoolean(extLocalStorage.getItem(AppStorage.HEADER_OPENED));
        }

        this.setState({
            open: open
        });
    }

    toggle(){
        if (this.getOrElse(state => state.open, false)) {
            this.setState({
                open: false
            }, () => {
                extLocalStorage.setItem(AppStorage.HEADER_OPENED, false);
            });
        } else {
            this.setState({
                open: true
            }, () => {
                extLocalStorage.setItem(AppStorage.HEADER_OPENED, true);
            });
        }
    }

    render() {
        let open = this.getOrElse(state => state.open, false);

        return <div className={"header-container"}>
            <div className={"toggle chevron" + (open ? " open" : "")} onClick={this.toggle}/>
            <header id={"header"} className={"header" + (!open ? " closed" : "")}>
                <div className={"icons"}>
                    <Flags hub={this.props.hub}/>
                    <Export hub={this.props.hub}/>
                </div>
                <Menu hub={this.props.hub}/>
            </header>
        </div>;
    }
}

export default Header;