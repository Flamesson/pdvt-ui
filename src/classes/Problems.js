import Elements from "../cytoscape/Elements";
import Problem from "./Problem";
import Optional from "../utils/Optional";
import Arrays from "../utils/Arrays";

class Problems {
    constructor(elements: Elements, t) {
        this.elements = elements;
        this.t = t;
    }

    analyze(): Problem[] {
        let problems: Problem[] = [];
        this._getUnlinked().ifPresent(problem => problems.push(problem));
    }

    _getUnlinked(): Optional<Problem> {
        let unlinked: Node[] = this.elements.getUnlinkedNodes();
        if (Arrays.isEmpty(unlinked)) {
            return Optional.empty();
        }

        //TODO: localize
        let name = "Несвязанные узлы";
        let description = "В графе присутствуют несвязанные узлы. Вот список таких узлов: " +
        "\n" + unlinked.map(node => "=> " + node.getLabel() + "\n") +
        "\nЭто может произойти по следующим причинам:" +
        "\n1) В проекте может быть независимый компонент, модуль или микросервис, который не зависит от других элементов системы и не требует взаимодействия с ними." +
        "\n2) В ходе развития проекта код может устареть и некоторые модули могут стать неактуальными." +
        "\n3) При проектировании или разработке произошла ошибка, модуль оказался ненужен или не был привязан к нужному месту." +
        "\n4) Вы используете версию приложения, которая содержит баг, из-за которого не генерирует список зависимостей нужным образом.";

        return Optional.of(new Problem(name, description, ""))
    }
}

export default Problems;