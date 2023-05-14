import LicenseType from "./LicenseType";

class License {
    constructor(id, name: String, type: LicenseType, info: String) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.info = info;
    }
}

export default License;