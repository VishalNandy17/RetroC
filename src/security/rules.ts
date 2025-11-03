import * as vscode from 'vscode';

export interface SecurityIssue {
	ruleId: string;
	message: string;
	severity: vscode.DiagnosticSeverity;
	fileUri: vscode.Uri;
	range: vscode.Range;
	fix?: {
		title: string;
		kind: 'reentrancy.guard' | 'txorigin.replace' | 'selfdestruct.block' | 'delegatecall.block' | 'unchecked.call.check';
		data?: any;
	};
}

export interface RuleContext {
	document: vscode.TextDocument;
	text: string;
	lines: string[];
}

type Rule = (ctx: RuleContext) => SecurityIssue[];

function findAll(regex: RegExp, text: string): RegExpExecArray[] {
	const flags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
	const re = new RegExp(regex.source, flags);
	const results: RegExpExecArray[] = [];
	let m: RegExpExecArray | null;
	while ((m = re.exec(text))) results.push(m);
	return results;
}

function toRange(doc: vscode.TextDocument, startIdx: number, endIdx: number): vscode.Range {
	const start = doc.positionAt(startIdx);
	const end = doc.positionAt(endIdx);
	return new vscode.Range(start, end);
}

const noTxOrigin: Rule = (ctx) => {
	const out: SecurityIssue[] = [];
	for (const m of findAll(/\btx\.origin\b/g, ctx.text)) {
		out.push({
			ruleId: 'no-tx-origin',
			message: 'Avoid tx.origin for authorization. Use msg.sender and proper access control.',
			severity: vscode.DiagnosticSeverity.Error,
			fileUri: ctx.document.uri,
			range: toRange(ctx.document, m.index, m.index + m[0].length),
			fix: { title: 'Replace tx.origin with msg.sender', kind: 'txorigin.replace' },
		});
	}
	return out;
};

const noSelfDestruct: Rule = (ctx) => {
	const out: SecurityIssue[] = [];
	for (const m of findAll(/\bselfdestruct\s*\(/g, ctx.text)) {
		out.push({
			ruleId: 'no-selfdestruct',
			message: 'Avoid selfdestruct. Consider disabling or gating behind strict governance.',
			severity: vscode.DiagnosticSeverity.Warning,
			fileUri: ctx.document.uri,
			range: toRange(ctx.document, m.index, m.index + m[0].length),
			fix: { title: 'Comment out selfdestruct', kind: 'selfdestruct.block' },
		});
	}
	return out;
};

const noDelegateCall: Rule = (ctx) => {
	const out: SecurityIssue[] = [];
	for (const m of findAll(/\.\s*delegatecall\s*\(/g, ctx.text)) {
		out.push({
			ruleId: 'no-delegatecall',
			message: 'delegatecall is dangerous; ensure strict target and storage layout.',
			severity: vscode.DiagnosticSeverity.Warning,
			fileUri: ctx.document.uri,
			range: toRange(ctx.document, m.index, m.index + m[0].length),
			fix: { title: 'Comment out delegatecall', kind: 'delegatecall.block' },
		});
	}
	return out;
};

const uncheckedLowLevelCall: Rule = (ctx) => {
	const out: SecurityIssue[] = [];
	for (const m of findAll(/\.\s*call(\s*\{[^}]*\})?\s*\([^)]*\)/g, ctx.text)) {
		const stmtStart = ctx.text.lastIndexOf('\n', m.index) + 1;
		const stmtEnd = ctx.text.indexOf(';', m.index);
		const stmt = ctx.text.slice(stmtStart, stmtEnd === -1 ? m.index + m[0].length : stmtEnd + 1);
		if (!/^\s*\(\s*bool\s*,?/m.test(stmt) && !/^\s*bool\s+success\s*=/.test(stmt)) {
			out.push({
				ruleId: 'unchecked-call',
				message: 'Low-level call without checking returned success. Capture (bool success,) and require(success).',
				severity: vscode.DiagnosticSeverity.Warning,
				fileUri: ctx.document.uri,
				range: toRange(ctx.document, m.index, m.index + m[0].length),
				fix: { title: 'Capture and check call success', kind: 'unchecked.call.check' },
			});
		}
	}
	return out;
};

const naiveReentrancy: Rule = (ctx) => {
	const out: SecurityIssue[] = [];
	const funcRe = /function\s+[\w$]*\s*\([^)]*\)\s*(?:public|external)(?:\s+(?:payable|nonReentrant|only\w+))*\s*{([\s\S]*?)}/g;
	let m: RegExpExecArray | null;
	while ((m = funcRe.exec(ctx.text))) {
		const body = m[1];
		const startIdx = m.index;
		const externalCall = /(\.call(\s*\{[^}]*\})?\s*\(|\.transfer\s*\(|\.send\s*\()/g.exec(body);
		if (externalCall) {
			const callPos = startIdx + externalCall.index;
			const after = body.slice(externalCall.index);
			if (/(^|\s)(\w+)\s*=\s*[^=]/m.test(after)) {
				out.push({
					ruleId: 'reentrancy-naive',
					message: 'Possible reentrancy: external call before state update. Use checks-effects-interactions and nonReentrant.',
					severity: vscode.DiagnosticSeverity.Warning,
					fileUri: ctx.document.uri,
					range: toRange(ctx.document, callPos, callPos + externalCall[0].length),
					fix: { title: 'Add ReentrancyGuard and nonReentrant', kind: 'reentrancy.guard' },
				});
			}
		}
	}
	return out;
};

export const ALL_RULES: Rule[] = [
	noTxOrigin,
	noSelfDestruct,
	noDelegateCall,
	uncheckedLowLevelCall,
	naiveReentrancy,
];


