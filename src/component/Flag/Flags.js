import React, {Component} from "react";
import {Dropdown, Image} from "react-bootstrap";
import Flag from "./Flag";
import DropdownItem from "react-bootstrap/DropdownItem";
import {withTranslation} from "react-i18next";
import PathSource from "./PathSource";
import i18next from "i18next";
import "./Flags.css";
import ReactNodeWrapper from "../../utils/ReactNodeWrapper";
import AppEvents from "../../utils/AppEvents";

class Flags extends Component {
    constructor(props) {
        super(props);

        this.updateLocale = this.updateLocale.bind(this);
        this.getLocales = this.getLocales.bind(this);
    }

    componentDidMount() {
        this.updateLocale("ru");
    }

    updateLocale(newLocaleCode: String) {
        this.props.i18n.changeLanguage(newLocaleCode)
            .then(r => {
                this.props.hub.emit(AppEvents.LOCALE_CHANGED, newLocaleCode);
            });
    }

    getLocales(): ReactNodeWrapper[] {
        let i18n = this.props.i18n;
        let currentLocaleCode = i18n.resolvedLanguage;
        let pathSource = new PathSource();
        let languagesCodes = Object.keys(i18next.services.resourceStore.data);
        return languagesCodes
            .filter(localeCode => localeCode !== currentLocaleCode)
            .map(localeCode =>  {
                let image = <Image key={localeCode} className={"flag-to-pickup"} src={pathSource.getPath(localeCode)}/>;
                let onClick = ignored => this.updateLocale(localeCode);
                return new ReactNodeWrapper(image, localeCode, onClick);
            });
    }

    render() {
        return <Dropdown id={"flag-dropdown"}>
            <Dropdown.Toggle>
                <Flag hub={this.props.hub}/>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                { this.getLocales().map(nodeWrapper => {
                    return <DropdownItem key={nodeWrapper.key} onClick={nodeWrapper.onClick}>
                        { nodeWrapper.node }
                    </DropdownItem>
                }) }
            </Dropdown.Menu>
        </Dropdown>;
    }
}

export default withTranslation()(Flags);