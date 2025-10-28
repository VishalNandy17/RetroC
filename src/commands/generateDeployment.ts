import * as vscode from 'vscode';
import { generateDeploymentScript } from '../generators/deploymentGenerator';

export async function generateDeployment() {
  const name = await vscode.window.showInputBox({ prompt: 'Contract name (without .sol)' });
  if (!name) return;
  await generateDeploymentScript(name);
  vscode.window.showInformationMessage(`RetroC: Created deployment script for ${name}`);
}


