import Arrays from "../utils/Arrays";

class LicenseProblems {
    constructor(infections: Node[], infected: Node[]) {
        this.infections = infections;
        this.infected = infected;
    }

    isEmpty() {
        return Arrays.isEmpty(this.infections);
    }

    isNotEmpty() {
        return !this.isEmpty();
    }
}

export default LicenseProblems;