import * as vscode from 'vscode';
import * as path from 'path';
import { generateContractReadme } from '../generators/readmeGenerator';
import { getDefaultSettings } from '../config/settings';

export async function generateReadmeForCurrent() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return vscode.window.showWarningMessage('RetroC: No active editor');

	const doc = editor.document;
	if (doc.languageId !== 'solidity' && !doc.fileName.endsWith('.sol')) {
		return vscode.window.showWarningMessage('RetroC: Open a Solidity (.sol) file to generate README');
	}

	const fileName = path.basename(doc.fileName);
	const baseName = fileName.replace(/\.sol$/i, '');
	const settings = getDefaultSettings();

	try {
		await generateContractReadme(baseName, fileName);
		vscode.window.showInformationMessage(`RetroC: README generated for ${fileName} (contracts/${baseName}.md)`);
	} catch (err) {
		vscode.window.showErrorMessage(`RetroC: Failed to generate README: ${err instanceof Error ? err.message : 'Unknown error'}`);
	}
}


