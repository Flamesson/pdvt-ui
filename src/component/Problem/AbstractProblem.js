import React, {ReactNode} from "react";
import AbstractComponent from "../AbstractComponent";
import {Button} from "react-bootstrap";

class AbstractProblem extends AbstractComponent {
    constructor(props) {
        super(props);

        this.state = {
            showReasons: true,
            showSolution: false,
            showConsequences: false
        };
    }

    renderProblems(): ReactNode {
        throw new Error("Must be implemented");
    }

    renderReasons(): ReactNode {
        throw new Error("Must be implemented");
    }

    renderSolution(): ReactNode {
        throw new Error("Must be implemented");
    }

    renderConsequences(): ReactNode {
        throw new Error("Must be implemented");
    }

    toggleReasons = (): void => {
        this.setState(prev => ({
            showReasons: !prev.showReasons
        }));
    }

    toggleSolution = (): void => {
        this.setState(prev => ({
            showSolution: !prev.showSolution
        }));
    }

    toggleConsequences = (): void => {
        this.setState(prev => ({
            showConsequences: !prev.showConsequences
        }));
    }

    hasReasons(): boolean {
        return true;
    }

    hasSolution(): boolean {
        return true;
    }

    hasConsequences(): boolean {
        return true;
    }

    render() {
        const t = this.props.t;
        return <div>
            {this.renderProblems()}
            {this.hasReasons() &&
                <div className={"d-flex flex-column align-items-center mt-2 mb-4"}>
                    <Button className={"mb-3"} variant="outline-secondary" onClick={this.toggleReasons}>
                        {this.state.showReasons
                            ? t('problem.hide-reasons')
                            : t('problem.show-reasons')
                        }
                    </Button>
                    {this.state.showReasons && this.renderReasons()}
                </div>
            }
            {this.hasSolution() &&
                <div className={"d-flex flex-column align-items-center mt-2 mb-4"}>
                    <Button className={"mb-3"} variant="outline-secondary" onClick={this.toggleSolution}>
                        {this.state.showSolution
                            ? t('problem.hide-solution')
                            : t('problem.show-solution')
                        }
                    </Button>
                    {this.state.showSolution && this.renderSolution()}
                </div>
            }
            {this.hasConsequences() &&
                <div className={"d-flex flex-column align-items-center mt-2 mb-4"}>
                    <Button className={"mb-3"} variant="outline-secondary" onClick={this.toggleConsequences}>
                        {this.state.showConsequences
                            ? t('problem.hide-consequences')
                            : t('problem.show-consequences')
                        }
                    </Button>
                    {this.state.showConsequences && this.renderConsequences()}
                </div>
            }
        </div>;
    }
}

export default AbstractProblem;