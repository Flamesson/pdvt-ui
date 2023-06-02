import React from "react";
import {withTranslation} from "react-i18next";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {ReactNode} from "react";
import Cycle from "../../cytoscape/Cycle";
import AbstractProblem from "./AbstractProblem";

class CyclesProblem extends AbstractProblem {
    constructor(props) {
        super(props);

        this.state = {
            cycles: this.props.cycles
        };
    }

    mapCycles = (): ReactNode[] => {
        let reactNodes: ReactNode[] = [];
        let cycles = this.state.cycles;
        for (let i = 0; i < cycles.length; i++) {
            let cycle = cycles[i];
            reactNodes.push(<ListGroupItem key={i}>{this.expandCycle(cycle)} -> </ListGroupItem>)
        }

        return reactNodes;
    }

    expandCycle = (cycle: Cycle) => {
        return cycle.map((node: Node) => " -> " + node.getLabel()).concat();
    }

    renderProblems(): React.ReactNode {
        const t = this.props.t;
        return <div>
            <h5>{t("problems.cycles.problems-header")} </h5>
            <ListGroup>
                {this.mapCycles()}
            </ListGroup>
        </div>;
    }


    renderReasons(): React.ReactNode {
        const t = this.props.t;
        return <ul>{t("problems.cycles.reasons-header")}
            <ol>{t("problems.cycles.reasons-1")}</ol>
            <ol>{t("problems.cycles.reasons-2")}</ol>
            <ol>{t("problems.cycles.reasons-3")}</ol>
            <ol>{t("problems.cycles.reasons-4")}</ol>
        </ul>;
    }


    renderSolution(): React.ReactNode {
        const t = this.props.t;
        return <div>
            <p>{t("problems.cycles.solution-1")}</p>
            <p>{t("problems.cycles.solution-2")}</p>
        </div>;
    }


    renderConsequences(): React.ReactNode {
        const t = this.props.t;
        return <div>
            <li>{t("problems.cycles.consequences-1")}</li>
        </div>;
    }
}

export default withTranslation()(CyclesProblem);