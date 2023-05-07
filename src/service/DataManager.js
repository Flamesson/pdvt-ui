import extLocalStorage from "../utils/ext.local.storage";
import AbstractParser from "../parser/AbstractParser";
import ParserFactory from "../parser/ParserFactory";
import Elements from "../cytoscape/Elements";
import AppStorage from "../AppStorage";

class DataManager {
    getElements(): Promise<Elements> {
        if (extLocalStorage.isPresent(AppStorage.DATA_TEXT)) {
            return this.getTextDataElements();
        } else if (extLocalStorage.isPresent(AppStorage.DATA_FILE)) {
            return this.getFileElements();
        } else {
            return new Promise((resolve, reject) => {
                resolve(new Elements());
            });
        }
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
}

export default DataManager;