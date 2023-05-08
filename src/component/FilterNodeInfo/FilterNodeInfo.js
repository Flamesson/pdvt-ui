import React, {Component} from "react";

import "./FilterNodeInfo.css";

class FilterNodeInfo extends Component {

    render() {
        let node = this.props.node;
        let data = node.data();
        let name = data.label;

        return <div className={"filter-node-info"}>
            <div className={"filter-node-info-name"}>
                { name }
            </div>
        </div>;
    }
}

export default FilterNodeInfo;