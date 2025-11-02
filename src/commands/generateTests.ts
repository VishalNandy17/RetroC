import * as vscode from 'vscode';
import { writeTextFile } from '../utils/fileWriter';
import { getDefaultSettings } from '../config/settings';
import { isNonEmpty, isValidSolidityIdentifier } from '../utils/validator';
import { error } from '../utils/logger';

export async function generateTests() {
  try {
    const settings = getDefaultSettings();
    
    const contract = await vscode.window.showInputBox({ 
      prompt: 'Contract name (without .sol)',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Contract name is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid contract name. Must be a valid Solidity identifier.';
        return null;
      }
    });
    if (!contract) return;

    const ext = settings.useTypeScript ? 'ts' : 'js';
    const content = `import { expect } from 'chai';\n\ndescribe('${contract}', () => {\n  it('deploys', async () => {\n    expect(true).to.eq(true);\n  });\n});\n`;
    await writeTextFile(`${contract}.test.${ext}`, content, 'test');
    vscode.window.showInformationMessage(`RetroC: Created test ${contract}.test.${ext}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate test file';
    error('Error generating test file', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}

export async function generateAllTests() {
  try {
    const ws = vscode.workspace.workspaceFolders?.[0];
    if (!ws) {
      vscode.window.showWarningMessage('Open a workspace to generate tests');
      return;
    }
    await writeTextFile(`example.test.ts`, `describe('example', ()=>{});\n`, 'test');
    vscode.window.showInformationMessage('RetroC: Generated baseline tests');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate tests';
    error('Error generating tests', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}


