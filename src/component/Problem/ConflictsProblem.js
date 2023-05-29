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
        return <div className={"d-flex flex-row"}>
            <div className={"vertical-line"}/>
            <div className={"d-flex flex-column justify-content-start align-items-end ml-4"}>
                <h6>Модули, зависящие от конфликтующей функциональности:</h6>
                <div className={"d-flex flex-row"}>
                    {conflict.intermediateNodes.map((node: Node) => <div className={"mr-3"}>{node.getLabel()}</div>)}
                </div>
            </div>
        </div>;
    }

    expandEndNodes = (conflict: Conflict): ReactNode => {
        return <div className={"d-flex flex-column justify-content-start align-items-start mr-3"}>
            <h6>Конфликтующие артефакты:</h6>
            {conflict.endNodes.map((node: Node) => <div>{node.getLabel()}</div>)}
        </div>;
    }

    renderProblems(): React.ReactNode {
        return <div>
            <h5>Обнаружены конфликты версий. Список конфликтов: </h5>
            <ListGroup>
                {this.mapConflicts()}
            </ListGroup>
        </div>;
    }


    renderReasons(): React.ReactNode {
        return <ul>Конфликты версий могут возникать по разным причинам. Вот некоторые из них:
            <ol>1) Разные требования: Разные зависимости могут требовать разные версии одной и той же библиотеки или пакета. Например, одна зависимость может требовать версию 1.0, а другая - версию 2.0. Это может привести к конфликту, когда две разные версии несовместимы между собой.</ol>
            <ol>2) Неявные зависимости: Если разные зависимости имеют скрытые или неявные зависимости от одного и того же пакета, это также может вызвать конфликт версий. Если одна зависимость требует определенной версии пакета, а другая зависимость требует другой версии этого же пакета, возникает проблема.</ol>
            <ol>3) Обновление зависимостей: При обновлении версий зависимостей в проекте могут возникать конфликты. Если обновленная версия зависимости несовместима с уже имеющимися зависимостями проекта, могут возникать проблемы совместимости и конфликты версий.</ol>
        </ul>;
    }


    renderSolution(): React.ReactNode {
        return <ul>
            <li>Обновление версий: Попробуйте вручную обновить зависимости до их совместимых версий.</li>
            <li>Многие инструменты управления зависимостями, такие как maven, npm, yarn и pnpm, могут автоматически разрешать конфликты зависимостей. Они используют алгоритмы разрешения зависимостей, чтобы найти совместимые версии и использовтаь их. Например maven применяет стратегию <a href={"https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html"}>nearest-wins</a> для разрешения конфликтов.</li>
        </ul>;
    }


    renderConsequences(): React.ReactNode {
        return <ul>
            <li>Разные версии зависимостей могут иметь несовместимые изменения в интерфейсе, функциональности или поведении. Это может привести к ошибкам компиляции или выполнения программы, поскольку код, написанный для одной версии зависимости, может не работать с другой версией. Несовместимость версий может привести к непредсказуемому поведению и ошибкам в работе приложения.</li>
            <li>Дублирование кода: Если разные модули или библиотеки используют разные версии одной и той же зависимости, это может привести к дублированию кода в проекте. Каждая версия зависимости будет загружена и использована отдельно, что может увеличить размер проекта и усложнить его поддержку. Дублирование кода также может привести к проблемам согласованности и совместимости между модулями.</li>
        </ul>;
    }
}

export default withTranslation()(ConflictsProblem);