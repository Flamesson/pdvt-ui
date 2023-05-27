import React from "react";
import "./Analysis.css";

import AbstractComponent from "../AbstractComponent";
import {Button} from "react-bootstrap";
import {withTranslation} from "react-i18next";
import ProblemCarousel from "../ProblemCarousel/ProblemCarousel";
import Problems from "../../classes/Problems";
import DataManager from "../../datamanager/DataManager";
import Problem from "../../classes/Problem";

class Analysis extends AbstractComponent {
    constructor(props) {
        super(props);

        this.analyze = this.analyze.bind(this);
    }

    analyze() {
        let dataManager: DataManager = new DataManager();
        dataManager.getElements().then(elements => {
            let problems: Problem[] = new Problems(elements, this.props.t).analyze();
            this.setState({
                problems: problems
            });
        });
    }

    render() {
        const t = this.props.t;
        let problems = this.getOrElse(state => state.problems, []);
        /*let problems = [
            { name: 'Problem 1', description: 'Description 1', solution: 'Solution 1' },
            { name: 'Problem 2', description: 'Description 2', solution: 'Solution 2' },
            { name: 'Problem 3', description: 'Description 3', solution: 'Solution 3' }
        ];*/
        return <div className={"b"}>
            <Button onClick={ignored => this.analyze()}>{t("button.perform-analysis.caption")}</Button>
            <ProblemCarousel problems={problems}/>
        </div>;
    }
}

export default withTranslation()(Analysis);