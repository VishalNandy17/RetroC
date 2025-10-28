import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';

export async function generateStaking() {
  const settings = getDefaultSettings();
  const name = await vscode.window.showInputBox({ prompt: 'Staking Contract Name', placeHolder: 'MyStaking' });
  if (!name) return;

  const placeholders = {
    LICENSE: settings.defaultLicense,
    SOLIDITY_VERSION: settings.defaultSolidityVersion,
    STAKING_NAME: name,
  };

  await generateContract('defi/staking', `${name}.sol`, placeholders);
}


