import { TextEditor, window } from "vscode";
import { Highlights } from "../state/highlightsSingleton";
import { analyseAndDecorate } from "../operations/analyseAndDecorate";
import { Logger } from "../logger";
import { Editor } from "../state/editor";

export class TextEditorEvents {
    static registerOnDidChange(logger: Logger) {
        window.onDidChangeVisibleTextEditors((event: readonly TextEditor[]) => {
            if (Highlights.Disabled()) { return; }
            if (event.length > 1) {
                Editor.SetCurrentWindow(event[1]);

                Highlights.Singleton().deregisterAll(logger);
                const highlights = analyseAndDecorate(logger);
                highlights.then(
                    (inner) => Highlights.Singleton().register(inner, Editor.CurrentWindow())
                );
            }
        });
    }
}