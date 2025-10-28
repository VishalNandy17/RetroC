import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';

export async function generateERC20() {
  const settings = getDefaultSettings();
  const name = await vscode.window.showInputBox({ prompt: 'Token Name', placeHolder: 'MyToken' });
  if (!name) return;
  const symbol = await vscode.window.showInputBox({ prompt: 'Token Symbol', placeHolder: 'MTK' });
  if (!symbol) return;
  const initialSupply = await vscode.window.showInputBox({
    prompt: 'Initial Supply (whole units)',
    placeHolder: '1000000',
    value: '1000000',
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
}


