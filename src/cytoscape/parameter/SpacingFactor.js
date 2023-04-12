import RangeParameter from "./RangeParameter";
import React from "react";

class SpacingFactor extends RangeParameter {
    hasCompleteUi(): Boolean {
        return true;
    }

    toCompleteUi(translation): React.ReactNode {
        return <div className={"graph-parameter-container"} key={this.nameKey}>
            <label className={"graph-parameter-caption"}>{translation(this.nameKey)}: {this.getValue()}</label>
            { this.toUi() }
        </div>;
    }

    toUi(t): React.ReactNode {
        return <div className={"flex-vertical-center-center margin-10px"}>
            <input className={"graph-parameter input-only"} type={"range"} min={this.min()} max={this.max()}
                   onChange={ev => this.acceptChange(ev)}
                   value={this.getValue()}/>
            <input className={"graph-parameter input-only"} type={"number"} min={this.min()} max={this.max()}
                   onChange={ev => this.acceptChange(ev)}
                   value={this.getValue()}/>
        </div>
    }

    min(): Number {
        return 0;
    }
}

export default SpacingFactor;