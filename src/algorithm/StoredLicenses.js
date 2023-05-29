import Elements from "../cytoscape/Elements";
import LicenseDependency from "../licenses/LicenseDependency";
import extLocalStorage from "../utils/ext.local.storage";
import AppStorage from "../AppStorage";
import Licenses from "../licenses/Licenses";
import LicenseType from "../licenses/LicenseType";
import Arrays from "../utils/Arrays";
import LicenseProblems from "../cytoscape/LicenseProblems";
import Node from "../cytoscape/Node";

class StoredLicenses {
    constructor(elements: Elements) {
        this.elements = elements;
    }

    findProblems(): Promise<LicenseProblems> {
        let licenses: LicenseDependency[] = this.getLicenses().filter((license: LicenseDependency) => {
            let code = license.value
            let type = Licenses.getTypeByCode(code);
            return type === LicenseType.PAID || type === LicenseType.MAYBE_PAID;
        });

        let infections: Node[] = this._matchesAll(licenses);
        let infected = [];
        let handled = [];
        let toHandle: Node[] = new Array(...infections);
        while (Arrays.isNotEmpty(toHandle)) {
            let inHandle: Node = toHandle.pop();
            let incomers: Node[] = inHandle.getIncomers();
            let shouldHandle: Node[] = incomers.filter((incomer: Node) => !handled.includes(incomer));
            Arrays.pushAll(toHandle, shouldHandle);
            Arrays.pushAll(infected, incomers);
            handled.push(inHandle);
        }

        return Promise.resolve(new LicenseProblems(infections, infected));
    }

    getLicenses(): LicenseDependency[] {
        if (extLocalStorage.isAbsent(AppStorage.DEPENDENCIES_LICENSES)) {
            return [];
        }

        let plain = extLocalStorage.getParsedJson(AppStorage.DEPENDENCIES_LICENSES);
        return plain.map(singlePlain => {
            return new LicenseDependency(singlePlain.key, singlePlain.value);
        });
    }

    _matchesAll(licenses: LicenseDependency[]): Node[] {
        let nodes: Node[] = [];
        for (let license: LicenseDependency of licenses) {
            let matches: Node[] = this._matches(license);
            Arrays.pushAll(nodes, matches);
        }

        return nodes;
    }

    _matches(license: LicenseDependency): Node[] {
        let parts = license.key.split(":");
        let regex = [];
        for (let i = 0; i < parts.length - 1; i++) {
            let part = parts[i];
            if (part.trim() === "+") {
                regex.push(".*", this.escapeRegExp(":"));
            } else {
                regex.push(this.escapeRegExp(part + ":"));
            }
        }
        let lastPart = parts[parts.length - 1];
        if (lastPart.trim() === "+") {
            regex.push(".*");
        } else {
            regex.push(this.escapeRegExp(lastPart));
        }

        let pattern: RegExp = new RegExp(regex.join(""));
        return this.elements.nodes
            .filter((node: Node): boolean => {
                let label: String = node.getLabel();
                return pattern.test(label);
            })
            .map((node: Node): Node => {
                node.data.specifiedLicense = license.value;
                return node;
            });
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}

export default StoredLicenses;