import { TextDocument, TextDocumentChangeEvent, TextEditor, window, workspace  } from "vscode";
import { Highlights } from "../state/highlightsSingleton";
import { analyseAndDecorate } from "../operations/analyseAndDecorate";
import { Logger } from "../logger";
import { Editor } from "../state/editor";

 export class WorkspaceEvents {
	static registerOnDidSaveTextDocument(logger: Logger) {
        workspace.onDidSaveTextDocument((event: TextDocument) => {
            logger.info("Text document save detected. Reanalysing", event.fileName);
            Highlights.Singleton().deregisterAll(logger);
            const highlights = analyseAndDecorate(logger);
            highlights.then(
                (inner) => Highlights.Singleton().register(inner, Editor.CurrentWindow())
            );
        });
    }
}