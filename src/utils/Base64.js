import {Buffer} from 'buffer';

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
        let content = this.decodeText(parts[1]);
        return new File([content], filename, {type: format});
    }

    encodeText(text): String {
        const buffer: Buffer = Buffer.from(text, "utf8");
        return buffer.toString("base64");
    }

    decodeText(text): String {
        const buffer = Buffer.from(text, "base64");
        return buffer.toString("utf8");
    }
}

export default new Base64();