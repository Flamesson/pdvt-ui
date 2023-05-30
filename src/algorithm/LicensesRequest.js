import Elements from "../cytoscape/Elements";
import Node from "../cytoscape/Node";
import axios from "axios";
import logger from "../utils/Logger";
import Arrays from "../utils/Arrays";
import LicenseProblems from "../cytoscape/LicenseProblems";

const REACT_APP_SERVER_ADDRESS: String = process.env.REACT_APP_SERVER_ADDRESS;
const SERVER_URL = "http://" + REACT_APP_SERVER_ADDRESS;

class LicensesRequest {
    constructor(elements: Elements) {
        this.elements = elements;
    }

    getLicenseProblems(): Promise<LicenseProblems> {
        let dtos = this.elements.nodes.map((node: Node) => {
            return { artifact: node.getLabel() }
        });
        let config = { timeout: this._calculateTimeout(dtos.length) };
        return axios.post(SERVER_URL + "/licenses/check", dtos, config)
            .then(response => {
                let infections: Node[] = response.data.map(dto => {
                    let node = this.elements._getNodeByLabel(dto.artifact);
                    node.data.license = dto.license;
                    return node;
                });

                let infected: Node[] = [];
                let handled: Node[] = [];
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
            })
            .catch(ignored => {
                logger.error("Failed to determine licensing with backend");
                return Promise.resolve(new LicenseProblems([], []));
            });
    }

    _calculateTimeout(input: Number): Number {
        let inputMin = 1;
        let inputMax = 150;
        let outputMin = 2000;
        let outputMax = 10000;

        if (input >= inputMax) {
            return outputMax;
        }

        let normalizedInput = (input - inputMin) / (inputMax - inputMin);
        let output = (normalizedInput * (outputMax - outputMin)) + outputMin;
        return Math.round(output);
    }
}

export default LicensesRequest;