import React, {Component} from "react";
import {Image} from "react-bootstrap";
import Objects from "../../utils/Objects";
import PathSource from "./PathSource";
import AppEvents from "../../AppEvents";
import {withTranslation} from "react-i18next";

class Flag extends Component {
    componentDidMount() {
        this.props.hub.on(AppEvents.LOCALE_CHANGED, localeCode => {
            this.setState({
                localeCode: localeCode
            });
        });

        let currentLocaleCode: String = this.getCurrentLocaleCode();
        if (Objects.isCorrect(currentLocaleCode)) {
            this.setState({
                localeCode: currentLocaleCode
            });
        }
    }

    getCurrentLocaleCode(): String {
        return this.props.i18n.language;
    }

    render() {
        let state = this.state;

        let path;
        if (Objects.isNotCorrect(state)) {
            path = undefined;
        } else {
            path = new PathSource().getPath(state.localeCode);
        }

        return <Image src={path}/>;
    }
}

export default withTranslation()(Flag);