import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';
import { isNonEmpty, isValidSolidityIdentifier } from '../utils/validator';
import { error } from '../utils/logger';

export async function generateERC1155() {
  try {
    const settings = getDefaultSettings();
    
    const name = await vscode.window.showInputBox({ 
      prompt: 'Base URI Name', 
      placeHolder: 'MyMulti',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Base URI name is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid name. Must be a valid Solidity identifier.';
        return null;
      }
    });
    if (!name) return;

    const placeholders = {
      LICENSE: settings.defaultLicense,
      SOLIDITY_VERSION: settings.defaultSolidityVersion,
      BASE_URI: name,
    };

    await generateContract('tokens/erc1155', `ERC1155_${name}.sol`, placeholders);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate ERC1155 contract';
    error('Error generating ERC1155 contract', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}


