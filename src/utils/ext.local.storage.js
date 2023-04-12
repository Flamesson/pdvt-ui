import Objects from "./Objects";
import base64 from "./Base64";
import EventEmitter from "eventemitter3";

class ExtLocalStorage {
    constructor() {
        this.hub = new EventEmitter();
    }

    setAsJson(key: String, value: *): void {
        this.setItem(key, JSON.stringify(value));
        this.hub.emit(key);
    }

    getParsedJson(key: String) {
        return JSON.parse(localStorage.getItem(key));
    }

    isPresent(key: String) {
        return Objects.isCorrect(localStorage.getItem(key));
    }

    remove(key: String) {
        localStorage.removeItem(key);
        this.hub.emit(key);
    }

    setItem(key: String, value: *) {
        localStorage.setItem(key, value);
        this.hub.emit(key);
    }

    getItem(key: String): String | null {
        return localStorage.getItem(key);
    }

    removeFile(key: String) {
        localStorage.removeItem(key);
        localStorage.removeItem(key + "_name");
        this.hub.emit(key);
    }

    saveFile(key: String, file: File, onSaved) {
        base64.encode(file, (encoded) => {
            localStorage.setItem(key, encoded);
            localStorage.setItem(key + "_name", file.name);
            if (Objects.isCorrect(onSaved)) {
                onSaved();
            }
            this.hub.emit(key);
        });
    }

    getFile(key: String): File {
        let filename = localStorage.getItem(key + "_name");
        let raw = localStorage.getItem(key);
        return base64.decode(raw, filename);
    }

    subscribeOnChange(key: String, listener: Function) {
        this.hub.on(key, listener);
    }
}

export default new ExtLocalStorage();