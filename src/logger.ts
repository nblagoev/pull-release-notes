// tslint:disable: no-console
import * as util from "util"

export class Logger {
    public static verbose: boolean = true

    public static log(format: any, ...args: any[]) {
        if (this.verbose) {
            console.log(util.format(format, ...args))
        }
    }

    public static warn(format: any, ...args: any[]) {
        console.warn(util.format(format, ...args))
    }
}
