import * as vscode from 'vscode';
import { generateDeploymentScript } from '../generators/deploymentGenerator';
import { isNonEmpty, isValidSolidityIdentifier } from '../utils/validator';
import { error } from '../utils/logger';

export async function generateDeployment() {
  try {
    const name = await vscode.window.showInputBox({ 
      prompt: 'Contract name (without .sol)',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Contract name is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid contract name. Must be a valid Solidity identifier.';
        return null;
      }
    });
    if (!name) return;
    
    await generateDeploymentScript(name);
    vscode.window.showInformationMessage(`RetroC: Created deployment script for ${name}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate deployment script';
    error('Error generating deployment script', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}


