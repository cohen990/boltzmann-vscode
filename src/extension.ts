import { ExtensionContext } from 'vscode';
import { Logger } from './logger';
import { HighlightCommand } from './handlers/highlightCommand';
import { TextEditorEvents } from './handlers/textEditorEvents';

export function activate(context: ExtensionContext) {
	const logger = new Logger("Boltzmann Analyser");
	TextEditorEvents.registerOnDidChange(logger);
	HighlightCommand.register(context, logger);
}

export function deactivate() {}
