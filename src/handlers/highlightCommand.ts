import { commands, ExtensionContext, TextEditor } from "vscode";
import { Highlights  } from "../highlights/highlightsSingleton";
import { analyseAndDecorate as computeHighlights } from "../operations/analyseAndDecorate";
import { Logger } from "../logger";

export class HighlightCommand {
	static register (context: ExtensionContext, logger: Logger) {
		logger.info("Registering Highlighter");
		const highlightCommand = 
			commands.registerTextEditorCommand('boltzmann-analyser.Highlight', (textEditor: TextEditor) => {
				logger.info("Highlighting");
				Highlights.Singleton().deregisterAll();
				logger.info("Computing Highlights");
				let highlights = computeHighlights(logger);
				logger.info("Registering Highlights", highlights);
				highlights.then((inner) => {
					Highlights.Singleton().register(inner, textEditor);
					logger.info("Registration Complete");
				});
		});

		context.subscriptions.push(highlightCommand);
	}
}