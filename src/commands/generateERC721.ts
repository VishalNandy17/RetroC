import * as vscode from 'vscode';
import { generateContract } from '../generators/contractGenerator';
import { getDefaultSettings } from '../config/settings';

export async function generateERC721() {
  const settings = getDefaultSettings();
  const name = await vscode.window.showInputBox({ prompt: 'NFT Name', placeHolder: 'MyNFT' });
  if (!name) return;
  const symbol = await vscode.window.showInputBox({ prompt: 'NFT Symbol', placeHolder: 'MNFT' });
  if (!symbol) return;

  const placeholders = {
    LICENSE: settings.defaultLicense,
    SOLIDITY_VERSION: settings.defaultSolidityVersion,
    TOKEN_NAME: name,
    TOKEN_SYMBOL: symbol,
  };

  await generateContract('tokens/erc721', `${name}.sol`, placeholders);
}


