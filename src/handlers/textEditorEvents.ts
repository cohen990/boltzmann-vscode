import { TextEditor, window } from "vscode";
import { Highlights } from "../highlights/highlightsSingleton";
import { analyseAndDecorate } from "../operations/analyseAndDecorate";
import { Logger } from "../logger";

 export class TextEditorEvents {
	static registerOnDidChange(logger: Logger) {
        window.onDidChangeVisibleTextEditors((event: readonly TextEditor[]) => {
            if(event.length > 1) {
                Highlights.Singleton().deregisterAll();
                const highlights = analyseAndDecorate(logger);

                highlights.then(
                    (inner) => Highlights.Singleton().register(inner, event[1])
                );
            }
        });
    }
}