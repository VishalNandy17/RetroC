import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';

export async function generateDAO() {
  const settings = getDefaultSettings();
  const name = await vscode.window.showInputBox({ prompt: 'DAO Name', placeHolder: 'MyDAO' });
  if (!name) return;

  const placeholders = {
    LICENSE: settings.defaultLicense,
    SOLIDITY_VERSION: settings.defaultSolidityVersion,
    DAO_NAME: name,
  };

  await generateContract('governance/dao', `${name}DAO.sol`, placeholders);
}


