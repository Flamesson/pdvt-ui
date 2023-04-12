import React, {Component} from "react";
import "./NodeInfo.css";

class NodeInfo extends Component {
  render() {
      let node = this.props.node;
      let data = node.data();
      let name = data.label;

      return <div className={"node-info"}>
          <div className={"node-info-name"}>
            { name }
          </div>
      </div>;
  }
}

export default NodeInfo;
