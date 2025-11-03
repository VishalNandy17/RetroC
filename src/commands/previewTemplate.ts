import * as vscode from 'vscode';
import * as path from 'path';
import { replacePlaceholders } from '../utils/placeholderReplacer';
import { getDefaultSettings } from '../config/settings';

async function readTemplate(relativePath: string): Promise<string> {
	const ext = vscode.extensions.getExtension('VishalNandy17.retroc');
	const extensionPath = ext?.extensionPath;
	const tries: string[] = [];

	if (extensionPath) {
		tries.push(path.join(extensionPath, 'dist', 'templates', `${relativePath}.template.sol`));
		tries.push(path.join(extensionPath, 'templates', `${relativePath}.template.sol`));
		tries.push(path.join(extensionPath, 'src', 'templates', `${relativePath}.template.sol`));
	}
	const ws = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	if (ws) {
		tries.push(path.join(ws, 'dist', 'templates', `${relativePath}.template.sol`));
		tries.push(path.join(ws, 'src', 'templates', `${relativePath}.template.sol`));
	}

	for (const p of tries) {
		try {
			const bytes = await vscode.workspace.fs.readFile(vscode.Uri.file(p));
			return Buffer.from(bytes).toString('utf8');
		} catch {
			// try next
		}
	}
	throw new Error(`Template not found: ${relativePath}\nTried:\n${tries.join('\n')}`);
}

export async function previewTemplate() {
	const templates = [
		{ label: 'ERC20', id: 'tokens/erc20' },
		{ label: 'ERC721', id: 'tokens/erc721' },
		{ label: 'ERC1155', id: 'tokens/erc1155' },
		{ label: 'DAO', id: 'governance/dao' },
		{ label: 'Multisig', id: 'governance/multisig' },
		{ label: 'Staking', id: 'defi/staking' },
		{ label: 'Vesting', id: 'defi/vesting' },
	];

	const pick = await vscode.window.showQuickPick(templates, { placeHolder: 'Select a template to preview' });
	if (!pick) return;

	const settings = getDefaultSettings();
	const tpl = await readTemplate(pick.id);

	const resolved = replacePlaceholders(tpl, {
		LICENSE: settings.defaultLicense,
		SOLIDITY_VERSION: settings.defaultSolidityVersion,
		INCLUDE_PAUSABLE: settings.includePausable ? 'true' : 'false',
		INCLUDE_ACCESS_CONTROL: settings.includeAccessControl ? 'true' : 'false',
		INCLUDE_REENTRANCY_GUARD: settings.includeReentrancyGuard ? 'true' : 'false',
		INCLUDE_NATSPEC: settings.includeNatSpec ? 'true' : 'false',
		ENABLE_GAS_OPTIMIZATIONS: settings.enableGasOptimizations ? 'true' : 'false',
	});

	const doc = await vscode.workspace.openTextDocument({ content: resolved, language: 'solidity' });
	await vscode.window.showTextDocument(doc, { preview: true });
}


