import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';
import { isNonEmpty, isPositiveIntegerString, isValidSolidityIdentifier } from '../utils/validator';
import { error } from '../utils/logger';

export async function generateERC20() {
  try {
    const settings = getDefaultSettings();
    
    const name = await vscode.window.showInputBox({ 
      prompt: 'Token Name', 
      placeHolder: 'MyToken',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Token name is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid token name. Must be a valid Solidity identifier.';
        return null;
      }
    });
    if (!name) return;

    const symbol = await vscode.window.showInputBox({ 
      prompt: 'Token Symbol', 
      placeHolder: 'MTK',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Token symbol is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid token symbol. Must be a valid Solidity identifier.';
        if (value.length > 10) return 'Token symbol should be 10 characters or less.';
        return null;
      }
    });
    if (!symbol) return;

    const initialSupply = await vscode.window.showInputBox({
      prompt: 'Initial Supply (whole units)',
      placeHolder: '1000000',
      value: '1000000',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Initial supply is required';
        if (!isPositiveIntegerString(value)) return 'Initial supply must be a positive integer';
        return null;
      }
    });
    if (!initialSupply) return;

    const placeholders = {
      LICENSE: settings.defaultLicense,
      SOLIDITY_VERSION: settings.defaultSolidityVersion,
      TOKEN_NAME: name,
      TOKEN_SYMBOL: symbol,
      INITIAL_SUPPLY: initialSupply,
    };

    await generateContract('tokens/erc20', `${name}.sol`, placeholders);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate ERC20 contract';
    error('Error generating ERC20 contract', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}


