import React from "react";
import "./Analysis.css";

import AbstractComponent from "../AbstractComponent";
import {Button} from "react-bootstrap";
import {withTranslation} from "react-i18next";
import ProblemCarousel from "../ProblemCarousel/ProblemCarousel";
import Problems from "../../classes/Problems";
import DataManager from "../../datamanager/DataManager";
import Problem from "../../classes/Problem";
import extLocalStorage from "../../utils/ext.local.storage";
import AppStorage from "../../AppStorage";
import Optional from "../../utils/Optional";
import Strings from "../../utils/Strings";
import Objects from "../../utils/Objects";
import AppEvents from "../../AppEvents";

class Analysis extends AbstractComponent {
    constructor(props) {
        super(props);

        this.state = {
            problems: []
        };
    }

    componentDidMount() {
        let analysisPerformed: Boolean = Optional.ofNullable(extLocalStorage.getItem(AppStorage.ANALYSIS_PERFORMED))
            .map(Strings.asBoolean)
            .getOrDefault(false);

        if (analysisPerformed) {
            this.analyze();
        }

        this.props.hub.on(AppEvents.INPUT_CHANGED_USER_ORIGIN, () => {
            this.setState({
                problems: []
            });
        });
    }

    analyze = (callback): void => {
        let dataManager: DataManager = new DataManager();
        dataManager.getElements().then(elements => {
            let problems: Problem[] = new Problems(elements, this.props.t).analyze();

            if (Objects.isCorrect(callback)) {
                this.setState({
                    problems: problems
                }, callback);
            } else {
                this.setState({
                    problems: problems
                });
            }
        });
    }

    onPerformAnalysis = (): void => {
        this.analyze(() => {
            extLocalStorage.setItem(AppStorage.ANALYSIS_PERFORMED, true);
        });
    }

    render() {
        const t = this.props.t;
        let problems = this.state.problems;

        return <div className={"d-flex flex-column justify-content-start align-items-center"}>
            <Button className={"mt-5"} onClick={this.onPerformAnalysis}>{t("button.perform-analysis.caption")}</Button>
            <ProblemCarousel problems={problems}/>
        </div>;
    }
}

export default withTranslation()(Analysis);