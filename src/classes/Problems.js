import Elements from "../cytoscape/Elements";
import Problem from "./Problem";
import Optional from "../utils/Optional";
import Arrays from "../utils/Arrays";
import Cycle from "../cytoscape/Cycle";
import Conflict from "../cytoscape/Conflict";
import UnlinkedNodesProblem from "../component/Problem/UnlinkedNodesProblem";
import CyclesProblem from "../component/Problem/CyclesProblem";
import ConflictsProblem from "../component/Problem/ConflictsProblem";

class Problems {
    constructor(elements: Elements, t) {
        this.elements = elements;
        this.t = t;
    }

    analyze(): Problem[] {
        return Array.of(
            this._getUnlinked(),
            this._getCycles(),
            this._getVersionsConflicts(),
            this._getLicencesProblems()
        )
            .filter(optional => optional.isPresent())
            .map(optional => optional.getOrThrow());
    }

    _getUnlinked(): Optional<Problem> {
        let unlinked: Node[] = this.elements.getUnlinkedNodes();
        if (Arrays.isEmpty(unlinked)) {
            return Optional.empty();
        }

        //TODO: localize
        let name = "Несвязанные узлы";
        return Optional.of(new Problem(name, <UnlinkedNodesProblem nodes={unlinked}/>, <div>"Пока не придумал..."</div>))
    }

    _getCycles(): Optional<Problem> {
        let cycles: Cycle[] = this.elements.getCycles();
        if (Arrays.isEmpty(cycles)) {
            return Optional.empty();
        }

        //проблема не критична, но может ухудшить сопровождаемость, тестируемость и скорость разработки.
        //решение - Когда у вас есть циклическая зависимость, вероятно, у вас есть проблема с дизайном, и обязанности не разделены должным образом. Вам следует попытаться правильно перепроектировать компоненты, чтобы их иерархия была хорошо спроектирована и не было необходимости в циклических зависимостях.
        //решение - использование пакетного менеджера
        let name = "Циклы зависимостей";
        return Optional.of(new Problem(name, <CyclesProblem cycles={cycles}/>, <div>"Пока не придумал..."</div>));
    }

    _getVersionsConflicts(): Optional<Problem> {
        let conflicts: Conflict[] = this.elements.getVersionsConflicts();
        if (Arrays.isEmpty(conflicts)) {
            return Optional.empty();
        }

        let name = "Конфликты зависимостей";
        return Optional.of(new Problem(name, <ConflictsProblem conflicts={conflicts}/>, <div>"Пока не придумал..."</div>));
    }

    _getLicencesProblems(): Optional<Problem> {
        //TODO: отправлять на бэкенд текущий файл зависимостей. там фильтровать. возвращать те, что не проходят + по какой лицензии. причем можно по id, а не по label.
        return Optional.empty();
    }
}

export default Problems;