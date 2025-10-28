import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';

export async function generateMultisig() {
  const settings = getDefaultSettings();
  const name = await vscode.window.showInputBox({ prompt: 'Wallet Name', placeHolder: 'MyMultisig' });
  if (!name) return;

  const placeholders = {
    LICENSE: settings.defaultLicense,
    SOLIDITY_VERSION: settings.defaultSolidityVersion,
    WALLET_NAME: name,
  };

  await generateContract('governance/multisig', `${name}Wallet.sol`, placeholders);
}


