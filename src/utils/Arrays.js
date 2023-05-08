class Arrays {
    static filter(source: *[], exclude: *[]): *[] {
        return source.filter(item => !exclude.includes(item));
    }
}

export default Arrays;