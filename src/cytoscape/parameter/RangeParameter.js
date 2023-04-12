import Parameter from "./Parameter";
import React, {ReactNode} from "react";

class RangeParameter extends Parameter {
    toUi(t): ReactNode {
        return <input className={"graph-parameter"} type={"range"} min={this.min()} max={this.max()}
                      onChange={(ev) => this.acceptChange(ev)}
                      value={this.getValue()}/>
    }

    min(): Number {
        return undefined;
    }

    max(): Number {
        return undefined;
    }
}

export default RangeParameter;