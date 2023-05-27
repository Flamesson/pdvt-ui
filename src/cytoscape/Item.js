class Item {
    isEdge(): boolean {
        throw new Error("Must be implemented");
    }

    isNode(): boolean {
        throw new Error("Must be implemented");
    }
}

export default Item;