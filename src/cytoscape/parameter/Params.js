import Elements from "../Elements";
import Objects from "../../utils/Objects";
import Optional from "../../utils/Optional";
import CheckboxParameter from "./CheckboxParameter";
import SpacingFactor from "./SpacingFactor";
import Maps from "../../utils/Maps";
import Option from "../../utils/Option";
import NumberParameter from "./NumberParameter";
import Layouts from "./Layouts";

class Params {
    static VALUES: Map<String, Function> = Maps.ofVararg(
        new Option(Layouts.GRID, () => new Params(Layouts.GRID, Array.of(
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
        new Option(Layouts.BREADTH_FIRST, () => new Params(Layouts.BREADTH_FIRST, Array.of(
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
        new Option(Layouts.CONCENTRIC, () => new Params(Layouts.CONCENTRIC, Array.of(
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
        ))),
        new Option(Layouts.COSE_BILKENT, () => new Params(Layouts.COSE_BILKENT, Array.of(
            new CheckboxParameter("parameter.node-dimensions-include-labels-overlap.caption", "nodeDimensionsIncludeLabels", true)
        ))),
        new Option(Layouts.FCOSE, () => new Params(Layouts.FCOSE, Array.of(
            new CheckboxParameter("parameter.node-dimensions-include-labels-overlap.caption", "nodeDimensionsIncludeLabels", true),
            new NumberParameter("parameter.node-separation.caption", "nodeSeparation", 75),
        ))),
        new Option(Layouts.AVSDF, () => new Params(Layouts.AVSDF, Array.of(
            new NumberParameter("parameter.node-separation.caption", "nodeSeparation", 60)
        ))),
        new Option(Layouts.DAGRE, () => new Params(Layouts.DAGRE, Array.of(
            new SpacingFactor("parameter.spacingFactor.caption", "spacingFactor",
                5,
                (elements: Elements) => {
                    return elements.nodes.length === 0 ? 1 : (elements.countMostTargetNode() / 2);
                }
            ),
            new CheckboxParameter("parameter.node-dimensions-include-labels-overlap.caption", "nodeDimensionsIncludeLabels", true)
        ))),
        new Option(Layouts.KLAY, () => new Params(Layouts.KLAY, Array.of(
            new CheckboxParameter("parameter.node-dimensions-include-labels-overlap.caption", "nodeDimensionsIncludeLabels", true),
            new NumberParameter("parameter.spacingFactor.caption", "klay.spacing", 20),
            new NumberParameter("parameter.thoroughness.caption", "klay.thoroughness", 7)
        ))),
        new Option(Layouts.COLA, () => new Params(Layouts.COLA, Array.of(
            new CheckboxParameter("parameter.node-dimensions-include-labels-overlap.caption", "nodeDimensionsIncludeLabels", true),
            new CheckboxParameter("parameter.avoid-overlap.caption", "avoidOverlap", true),
            new CheckboxParameter("parameter.handle-disconnected.caption", "handleDisconnected", true),
            new NumberParameter("parameter.min-node-spacing.caption", "nodeSpacing", 10)
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