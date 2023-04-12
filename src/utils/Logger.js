import Strings from "./Strings";
import Objects from "./Objects";

const DEBUG = "debug";
const INFO = "info";
const WARN = "warn";
const ERROR = "error";

const LOG_LEVEL_KEYWORD = INFO;

class Logger {
    static getLoggingLevel(keyword) {
        let lowerCaseKeyword = String(keyword).toLowerCase();
        if (lowerCaseKeyword === DEBUG) {
            return 10;
        } else if (lowerCaseKeyword === INFO) {
            return 20;
        } else if (lowerCaseKeyword === WARN) {
            return 30;
        } else if (lowerCaseKeyword === ERROR) {
            return 40;
        }

        throw new Error();
    }

    static getKeyword(loggingLevel) {
        if (loggingLevel === 10) {
            return DEBUG;
        } else if (loggingLevel === 20) {
            return INFO;
        } else if (loggingLevel === 30) {
            return WARN;
        } else if (loggingLevel === 40) {
            return ERROR;
        }

        throw new Error();
    }

    isLevelCovered(keyword) {
        return Logger.getLoggingLevel(LOG_LEVEL_KEYWORD) <= Logger.getLoggingLevel(keyword);
    }

    isLevelNotCovered(keyword) {
        return !this.isLevelCovered(keyword);
    }

    debug(message, args) {
        this.log(DEBUG, message, args);
    }

    info(message, args) {
        this.log(INFO, message, args);
    }

    warn(message, args) {
        this.log(WARN, message, args);
    }

    error(message, args) {
        this.log(ERROR, message, args);
    }

    log(level, message, args) {
        if (this.isLevelNotCovered(level)) {
            return;
        }

        let now = new Date();
        console.log(
            String(level).toUpperCase()
            + " | " + now.toLocaleDateString() + " " + now.toLocaleTimeString()
            + " | " + this.handleMessage(message, args)
        );
    }

    handleMessage(message, args) {
        if (Objects.isNotCorrect(args)) {
            return message;
        }

        return Strings.format(message, args);
    }
}

export default new Logger();