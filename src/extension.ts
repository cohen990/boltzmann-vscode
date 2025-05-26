// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { execSync } from 'child_process';
import { closeSync, openSync, readFileSync } from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const outputChannel = vscode.window.createOutputChannel("banana");
	let decorations: { decoration: vscode.TextEditorDecorationType, range: vscode.Range }[] = [];

	vscode.window.onDidChangeVisibleTextEditors((event) => {
		if(event.length > 1) {
			decorations.forEach(decoration => decoration.decoration.dispose());
			decorations = analyseAndDecorate(outputChannel);
			decorations.forEach(x => event[1].setDecorations(x.decoration, [x.range]));
		}
	});

	vscode.window.onDidChangeVisibleTextEditors((event) => {
		if(event.length > 1) {
			outputChannel.appendLine("test")
			outputChannel.appendLine(JSON.stringify(event));
			decorations.forEach(decoration => decoration.decoration.dispose());
			decorations = analyseAndDecorate(outputChannel);
			decorations.forEach(x => event[1].setDecorations(x.decoration, [x.range]));
		}
	});

	const decorateCommand = vscode.commands.registerTextEditorCommand('banana.decorate', (textEditor: vscode.TextEditor) => {
		decorations.forEach(decoration => decoration.decoration.dispose());
		decorations = analyseAndDecorate(outputChannel);
		decorations.forEach(x => textEditor.setDecorations(x.decoration, [x.range]));
	});

	context.subscriptions.push(decorateCommand);
}


type Token = {
	complexity: number
	range: vscode.Range
}

type Analysis = {
	tokens: Token[]
	maximum_complexity: number
	minimum_complexity: number
}

function analyseAndDecorate(outputChannel: vscode.OutputChannel) {
	const analysis_path = analyseFile();
	let analysis = parseAnalysis(analysis_path);
	return generateDecorations(analysis, outputChannel);
}

function generateDecorations(analysis: Analysis, outputChannel: vscode.OutputChannel) {
	let decorations = [];

	for (const token of analysis.tokens) {
		let normalised_complexity = (token.complexity - analysis.minimum_complexity) / (analysis.maximum_complexity - analysis.minimum_complexity);
		if (normalised_complexity === 0) { continue; }

		let red = Math.round(255 * normalised_complexity);
		let green = Math.round(255 * (1 - normalised_complexity));
		let alpha = Math.round(30 * normalised_complexity);
		if (alpha > 30) {
			outputChannel.appendLine(`Setting alpha: ${alpha}`);
		}
		const backgroundColor = `#${red.toString(16)}${green.toString(16)}00${alpha.toString(16)}`;
		const decoration = vscode.window.createTextEditorDecorationType({
			backgroundColor
		});
		decorations.push({ decoration, range: token.range });
	}

	return decorations;
}

function analyseFile() {
	const currentlyOpenTabfilePath = vscode.window.activeTextEditor!.document.fileName;
	const folder = vscode.workspace.workspaceFolders![0].uri.path;
	const filePath = currentlyOpenTabfilePath.substring(folder.length + 1);
	const executable = '/home/samanthacohen/git/boltzmann/target/debug/boltzmann_analyser';
	const command = `${executable} file ${folder} ${filePath} ${folder}`;
	execSync(command);

	const analysis_path = `${folder}/.boltzmann/${filePath}`;
	return analysis_path;
}

function parseAnalysis(path: string): Analysis{
	const fileDescriptor = openSync(path, 'r');
	const analysis_raw = readFileSync(fileDescriptor);
	closeSync(fileDescriptor);
	const decoded = new TextDecoder("utf-8").decode(analysis_raw);
	const analysis = JSON.parse(decoded);

	let tokens: Token[] = [];
	let maximum_complexity = 0;
	let minimum_complexity = 100000;
	for(const node of analysis.tree.nodes){
		let start = new vscode.Position(node.syntax_span.start_row, node.syntax_span.start_column);
		let end = new vscode.Position(node.syntax_span.end_row, node.syntax_span.end_column);
		if(start.character === end.character && start.line === end.line){
			continue;
		}
		tokens.push(
			{
				complexity: node.local_complexity,
				range: new vscode.Range(start, end)
			}
		);

		if (node.local_complexity > maximum_complexity)
		{
			maximum_complexity = node.local_complexity;
		}
		
		if (node.local_complexity < minimum_complexity)
		{
			minimum_complexity = node.local_complexity;
		}
	}

	return { tokens, maximum_complexity, minimum_complexity };
};

// This method is called when your extension is deactivated
export function deactivate() {}
