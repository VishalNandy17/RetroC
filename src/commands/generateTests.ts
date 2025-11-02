import * as vscode from 'vscode';
import { getDefaultSettings } from '../config/settings';
import { isNonEmpty, isValidSolidityIdentifier } from '../utils/validator';
import { error } from '../utils/logger';
import { generateBasicHardhatTest, generateBasicFoundryTest } from '../generators/testGenerator';
import { writeTextFile } from '../utils/fileWriter';

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

    if (settings.testFramework === 'foundry') {
      await generateBasicFoundryTest(contract);
      vscode.window.showInformationMessage(`RetroC: Created Foundry test ${contract}.t.sol`);
    } else {
      await generateBasicHardhatTest(contract, settings.useTypeScript);
      const ext = settings.useTypeScript ? 'ts' : 'js';
      vscode.window.showInformationMessage(`RetroC: Created test ${contract}.test.${ext}`);
    }
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


