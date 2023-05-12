import Elements from "../Elements";
import Objects from "../../utils/Objects";
import Optional from "../../utils/Optional";
import CheckboxParameter from "./CheckboxParameter";
import SpacingFactor from "./SpacingFactor";
import Maps from "../../utils/Maps";
import Option from "../../utils/Option";
import NumberParameter from "./NumberParameter";

class Params {
    static VALUES: Map<String, Function> = Maps.ofVararg(
        new Option("grid", () => new Params("grid", Array.of(
            new CheckboxParameter("parameter.condense.caption", "condense", false),
            new NumberParameter("parameter.rows.caption", "rows", undefined),
            new NumberParameter("parameter.cols.caption", "cols", undefined),
            new SpacingFactor("parameter.spacingFactor.caption", "spacingFactor",
                5,
                (elements: Elements) => {
                    return elements.nodes.length === 0 ? 1 : (elements.countMostTargetNode() / 2);
                }
            ),
            new CheckboxParameter("parameter.avoid-overlap.caption", "avoidOverlap", true),
            new CheckboxParameter("parameter.node-dimensions-include-labels-overlap.caption", "nodeDimensionsIncludeLabels", true)
        ))),
        new Option("breadthfirst", () => new Params("breadthfirst", Array.of(
            new CheckboxParameter("parameter.breadthfirst.circle.caption", "circle", true),
            new CheckboxParameter("parameter.breadthfirst.grid.caption", "grid", false),
            new SpacingFactor("parameter.spacingFactor.caption", "spacingFactor",
                5,
                (elements: Elements) => {
                    return elements.nodes.length === 0 ? 1 : (elements.countMostTargetNode() / 2);
                }
            ),
            new CheckboxParameter("parameter.avoid-overlap.caption", "avoidOverlap", true),
            new CheckboxParameter("parameter.node-dimensions-include-labels-overlap.caption", "nodeDimensionsIncludeLabels", true)
        ))),
        new Option("concentric", () => new Params("concentric", Array.of(
            new NumberParameter("parameter.start-angle.caption", "startAnge", 3 / 2 * Math.PI),
            new NumberParameter("parameter.sweep.caption", "sweep", undefined),
            new CheckboxParameter("parameter.clockwise.caption", "clockwise", true),
            new CheckboxParameter("parameter.equidistant.caption", "equidistant", false),
            new NumberParameter("parameter.min-node-spacing.caption", "minNodeSpacing", 10),
            new SpacingFactor("parameter.spacingFactor.caption", "spacingFactor",
                5,
                (elements: Elements) => {
                    return elements.nodes.length === 0 ? 1 : (elements.countMostTargetNode() / 2);
                }
            ),
            new CheckboxParameter("parameter.avoid-overlap.caption", "avoidOverlap", true),
            new CheckboxParameter("parameter.node-dimensions-include-labels-overlap.caption", "nodeDimensionsIncludeLabels", true)
        )))
    );

    static find(layoutName: String): Optional {
        for (let [suppliedLayoutName, supplier] of this.VALUES.entries()) {
            if (Objects.equals(layoutName, suppliedLayoutName)) {
                return Optional.of(supplier());
            }
        }

        return Optional.empty();
    }

    constructor(layoutName, parameters) {
        this.layoutName = layoutName;
        this.parameters = parameters;
    }

    toLayout() {
        let layout = {};
        this.parameters.forEach((parameter) => {
            layout[parameter.code] = parameter.getValue();
        });
        layout['name'] = this.layoutName;
        layout['fit'] = 'true';

        return layout;
    }

    findByCode(code): Optional {
        for (let parameter of this.parameters) {
            if (parameter.code === code) {
                return Optional.of(parameter);
            }
        }

        return Optional.empty();
    }
}

export default Params;