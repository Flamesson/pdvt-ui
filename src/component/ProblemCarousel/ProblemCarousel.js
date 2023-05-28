import React from 'react';
import "./ProblemCarousel.css";

import { Carousel, Button } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import AbstractComponent from "../AbstractComponent";
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import Optional from "../../utils/Optional";
import Arrays from "../../utils/Arrays";

class ProblemCarousel extends AbstractComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            showSolution: {},
            explicitShowSolution: false,
        };

        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.toggleSolution = this.toggleSolution.bind(this);
    }

    handlePrev(): void {
        let currentIndex = this.state.currentIndex;
        if (currentIndex > 0) {
            this.setState(prevState => ({
                currentIndex: prevState.currentIndex - 1,
            }));
        }
    };

    handleNext(): void {
        let currentIndex = this.state.currentIndex;
        let problems = this.props.problems;
        if (currentIndex < problems.length - 1) {
            this.setState(prevState => ({
                currentIndex: prevState.currentIndex + 1,
            }));
        }
    };

    toggleSolution(): void {
        this.setState(prevState => ({
            explicitShowSolution: !prevState.explicitShowSolution,
        }));
    };

    render() {
        let problems = Optional.ofNullable(this.props.problems).getOrDefault([]);
        const t = this.props.t;

        const { currentIndex, showSolution, explicitShowSolution } = this.state;

        let canGoPrev: Function = currentIndex > 0;
        let canGoNext: Function = currentIndex < problems.length - 1;

        const currentProblem = problems[currentIndex];
        const showSolutionButtonText = explicitShowSolution
            ? t('problem-carousel.hide-solution')
            : t('problem-carousel.show-solution');

        return (
            <div className={"w-100 mt-2 vertical-scrollable"}>
                {Arrays.isNotEmpty(problems) &&
                    <div className={"d-flex flex-column align-items-center"}>
                        <div className="d-flex flex-row justify-content-center">
                            <Button variant="link" className="ml-1 mr-1" onClick={this.handlePrev} disabled={!canGoPrev}>
                                <BsChevronLeft className="navigation-icon" size={32} />
                            </Button>
                            <Button variant="link" className="ml-1 mr-1" onClick={this.handleNext} disabled={!canGoNext}>
                                <BsChevronRight className="navigation-icon" size={32} />
                            </Button>
                        </div>
                        <Carousel className={"w-96 ml-2p"} interval={null} activeIndex={currentIndex}>
                            {problems.map((problem, index) => (
                                <Carousel.Item key={index}>
                                    <div>
                                        <h3>{problem.name}</h3>
                                        {problem.body}
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>

                        <div className="toggle-solution mt-4 mb-4">
                            <Button variant="outline-secondary" onClick={this.toggleSolution}>
                                {showSolutionButtonText}
                            </Button>
                        </div>

                        {explicitShowSolution && currentProblem.possibleSolution}
                    </div>
                }
            </div>
        );
    }
}

export default withTranslation()(ProblemCarousel);
