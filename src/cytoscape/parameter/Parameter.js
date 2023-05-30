import Objects from "../../utils/Objects";
import Elements from "../Elements";
import {ChangeEvent} from "react";
import {ReactNode} from "react";

class Parameter {
    constructor(nameKey, code, defaultValue, adjustFunc, visible) {
        this.nameKey = nameKey;
        this.code = code;
        this._value = defaultValue;
        this.adjustFunc = adjustFunc;
        this._onChange = null;
        this.visible = Objects.isCorrect(visible) ? visible : true;
    }

    getValue(): * {
        return this._value;
    }

    setValue(value: *): void {
        this._value = value;
    }

    hasCompleteUi(): Boolean {
        return false;
    }

    toCompleteUi(translation): ReactNode {
        return undefined;
    }

    toUi(t): ReactNode {
        throw new Error("Must be implemented");
    }

    acceptChange(ev: ChangeEvent<HTMLInputElement>): void {
        this._value = ev.target.value;
        if (Objects.isCorrect(this._onChange)) {
            let parameter: Parameter = this;
            this._onChange(parameter, true);
        }
    }

    subscribeOnChange(consumer: Function): void {
        this._onChange = consumer;
    }

    adjustIfSupported(elements: Elements, invokeChanges: Boolean) {
        if (Objects.isNotCorrect(this.adjustFunc)) {
            return;
        }

        this._value = this.adjustFunc(elements);
        if (Objects.isCorrect(this._onChange)) {
            if (Objects.isCorrect(invokeChanges) && !invokeChanges) {
                return;
            } else {
                let parameter: Parameter = this;
                this._onChange(parameter, false);
            }
        }
    }
}

export default Parameter;