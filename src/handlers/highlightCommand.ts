import { commands, ExtensionContext, TextEditor } from "vscode";
import { Highlights  } from "../state/highlightsSingleton";
import { analyseAndDecorate as computeHighlights } from "../operations/analyseAndDecorate";
import { Logger } from "../logger";
import { Editor } from "../state/editor";

export class HighlightCommand {
	static register (context: ExtensionContext, logger: Logger) {
		logger.info("Registering Highlighter");
		const highlightCommand = 
			commands.registerTextEditorCommand('boltzmann-analyser.Highlight', (textEditor: TextEditor) => {
                Editor.SetCurrentWindow(textEditor);
				Highlights.Singleton().deregisterAll(logger);
				let highlights = computeHighlights(logger);
				highlights.then((inner) => {
					Highlights.Singleton().register(inner, Editor.CurrentWindow());
				});
		});

		context.subscriptions.push(highlightCommand);
	}
}