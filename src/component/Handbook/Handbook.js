import React, {Component} from "react";
import "./Handbook.css";

import {Table} from "react-bootstrap";
import LicenseType from "../../licenses/LicenseType";
import Licenses from "../../licenses/Licenses";
import {withTranslation} from "react-i18next";

class Handbook extends Component {
    constructor(props) {
        super(props);

        this.getTypeTranslate = this.getTypeTranslate.bind(this);
    }

    getTypeTranslate(type: LicenseType): String {
        const t = this.props.t;
        if (type === LicenseType.PAID) {
            return t("license-type.paid");
        } else if (type === LicenseType.MAYBE_PAID) {
            return t("license-type.maybe-paid");
        } else if (type === LicenseType.FREE) {
            return t("license-type.free");
        } else {
            throw new Error("Unknown license type: " + type);
        }
    }

    render() {
        const t = this.props.t;

        return (
            <div>
                <div className={"licenses"}>
                    <h4>{t("licenses.table.caption")}</h4>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>№</th>
                            <th>{t("column.name.caption")}</th>
                            <th>{t("column.type.caption")}</th>
                            <th>{t("column.type-code.caption")}</th>
                            <th>{t("column.info.caption")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            Licenses.LICENSES.map(license => {
                                return <tr>
                                    <td>{license.id}</td>
                                    <td>{t(license.name)}</td>
                                    <td>{this.getTypeTranslate(license.type)}</td>
                                    <td>{license.type.toString()}</td>
                                    <td>{t(license.info)}</td>
                                </tr>;
                            })
                        }
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Handbook);