import Cycle from "./Cycle";

class Cycles {
    constructor() {
        this.cycles = [];
    }

    addCycle(cycle: Cycle) {
        if (!this.contains(cycle)) {
            this.cycles.push(cycle);
        }
    }

    contains(cycle: Cycle): boolean {
        for (let ownedCycle: Cycle of this.cycles) {
            if (cycle.length === ownedCycle.length && this.includesAll(ownedCycle, cycle)) {
                return true;
            }
        }

        return false;
    }

    covered(cycle: Cycle): boolean {
        for (let ownedCycle: Cycle of this.cycles) {
            if (this.includesAll(ownedCycle, cycle)) {
                return true;
            }
        }

        return false;
    }

    includesAll(cycle: Cycle, possibleSub: Cycle): boolean {
        for (let node: Node of possibleSub) {
            if (!cycle.includes(node)) {
                return false;
            }
        }

        return true;
    }
}

export default Cycles;