import React, {Component} from "react";
import {Image} from "react-bootstrap";
import Objects from "../../utils/Objects";
import PathSource from "./PathSource";

class Flag extends Component {
    componentDidMount() {
        this.props.hub.on("locale changed", localeCode => {
            this.setState({
                localeCode: localeCode
            });
        });
    }

    render() {
        let state = this.state;

        let path;
        if (Objects.isNotCorrect(state)) {
            path = undefined;
        } else {
            path = new PathSource().getPath(state.localeCode);
        }

        return <Image src={path}/>;
    }
}

export default Flag;