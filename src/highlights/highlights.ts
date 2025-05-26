import { window } from "vscode";
import { Analysis } from "../analysis/analysisParser";
import { Logger } from "../logger";
import { Highlight } from "./highlightsSingleton";

export function generateHighlights(analysis: Analysis, logger: Logger) {
	let decorations: Highlight[] = [];

	for (const token of analysis.nodes) {
		let normalised_complexity = (token.complexity - analysis.minimumComplexity) / (analysis.maximumComplexity - analysis.minimumComplexity);
		if (normalised_complexity === 0) { continue; }

		let red = Math.round(255 * normalised_complexity);
		let green = Math.round(255 * (1 - normalised_complexity));
		let alpha = Math.round(30 * normalised_complexity);
		if (alpha > 30) {
			logger.info(`Setting alpha: ${alpha}`);
		}
		const backgroundColor = `#${toHex(red)}${toHex(green)}00${toHex(alpha)}`;
		logger.info(backgroundColor);
		const decoration = window.createTextEditorDecorationType({
			backgroundColor
		});
		decorations.push({ decoration, range: token.range });
	}

	return decorations;
}

function toHex(decimal: number): string {
	const hex = decimal.toString(16);
	if(hex.length === 1){
		return `0${hex}`;
	}

	return hex;
}