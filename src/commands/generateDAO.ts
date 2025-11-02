import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';
import { isNonEmpty, isValidSolidityIdentifier, isValidEthereumAddress } from '../utils/validator';
import { error } from '../utils/logger';

export async function generateDAO() {
  try {
    const settings = getDefaultSettings();
    
    const name = await vscode.window.showInputBox({ 
      prompt: 'DAO Name', 
      placeHolder: 'MyDAO',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'DAO name is required';
        if (!isValidSolidityIdentifier(value)) return 'Invalid DAO name. Must be a valid Solidity identifier.';
        return null;
      }
    });
    if (!name) return;

    const votesToken = await vscode.window.showInputBox({
      prompt: 'IVotes token address (governance token)',
      placeHolder: '0x...',
      validateInput: (value) => {
        if (!isNonEmpty(value)) return 'Token address is required';
        if (!isValidEthereumAddress(value)) return 'Invalid Ethereum address. Must be a 40-character hex string starting with 0x.';
        return null;
      }
    });
    if (!votesToken) return;

    const placeholders = {
      LICENSE: settings.defaultLicense,
      SOLIDITY_VERSION: settings.defaultSolidityVersion,
      DAO_NAME: name,
      VOTES_TOKEN: votesToken,
    };

    await generateContract('governance/dao', `${name}DAO.sol`, placeholders);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate DAO contract';
    error('Error generating DAO contract', err);
    vscode.window.showErrorMessage(`RetroC: ${message}`);
  }
}


