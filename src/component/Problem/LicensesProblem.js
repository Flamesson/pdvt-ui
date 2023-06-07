import React from "react";
import AbstractProblem from "./AbstractProblem";
import {withTranslation} from "react-i18next";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {ReactNode} from "react";
import LicenseProblems from "../../cytoscape/LicenseProblems";
import Arrays from "../../utils/Arrays";
import Sets from "../../utils/Sets";

class LicensesProblem extends AbstractProblem {
    constructor(props) {
        super(props);

        this.state = {
            problems: this.props.problems
        };
    }

    mapProblems = (): ReactNode[] => {
        return this.state.problems.map((problem: LicenseProblems) => {
            return <ListGroupItem>{problem.infections.map((node: Node) => node.getLabel()).concat(" ")}</ListGroupItem>
        });
    }

    collectInfections = (): Node[] => {
        let nodes: Set<Node> = new Set();
        for (let problem: LicenseProblems of this.state.problems) {
            Sets.addArray(nodes, problem.infections);
        }

        return [...nodes];
    }

    collectInfected = (): Node[] => {
        let nodes: Set<Node> = new Set();
        for (let problem: LicenseProblems of this.state.problems) {
            Sets.addArray(nodes, problem.infected);
        }

        let infections = this.collectInfections();
        let tmp = [...nodes];
        for (let infection of infections) {
            Arrays.removeIfPresent(tmp, infection);
        }
        return tmp;
    }

    mapInfection = (infection: Node): ReactNode => {
        const t = this.props.t;
        return <ListGroupItem key={infection.getId()} className={"d-flex flex-row justify-content-between"}>
            <div>{infection.getLabel()}</div>
            <div>({t("problems.licenses.license")} - {infection.data.license ? infection.data.license : infection.data.specifiedLicense + " " + t("problems.licenses.your-data")})</div>
        </ListGroupItem>;
    }

    renderProblems(): React.ReactNode {
        const t = this.props.t;
        return <div>
            <h5>{t("problems.licenses.problems-header")} </h5>
            <div className={"mt-4 d-flex flex-row"}>
                <div className={"w-100"}>
                    <h6>{t("problems.licenses.problems-infections-header")}</h6>
                    <ListGroup>
                        {this.collectInfections().map(this.mapInfection)}
                    </ListGroup>
                </div>
                <div className={"w-100"}>
                    <h6>{t("problems.licenses.problems-infected-header")}</h6>
                    <ListGroup>
                        {this.collectInfected().map((node: Node) => <ListGroupItem key={node.getId()}>{node.getLabel()}</ListGroupItem>)}
                    </ListGroup>
                </div>
            </div>
        </div>;
    }


    renderReasons(): React.ReactNode {
        const t = this.props.t;
        return <div>
            {t("problems.licenses.reasons-1")}
        </div>;
    }


    renderSolution(): React.ReactNode {
        const t = this.props.t;
        return <div>
            <p>{t("problems.licenses.solution-1")}</p>
            <p>{t("problems.licenses.solution-2")}</p>
            <p>{t("problems.licenses.solution-3")}</p>
            <p>{t("problems.licenses.solution-4")}</p>
        </div>;
    }


    renderConsequences(): React.ReactNode {
        const t = this.props.t;
        return <div>
            <p>{t("problems.licenses.consequences-4")}</p>
        </div>;
    }
}

export default withTranslation()(LicensesProblem);