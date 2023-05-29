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
        return <div>
            <h5>В графе присутствуют несвязанные узлы. Вот список таких узлов: </h5>
            <ListGroup>
                {this.state.nodes.map(node => <ListGroupItem key={node.id}>{node.getLabel()}</ListGroupItem>)}
            </ListGroup>
        </div>;
    }


    renderReasons(): React.ReactNode {
        return <ul>Это может произойти по следующим причинам:
            <ol>1) В проекте может быть независимый компонент, модуль или микросервис, который не зависит от других элементов системы и не требует взаимодействия с ними.</ol>
            <ol>2) В ходе развития проекта код может устареть и некоторые модули могут стать неактуальными.</ol>
            <ol>3) При проектировании или разработке произошла ошибка, модуль оказался ненужен или не был привязан к нужному месту.</ol>
            <ol>4) Вы используете версию приложения генерации списка зависимостей, которая содержит баг, из-за которого список зависимостей не генерируется нужным образом.</ol>
        </ul>;
    }


    renderSolution(): React.ReactNode {
        return <ul>
            <li>Если модуль не используется - его следует архивировать или удалить.</li>
            <li>Возможно необходимо произвести анализ зависимостей компонентов в проекте.</li>
        </ul>;
    }


    renderConsequences(): React.ReactNode {
        return <ul>
            <li>Наличие неиспользуемых модулей может приводить к нагромождению, усложнению разработки и проекта. Нагромождение уменьшает скорость понимания проекта и его частей.</li>
        </ul>;
    }
}

export default withTranslation()(UnlinkedNodesProblem);