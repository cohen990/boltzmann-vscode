import { ExtensionContext } from 'vscode';
import { Logger } from './logger';
import { HighlightCommand } from './handlers/highlightCommand';
import { TextEditorEvents } from './handlers/textEditorEvents';
import { WorkspaceEvents } from './handlers/workspaceEvents';

export function activate(context: ExtensionContext) {
	const logger = new Logger("Boltzmann Analyser");
	TextEditorEvents.registerOnDidChange(logger);
	WorkspaceEvents.registerOnDidSaveTextDocument(logger);
	HighlightCommand.registerEnable(context, logger);
	HighlightCommand.registerDisable(context, logger);
}

export function deactivate() {}
