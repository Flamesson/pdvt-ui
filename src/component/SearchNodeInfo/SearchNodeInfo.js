import React, {Component} from "react";

import "./SearchNodeInfo.css";

class SearchNodeInfo extends Component {
  render() {
      let node = this.props.node;
      let data = node.data();
      let name = data.label;

      return <div className={"search-node-info"}>
          <div className={"search-node-info-name"}>
            { name }
          </div>
      </div>;
  }
}

export default SearchNodeInfo;
