import React, {Component} from "react";
import "./Export.css";

import {Dropdown, Image} from "react-bootstrap";
import icon from "../../icons/export-white.svg";
import DropdownItem from "react-bootstrap/DropdownItem";
import ReactNodeWrapper from "../../utils/ReactNodeWrapper";
import AppEvents from "../../AppEvents";

class Export extends Component {
    constructor(props) {
        super(props);

        this.getExportOptions = this.getExportOptions.bind(this);
        this.download = this.download.bind(this);
    }

    componentDidMount() {
        this.props.hub.on(AppEvents.CY_UPDATE, cy => {
            this.cy = cy;
        });
    }

    getExportOptions(): ReactNodeWrapper[] {
        let png = new ReactNodeWrapper(
            <div className={"export-option"}>PNG</div>, "png", ignored => {
                let png64 = this.cy.png({
                    output: 'blob',
                    bg: '#FFF'
                });
                this.download(png64, "png");
            }
        );
        let jpg = new ReactNodeWrapper(
            <div className={"export-option"}>JPG</div>, "jpg", ignored => {
                let jpg64 = this.cy.jpg({
                    output: 'blob',
                    bg: '#FFF'
                });
                this.download(jpg64, "jpg");
            }
        );
        return Array.of(png, jpg);
    }

    download(blob, extension: String): void {
        let url = window.URL.createObjectURL(new Blob([blob]))
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `pdvt.${extension}`);

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }

    render() {
        return <Dropdown id={"export-dropdown"}>
            <Dropdown.Toggle>
                <Image id={"export-icon"} src={icon}/>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                { this.getExportOptions().map(exportWrapper => {
                    return <DropdownItem key={exportWrapper.key} onClick={exportWrapper.onClick}>
                        { exportWrapper.node }
                    </DropdownItem>
                }) }
            </Dropdown.Menu>
        </Dropdown>;
    }
}

export default Export;