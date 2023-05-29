import React from "react";
import AbstractProblem from "./AbstractProblem";
import {withTranslation} from "react-i18next";
import {ListGroup, ListGroupItem} from "react-bootstrap";
import {ReactNode} from "react";
import LicenseProblems from "../../cytoscape/LicenseProblems";
import Arrays from "../../utils/Arrays";
import set from "cytoscape/src/set";
import Sets from "../../utils/Sets";

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
        let nodes: Set<Node> = new Set();
        for (let problem: LicenseProblems of this.state.problems) {
            Sets.addArray(nodes, problem.infections);
        }

        return [...nodes];
    }

    collectInfected = (): Node[] => {
        let nodes: Set<Node> = new Set();
        for (let problem: LicenseProblems of this.state.problems) {
            Sets.addArray(nodes, problem.infected);
        }

        let infections = this.collectInfections();
        let tmp = [...nodes];
        for (let infection of infections) {
            Arrays.removeIfPresent(tmp, infection);
        }
        return tmp;
    }

    mapInfection(infection: Node): ReactNode {
        return <ListGroupItem key={infection.getId()} className={"d-flex flex-row justify-content-between"}>
            <div>{infection.getLabel()}</div>
            <div>(лицензия - {infection.data.license ? infection.data.license : infection.data.specifiedLicense + " (указано вами)"})</div>
        </ListGroupItem>;
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
        return <div>
            Основной причиной является невнимательность, нежелание или незнание специалистов о необходимости проверки лицензий при подключении новых зависимостей. В таких случаях лицензированию попросту не уделяется должного внимания.
        </div>;
    }


    renderSolution(): React.ReactNode {
        return <div>
            <p>Необходимо контролировать используемые модули, проверять лицензию, под которой они выпускаются и применять их соответственно вашему приложению. Если вы обнаружили зависимость с неподходящим типом лицензии - попробуйте найти аналогичную функциональность в другом фреймворке/библиотеке или выполнить условия лицензии.</p>
            <p>Требования со стороны лицензий могут разительно отличаться - некоторые библиотеки с открытым исходным кодом требуют того, чтобы ваш проект тоже имел открытый исходный код, некоторые нельзя использовать в коммерческих проектах. Важно внимательно читать эти условия.</p>
            <p>Возможны ситуации, когда продукт выпускается под несколькими лицензиями. Пример — использование некоторых версий LGPL лицензий вместе с коммерческим проприетарным (закрытым) ПО.</p>
            <p>Желательно консультироваться с юристом, поскольку в данном вопросе возможны неочевидные юридические нюансы.</p>
        </div>;
    }


    renderConsequences(): React.ReactNode {
        return <div>
            В долгосрочной перспективе такая ситуация может привести к юридическим проблемам или даже репутационным и финансовым потерям как правообладателя, так и пользователя. Возможны судебные разбирательства.
        </div>;
    }
}

export default withTranslation()(LicensesProblem);