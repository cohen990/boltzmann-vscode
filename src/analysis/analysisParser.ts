import { Position, Range } from "vscode";
import { readJsonFromFile } from "../adapters/io";

export type AnalysisNode = {
	complexity: number
	range: Range
}

export type Analysis = {
	nodes: AnalysisNode[]
	maximumComplexity: number
	minimumComplexity: number
}

export function parseAnalysis(path: string): Analysis{
    const analysis = readJsonFromFile(path);

	let analysisNodes: AnalysisNode[] = [];
	let maximumComplexity = 0;
	let minimumComplexity = Number.MAX_SAFE_INTEGER;

	for(const node of analysis.tree.nodes){
		let start = new Position(node.syntax_span.start_row, node.syntax_span.start_column);
		let end = new Position(node.syntax_span.end_row, node.syntax_span.end_column);
		if(start.character === end.character && start.line === end.line){
			continue;
		}
		analysisNodes.push(
			{
				complexity: node.local_complexity,
				range: new Range(start, end)
			}
		);

		if (node.local_complexity > maximumComplexity)
		{
			maximumComplexity = node.local_complexity;
		}
		
		if (node.local_complexity < minimumComplexity)
		{
			minimumComplexity = node.local_complexity;
		}
	}

	return { nodes: analysisNodes, maximumComplexity, minimumComplexity };
};
