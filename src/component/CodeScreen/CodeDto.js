class CodeDto {
    constructor(codeword, password, rawPasswordLength) {
        this.codeword = codeword;
        this.password = password;
        this.rawPasswordLength = rawPasswordLength;
    }

    static empty() {
        return new CodeDto(null, null, 0);
    }
}

export default CodeDto;