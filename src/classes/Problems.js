import Elements from "../cytoscape/Elements";
import Problem from "./Problem";
import Optional from "../utils/Optional";
import Arrays from "../utils/Arrays";
import Cycle from "../cytoscape/Cycle";
import Conflict from "../cytoscape/Conflict";
import UnlinkedNodesProblem from "../component/Problem/UnlinkedNodesProblem";
import CyclesProblem from "../component/Problem/CyclesProblem";
import ConflictsProblem from "../component/Problem/ConflictsProblem";
import LicenseProblems from "../cytoscape/LicenseProblems";
import LicenseProblem from "../component/Problem/LicensesProblem";
import logger from "../utils/Logger";

class Problems {
    constructor(elements: Elements, t) {
        this.elements = elements;
        this.t = t;
    }

    analyze(): Promise<Problem[]> {
        return this._getLicencesProblems()
            .then((optional: Optional<Problem>) => {
                return Array.of(
                    this._getUnlinked(),
                    this._getCycles(),
                    this._getVersionsConflicts(),
                    optional
                )
                    .filter(optional => optional.isPresent())
                    .map(optional => optional.getOrThrow());
            });
    }

    _getUnlinked(): Optional<Problem> {
        let unlinked: Node[] = this.elements.getUnlinkedNodes();
        if (Arrays.isEmpty(unlinked)) {
            return Optional.empty();
        }

        //TODO: localize
        let name = "Несвязанные узлы";
        return Optional.of(new Problem(name, <UnlinkedNodesProblem nodes={unlinked}/>))
    }

    _getCycles(): Optional<Problem> {
        let cycles: Cycle[] = this.elements.getCycles();
        if (Arrays.isEmpty(cycles)) {
            return Optional.empty();
        }

        let name = "Циклы зависимостей";
        return Optional.of(new Problem(name, <CyclesProblem cycles={cycles}/>));
    }

    _getVersionsConflicts(): Optional<Problem> {
        let conflicts: Conflict[] = this.elements.getVersionsConflicts();
        if (Arrays.isEmpty(conflicts)) {
            return Optional.empty();
        }

        let name = "Конфликты зависимостей";
        return Optional.of(new Problem(name, <ConflictsProblem conflicts={conflicts}/>));
    }

    _getLicencesProblems(): Promise<Optional<Problem>> {
        return this.elements.getLicenses()
            .then((problems: LicenseProblems[]) => {
                let filtered: LicenseProblems[] = problems.filter((problems: LicenseProblems) => problems.isNotEmpty());
                if (Arrays.isEmpty(filtered)) {
                    return Optional.empty();
                }

                logger.warn("LICENSE PROBLEMS! " + problems.length);
                let name = "Лицензирование";
                return Optional.of(new Problem(name, <LicenseProblem problems={problems}/>));
            });
    }
}

export default Problems;