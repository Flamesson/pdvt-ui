class Arrays {
    static filter(source: *[], exclude: *[]): *[] {
        return source.filter(item => !exclude.includes(item));
    }

    static isEmpty(array: *[]): boolean {
        return array.length === 0;
    }

    static isNotEmpty(array: *[]): boolean {
        return !this.isEmpty(array);
    }

    static pushAll(increased: [], included: []): void {
        increased.push.apply(increased, included);
    }

    static remove(array: [], element: *): void {
        let index = array.indexOf(element);
        if (index === -1) {
            return;
        }

        array.splice(index, 1);
    }

    static reverse(array: *[]): *[] {
        let result = [];
        for (let i = array.length - 1; i >= 0; i--) {
            result.push(array[i]);
        }

        return result;
    }

    static areEquals(a1: *[], a2: *[]): boolean {
        if (a1.length !== a2.length) {
            return false;
        }

        for (let i1: * of a1) {
            if (!a2.includes(i1)) {
                return false;
            }
        }

        return true;
    }
}

export default Arrays;