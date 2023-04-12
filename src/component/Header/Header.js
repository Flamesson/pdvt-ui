import React, {Component} from "react";
import Menu from "../Menu/Menu";
import "./Header.css";

import Flags from "../Flag/Flags";

class Header extends Component {

    render() {
        return <header id={"header"}>
            <Flags hub={this.props.hub}/>
            <Menu hub={this.props.hub}/>
        </header>;
    }
}

export default Header;