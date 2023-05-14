import Licenses from "./Licenses";
import LicenseType from "./LicenseType";

class LicenseDependency {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    booleanIsPaid() {
        if (this.value === 200) {
            return true;
        }

        for (let license of Licenses.LICENSES) {
            if (license.id === this.value) {
                return license.type === LicenseType.PAID;
            }
        }

        return false;
    }

    booleanIsFree() {
        if (this.value === 100) {
            return true;
        }

        for (let license of Licenses.LICENSES) {
            if (license.id === this.value) {
                return license.type === LicenseType.FREE;
            }
        }

        return false;
    }
}

export default LicenseDependency;