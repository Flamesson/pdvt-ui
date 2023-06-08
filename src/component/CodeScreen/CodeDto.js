class CodeDto {
    constructor(codeword) {
        this.codeword = codeword;
    }

    static empty() {
        return new CodeDto(null, null);
    }
}

export default CodeDto;