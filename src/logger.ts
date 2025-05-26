import { LogOutputChannel, window } from "vscode";
import { Option } from "./option";

export class Logger {
    private outputChannel: LogOutputChannel;

    constructor(logGroup: string) {
        this.outputChannel = window.createOutputChannel(logGroup, {log: true});
    }

    info(message: string, ...args: unknown[]) {
        if(args.length === 0) {
            this.outputChannel.info(message);
            return;
        }
        this.outputChannel.info(message, args);
    }

    debug(message: string, ...args: unknown[]) {
        if(args.length === 0) {
            this.outputChannel.debug(message);
            return;
        }
        this.outputChannel.debug(message, args || undefined);
	}

	trace(message: string, ...args: unknown[]) {
        if(args.length === 0) {
            this.outputChannel.trace(message);
            return;
        }
        this.outputChannel.trace(message, args || undefined);
	}

    error(error: unknown) {
        if(typeof error === 'string' || error instanceof String){
            this.outputChannel.error(error as string);
        }
        else if(error instanceof Error){
            this.outputChannel.error(error as Error);
        }
        else {
            this.outputChannel.error(JSON.stringify(error));
        }
    }
}