import { window, workspace } from "vscode";
import { BOLTZMANN_STORAGE_PATH, executeAnalyser } from "../adapters/boltzmann";
import { Logger } from "../logger";
import { None, Option } from "../option";

export function analyseFile(logger: Logger): Option<string> {
	const currentlyOpenTabFilePath = window.activeTextEditor!.document.fileName;
	const folder = workspace.workspaceFolders![0].uri.path;

	if(currentlyOpenTabFilePath.indexOf(BOLTZMANN_STORAGE_PATH) > 0) {
		logger.info("Open file is within the boltzmann storage directory. Skipping Analysis", currentlyOpenTabFilePath);
		return None();
	}

	const filePath = currentlyOpenTabFilePath.substring(folder.length + 1);

	logger.info("Analysing file in folder", filePath, folder);
    return executeAnalyser({ folder, filePath }, logger).toOption();
}
