import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';
import { isNonEmpty, isValidSolidityIdentifier } from '../utils/validator';
import { error } from '../utils/logger';

export async function generateMultisig() {
  try {
    const settings = getDefaultSettings();
    
    const name = await vscode.window.showInputBox({ 
      prompt: 'Wallet Name', 
      placeHolder: 'MyMultisig',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Wallet name is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid wallet name. Must be a valid Solidity identifier.';
        return null;
      }
    });
    if (!name) return;

    const placeholders = {
      LICENSE: settings.defaultLicense,
      SOLIDITY_VERSION: settings.defaultSolidityVersion,
      WALLET_NAME: name,
    };

    await generateContract('governance/multisig', `${name}Wallet.sol`, placeholders);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate Multisig contract';
    error('Error generating Multisig contract', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}


