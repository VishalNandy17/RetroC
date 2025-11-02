import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';
import { isNonEmpty, isValidSolidityIdentifier } from '../utils/validator';
import { error } from '../utils/logger';

export async function generateERC721() {
  try {
    const settings = getDefaultSettings();
    
    const name = await vscode.window.showInputBox({ 
      prompt: 'NFT Name', 
      placeHolder: 'MyNFT',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'NFT name is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid NFT name. Must be a valid Solidity identifier.';
        return null;
      }
    });
    if (!name) return;

    const symbol = await vscode.window.showInputBox({ 
      prompt: 'NFT Symbol', 
      placeHolder: 'MNFT',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'NFT symbol is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid NFT symbol. Must be a valid Solidity identifier.';
        if (value.length > 10) return 'NFT symbol should be 10 characters or less.';
        return null;
      }
    });
    if (!symbol) return;

    const placeholders = {
      LICENSE: settings.defaultLicense,
      SOLIDITY_VERSION: settings.defaultSolidityVersion,
      TOKEN_NAME: name,
      TOKEN_SYMBOL: symbol,
    };

    await generateContract('tokens/erc721', `${name}.sol`, placeholders);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate ERC721 contract';
    error('Error generating ERC721 contract', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}


