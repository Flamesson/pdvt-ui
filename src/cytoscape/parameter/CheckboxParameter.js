import Parameter from "./Parameter";
import React, {ReactNode} from "react";
import Objects from "../../utils/Objects";

class CheckboxParameter extends Parameter {
    toUi(t): ReactNode {
        return <input className={"graph-parameter"} type={"checkbox"} checked={this.getValue()}
                      onChange={ev => this.acceptChange(ev)}/>
    }

    acceptChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this._value = ev.target.checked;
        if (Objects.isCorrect(this._onChange)) {
            let parameter: Parameter = this;
            this._onChange(parameter);
        }
    }
}

export default CheckboxParameter;