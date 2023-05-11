import React, {Component} from "react";

import { withTranslation } from 'react-i18next';
import "./Data.css";
import FileManage from "../FileManage";
import {Button, ButtonGroup} from "react-bootstrap";
import extLocalStorage from "../../utils/ext.local.storage";
import {toast} from "react-toastify";
import ParserFactory from "../../parser/ParserFactory";
import Objects from "../../utils/Objects";
import Strings from "../../utils/Strings";
import Buttons from "../../utils/Buttons";
import AppStorage from "../../AppStorage";
import CurrentInputSource from "../CurrentInputSource/CurrentInputSource";
import AppEvents from "../../AppEvents";

class Data extends Component {
    constructor(props) {
        super(props);

        this.textAreaId = "text-area"

        this.applyText = this.applyText.bind(this);
        this.generateText = this.generateText.bind(this);
        this.clearText = this.clearText.bind(this);
        this.setText = this.setText.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.updateApplyTextButtonState = this.updateApplyTextButtonState.bind(this);
        this.updateClearTextButtonState = this.updateClearTextButtonState.bind(this);
    }
    componentDidMount() {
        if (extLocalStorage.isPresent(AppStorage.DATA_TEXT)) {
            let content = extLocalStorage.getItem(AppStorage.DATA_TEXT);
            document.getElementById(this.textAreaId).value = content;
        }

        this.updateApplyTextButtonState();
        this.updateClearTextButtonState();
    }

    applyText(ignored) {
        let content = document.getElementById(this.textAreaId).value;
        extLocalStorage.setItem(AppStorage.DATA_TEXT, content);

        const t = this.props.t;
        toast.success(t('apply-text.success.toast'));

        this.props.hub.emit(AppEvents.INPUT_CHANGED);
    }

    generateText(ignored) {
        this.setText(AppStorage.MOCK_TEXT_DATA);
    }

    clearText(ignored) {
        this.setText('');
        extLocalStorage.remove(AppStorage.DATA_TEXT);

        const t = this.props.t;
        toast.success(t('clear-text.success.toast'));

        this.props.hub.emit(AppEvents.INPUT_CHANGED);
    }

    setText(value) {
        document.getElementById(this.textAreaId).value = value;
        this.onTextChange();
    }

    onTextChange(ignored) {
        this.updateApplyTextButtonState();
        this.updateClearTextButtonState();
    }

    updateApplyTextButtonState() {
        let factory = new ParserFactory();
        let value = document.getElementById(this.textAreaId).value;
        Buttons.updateState(document.getElementById("apply-text-button"), factory.isValid(value));
    }

    updateClearTextButtonState() {
        let value = document.getElementById(this.textAreaId).value;
        Buttons.updateState(
            document.getElementById("clear-text-button"),
            Objects.isCorrect(value) && Strings.isNotEmpty(value)
        );
    }

    render() {
        const t = this.props.t;
        return <div>
            <CurrentInputSource hub={this.props.hub}/>
            <div className={"types-container"}>
                <div className={"input-data-type"}>
                    <div className={"text-area-zone"}>
                        <div className={"text-area-zone-internal"}>
                            <h3>{t('h3.simple-input-data.caption')}</h3>
                            <ButtonGroup>
                                <Button id={"apply-text-button"} variant={"outline-secondary"} onClick={this.applyText}>
                                    {t('button.apply.caption')}
                                </Button>
                                <Button variant={"outline-secondary"} onClick={this.generateText}>
                                    {t('button.sample.caption')}
                                </Button>
                                <Button id={"clear-text-button"} variant={"outline-danger"} onClick={this.clearText}>
                                    {t('button.clear.caption')}
                                </Button>
                            </ButtonGroup>
                            <textarea id={this.textAreaId} placeholder={t('textarea.input-data.placeholder')}
                                      onChange={this.onTextChange}/>
                        </div>
                    </div>
                </div>
                <div className={"input-data-type"}>
                    <div className={"text-area-zone"}>
                        <div className={"text-area-zone-internal"}>
                            <h3>{t('h3.file-upload-input.caption')}</h3>
                            <FileManage hub={this.props.hub}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default withTranslation()(Data);
