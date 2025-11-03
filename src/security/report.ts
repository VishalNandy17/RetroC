import * as vscode from 'vscode';
import { scanWorkspaceSecurity, scanCurrentFileSecurity } from './scanner';

export async function showSecurityReportWorkspace() {
	const count = await scanWorkspaceSecurity();
	await showScore('workspace', count);
}

export async function showSecurityReportCurrent() {
	const count = await scanCurrentFileSecurity();
	await showScore('current file', count);
}

async function showScore(scope: string, issues: number) {
	const score = Math.max(10, 100 - Math.min(issues * 10, 90));
	const status = score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 60 ? 'Fair' : 'Needs Attention';
	const msg = `RetroC Security (${scope}): ${score}% — ${status} (${issues} issue${issues === 1 ? '' : 's'})`;
	vscode.window.showInformationMessage(msg);
}


