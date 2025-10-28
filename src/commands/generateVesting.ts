import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';

export async function generateVesting() {
  const settings = getDefaultSettings();
  const name = await vscode.window.showInputBox({ prompt: 'Vesting Contract Name', placeHolder: 'MyVesting' });
  if (!name) return;

  const placeholders = {
    LICENSE: settings.defaultLicense,
    SOLIDITY_VERSION: settings.defaultSolidityVersion,
    VESTING_NAME: name,
  };

  await generateContract('defi/vesting', `${name}.sol`, placeholders);
}


