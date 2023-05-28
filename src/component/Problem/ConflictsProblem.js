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
        return <div>
            <h5 className={"mt-3"}>Возможные причины возникновения:</h5>
            <ul className={"mt-3"}>Конфликты версий могут возникать по разным причинам. Вот некоторые из них:
                <ol>1) Разные требования: Разные зависимости могут требовать разные версии одной и той же библиотеки или пакета. Например, одна зависимость может требовать версию 1.0, а другая - версию 2.0. Это может привести к конфликту, когда две разные версии несовместимы между собой.</ol>
                <ol>2) Неявные зависимости: Если разные зависимости имеют скрытые или неявные зависимости от одного и того же пакета, это также может вызвать конфликт версий. Если одна зависимость требует определенной версии пакета, а другая зависимость требует другой версии этого же пакета, возникает проблема.</ol>
                <ol>3) Обновление зависимостей: При обновлении версий зависимостей в проекте могут возникать конфликты. Если обновленная версия зависимости несовместима с уже имеющимися зависимостями проекта, могут возникать проблемы совместимости и конфликты версий.</ol>
            </ul>
        </div>;
    }


    renderSolution(): React.ReactNode {
        return <div>Не реализовано</div>;
    }


    renderConsequences(): React.ReactNode {
        return <div>Не реализовано</div>;
    }
}

export default withTranslation()(ConflictsProblem);