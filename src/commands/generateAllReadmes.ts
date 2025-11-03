import * as vscode from 'vscode';
import * as path from 'path';
import { generateContractReadme } from '../generators/readmeGenerator';
import { getDefaultSettings } from '../config/settings';

export async function generateAllReadmes() {
	const settings = getDefaultSettings();
	const folders = vscode.workspace.workspaceFolders;
	if (!folders || !folders.length) {
		return vscode.window.showWarningMessage('RetroC: Open a workspace to run this command.');
	}
	const root = folders[0].uri;
	const contractsDir = vscode.Uri.joinPath(root, settings.contractsDirectory);

	try {
		const entries = await vscode.workspace.fs.readDirectory(contractsDir);
		const solFiles = entries
			.filter(([name, type]) => type === vscode.FileType.File && name.toLowerCase().endsWith('.sol'))
			.map(([name]) => name);

		if (!solFiles.length) {
			return vscode.window.showInformationMessage(`RetroC: No .sol files found in ${settings.contractsDirectory}`);
		}

		for (const file of solFiles) {
			const baseName = file.replace(/\.sol$/i, '');
			await generateContractReadme(baseName, file);
		}
		vscode.window.showInformationMessage(`RetroC: Generated ${solFiles.length} README(s) in ${settings.contractsDirectory}`);
	} catch (err) {
		vscode.window.showErrorMessage(`RetroC: Failed to generate READMEs: ${err instanceof Error ? err.message : 'Unknown error'}`);
	}
}


