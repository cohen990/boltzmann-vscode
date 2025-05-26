import { TextEditor, window } from "vscode";
import { Highlights } from "../state/highlightsSingleton";
import { analyseAndDecorate } from "../operations/analyseAndDecorate";
import { Logger } from "../logger";
import { Editor } from "../state/editor";

export class TextEditorEvents {
    static registerOnDidChange(logger: Logger) {
        window.onDidChangeVisibleTextEditors((editors: readonly TextEditor[]) => {
            if (Highlights.Disabled()) { return; }
            if (editors.length > 1) {
                const textEditor = editors[1];
                Editor.SetCurrentWindow(textEditor);

                Highlights.Singleton().deregisterAll(logger);
                const highlights = analyseAndDecorate(logger);
                highlights.then(
                    (inner) => Highlights.Singleton().register(inner, Editor.CurrentWindow())
                );
            }
        });
    }
}