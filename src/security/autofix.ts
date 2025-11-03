import * as vscode from 'vscode';

function ensureImportReentrancyGuard(text: string): { newText: string; added: boolean } {
	if (/import\s+['"]@openzeppelin\/contracts\/security\/ReentrancyGuard\.sol['"];/.test(text) ||
		/import\s+["']@openzeppelin\/contracts\/utils\/ReentrancyGuard\.sol["'];/.test(text) ||
		/contract\s+\w+\s+is\s+ReentrancyGuard/.test(text)) {
		return { newText: text, added: false };
	}
	const pragmaIdx = text.indexOf('pragma solidity');
	let insertPos = 0;
	if (pragmaIdx !== -1) {
		const semi = text.indexOf(';', pragmaIdx);
		insertPos = semi !== -1 ? semi + 1 : pragmaIdx;
	}
	const header = '\nimport "@openzeppelin/contracts/utils/ReentrancyGuard.sol";\n';
	const newText = text.slice(0, insertPos) + header + text.slice(insertPos);
	return { newText, added: true };
}

function addNonReentrantToFunctions(text: string): { newText: string; count: number } {
	let count = 0;
	const re = /function\s+([\w$]*)\s*\(([^)]*)\)\s*(public|external)([^{};]*)\{/g;
	const newText = text.replace(re, (m, name, args, vis, tail) => {
		if (/\bnonReentrant\b/.test(tail)) return m;
		count++;
		const injectedTail = tail.trim().length ? `${tail} nonReentrant` : ' nonReentrant';
		return `function ${name}(${args}) ${vis}${injectedTail}{`;
	});
	return { newText, count };
}

export async function applyReentrancyFixForCurrentFile(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { vscode.window.showWarningMessage('RetroC: No active editor to fix.'); return; }
	const doc = editor.document;
	if (!doc.fileName.endsWith('.sol')) { vscode.window.showWarningMessage('RetroC: Open a Solidity (.sol) file to apply fixes.'); return; }

	const original = doc.getText();
	const hasRiskyOp = /\.(call|transfer|send)\s*\(/.test(original);
	if (!hasRiskyOp) { vscode.window.showInformationMessage('RetroC: No risky external value transfer patterns detected in this file.'); return; }

	let { newText, added } = ensureImportReentrancyGuard(original);

	if (!/\bis\s+ReentrancyGuard\b/.test(newText)) {
		newText = newText.replace(/contract\s+(\w+)\s*(is\s*[^,{]*)?\{/, (m, name, inherit) => {
			if (inherit && inherit.trim()) {
				if (/\bReentrancyGuard\b/.test(inherit)) return m;
				return `contract ${name} ${inherit.trim().endsWith(',') ? inherit : inherit + ','} ReentrancyGuard{`;
			}
			return `contract ${name} is ReentrancyGuard{`;
		});
	}

	const res = addNonReentrantToFunctions(newText);

	if (newText === original) { vscode.window.showInformationMessage('RetroC: No changes required for reentrancy fix.'); return; }

	const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(original.length));
	await editor.edit((eb) => eb.replace(fullRange, newText));
	vscode.window.showInformationMessage(`RetroC: Applied reentrancy fixes (${res.count} function(s) updated${added ? ', import added' : ''}).`);
}

export async function applyTxOriginFixCurrent(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { vscode.window.showWarningMessage('RetroC: No active editor to fix.'); return; }
	const doc = editor.document;
	if (!doc.fileName.endsWith('.sol')) { vscode.window.showWarningMessage('RetroC: Open a Solidity (.sol) file to apply fixes.'); return; }
	const original = doc.getText();
	if (!/\btx\.origin\b/.test(original)) { vscode.window.showInformationMessage('RetroC: No tx.origin usages found.'); return; }
	const updated = original.replace(/\btx\.origin\b/g, 'msg.sender');
	const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(original.length));
	await editor.edit((eb) => eb.replace(fullRange, updated));
	vscode.window.showInformationMessage('RetroC: Replaced tx.origin with msg.sender. Review access control logic.');
}

export async function applyDelegatecallFixCurrent(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { vscode.window.showWarningMessage('RetroC: No active editor to fix.'); return; }
	const doc = editor.document;
	if (!doc.fileName.endsWith('.sol')) { vscode.window.showWarningMessage('RetroC: Open a Solidity (.sol) file to apply fixes.'); return; }
	const original = doc.getText();
	if (!/\.\s*delegatecall\s*\(/.test(original)) { vscode.window.showInformationMessage('RetroC: No delegatecall usages found.'); return; }
	const updated = original.replace(/(\.\s*delegatecall\s*\([^)]*\))/g, '/* $1 // BLOCKED BY RETROC: review proxy design */');
	const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(original.length));
	await editor.edit((eb) => eb.replace(fullRange, updated));
	vscode.window.showInformationMessage('RetroC: Commented out delegatecall occurrences.');
}

export async function applySelfdestructFixCurrent(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { vscode.window.showWarningMessage('RetroC: No active editor to fix.'); return; }
	const doc = editor.document;
	if (!doc.fileName.endsWith('.sol')) { vscode.window.showWarningMessage('RetroC: Open a Solidity (.sol) file to apply fixes.'); return; }
	const original = doc.getText();
	if (!/\bselfdestruct\s*\(/.test(original)) { vscode.window.showInformationMessage('RetroC: No selfdestruct usages found.'); return; }
	const updated = original.replace(/\bselfdestruct\s*\([^)]*\)\s*;/g, '/* selfdestruct(...) blocked by RetroC. Replace with controlled upgrade path. */');
	const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(original.length));
	await editor.edit((eb) => eb.replace(fullRange, updated));
	vscode.window.showInformationMessage('RetroC: Commented out selfdestruct occurrences.');
}


