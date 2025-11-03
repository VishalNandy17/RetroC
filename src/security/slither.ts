import * as vscode from 'vscode';
import { exec } from 'child_process';

export interface SlitherFinding {
	check: string;
	impact: string;
	confidence: string;
	description: string;
	first_markdown_element?: string;
	source_mapping?: {
		filename: string;
		line: number;
		column?: number;
	};
}

export async function runSlitherAndReport(): Promise<number> {
	return new Promise<number>((resolve) => {
		const ws = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!ws) {
			vscode.window.showWarningMessage('RetroC: Open a workspace to run Slither.');
			return resolve(0);
		}
		const cmd = 'slither . --json -';
		exec(cmd, { cwd: ws, maxBuffer: 10 * 1024 * 1024 }, async (err, stdout, stderr) => {
			if (err && !stdout) {
				vscode.window.showErrorMessage(`RetroC: Slither failed: ${stderr || err.message}`);
				return resolve(0);
			}
			let json: any;
			try {
				json = JSON.parse(stdout);
			} catch (e) {
				vscode.window.showErrorMessage('RetroC: Failed to parse Slither output. Ensure Slither is installed and JSON output is enabled.');
				return resolve(0);
			}
			const findings: any[] = json?.results?.detectors || [];
			const col = vscode.languages.createDiagnosticCollection('retroc-slither');
			const fileToDiags = new Map<string, vscode.Diagnostic[]>();
			for (const f of findings) {
				const elements: any[] = f?.elements || [];
				for (const el of elements) {
					const loc = el?.source_mapping;
					const filename: string | undefined = loc?.filename || el?.filename;
					if (!filename) continue;
					const abs = vscode.Uri.file(require('path').join(ws, filename));
					const doc = await vscode.workspace.openTextDocument(abs);
					const line = Math.max(0, (loc?.lines?.[0] ?? loc?.line ?? 1) - 1);
					const range = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(line, Number.MAX_SAFE_INTEGER));
					const severity = toSeverity(f.impact);
					const code = mapFindingToCode(f.check, f.description);
					const d = new vscode.Diagnostic(range, `[slither:${f.check}] ${f.description || f.check}`, severity);
					d.source = 'Slither';
					d.code = code;
					const list = fileToDiags.get(abs.fsPath) || [];
					list.push(d);
					fileToDiags.set(abs.fsPath, list);
				}
			}
			for (const [file, diags] of fileToDiags) {
				col.set(vscode.Uri.file(file), diags);
			}
			const total = findings.length;
			vscode.window.showInformationMessage(`RetroC: Slither analysis complete — ${total} finding(s).`);
			resolve(total);
		});
	});
}

function toSeverity(impact: string): vscode.DiagnosticSeverity {
	switch ((impact || '').toLowerCase()) {
		case 'high': return vscode.DiagnosticSeverity.Error;
		case 'medium': return vscode.DiagnosticSeverity.Warning;
		case 'low': return vscode.DiagnosticSeverity.Information;
		default: return vscode.DiagnosticSeverity.Hint;
	}
}

function mapFindingToCode(check: string, description: string): string {
	const d = `${check} ${description}`.toLowerCase();
	if (d.includes('tx.origin')) return 'retroc:txorigin';
	if (d.includes('delegatecall')) return 'retroc:delegatecall';
	if (d.includes('selfdestruct') || d.includes('suicide')) return 'retroc:selfdestruct';
	if (d.includes('reentrancy')) return 'retroc:reentrancy';
	if (d.includes('low level call') || d.includes('.call(')) return 'retroc:unchecked-call';
	return `slither:${check}`;
}


