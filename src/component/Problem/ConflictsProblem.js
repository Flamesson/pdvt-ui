import React from "react";
import {withTranslation} from "react-i18next";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {ReactNode} from "react";
import Conflict from "../../cytoscape/Conflict";
import Node from "../../cytoscape/Node";
import AbstractProblem from "./AbstractProblem";

class ConflictsProblem extends AbstractProblem {
    constructor(props) {
        super(props);

        this.state = {
            conflicts: this.props.conflicts
        };
    }

    mapConflicts = (): ReactNode[] => {
        let reactNodes: ReactNode[] = [];
        let conflicts: Conflict[] = this.state.conflicts;
        for (let i = 0; i < conflicts.length; i++) {
            let conflict: Conflict = conflicts[i];
            reactNodes.push(<ListGroupItem key={i} className={"d-flex flex-row justify-content-between"}>
                {this.expandEndNodes(conflict)}
                {this.expandIntermediateNodes(conflict)}
            </ListGroupItem>);
        }

        return reactNodes;
    }

    expandIntermediateNodes = (conflict: Conflict): ReactNode => {
        const t = this.props.t;
        return <div className={"d-flex flex-row"}>
            <div className={"vertical-line"}/>
            <div className={"d-flex flex-column justify-content-start align-items-end ml-4"}>
                <h6>{t("problems.conflicts.intermediate-nodes-header")}</h6>
                <div className={"d-flex flex-row"}>
                    {conflict.intermediateNodes.map((node: Node) => <div className={"mr-3"}>{node.getLabel()}</div>)}
                </div>
            </div>
        </div>;
    }

    expandEndNodes = (conflict: Conflict): ReactNode => {
        const t = this.props.t;
        return <div className={"d-flex flex-column justify-content-start align-items-start mr-3"}>
            <h6>{t("problems.conflicts.end-nodes-header")}</h6>
            {conflict.endNodes.map((node: Node) => <div>{node.getLabel()}</div>)}
        </div>;
    }

    renderProblems(): React.ReactNode {
        const t = this.props.t;
        return <div>
            <h5>{t("problems.conflicts.problems-header")} </h5>
            <ListGroup>
                {this.mapConflicts()}
            </ListGroup>
        </div>;
    }


    renderReasons(): React.ReactNode {
        const t = this.props.t;
        return <ul>{t("problems.conflicts.reasons-header")}
            <ol>{t("problems.conflicts.reasons-1")}</ol>
            <ol>{t("problems.conflicts.reasons-2")}</ol>
            <ol>{t("problems.conflicts.reasons-3")}</ol>
        </ul>;
    }


    renderSolution(): React.ReactNode {
        const t = this.props.t;
        return <ul>
            <li>{t("problems.conflicts.solution-1")}</li>
            <li>{t("problems.conflicts.solution-2")}</li>
        </ul>;
    }


    renderConsequences(): React.ReactNode {
        const t = this.props.t;
        return <ul>
            <li>{t("problems.conflicts.consequences-1")}</li>
            <li>{t("problems.conflicts.consequences-2")}</li>
        </ul>;
    }
}

export default withTranslation()(ConflictsProblem);