import extLocalStorage from "../utils/ext.local.storage";
import AbstractParser from "../parser/AbstractParser";
import ParserFactory from "../parser/ParserFactory";
import Elements from "../cytoscape/Elements";
import AppStorage from "../AppStorage";
import InputSource from "./InputSource";
import Tag from "../parser/Tag";

class DataManager {
    getUsedInputSource(): InputSource {
        if (extLocalStorage.isPresent(AppStorage.DATA_TEXT)) {
            return InputSource.PLAIN_TEXT
        } else if (extLocalStorage.isPresent(AppStorage.DATA_FILE)) {
            return InputSource.FILE;
        } else {
            return InputSource.NOTHING;
        }
    }

    getElements(): Promise<Elements> {
        let inputSource = this.getUsedInputSource();
        if (inputSource === InputSource.PLAIN_TEXT) {
            return this.handle(this.getTextDataElements());
        } else if (inputSource === InputSource.FILE) {
            return this.handle(this.getFileElements());
        } else if (inputSource === InputSource.NOTHING) {
            return this.handle(new Promise((resolve, reject) => {
                resolve(new Elements());
            }));
        } else {
            throw new Error("Unknown input source will be used");
        }
    }

    handle(promise: Promise<Elements>): Promise<Elements> {
        return promise
            .then((elements: Elements) => {
                elements.handleUnlinkedNodes();
                elements.handleNumberOfOutputs(5);
                elements.findCycles();
                elements.findMostLongPath();
                elements.findVersionsConflicts();

                return Promise.resolve(elements);
            })
            .then((elements: Elements) => elements.handleLicenses());
    }

    getTextDataElements(): Promise<Elements> {
        return new Promise((resolve, reject) => {
            let content = extLocalStorage.getItem(AppStorage.DATA_TEXT);
            let parser: AbstractParser = new ParserFactory().create(content);
            resolve(parser.parse(content));
        });
    }

    getFileElements(): Promise<Elements> {
        return new Promise((resolve, reject) => {
            let file = extLocalStorage.getFile(AppStorage.DATA_FILE);
            let reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            }
            reader.onerror = reject;
            reader.readAsBinaryString(file);
        }).then((content) => {
            let parser: AbstractParser = new ParserFactory().create(content);
            return parser.parse(content);
        });
    }

    hasVersions(): Promise<Boolean> {
        let inputSource = this.getUsedInputSource();
        if (inputSource === InputSource.PLAIN_TEXT) {
            return new Promise((resolve, reject) => {
                let content = extLocalStorage.getItem(AppStorage.DATA_TEXT);
                let parser: AbstractParser = new ParserFactory().create(content);
                resolve(parser.doesSupportTag(Tag.VERSIONED));
            });
        } else if (inputSource === InputSource.FILE) {
            return new Promise((resolve, reject) => {
                let file = extLocalStorage.getFile(AppStorage.DATA_FILE);
                let reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                }
                reader.onerror = reject;
                reader.readAsBinaryString(file);
            }).then((content) => {
                let parser: AbstractParser = new ParserFactory().create(content);
                return parser.doesSupportTag(Tag.VERSIONED);
            });
        } else if (inputSource === InputSource.NOTHING) {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        } else {
            throw new Error("Unknown input source will be used");
        }
    }
}

export default DataManager;