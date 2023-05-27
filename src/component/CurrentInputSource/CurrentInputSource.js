import React, {Component} from "react";
import InputSource from "../../datamanager/InputSource";
import DataManager from "../../datamanager/DataManager";
import {withTranslation} from "react-i18next";
import AppEvents from "../../AppEvents";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";

import "./CurrentInputSource.css";

class CurrentInputSource extends Component {

    componentDidMount() {
        this.props.hub.on(AppEvents.INPUT_CHANGED_USER_ORIGIN, () => {
            this.forceUpdate();
        });
    }

    render() {
        const t = this.props.t;
        let inputSource: InputSource = new DataManager().getUsedInputSource();
        if (inputSource === InputSource.FILE) {
            return <div className={"input-source-container"}>
                {t("input-source.file.message")} { extLocalStorage.getFileName(AppStorage.DATA_FILE) }
            </div>;
        } else if (inputSource === InputSource.PLAIN_TEXT) {
            return <div className={"input-source-container"}>
                {t("input-source.text.message")}
            </div>;
        } else if (inputSource === InputSource.NOTHING) {
            return <div className={"input-source-container"}>
                {t("input-source.nothing.message")}
            </div>;
        } else {
            throw new Error("Unknown input source met. Met: " + inputSource);
        }
    }
}

export default withTranslation()(CurrentInputSource);