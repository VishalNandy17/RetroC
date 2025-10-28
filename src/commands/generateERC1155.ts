import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';

export async function generateERC1155() {
  const settings = getDefaultSettings();
  const name = await vscode.window.showInputBox({ prompt: 'Base URI Name', placeHolder: 'MyMulti' });
  if (!name) return;

  const placeholders = {
    LICENSE: settings.defaultLicense,
    SOLIDITY_VERSION: settings.defaultSolidityVersion,
    BASE_URI: name,
  };

  await generateContract('tokens/erc1155', `ERC1155_${name}.sol`, placeholders);
}


