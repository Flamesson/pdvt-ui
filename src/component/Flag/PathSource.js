import Objects from "../../utils/Objects";
import ruFlag from "./russian_flag.png";
import brFlag from "./british_flag.png";
import zhFlag from "./chinese_flag.png";

class PathSource {
    getPath(localeCode: String): * {
        if (Objects.isNotCorrect(localeCode)) {
            return undefined;
        } else if (localeCode === "ru") {
            return ruFlag;
        } else if (localeCode === "en") {
            return brFlag;
        } else if (localeCode === "zh") {
            return zhFlag;
        }
    }
}

export default PathSource;