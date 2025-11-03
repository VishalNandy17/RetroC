import * as vscode from 'vscode';

const FIX_CODE_TO_COMMAND: Record<string, { command: string; title: string }> = {
	'retroc:txorigin': { command: 'retroc.fixTxOriginCurrent', title: 'Replace tx.origin with msg.sender' },
	'retroc:selfdestruct': { command: 'retroc.fixSelfdestructCurrent', title: 'Comment out selfdestruct' },
	'retroc:delegatecall': { command: 'retroc.fixDelegatecallCurrent', title: 'Comment out delegatecall' },
	'retroc:unchecked-call': { command: 'retroc.fixLowLevelCallCurrent', title: 'Rewrite to safe low-level call with revert bubbling' },
	'retroc:reentrancy': { command: 'retroc.fixReentrancyCurrent', title: 'Add ReentrancyGuard and nonReentrant' },
};

export class SecurityCodeActionsProvider implements vscode.CodeActionProvider {
	public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

	provideCodeActions(document: vscode.TextDocument, range: vscode.Range, context: vscode.CodeActionContext): vscode.CodeAction[] | undefined {
		const actions: vscode.CodeAction[] = [];
		for (const diag of context.diagnostics) {
			const codeVal = typeof diag.code === 'string' ? diag.code : (diag.code as any)?.value;
			if (!codeVal) continue;
			const mapping = FIX_CODE_TO_COMMAND[codeVal];
			if (!mapping) continue;
			const action = new vscode.CodeAction(mapping.title, vscode.CodeActionKind.QuickFix);
			action.command = { command: mapping.command, title: mapping.title };
			action.diagnostics = [diag];
			action.isPreferred = true;
			actions.push(action);
		}
		return actions;
	}
}

export function registerSecurityCodeActions(context: vscode.ExtensionContext) {
	const provider = new SecurityCodeActionsProvider();
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider({ language: 'solidity', scheme: 'file' }, provider, {
			providedCodeActionKinds: SecurityCodeActionsProvider.providedCodeActionKinds,
		})
	);
}


