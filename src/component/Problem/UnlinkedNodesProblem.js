import React from "react";
import {withTranslation} from "react-i18next";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import AbstractProblem from "./AbstractProblem";

class UnlinkedNodesProblem extends AbstractProblem {
    constructor(props) {
        super(props);

        this.state = {
            nodes: this.props.nodes
        };
    }

    renderProblems(): React.ReactNode {
        const t = this.props.t;
        return <div>
            <h5>{t("problems.unlinked.problems-header")} </h5>
            <ListGroup>
                {this.state.nodes.map(node => <ListGroupItem key={node.id}>{node.getLabel()}</ListGroupItem>)}
            </ListGroup>
        </div>;
    }


    renderReasons(): React.ReactNode {
        const t = this.props.t;
        return <ul>{t("problems.unlinked.reasons-header")}
            <ol>{t("problems.unlinked.reasons-1")}</ol>
            <ol>{t("problems.unlinked.reasons-2")}</ol>
            <ol>{t("problems.unlinked.reasons-3")}</ol>
            <ol>{t("problems.unlinked.reasons-4")}</ol>
        </ul>;
    }


    renderSolution(): React.ReactNode {
        const t = this.props.t;
        return <ul>
            <li>{t("problems.unlinked.solution-1")}</li>
            <li>{t("problems.unlinked.solution-2")}</li>
        </ul>;
    }


    renderConsequences(): React.ReactNode {
        const t = this.props.t;
        return <ul>
            <li>{t("problems.unlinked.consequences-1")}</li>
        </ul>;
    }
}

export default withTranslation()(UnlinkedNodesProblem);