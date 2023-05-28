class CodeDto {
    constructor(codeword, password) {
        this.codeword = codeword;
        this.password = password;
    }

    static empty() {
        return new CodeDto(null, null);
    }
}

export default CodeDto;