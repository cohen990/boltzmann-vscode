import { parseAnalysis } from "../analysis/analysisParser";
import { generateHighlights } from "../highlights/highlights";
import { analyseFile } from "../analysis/file";
import { Logger } from "../logger";
import { Highlight } from "../highlights/highlightsSingleton";
import { Option} from "../option";

export const analyseAndDecorate: (logger: Logger) => Option<Highlight[]> = (logger: Logger) => {
	const analysisPath = analyseFile(logger);
	logger.info("Analysing", analysisPath);
	let analysis = analysisPath.then(
		(inner) => {
			logger.debug("Parsing analysis", analysisPath);
			return parseAnalysis(inner);
		}
	);
	return analysis.then(
		(inner) => {
			logger.debug("Generating Highlights", inner);
			return generateHighlights(inner, logger);
		}
	);
};
