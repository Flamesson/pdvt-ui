class Sets {
    static addArray(set: Set, arr: *[]): void {
        for (let item of arr) {
            set.add(item);
        }
    }
}

export default Sets;