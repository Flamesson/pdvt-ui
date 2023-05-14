import License from "./License";
import LicenseType from "./LicenseType";

class Licenses {
    static LICENSES = Array.of(
        new License(1, "license.public-domain.name", LicenseType.MAYBE_PAID, "licence.public-domain.description"),
        new License(2, "licence.shareware.name", LicenseType.PAID, "licence.shareware.description"),
        new License(3, "licence.commercial-software.name", LicenseType.PAID, "licence.commercial-software.description"),
        new License(4, "licence.crippleware.name", LicenseType.PAID, "licence.crippleware.description"),
        new License(5, "licence.hostageware.name", LicenseType.PAID, "licence.hostageware.description"),
        new License(6, "licence.proprietary.name", LicenseType.MAYBE_PAID, "licence.proprietary.description"),
        new License(7, "licence.free.name", LicenseType.FREE, "licence.free.description"),
        new License(8, "licence.gnu-gpl.name", LicenseType.FREE, "licence.gnu-gpl.description"),
        new License(9, "licence.bsd.name", LicenseType.FREE, "licence.bsd.description"),
        new License(10, "licence.mit.name", LicenseType.FREE, "licence.mit.description"),
        new License(11, "licence.apache.name", LicenseType.FREE, "licence.apache.description"),
        new License(12, "licence.open-source.name", LicenseType.FREE, "licence.open-source.description")
    );

    static isKnown(id: *): Boolean {
        if (id.toString() === "100") {
            return true;
        } else if (id.toString() === "200") {
            return true;
        }

        for (let license of this.LICENSES) {
            if (license.id.toString() === id) {
                return true;
            }
        }

        return false;
    }

    static getTypeByCode(code: Number): * {
        if (code.toString() === "100") {
            return LicenseType.FREE;
        } else if (code.toString() === "200") {
            return LicenseType.PAID;
        }

        for (let license of this.LICENSES) {
            if (license.id === code) {
                return license.type;
            }
        }

        throw new Error("Unknown code was given. Given: " + code);
    }
}

export default Licenses;