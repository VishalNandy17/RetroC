import * as vscode from 'vscode';

function ensureRevertHelper(text: string): { newText: string; added: boolean } {
	if (/\bfunction\s+_revertMsg\s*\(/.test(text)) return { newText: text, added: false };
	const contractIdx = text.search(/contract\s+\w+\s*(?:is\s+[^\{]+)?\{/);
	if (contractIdx === -1) return { newText: text, added: false };
	const nextContract = text.indexOf('contract', contractIdx + 1);
	const insertPos = nextContract === -1 ? text.lastIndexOf('}') : text.lastIndexOf('}', nextContract);
	if (insertPos === -1) return { newText: text, added: false };
	const helper = `\n    function _revertMsg(bytes memory returndata) internal pure returns (string memory) {\n        if (returndata.length < 68) return "Low-level call reverted";\n        assembly { returndata := add(returndata, 0x04) }\n        return abi.decode(returndata, (string));\n    }\n`;
	const newText = text.slice(0, insertPos) + helper + text.slice(insertPos);
	return { newText, added: true };
}

function rewriteLowLevelCalls(text: string): { newText: string; count: number } {
	let count = 0;
	const re = /([A-Za-z0-9_().\[\]]+)\s*\.\s*(call\s*(\{[^}]*\})?\s*\([^;]*\)|transfer\s*\([^;]*\)|send\s*\([^;]*\))/g;
	const rewritten = text.replace(re, (m, receiver, op) => {
		if (/^\s*\(\s*bool\s*,?\s*bytes?/m.test(m)) return m;
		if (/transfer\s*\(/.test(op)) {
			const arg = op.match(/transfer\s*\(([^)]*)\)/)?.[1]?.trim() ?? '0';
			count++;
			return `(bool success, bytes memory data) = payable(${receiver}).call{value: ${arg}}(\"\"); require(success, _revertMsg(data));`;
		}
		if (/send\s*\(/.test(op)) {
			const arg = op.match(/send\s*\(([^)]*)\)/)?.[1]?.trim() ?? '0';
			count++;
			return `(bool success, bytes memory data) = payable(${receiver}).call{value: ${arg}}(\"\"); require(success, _revertMsg(data));`;
		}
		const valuePart = op.match(/call\s*\{([^}]*)\}/)?.[1];
		const argsPart = op.match(/call\s*(?:\{[^}]*\})?\s*\(([\s\S]*?)\)/)?.[1]?.trim() ?? '';
		const callValue = valuePart ? `{${valuePart}}` : '';
		const payload = argsPart.length ? argsPart : '""';
		count++;
		return `(bool success, bytes memory data) = ${receiver}.call${callValue}(${payload}); require(success, _revertMsg(data));`;
	});
	return { newText: rewritten, count };
}

export async function fixLowLevelCallsInCurrentFile(): Promise<void> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { vscode.window.showWarningMessage('RetroC: No active editor to fix.'); return; }
	const doc = editor.document;
	if (!doc.fileName.endsWith('.sol')) { vscode.window.showWarningMessage('RetroC: Open a Solidity (.sol) file to apply low-level call fixes.'); return; }

	const original = doc.getText();
	const { newText: withHelper, added } = ensureRevertHelper(original);
	const { newText: rewritten, count } = rewriteLowLevelCalls(withHelper);

	if (rewritten === original) { vscode.window.showInformationMessage('RetroC: No low-level call rewrites necessary.'); return; }

	const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(original.length));
	await editor.edit((eb) => eb.replace(fullRange, rewritten));
	vscode.window.showInformationMessage(`RetroC: Rewrote ${count} low-level call(s)${added ? ' and added _revertMsg()' : ''}.`);
}


