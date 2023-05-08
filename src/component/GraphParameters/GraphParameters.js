import React, {Component} from "react";
import {withTranslation} from "react-i18next";

class GraphParameters extends Component {

    render() {
        const t = this.props.t;
        return <div>
            <h4>{t("parameters.graph.caption")}</h4>
        </div>;
    }
}

export default withTranslation()(GraphParameters);