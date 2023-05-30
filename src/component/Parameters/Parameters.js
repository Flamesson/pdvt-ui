import React, {Component} from "react";
import "./Parameters.css";

import PickField from "../PickField/PickField";
import Parameter from "../../cytoscape/parameter/Parameter";
import Params from "../../cytoscape/parameter/Params";
import Objects from "../../utils/Objects";
import {withTranslation} from "react-i18next";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import AppEvents from "../../AppEvents";
import Elements from "../../cytoscape/Elements";
import GeneralParameters from "../GeneralParameters/GeneralParameters";
import GraphParameters from "../GraphParameters/GraphParameters";
import Arrays from "../../utils/Arrays";
import Layouts from "../../cytoscape/parameter/Layouts";

class Parameters extends Component {
    static DEFAULT_LAYOUT = "grid";
    static DEFAULT_LAYOUT_VALUE = {
        name: Parameters.DEFAULT_LAYOUT
    };

    constructor(props) {
        super(props);
        this.elementsSupplier = props.elementsSupplier;
        this.modified = false;

        this.defaultLayout = this.defaultLayout.bind(this);
        this.initLayout = this.initLayout.bind(this);
        this.onParameterChange = this.onParameterChange.bind(this);
        this.changeLayout = this.changeLayout.bind(this);
        this.layout = this.layout.bind(this);
        this.getLayoutName = this.getLayoutName.bind(this);
        this.getParameters = this.getParameters.bind(this);
        this.adjustParameters = this.adjustParameters.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.toOption = this.toOption.bind(this);
        this.getLayoutOption = this.getLayoutOption.bind(this);
    }

    componentDidMount(): void {
        this.initLayout();
        this.props.hub.on(AppEvents.ELEMENTS_UPDATE, () => {
            this.changeLayout(this.defaultLayout());
            this.adjustParameters();
        });
        this.props.hub.on(AppEvents.CY_UPDATE, cy => this.cy = cy);
    }

    initLayout(): void {
        if (extLocalStorage.anyAbsent(AppStorage.GRAPH_LAYOUT, AppStorage.GRAPH_PARAMETERS_MODIFIED, AppStorage.GRAPH_PARAMS)) {
            this.changeLayout(this.defaultLayout());
            return;
        }

        this.layoutName = extLocalStorage.getItem(AppStorage.GRAPH_LAYOUT);
        this.modified = extLocalStorage.getParsedJson(AppStorage.GRAPH_PARAMETERS_MODIFIED);
        this.params = this.loadParams();

        this.params.parameters.forEach((parameter: Parameter) => {
            parameter.subscribeOnChange(this.onParameterChange);
        });

        let layout = this.params.toLayout();
        this.setState({
            _layout: layout
        }, () => {
            this.props.hub.emit(AppEvents.LAYOUT_CHANGE, layout);
        });
    }

    defaultLayout(): String {
        let elements = this.props.elementsSupplier();
        if (elements.nodes.length <= 40) {
            return Layouts.COSE_BILKENT;
        } else {
            return Layouts.CONCENTRIC;
        }
    }

    onParameterChange(parameter: Parameter, userOriginated: Boolean): void {
        if (userOriginated) {
            this.modified = true;
            extLocalStorage.setAsJson(AppStorage.GRAPH_PARAMETERS_MODIFIED, this.modified);
            this.saveParams();
        }

        let layout = this.params.toLayout();
        this.setState({
            _layout: layout
        }, () => {
            this.props.hub.emit(AppEvents.LAYOUT_CHANGE, layout);
        });
    }

    saveParams(): void {
        let values = this.params.parameters.map((parameter: Parameter) => {
            return { code: parameter.code, value: parameter.getValue() }
        });
        extLocalStorage.setAsJson(AppStorage.GRAPH_PARAMS, values);
    }

