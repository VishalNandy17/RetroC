import * as vscode from 'vscode';
import { getDefaultSettings } from '../config/settings';

export async function insertHeader() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return vscode.window.showWarningMessage('RetroC: No active editor');
	const doc = editor.document;

	if (doc.languageId !== 'solidity' && !doc.fileName.endsWith('.sol')) {
		return vscode.window.showWarningMessage('RetroC: Open a Solidity (.sol) file to insert header');
	}

	const { defaultLicense, defaultSolidityVersion } = getDefaultSettings();
	const header = `// SPDX-License-Identifier: ${defaultLicense}\npragma solidity ^${defaultSolidityVersion};\n\n`;

	await editor.edit((eb) => eb.insert(new vscode.Position(0, 0), header));
	vscode.window.showInformationMessage('RetroC: Inserted SPDX license and pragma header');
}


