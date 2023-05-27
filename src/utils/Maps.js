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

    static computeIfAbsent(map: Map, key: *, defaultValueSupplier: Function): * {
        if (!map.has(key)) {
            map.set(key, defaultValueSupplier());
        }

        return map.get(key);
    }
}

export default Maps;