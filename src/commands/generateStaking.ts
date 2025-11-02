import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';
import { isNonEmpty, isValidSolidityIdentifier } from '../utils/validator';
import { error } from '../utils/logger';

export async function generateStaking() {
  try {
    const settings = getDefaultSettings();
    
    const name = await vscode.window.showInputBox({ 
      prompt: 'Staking Contract Name', 
      placeHolder: 'MyStaking',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Staking contract name is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid contract name. Must be a valid Solidity identifier.';
        return null;
      }
    });
    if (!name) return;

    const placeholders = {
      LICENSE: settings.defaultLicense,
      SOLIDITY_VERSION: settings.defaultSolidityVersion,
      STAKING_NAME: name,
    };

    await generateContract('defi/staking', `${name}.sol`, placeholders);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate Staking contract';
    error('Error generating Staking contract', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}


