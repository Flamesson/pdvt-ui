import React from 'react';
import "./ProblemNavigation.css";

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
        const prevButtonText = t('problem-carousel.prev');
        const nextButtonText = t('problem-carousel.next');

        return (
            <div>
                {Arrays.isNotEmpty(problems) &&
                    <div>
                        <div className="problem-navigation">
                            <Button variant="link" className="navigation-button" onClick={this.handlePrev} disabled={!canGoPrev}>
                                <BsChevronLeft className="navigation-icon" size={32} />
                            </Button>
                            <Button variant="link" className="navigation-button" onClick={this.handleNext} disabled={!canGoNext}>
                                <BsChevronRight className="navigation-icon" size={32} />
                            </Button>
                        </div>
                        <Carousel interval={null} activeIndex={currentIndex}>
                            {problems.map((problem, index) => (
                                <Carousel.Item key={index}>
                                    <div>
                                        <h3>{problem.name}</h3>
                                        <p>{problem.description}</p>
                                    </div>
                                </Carousel.Item>
                            ))}
                        </Carousel>

                        <div className="toggle-solution">
                            <Button variant="outline-secondary" onClick={this.toggleSolution}>
                                {showSolutionButtonText}
                            </Button>
                        </div>

                        {explicitShowSolution && <p>{currentProblem.possibleSolution}</p>}
                    </div>
                }
            </div>
        );
    }
}

export default withTranslation()(ProblemCarousel);
