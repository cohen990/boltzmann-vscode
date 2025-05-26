import { commands, ExtensionContext, TextEditor } from "vscode";
import { Highlights  } from "../state/highlightsSingleton";
import { analyseAndDecorate as computeHighlights } from "../operations/analyseAndDecorate";
import { Logger } from "../logger";
import { Editor } from "../state/editor";

export class HighlightCommand {
	static registerEnable (context: ExtensionContext, logger: Logger) {
		logger.debug("Registering Enable Highlighting Command");
		const highlightCommand = 
			commands.registerTextEditorCommand('boltzmann-analyser.HighlightEnable', (textEditor: TextEditor) => {
				Highlights.Enable();
                Editor.SetCurrentWindow(textEditor);
				Highlights.Singleton().deregisterAll(logger);
				let highlights = computeHighlights(logger);
				highlights.then((inner) => {
					Highlights.Singleton().register(inner, Editor.CurrentWindow());
				});
		});

		context.subscriptions.push(highlightCommand);
	}

	static registerDisable (context: ExtensionContext, logger: Logger) {
		logger.debug("Registering Disable Highlighting Command");
		const highlightCommand = 
			commands.registerCommand('boltzmann-analyser.HighlightDisable', (_: TextEditor) => {
				Highlights.Singleton().deregisterAll(logger);
				Highlights.Disable();
		});

		context.subscriptions.push(highlightCommand);
	}
}