    loadParams(): Params {
        let values = extLocalStorage.getParsedJson(AppStorage.GRAPH_PARAMS);
        let layoutName: String = extLocalStorage.getItem(AppStorage.GRAPH_LAYOUT);
        let params: Params = Params.find(layoutName).getOrThrow();
        values.forEach(value => {
            params.findByCode(value.code).ifPresent((parameter: Parameter) => {
                parameter.setValue(value.value);
            });
        })

        return params;
    }

    changeLayout(newLayout: String): void {
        this.layoutName = newLayout;
        this.modified = false;
        let params: Params = Params.find(newLayout).getOrThrow();
        this.params = params;

        extLocalStorage.setItem(AppStorage.GRAPH_LAYOUT, newLayout);
        extLocalStorage.setAsJson(AppStorage.GRAPH_PARAMETERS_MODIFIED, this.modified);

        params.parameters.forEach((parameter: Parameter) => {
            parameter.subscribeOnChange(this.onParameterChange);
        });

        let layout = params.toLayout();
        this.setState({
            _layout: layout
        }, () => {
            this.props.hub.emit(AppEvents.LAYOUT_CHANGE, layout);
            this.adjustParameters();
            this.saveParams();
        });
    }

    layout() {
        let state = this.state;
        if (Objects.isNotCorrect(state) || Objects.isNotCorrect(state._layout)) {
            return Parameters.DEFAULT_LAYOUT_VALUE;
        }

        return state._layout;
    }

    getLayoutName(): String {
        if (Objects.isCorrect(this.layoutName)) {
            return this.layoutName;
        }

        return Parameters.DEFAULT_LAYOUT;
    }

    getParameters(): Parameter[] {
        let params: Params = this.params;
        if (Objects.isNotCorrect(params)) {
            return [];
        }

        return params.parameters;
    }

    adjustParameters(): void {
        let params: Params = this.params;
        if (Objects.isNotCorrect(params) || Objects.isNotCorrect(this.modified)) {
            return;
        }

        if (this.modified) {
            return;
        }

        let elements: Elements = this.elementsSupplier();
        params.parameters.forEach(parameter => {
            parameter.adjustIfSupported(elements, true);
        });
    }

    getOptions(): Array {
        let elements: Elements = this.props.elementsSupplier();
        let allLayoutNames: String[] = [...Params.VALUES.keys()];
        if (elements.nodes.length > 80) {
            Arrays.removeIfPresent(allLayoutNames, )
        }
        //TODO: нужна логика удаления очевидно неподходящих layout

        return allLayoutNames.map(layoutName => {
            return this.toOption(layoutName);
        });
    }

    toOption(layoutName) {
        if (Objects.isNotCorrect(layoutName)) {
            return undefined;
        }

        const t = this.props.t;
        return { value: layoutName, label: t(`layout.${layoutName}.label`) }
    }

    getLayoutOption() {
        return this.toOption(this.getLayoutName());
    }

    render() {
        const t = this.props.t;
        return <div className={"vertical-scrollable"}>
            <div className={"label-container"}>
                <PickField hub={this.props.hub}
                           optionsSupplier={() => this.getOptions()}
                           options={this.getOptions()}
                           onValueChanged={picked => {
                               this.changeLayout(picked);
                           }}
                           reference={ref => ref.pick(this.getLayoutOption())} />
            </div>

            { this.getParameters().filter(parameter => parameter.visible).map(parameter => {
                if (parameter.hasCompleteUi()) {
                    return parameter.toCompleteUi(t);
                } else {
                    return <div className={"graph-parameter-container"} key={parameter.nameKey}>
                        <label className={"graph-parameter-caption"}>{t(parameter.nameKey)}:</label>
                        { parameter.toUi() }
                    </div>
                }
            })}

            <hr/>
            <GraphParameters hub={this.props.hub}
                             cyStyle={this.props.cyStyle}
                             elementsSupplier={this.props.elementsSupplier}/>
            <hr/>
            <GeneralParameters hub={this.props.hub} cyStyle={this.props.cyStyle}/>
        </div>;
    }
}

export default withTranslation()(Parameters);
