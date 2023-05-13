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
}

export default Arrays;