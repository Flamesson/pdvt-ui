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
        return <div>
            <h5>Обнаружены циклы зависимостей. Список циклов: </h5>
            <ListGroup>
                {this.mapCycles()}
            </ListGroup>
        </div>;
    }


    renderReasons(): React.ReactNode {
        return <ul>Подобная проблема может возникнуть следующим образом:
            <ol>1) Неправильное разделение ответственности: Когда разные части кода слишком сильно связаны друг с другом, возможно, они будут иметь циклические зависимости. Недостаточное разделение ответственности между компонентами может привести к такой ситуации.</ol>
            <ol>2) Ошибки в процессе разработки: Неправильное использование или неправильное связывание компонентов может привести к циклическим зависимостям. Это может произойти при некорректном внедрении зависимостей.</ol>
            <ol>3) При проектировании или разработке произошла ошибка, модуль оказался ненужен или не был привязан к нужному месту.</ol>
            <ol>4) Вы используете версию приложения, которая содержит баг, из-за которого не генерирует список зависимостей нужным образом.</ol>
        </ul>;
    }


    renderSolution(): React.ReactNode {
        return <div>
            <p>Если у вас есть циклическая зависимость, вероятно, у вас есть проблема с дизайном, и обязанности не разделены должным образом. Вам следует попытаться правильно перепроектировать компоненты, чтобы их иерархия была хорошо спроектирована и не было необходимости в циклических зависимостях.</p>
            <p>Проанализируйте структуру вашего проекта и его модули. Попытайтесь выделить ядро функциональности и минимизировать перекрестные зависимости между модулями. Разделите функциональность на независимые слои или компоненты, чтобы уменьшить взаимозависимость.</p>
        </div>;
    }


    renderConsequences(): React.ReactNode {
        return <div>
            <li>Проблема не является критичной, но может ухудшать сопровождаемость, тестируемость и скорость разработки.</li>
        </div>;
    }
}

export default withTranslation()(CyclesProblem);