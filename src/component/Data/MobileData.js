import React from "react";

import AbstractComponent from "../AbstractComponent";
import {Button, ButtonGroup, Tab, Tabs} from "react-bootstrap";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import CurrentInputSource from "../CurrentInputSource/CurrentInputSource";
import FileManage from "../FileManage";
import {withTranslation} from "react-i18next";
import AppEvents from "../../AppEvents";
import Optional from "../../utils/Optional";
import {toast} from "react-toastify";
import ParserFactory from "../../parser/ParserFactory";
import Buttons from "../../utils/Buttons";
import Objects from "../../utils/Objects";
import Strings from "../../utils/Strings";
import Licenses from "../../licenses/Licenses";
import LicenseDependency from "../../licenses/LicenseDependency";

class MobileData extends AbstractComponent {
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
        this.getActiveKey = this.getActiveKey.bind(this);
        this.onLicensesInputChange = this.onLicensesInputChange.bind(this);
    }
    componentDidMount() {
        this.props.hub.on(AppEvents.INPUT_CHANGED, () => {
            if (extLocalStorage.isPresent(AppStorage.DATA_FILE)) {
                extLocalStorage.getFile(AppStorage.DATA_FILE).text().then(text => {
                    document.getElementById("file-preview").value = text;
                });
            } else {
                document.getElementById("file-preview").value = "";
            }
        });

        if (extLocalStorage.isPresent(AppStorage.DATA_TEXT)) {
            let content = extLocalStorage.getItem(AppStorage.DATA_TEXT);
            document.getElementById(this.textAreaId).value = content;
        }
        if (extLocalStorage.isPresent(AppStorage.DATA_FILE)) {
            extLocalStorage.getFile(AppStorage.DATA_FILE).text().then(text => {
                document.getElementById("file-preview").value = text;
            });
        }
        if (extLocalStorage.isPresent(AppStorage.DATA_ACTIVE_TAB)) {
            this.activeTab = extLocalStorage.getItem(AppStorage.DATA_ACTIVE_TAB);
        } else {
            this.activeTab = "graph";
        }
        Optional.ofNullable(extLocalStorage.getItem(AppStorage.RAW_DEPENDENCIES_LICENSES))
            .ifPresent(raw => document.getElementById("licenses-textarea").value = raw)

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

    getActiveKey(): String {
        if (Objects.isNotCorrect(this.activeTab)) {
            return "parameters";
        }

        return this.activeTab;
    }

    onLicensesInputChange(ignored): void {
        let raw = document.getElementById("licenses-textarea").value;
        if (Objects.isNotCorrect(raw) || Strings.isBlank(raw)) {
            return;
        }

        let dependencies = [];
        let lines: String[] = raw.split(/\r?\n/);
        for (let line of lines) {
            if (Strings.isBlank(line)) {
                continue;
            }

            let signIndex: Number = line.lastIndexOf("=");
            let key: String = line.substring(0, signIndex);
            let value: String = line.substring(signIndex + 1);
            if (isNaN(value)) {
                document.getElementById("licenses-error").value = "Некорретный формат. После = указано не число";
                return;
            }

            if (!Licenses.isKnown(value)) {
                document.getElementById("licenses-error").value = "Некорректное значеие. После = указан неизвестный код";
                return;
            }

            dependencies.push(new LicenseDependency(key, value));
        }

        extLocalStorage.setItem(AppStorage.RAW_DEPENDENCIES_LICENSES, raw);
        extLocalStorage.setAsJson(AppStorage.DEPENDENCIES_LICENSES, dependencies);
    }

    render() {
        const t = this.props.t;
        return <Tabs activeKey={this.getActiveKey()}
                     defaultActiveKey={"plain"}
                     onSelect={(key) => {
                         this.activeTab = key;
                         extLocalStorage.setItem(AppStorage.DATA_ACTIVE_TAB, key);
                         this.forceUpdate();
                     }}>
            <Tab eventKey={"plain"} title={t("tab.mobile-plain.caption")}>
                <CurrentInputSource hub={this.props.hub}/>
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
            </Tab>
            <Tab eventKey={"file"} title={t("tab.mobile-file.caption")}>
                <CurrentInputSource hub={this.props.hub}/>
                <div className={"input-data-type"}>
                    <div className={"text-area-zone"}>
                        <div className={"text-area-zone-internal"}>
                            <h3>{t('h3.file-upload-input.caption')}</h3>
                            <FileManage hub={this.props.hub}/>

                            <h6>{t('file-content.caption')}</h6>
                            <textarea id={"file-preview"} readOnly={"readonly"} disabled={"disabled"}/>
                        </div>
                    </div>
                </div>
            </Tab>
            <Tab eventKey={"licenses"} title={t("tab.licenses.caption")}>
                <div className={"licenses-input"}>
                    {t("licences.format.message")}
                    <div id={"licenses-error-container"}>
                        <p id={"licenses-error"}></p>
                    </div>
                    <textarea id={"licenses-textarea"}
                              placeholder={t("input-data-here.prompt")}
                              onChange={this.onLicensesInputChange}/>
                </div>
            </Tab>
        </Tabs>;
    }
}

export default withTranslation()(MobileData);