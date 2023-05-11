import React, {ChangeEvent, Component} from "react";
import AppEvents from "../../AppEvents";
import {withTranslation} from "react-i18next";
import {Button} from "react-bootstrap";
import CyStyle from "../Visualization/CyStyle";

class GeneralParameters extends Component {
    constructor(props) {
        super(props);

        this.reset = this.reset.bind(this);
        this.fireCyStyleChanged = this.fireCyStyleChanged.bind(this);
        this.onNodeColorChange = this.onNodeColorChange.bind(this);
        this.onNodeBorderColorChange = this.onNodeBorderColorChange.bind(this);
        this.onNodeSizeChange = this.onNodeSizeChange.bind(this);
        this.onEdgeColorChange = this.onEdgeColorChange.bind(this);
        this.onEdgeWidthChange = this.onEdgeWidthChange.bind(this);
        this.onLabelColorChange = this.onLabelColorChange.bind(this);
        this.onLabelMaxWidthChange = this.onLabelMaxWidthChange.bind(this);
        this.onLabelFontSizeChange = this.onLabelFontSizeChange.bind(this);
        this.onCircularColorChange = this.onCircularColorChange.bind(this);
    }

    reset(): void {
        let style: CyStyle = this.props.cyStyle;
        style.reset();
        document.getElementById("node-color-input").value = style.nodeColor;
        document.getElementById("node-border-color-input").value = style.nodeBorderColor;
        document.getElementById("node-size-input").value = style.nodeSize;
        document.getElementById("edge-color-input").value = style.edgeColor;
        document.getElementById("edge-width-input").value = style.edgeWidth;
        document.getElementById("label-max-width-input").value = style.labelMaxWidth;
        document.getElementById("label-font-size-input").value = style.labelFontSize;
        document.getElementById("label-color-input").value = style.labelColor;
        document.getElementById("circular-color-input").value = style.circularColor;
        this.props.hub.emit(AppEvents.CY_STYLE_CHANGED, style);
    }

    fireCyStyleChanged(): void {
        this.props.hub.emit(AppEvents.CY_STYLE_CHANGED, this.props.cyStyle);
    }

    onNodeColorChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.setNodeColor(event.target.value);
        this.fireCyStyleChanged();
    }

    onNodeBorderColorChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.setNodeBorderColor(event.target.value);
        this.fireCyStyleChanged();
    }

    onNodeSizeChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.setNodeSize(event.target.value);
        this.fireCyStyleChanged();
    }

    onEdgeColorChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.setEdgeColor(event.target.value);
        this.fireCyStyleChanged();
    }

    onEdgeWidthChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.setEdgeWidth(event.target.value);
        this.fireCyStyleChanged();
    }

    onLabelColorChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.setLabelColor(event.target.value);
        this.fireCyStyleChanged();
    }

    onLabelMaxWidthChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.setLabelMaxWidth(event.target.value);
        this.fireCyStyleChanged();
    }

    onLabelFontSizeChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.setLabelFontSize(event.target.value);
        this.fireCyStyleChanged();
    }

    onCircularColorChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.cyStyle.setCircularColor(event.target.value);
        this.fireCyStyleChanged();
    }

    render() {
        const t = this.props.t;
        return <div>
            <h4>{t("parameters.general.caption")}</h4>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.general.node-color.caption")}: </label>
                <input id={"node-color-input"}
                       type={"color"}
                       defaultValue={this.props.cyStyle.nodeColor}
                       onChange={this.onNodeColorChange}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.general.node-border-color.caption")}: </label>
                <input id={"node-border-color-input"}
                       type={"color"}
                       defaultValue={this.props.cyStyle.nodeBorderColor}
                       onChange={this.onNodeBorderColorChange}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.general.node-size.caption")}: </label>
                <input id={"node-size-input"}
                       type={"number"}
                       defaultValue={this.props.cyStyle.nodeSize}
                       onChange={this.onNodeSizeChange}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.general.edge-color.caption")}: </label>
                <input id={"edge-color-input"}
                       type={"color"}
                       defaultValue={this.props.cyStyle.edgeColor}
                       onChange={this.onEdgeColorChange}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.general.edge-width.caption")}: </label>
                <input id={"edge-width-input"}
                       type={"number"}
                       defaultValue={this.props.cyStyle.edgeWidth}
                       onChange={this.onEdgeWidthChange}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.general.label-max-width.caption")}: </label>
                <input id={"label-max-width-input"}
                       type={"number"}
                       defaultValue={this.props.cyStyle.labelMaxWidth}
                       onChange={this.onLabelMaxWidthChange}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.general.label-font-size.caption")}: </label>
                <input id={"label-font-size-input"}
                       type={"number"}
                       defaultValue={this.props.cyStyle.labelFontSize}
                       onChange={this.onLabelFontSizeChange}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>{t("parameter.general.label-font-color.caption")}: </label>
                <input id={"label-color-input"}
                       type={"color"}
                       defaultValue={this.props.cyStyle.labelColor}
                       onChange={this.onLabelColorChange}/>
            </div>
            <div className={"graph-parameter-container"}>
                <label className={"graph-parameter-caption"}>Цвет циклических зависимостей:</label>
                <input id={"circular-color-input"}
                       type={"color"}
                       defaultValue={this.props.cyStyle.circularColor}
                       onChange={this.onCircularColorChange}/>
            </div>

            <div className={"full-width-container flex-horizontal-center-center margin-top-10px"}>
                <Button onClick={ignored => this.reset()} variant={"outline-info"}>
                    {t("button.reset.caption")}
                </Button>
            </div>
        </div>;
    }
}

export default withTranslation()(GeneralParameters);