import Parameter from "./Parameter";
import React, {ReactNode} from "react";

class NumberParameter extends Parameter {
    toUi(t): ReactNode {
        return <input className={"graph-parameter"} type={"number"} min={this.min()} max={this.max()}
                      onChange={ev => this.acceptChange(ev)}
                      value={this.getValue()}/>;
    }

    min(): Number {
        return undefined;
    }

    max(): Number {
        return undefined;
    }
}

export default NumberParameter;