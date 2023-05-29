import React from "react";
import AbstractProblem from "./AbstractProblem";
import {withTranslation} from "react-i18next";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {ReactNode} from "react";
import LicenseProblems from "../../cytoscape/LicenseProblems";
import Arrays from "../../utils/Arrays";

class LicensesProblem extends AbstractProblem {
    constructor(props) {
        super(props);

        this.state = {
            problems: this.props.problems
        };
    }

    mapProblems = (): ReactNode[] => {
        return this.state.problems.map((problem: LicenseProblems) => {
            return <ListGroupItem>{problem.infections.map((node: Node) => node.getLabel()).concat(" ")}</ListGroupItem>
        });
    }

    collectInfections = (): Node[] => {
        let nodes: Node[] = [];
        for (let problem: LicenseProblems of this.state.problems) {
            Arrays.pushAll(nodes, problem.infections);
        }

        return nodes;
    }

    collectInfected = (): Node[] => {
        let nodes: Node[] = [];
        for (let problem: LicenseProblems of this.state.problems) {
            Arrays.pushAll(nodes, problem.infected);
        }

        return nodes;
    }

    mapInfection(infection: Node): ReactNode {
        return <ListGroupItem key={infection.getId()}>{infection.getLabel()}</ListGroupItem>;
    }

    renderProblems(): React.ReactNode {
        return <div>
            <h5>Возможны проблемы с лицензированием: </h5>
            <div className={"mt-4 d-flex flex-row"}>
                <div className={"w-100"}>
                    <h6>Модули с проблемной лицензией</h6>
                    <ListGroup>
                        {this.collectInfections().map(this.mapInfection)}
                    </ListGroup>
                </div>
                <div className={"w-100"}>
                    <h6>Модули, зависящие от проблемных</h6>
                    <ListGroup>
                        {this.collectInfected().map((node: Node) => <ListGroupItem key={node.getId()}>{node.getLabel()}</ListGroupItem>)}
                    </ListGroup>
                </div>
            </div>
        </div>;
    }


    renderReasons(): React.ReactNode {
        return <div>Не реализовано</div>;
    }


    renderSolution(): React.ReactNode {
        return <div>
            <p>Необходимо контролировать используемые модули, проверять лицензию, под которой они выпускаются и применять их соответственно вашему приложению. Если вы обнаружили зависимость с неподходящим типом лицензии - попробуйте найти аналогичную функциональность в другом фреймворке/библиотеке или выполнить условия лицензии.</p>
            <p>Требования со стороны лицензий могут разительно отличаться - некоторые библиотеки с открытым исходным кодом требуют того, чтобы ваш проект тоже имел открытый исходный код, некоторые нельзя использовать в коммерческих проектах. Важно внимательно читать эти условия.</p>
            <p>Возможны ситуации, когда продукт выпускается под несколькими лицензиями. Пример — использование некоторых версий LGPL лицензий вместе с коммерческим проприетарным (закрытым) ПО.</p>
        </div>;
    }


    renderConsequences(): React.ReactNode {
        return <div>
            В долгосрочной перспективе такая ситуация может привести к юридическим проблемам или даже репутационным и финансовым потерям как правообладателя, так и пользователя. Возможны судебные разбирательства.
        </div>;
    }
}

export default withTranslation()(LicensesProblem);