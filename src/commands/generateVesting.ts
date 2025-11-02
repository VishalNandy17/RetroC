import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';
import { isNonEmpty, isValidSolidityIdentifier } from '../utils/validator';
import { error } from '../utils/logger';

export async function generateVesting() {
  try {
    const settings = getDefaultSettings();
    
    const name = await vscode.window.showInputBox({ 
      prompt: 'Vesting Contract Name', 
      placeHolder: 'MyVesting',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Vesting contract name is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid contract name. Must be a valid Solidity identifier.';
        return null;
      }
    });
    if (!name) return;

    const placeholders = {
      LICENSE: settings.defaultLicense,
      SOLIDITY_VERSION: settings.defaultSolidityVersion,
      VESTING_NAME: name,
    };

    await generateContract('defi/vesting', `${name}.sol`, placeholders);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate Vesting contract';
    error('Error generating Vesting contract', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}


