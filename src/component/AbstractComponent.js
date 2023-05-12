import React, {Component} from "react";
import Objects from "../utils/Objects";

class AbstractComponent extends Component {
    constructor(props) {
        super(props);

        this.getOrElse = this.getOrElse.bind(this);
    }

    getOrElse(stateFunction: Function, defaultValue: *): * {
        if (Objects.isCorrect(this.state)) {
            return stateFunction(this.state);
        } else {
            return defaultValue;
        }
    }
}

export default AbstractComponent;