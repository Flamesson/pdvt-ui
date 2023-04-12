import Option from "./Option";

class Maps {
    static ofVararg(...options: Option): Map<*, *> {
        return this.ofArray(Array.from(options));
    }

    static ofArray(options: Option[]): Map<*, *> {
        let map: Map<*, *> = new Map();
        options.forEach((option) => {
            map.set(option.key, option.value)
        });
        return map;
    }
}

export default Maps;