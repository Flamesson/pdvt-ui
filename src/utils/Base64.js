class Base64 {
    encode(file: File, callback: Function) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            callback(reader.result);
        };
    }

    decode(data: String, filename: String) {
        let parts = data.split(",");
        let format = parts[0].split(";")[1];
        let content = atob(parts[1]);
        return new File([content], filename, {type: format});
    }
}

export default new Base64();