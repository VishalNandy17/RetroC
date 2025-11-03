import * as vscode from 'vscode';
import { ALL_RULES, SecurityIssue, RuleContext } from './rules';

export async function scanWorkspaceSecurity(): Promise<number> {
	const folders = vscode.workspace.workspaceFolders;
	if (!folders || !folders.length) {
		vscode.window.showWarningMessage('RetroC: Open a workspace to run security scan.');
		return 0;
	}

	const col = vscode.languages.createDiagnosticCollection('retroc-security');
	const uris = await vscode.workspace.findFiles('**/*.sol', '**/node_modules/**');

	let total = 0;
	for (const uri of uris) {
		const doc = await vscode.workspace.openTextDocument(uri);
		const text = doc.getText();
		const ctx: RuleContext = { document: doc, text, lines: text.split('\n') };

		const diags: vscode.Diagnostic[] = [];
		for (const rule of ALL_RULES) {
			const issues: SecurityIssue[] = rule(ctx);
			total += issues.length;
      for (const issue of issues) {
				const d = new vscode.Diagnostic(issue.range, `[${issue.ruleId}] ${issue.message}`, issue.severity);
				d.source = 'RetroC Security';
        if (issue.fix) {
          switch (issue.fix.kind) {
            case 'txorigin.replace': d.code = 'retroc:txorigin'; break;
            case 'selfdestruct.block': d.code = 'retroc:selfdestruct'; break;
            case 'delegatecall.block': d.code = 'retroc:delegatecall'; break;
            case 'unchecked.call.check': d.code = 'retroc:unchecked-call'; break;
            case 'reentrancy.guard': d.code = 'retroc:reentrancy'; break;
          }
        }
				diags.push(d);
			}
		}
		col.set(uri, diags);
	}

	vscode.window.showInformationMessage(`RetroC: Security scan complete — ${total} issue(s) found.`);
	return total;
}

export async function scanCurrentFileSecurity(): Promise<number> {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage('RetroC: No active editor for security scan.');
		return 0;
	}
	const doc = editor.document;
	if (!doc.fileName.endsWith('.sol')) {
		vscode.window.showWarningMessage('RetroC: Open a Solidity (.sol) file to run security scan.');
		return 0;
	}

	const col = vscode.languages.createDiagnosticCollection('retroc-security');
	const text = doc.getText();
	const ctx: RuleContext = { document: doc, text, lines: text.split('\n') };

	const diags: vscode.Diagnostic[] = [];
	let total = 0;
	for (const rule of ALL_RULES) {
		const issues = rule(ctx);
		total += issues.length;
		for (const issue of issues) {
			const d = new vscode.Diagnostic(issue.range, `[${issue.ruleId}] ${issue.message}`, issue.severity);
			d.source = 'RetroC Security';
			(d as any).__retrocFix = issue.fix;
			diags.push(d);
		}
	}
	col.set(doc.uri, diags);
	vscode.window.showInformationMessage(`RetroC: Security scan (current file) — ${total} issue(s) found.`);
	return total;
}


