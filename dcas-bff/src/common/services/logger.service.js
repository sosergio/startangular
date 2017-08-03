import colors from 'colors';
import LogLevel from './../models/log-level';

export default function (environment) {
    return new Logger(environment);
}

class Logger {

    constructor(environment) {
        this.level = environment.app.logLevel;
        this.logPrefix = environment.app.name? `[${environment.app.name}]` : '[app]';
        colors.setTheme({
            silly: 'rainbow',
            input: 'grey',
            verbose: 'cyan',
            prompt: 'grey',
            info: 'green',
            data: 'grey',
            help: 'cyan',
            warn: 'yellow',
            debug: 'blue',
            error: 'red'
        });
    }

    logSuccess(message, ...optionalParams) {
        let params = colors.info.apply(colors.info, arguments);
        this.isLogEnabled() && console.log(this.logPrefix.info, params);
    }
    log(message, ...optionalParams) {
        let params = colors.input.apply(colors.input, arguments);
        this.isLogEnabled() && console.log(this.logPrefix, params);
    }
    warn(message, ...optionalParams) {
        let params = colors.warn.apply(colors.warn, arguments);
        this.isWarnEnabled() && console.warn(this.logPrefix.warn,params);
    }
    error(message, ...optionalParams) {
        let params = colors.error.apply(colors.error, arguments);
        this.isErrorEnabled() && console.error(this.logPrefix.error, params);
    }

    isErrorEnabled() {
        return this.level >= LogLevel.ERROR
    };
    isWarnEnabled() {
        return this.level >= LogLevel.WARN
    };
    isLogEnabled() {
        return this.level >= LogLevel.LOG
    };
}