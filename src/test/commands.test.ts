import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

describe('Commands', () => {
  it('generates ERC20 contract file', async () => {
    const ws = vscode.workspace.workspaceFolders?.[0];
    assert.ok(ws, 'No workspace folder open');

    const tokenName = 'TestToken';

    const showInputBox = vscode.window.showInputBox;
    let step = 0;
    // mock sequential prompts
    (vscode.window.showInputBox as unknown as any) = async () => {
      step++;
      if (step === 1) return tokenName; // name
      if (step === 2) return 'TTK'; // symbol
      if (step === 3) return '1000000'; // supply
      return undefined;
    };

    try {
      await vscode.commands.executeCommand('retroc.generateERC20');
      const filePath = path.join(ws.uri.fsPath, 'contracts', `${tokenName}.sol`);
      const exists = fs.existsSync(filePath);
      assert.ok(exists, 'Expected generated contract file not found');
    } finally {
      // restore
      (vscode.window.showInputBox as unknown as any) = showInputBox;
    }
  });
});
