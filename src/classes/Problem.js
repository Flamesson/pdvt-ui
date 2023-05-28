import {ReactNode} from "react";

class Problem {
    constructor(name: String, body: ReactNode, possibleSolution: ReactNode) {
        this.name = name;
        this.body = body;
        this.possibleSolution = possibleSolution;
    }
}

export default Problem;