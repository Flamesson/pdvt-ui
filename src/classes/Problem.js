import {ReactNode} from "react";

class Problem {
    constructor(name: String, body: ReactNode) {
        this.name = name;
        this.body = body;
    }
}

export default Problem;