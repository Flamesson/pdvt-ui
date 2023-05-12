import React, {Component} from "react";
import "./Menu.css";

import { withTranslation } from 'react-i18next';
import {Link} from "react-router-dom";

class Menu extends Component {
    render() {
        const t = this.props.t;
        return <div id={"menu"}>
            <Link className={"menu-item"} to={"/Visualization"}>{t("menu-item.visualization")}</Link>
            <Link className={"menu-item"} to={"/Data"}>{t("menu-item.data")}</Link>
            <Link className={"menu-item"} to={"/help"}>{t("menu-item.help")}</Link>
        </div>
    }
}

export default withTranslation()(Menu);